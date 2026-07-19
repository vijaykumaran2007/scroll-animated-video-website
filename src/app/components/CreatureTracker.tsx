"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── CONFIG ─────────────────────────────────────────────────────────────────
// Background video — plays silently on loop behind the creature canvas.
const BG_VIDEO_SRC    = "/bg_loop.mp4";

// New creature head-turn frames (PNG, 5-digit zero-padded, 0–120 = 121 frames)
const FRAMES_PATH     = "/new_creature_frames";
const TOTAL_FRAMES    = 121;
const LERP_FACTOR     = 0.18;
const BITMAP_SCALE    = 0.75;

// Creature sits at ~66 % from the left — remap so it faces the cursor.
const GAZE_CENTER = 0.66;

const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
};

// Curtain reveal — five full-height vertical columns sliding upward with a
// gentle left-to-right stagger. Slightly slow so the lift feels cinematic.
const CURTAIN_SECTIONS = [
  { left: "0%",  width: "20%", delay: 0.00, duration: 1.00, ease: [0.86, 0, 0.07, 1] as [number,number,number,number] },
  { left: "20%", width: "20%", delay: 0.15, duration: 1.05, ease: [0.86, 0, 0.07, 1] as [number,number,number,number] },
  { left: "40%", width: "20%", delay: 0.30, duration: 1.10, ease: [0.86, 0, 0.07, 1] as [number,number,number,number] },
  { left: "60%", width: "20%", delay: 0.45, duration: 1.15, ease: [0.86, 0, 0.07, 1] as [number,number,number,number] },
  { left: "80%", width: "20%", delay: 0.60, duration: 1.20, ease: [0.86, 0, 0.07, 1] as [number,number,number,number] },
];

