"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── CONFIG ────────────────────────────────────────────────
const VIDEO_SRC =
  "/Firefly A small, round, fluffy orange creature with huge white eyes and a tiny black nose stands com.mp4";
const VIDEO_DURATION = 5.042;
const LERP_FACTOR    = 0.12;
const TOTAL_FRAMES   = 121; // 24fps × 5s
const BITMAP_SCALE   = 0.75;
// Creature sits at ~66% from the left — remap mouse so it looks straight
// at the cursor when hovering directly over it.
const GAZE_CENTER = 0.66;

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
  const videoRef        = useRef<HTMLVideoElement | null>(null);
  const framesRef       = useRef<ImageBitmap[]>([]);
  const targetIdxRef    = useRef(TOTAL_FRAMES / 2);
  const currentIdxRef   = useRef(TOTAL_FRAMES / 2);
  const lastDrawnIdxRef = useRef(-1);   // skip redraw when frame unchanged
  const rafRef          = useRef<number | null>(null);
  const visibleRef      = useRef(true); // paused via IntersectionObserver
  const resizeRafRef    = useRef<number | null>(null);

  const [progress,     setProgress]     = useState(0);
  const [ready,        setReady]        = useState(false);
  const [revealing,    setRevealing]    = useState(false);
  const [revealed,     setRevealed]     = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // ── Lock scroll while loading ────────────────────────────
  // Prevent the user from scrolling past the hero while frames are still
  // being extracted. Released as soon as the curtain reveal begins.
  useEffect(() => {
    if (!revealing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [revealing]);

  // ── Reduced-motion ──────────────────────────────────────
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // ── Extract frames sequentially ──────────────────────────
  useEffect(() => {
    let cancelled = false;

    const video       = document.createElement("video");
    videoRef.current  = video;
    video.src         = VIDEO_SRC;
    video.muted       = true;
    video.preload     = "auto";
    video.playsInline = true;

    const offscreen = document.createElement("canvas");
    const ctx       = offscreen.getContext("2d")!;

    const extractFrames = async () => {
      await new Promise<void>((resolve) => {
        video.addEventListener("loadedmetadata", () => resolve(), { once: true });
        video.load();
      });

      offscreen.width  = video.videoWidth;
      offscreen.height = video.videoHeight;

      const captured: ImageBitmap[] = [];

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (cancelled) return;

        const time = (i / (TOTAL_FRAMES - 1)) * VIDEO_DURATION;

        await new Promise<void>((resolve) => {
          video.currentTime = time;
          video.addEventListener("seeked", () => resolve(), { once: true });
        });

        ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
        const bitmap = await createImageBitmap(offscreen, {
          resizeWidth:   Math.round(offscreen.width  * BITMAP_SCALE),
          resizeHeight:  Math.round(offscreen.height * BITMAP_SCALE),
          resizeQuality: "high",
        });
        captured.push(bitmap);

        if (!cancelled) setProgress(Math.round(((i + 1) / TOTAL_FRAMES) * 100));
      }

      framesRef.current = captured;
      if (!cancelled) {
        setProgress(100);
        setReady(true);
      }
    };

    extractFrames().catch(console.error);

    return () => {
      cancelled = true;
      video.src = "";
      framesRef.current.forEach((b) => b?.close());
    };
  }, []);

  // ── Start curtain reveal once frames are ready ───────────
  useEffect(() => {
    if (!ready) return;
    if (reduceMotion) { setRevealing(true); setRevealed(true); return; }
    // Brief pause so the "100% / Core ready" state is visible.
    const t = setTimeout(() => setRevealing(true), 200);
    return () => clearTimeout(t);
  }, [ready, reduceMotion]);

  // ── Canvas render loop ────────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    // RAF-debounced resize — avoids repeated layout thrash
    const resize = () => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        lastDrawnIdxRef.current = -1; // force full redraw after resize
      });
    };
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", resize);

    // Pause RAF when hero is scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (!visibleRef.current) return; // paused when off-screen

      currentIdxRef.current +=
        (targetIdxRef.current - currentIdxRef.current) * LERP_FACTOR;

      const idx  = Math.round(currentIdxRef.current);
      const safe = Math.min(Math.max(idx, 0), TOTAL_FRAMES - 1);

      // Skip if frame hasn't changed — saves GPU bandwidth each tick
      if (safe === lastDrawnIdxRef.current) return;
      lastDrawnIdxRef.current = safe;

      const frame = framesRef.current[safe];
      if (!frame) return;

      const scaleX = canvas.width  / frame.width;
      const scaleY = canvas.height / frame.height;
      const scale  = Math.max(scaleX, scaleY);
      const w = frame.width  * scale;
      const h = frame.height * scale;
      const x = (canvas.width  - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frame, x, y, w, h);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current)      cancelAnimationFrame(rafRef.current);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [ready]);

  // ── Mouse / Touch / Gyroscope input ──────────────────────
  const [needsGyroPermission, setNeedsGyroPermission] = useState(false);
  const gyroActiveRef = useRef(false);

  useEffect(() => {
    const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;

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

    const attachGyro = () =>
      window.addEventListener("deviceorientation", onOrientation, { passive: true });

    const tryGyro = async () => {
      if (!isTouchDevice()) return;
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === "function") {
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
    };
  }, []);

  const requestGyroPermission = async () => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE.requestPermission === "function") {
      const result = await DOE.requestPermission();
      if (result === "granted") {
        (window as any).__attachGyro?.();
        setNeedsGyroPermission(false);
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* ── Stage 1: Full-viewport loading overlay ─────────────────────────
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
              position: "fixed", inset: 0,   // ← fixed, not absolute
              background: "#09090B",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              zIndex: 9999,                  // ← above navbar (z-50) and everything
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
                color: "#fafaf9", letterSpacing: "-0.02em",
              }}
            >
              <span>VA</span>
              <span style={{ color: "#10b981" }}>.</span>
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
                    height: "100%", background: "#10b981",
                    borderRadius: "999px", transformOrigin: "left center",
                    boxShadow: "0 0 12px rgba(16,185,129,0.4)",
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
                <span style={{ color: "#10b981", fontVariantNumeric: "tabular-nums" }}>
                  {String(progress).padStart(2, "0")}%
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stage 2: Canvas ─────────────────────────────────────────── */}
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

      {/* ── Stage 3: Vertical curtain columns sliding upward ────────── */}
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
                  // Last column done → remove curtain from DOM
                  if (i === CURTAIN_SECTIONS.length - 1) setRevealed(true);
                }}
                style={{
                  position: "absolute",
                  top: 0, bottom: 0,
                  left:  section.left,
                  width: section.width,
                  background:
                    "linear-gradient(180deg, #0c0c0e 0%, #0a0a0b 60%, #09090B 100%)",
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
