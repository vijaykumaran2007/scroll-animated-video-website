"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loadingStore } from "../store";

// ── CONFIG ─────────────────────────────────────────────────────────────────
const BG_VIDEO_SRC    = "/bg_loop.mp4";
const FRAMES_PATH     = "/new_creature_frames";
const TOTAL_FRAMES    = 121;
const LERP_FACTOR     = 0.18;
const BITMAP_SCALE    = 0.75;
const GAZE_CENTER     = 0.66;

const IS_TOUCH        = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
const IS_MOBILE_WIDTH = typeof window !== "undefined" && window.innerWidth <= 768;



export default function CreatureTracker() {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const framesRef       = useRef<ImageBitmap[]>([]);
  const targetIdxRef    = useRef(TOTAL_FRAMES * 0.75);
  const currentIdxRef   = useRef(TOTAL_FRAMES * 0.75);
  const lastDrawnIdxRef = useRef(-1);
  const rafRef          = useRef<number | null>(null);
  const visibleRef      = useRef(true);
  const resizeRafRef    = useRef<number | null>(null);
  const drawFnRef       = useRef<(() => void) | null>(null);

  const [ready,        setReady]        = useState(false);
  const [revealing,    setRevealing]    = useState(false);
  const [revealed,     setRevealed]     = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // ── Scroll lock while curtains are active ──────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = revealing ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [revealing]);

  // ── Reduced-motion ─────────────────────────────────────────────────────────
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // ── Load frames; sync progress to store ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const captured: ImageBitmap[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    let lastReportedPct = -1; // throttle: only notify store when % actually changes

    const loadAll = async () => {
      const promises = Array.from({ length: TOTAL_FRAMES }).map(async (_, i) => {
        if (cancelled) return;
        const padded = i.toString().padStart(5, "0");
        const res    = await fetch(`${FRAMES_PATH}/frame_${padded}.png`);
        const blob   = await res.blob();
        const bitmapFull   = await createImageBitmap(blob);
        const bitmapScaled = await createImageBitmap(bitmapFull, {
          resizeWidth:   Math.round(bitmapFull.width  * BITMAP_SCALE),
          resizeHeight:  Math.round(bitmapFull.height * BITMAP_SCALE),
          resizeQuality: "high",
        });
        bitmapFull.close();
        captured[i] = bitmapScaled;
        loadedCount++;
        if (!cancelled) {
          const p = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          // Only push to store when integer % changes — prevents 121 simultaneous
          // fetches from each firing a store notification and causing re-renders
          if (p !== lastReportedPct) {
            lastReportedPct = p;
            loadingStore.set(p, false, reduceMotion);
          }
        }
      });

      await Promise.all(promises);

      if (!cancelled) {
        framesRef.current = captured;
        loadingStore.set(100, false, reduceMotion);
        setReady(true);
      }
    };

    loadAll().catch(console.error);

    return () => {
      cancelled = true;
      framesRef.current.forEach((b) => b?.close());
    };
  }, [reduceMotion]);

  // ── Trigger curtain once ready ─────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    if (reduceMotion) {
      setRevealing(true);
      setRevealed(true);
      loadingStore.set(100, true, true);
      document.body.classList.add("loader-revealed");
      return;
    }
    const t = setTimeout(() => {
      // Signal GlobalLoader to unmount NOW so white curtains slide over the dark hero
      loadingStore.set(loadingStore.progress, true, reduceMotion);
      setRevealing(true);
    }, 200);
    return () => clearTimeout(t);
  }, [ready, reduceMotion]);

  // ── Canvas render loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    const resize = () => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        lastDrawnIdxRef.current = -1;
        if (visibleRef.current && !rafRef.current && drawFnRef.current) {
          rafRef.current = requestAnimationFrame(drawFnRef.current);
        }
      });
    };
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting && !rafRef.current && drawFnRef.current) {
        rafRef.current = requestAnimationFrame(drawFnRef.current);
      }
    }, { threshold: 0 });
    observer.observe(canvas);

    const draw = () => {
      if (!visibleRef.current) { rafRef.current = null; return; }
      const delta = targetIdxRef.current - currentIdxRef.current;
      if (Math.abs(delta) < 0.01 && lastDrawnIdxRef.current !== -1) { rafRef.current = null; return; }
      currentIdxRef.current += delta * LERP_FACTOR;
      const idx   = Math.round(currentIdxRef.current);
      const safe  = Math.min(Math.max(idx, 0), TOTAL_FRAMES - 1);
      const frame = framesRef.current[safe];
      if (!frame) { rafRef.current = requestAnimationFrame(draw); return; }
      if (safe === lastDrawnIdxRef.current) { rafRef.current = requestAnimationFrame(draw); return; }
      lastDrawnIdxRef.current = safe;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobileLayout = canvas.width <= 768;

      const scaleX = canvas.width  / frame.width;
      // Use screen.height on mobile to prevent the creature from enlarging/shrinking
      // when the mobile browser's address bar hides/shows (which changes canvas.height)
      const stableHeight = isMobileLayout ? window.screen.height : canvas.height;
      const scaleY = stableHeight / frame.height;
      
      let scale    = Math.max(scaleX, scaleY) * 0.85;
      let x: number, y: number, w: number, h: number;

      if (isMobileLayout) {
        scale *= 1.5;
        w = frame.width  * scale;
        h = frame.height * scale;
        x = (canvas.width / 2) - (w * GAZE_CENTER);
        y = canvas.height - h;
      } else {
        w = frame.width  * scale;
        h = frame.height * scale;
        x = (canvas.width  - w) / 2;
        y = (canvas.height - h) / 2;
      }
      ctx.drawImage(frame, x, y, w, h);
      rafRef.current = requestAnimationFrame(draw);
    };

    drawFnRef.current = draw;
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current)       cancelAnimationFrame(rafRef.current);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [ready]);

  // ── Mouse / Touch / Gyroscope ──────────────────────────────────────────────
  const [needsGyroPermission, setNeedsGyroPermission] = useState(false);
  const gyroActiveRef = useRef(false);

  useEffect(() => {
    const updateTarget = (ratio: number) => {
      const remapped =
        ratio < GAZE_CENTER
          ? (ratio / GAZE_CENTER) * 0.5
          : 0.5 + ((ratio - GAZE_CENTER) / (1 - GAZE_CENTER)) * 0.5;
      targetIdxRef.current = Math.min(Math.max(remapped, 0), 1) * (TOTAL_FRAMES - 1);
      if (visibleRef.current && !rafRef.current && drawFnRef.current) {
        rafRef.current = requestAnimationFrame(drawFnRef.current);
      }
    };
    const onMouse = (e: MouseEvent) => updateTarget(e.clientX / window.innerWidth);
    const onTouch = (e: TouchEvent) => {
      if (!gyroActiveRef.current && e.touches.length > 0)
        updateTarget(e.touches[0].clientX / window.innerWidth);
    };
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null) return;
      updateTarget((Math.min(Math.max(e.gamma, -45), 45) + 45) / 90);
      gyroActiveRef.current = true;
    };
    const attachGyro = () => {
      window.addEventListener("deviceorientation",         onOrientation, { passive: true });
      window.addEventListener("deviceorientationabsolute", onOrientation as EventListener, { passive: true });
    };
    const tryGyro = async () => {
      if (!IS_TOUCH) return;
      if (typeof (window as any).DeviceOrientationEvent?.requestPermission === "function") {
        setNeedsGyroPermission(true);
      } else {
        attachGyro();
      }
    };
    tryGyro();
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    (window as any).__attachGyro = attachGyro;
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("deviceorientationabsolute", onOrientation as EventListener);
    };
  }, []);

  const requestGyroPermission = async () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE.requestPermission === "function") {
      const result = await DOE.requestPermission();
      if (result === "granted") { (window as any).__attachGyro?.(); setNeedsGyroPermission(false); }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <video src={BG_VIDEO_SRC} autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover" />

      {/* Creature canvas — fades in after curtains leave */}
      <motion.canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready && (revealing || reduceMotion) ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />



      {needsGyroPermission && revealed && (
        <button onClick={requestGyroPermission}
          style={{
            position: "absolute", bottom: "32px", left: "50%",
            transform: "translateX(-50%)", zIndex: 25,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontSize: "14px", fontFamily: "var(--font-manrope), sans-serif",
            padding: "12px 24px", borderRadius: "999px", cursor: "pointer",
            letterSpacing: "0.02em", whiteSpace: "nowrap", transition: "all 0.2s ease",
          }}>
          🎮 Enable Tilt Controls
        </button>
      )}
    </div>
  );
}