export default function CreatureTracker() {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const framesRef       = useRef<ImageBitmap[]>([]);
  const targetIdxRef    = useRef(TOTAL_FRAMES * 0.75);
  const currentIdxRef   = useRef(TOTAL_FRAMES * 0.75);
  const lastDrawnIdxRef = useRef(-1); // skip creature redraw when frame unchanged
  const rafRef          = useRef<number | null>(null);
  const visibleRef      = useRef(true);
  const resizeRafRef    = useRef<number | null>(null);

  const [progress,     setProgress]     = useState(0);
  const [ready,        setReady]        = useState(false);
  const [revealing,    setRevealing]    = useState(false);
  const [revealed,     setRevealed]     = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // ── Lock scroll while loading ──────────────────────────────────────────────
  useEffect(() => {
    if (!revealing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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



  // ── Load creature PNG frames in parallel ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const captured: ImageBitmap[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    const loadAll = async () => {
      const promises = Array.from({ length: TOTAL_FRAMES }).map(async (_, i) => {
        if (cancelled) return;
        const padded = i.toString().padStart(5, "0");
        const res    = await fetch(`${FRAMES_PATH}/frame_${padded}.png`);
        const blob   = await res.blob();
        // Decode at full size, then rescale to reduce canvas draw cost.
        const bitmapFull   = await createImageBitmap(blob);
        const bitmapScaled = await createImageBitmap(bitmapFull, {
          resizeWidth:   Math.round(bitmapFull.width  * BITMAP_SCALE),
          resizeHeight:  Math.round(bitmapFull.height * BITMAP_SCALE),
          resizeQuality: "high",
        });
        bitmapFull.close();
        captured[i] = bitmapScaled;

        loadedCount++;
        if (!cancelled) setProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      });

      await Promise.all(promises);

      if (!cancelled) {
        framesRef.current = captured;
        setProgress(100);
        setReady(true);
      }
    };

    loadAll().catch(console.error);

    return () => {
      cancelled = true;
      framesRef.current.forEach((b) => b?.close());
    };
  }, []);

  // ── Start curtain reveal once frames are ready ────────────────────────────
  useEffect(() => {
    if (!ready) return;
    if (reduceMotion) { setRevealing(true); setRevealed(true); return; }
    const t = setTimeout(() => setRevealing(true), 200);
    return () => clearTimeout(t);
  }, [ready, reduceMotion]);

  // ── Canvas render loop ────────────────────────────────────────────────────
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
      });
    };
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (!visibleRef.current) return;

      // ── LERP creature frame index ──
      currentIdxRef.current +=
        (targetIdxRef.current - currentIdxRef.current) * LERP_FACTOR;

      const idx   = Math.round(currentIdxRef.current);
      const safe  = Math.min(Math.max(idx, 0), TOTAL_FRAMES - 1);
      const frame = framesRef.current[safe];
      if (!frame) return;

      // Skip the full canvas redraw only when the creature frame hasn't changed.
      if (safe === lastDrawnIdxRef.current) return;
      lastDrawnIdxRef.current = safe;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw creature frame

      let scaleX = canvas.width  / frame.width;
      let scaleY = canvas.height / frame.height;
      let scale  = Math.max(scaleX, scaleY) * 0.85; // Make the creature slightly smaller

      let x: number, y: number, w: number, h: number;

      if (isTouchDevice()) {
        scale *= 1.5;
        w = frame.width  * scale;
        h = frame.height * scale;
        x = (canvas.width - w) / 2;
        y = canvas.height - h;
      } else if (window.innerWidth <= 768) {
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
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current)       cancelAnimationFrame(rafRef.current);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [ready]);

  // ── Mouse / Touch / Gyroscope input ──────────────────────────────────────
  const [needsGyroPermission, setNeedsGyroPermission] = useState(false);
  const gyroActiveRef = useRef(false);

  useEffect(() => {
    const updateTarget = (ratio: number) => {
      const remapped =
        ratio < GAZE_CENTER
          ? (ratio / GAZE_CENTER) * 0.5
          : 0.5 + ((ratio - GAZE_CENTER) / (1 - GAZE_CENTER)) * 0.5;
      targetIdxRef.current =
        Math.min(Math.max(remapped, 0), 1) * (TOTAL_FRAMES - 1);
    };

    const onMouse = (e: MouseEvent) =>
      updateTarget(e.clientX / window.innerWidth);

    const onTouch = (e: TouchEvent) => {
      if (!gyroActiveRef.current && e.touches.length > 0)
        updateTarget(e.touches[0].clientX / window.innerWidth);
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null) return;
      const clamped = Math.min(Math.max(e.gamma, -45), 45);
      updateTarget((clamped + 45) / 90);
      gyroActiveRef.current = true;
    };

    const attachGyro = () => {
      window.addEventListener("deviceorientation",         onOrientation, { passive: true });
      window.addEventListener("deviceorientationabsolute", onOrientation as any, { passive: true });
    };

    const tryGyro = async () => {
      if (!isTouchDevice()) return;
      if (
        typeof window !== "undefined" &&
        typeof (window as any).DeviceOrientationEvent !== "undefined" &&
        typeof (window as any).DeviceOrientationEvent.requestPermission === "function"
      ) {
        setNeedsGyroPermission(true);
      } else {
        attachGyro();
      }
    };

    tryGyro();
    window.addEventListener("mousemove",  onMouse, { passive: true });
    window.addEventListener("touchmove",  onTouch, { passive: true });
    (window as any).__attachGyro = attachGyro;

    return () => {
      window.removeEventListener("mousemove",              onMouse);
      window.removeEventListener("touchmove",              onTouch);
      window.removeEventListener("deviceorientation",      onOrientation);
      window.removeEventListener("deviceorientationabsolute", onOrientation as any);
    };
  }, []);

  const requestGyroPermission = async () => {
    if (typeof window !== "undefined" && typeof window.DeviceOrientationEvent !== "undefined") {
      const DOE = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === "function") {
        const result = await DOE.requestPermission();
        if (result === "granted") {
          (window as any).__attachGyro?.();
          setNeedsGyroPermission(false);
        }
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">

      <video
        src={BG_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── Stage 1: Full-viewport loading overlay ───────────────────────────
          position: fixed + z-index 9999 so it covers the fixed navbar and
          ALL page content — nothing peeks through until frames are ready. */}
      <AnimatePresence>
        {!revealing && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: reduceMotion ? 0 : 0.35, ease: "easeInOut" },
            }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", inset: 0,
              background: "#09090B",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              zIndex: 9999,
              gap: "24px",
            }}
          >
            {/* Brand mark */}
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex", alignItems: "baseline", gap: "4px",
                fontFamily: "var(--font-sora), sans-serif",
                fontWeight: 600, fontSize: "28px",
                color: "#111111", letterSpacing: "-0.02em",
              }}
            >
              <span>VA</span>
              <span style={{ color: "#6366f1" }}>.</span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.2 }}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "12px", width: "220px",
              }}
            >
              <div
                style={{
                  width: "100%", height: "2px",
                  background: "rgba(255,255,255,0.10)",
                  borderRadius: "999px", overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%", background: "#6366f1",
                    borderRadius: "999px", transformOrigin: "left center",
                    boxShadow: "0 0 12px rgba(99,102,241,0.4)",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0.15, ease: "linear" }}
                />
              </div>
              <div
                style={{
                  display: "flex", justifyContent: "space-between", width: "100%",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "10px", letterSpacing: "0.12em",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.40)", textTransform: "uppercase" }}>
                  {progress < 100 ? "Pre-rendering frames" : "Core ready"}
                </span>
                <span style={{ color: "#6366f1", fontVariantNumeric: "tabular-nums" }}>
                  {String(progress).padStart(2, "0")}%
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stage 2: Creature canvas (mouse-scrubbed PNG frames) ─────────── */}
      <motion.canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0,
          display: "block", width: "100%", height: "100%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready && (revealing || reduceMotion) ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── Stage 3: Vertical curtain columns sliding upward ─────────────── */}
      <AnimatePresence>
        {revealing && !revealed && !reduceMotion && (
          <div
            key="curtains"
            aria-hidden
            style={{
              position: "absolute", inset: 0,
              zIndex: 20, pointerEvents: "none",
            }}
          >
            {CURTAIN_SECTIONS.map((section, i) => (
              <motion.div
                key={i}
                initial={{ y: 0 }}
                animate={{ y: "-105%" }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={{
                  duration: section.duration,
                  delay:    section.delay,
                  ease:     section.ease,
                }}
                onAnimationComplete={() => {
                  if (i === CURTAIN_SECTIONS.length - 1) setRevealed(true);
                }}
                style={{
                  position: "absolute",
                  top: 0, bottom: 0,
                  left:  section.left,
                  width: section.width,
                  background:
                    "linear-gradient(180deg, transparent 0%, #e3e2dc 60%, #e3e2dc 100%)",
                  borderLeft:  "1px solid rgba(255,255,255,0.04)",
                  borderRight: "1px solid rgba(255,255,255,0.04)",
                  willChange: "transform",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* iOS gyroscope permission button */}
      {needsGyroPermission && revealed && (
        <button
          onClick={requestGyroPermission}
          style={{
            position: "absolute", bottom: "32px", left: "50%",
            transform: "translateX(-50%)", zIndex: 25,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontSize: "14px",
            fontFamily: "var(--font-sora), sans-serif",
            padding: "12px 24px", borderRadius: "999px",
            cursor: "pointer", letterSpacing: "0.02em",
            whiteSpace: "nowrap", transition: "all 0.2s ease",
          }}
        >
          🎮 Enable Tilt Controls
        </button>
      )}
    </div>
  );
}
