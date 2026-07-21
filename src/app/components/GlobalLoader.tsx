"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadingStore } from "../store";

const CURTAIN_SECTIONS = [
  { left: "0%",  width: "20%", delay: 0.00, duration: 1.05, ease: [0.86, 0, 0.07, 1] as [number, number, number, number] },
  { left: "20%", width: "20%", delay: 0.12, duration: 1.10, ease: [0.86, 0, 0.07, 1] as [number, number, number, number] },
  { left: "40%", width: "20%", delay: 0.24, duration: 1.15, ease: [0.86, 0, 0.07, 1] as [number, number, number, number] },
  { left: "60%", width: "20%", delay: 0.36, duration: 1.20, ease: [0.86, 0, 0.07, 1] as [number, number, number, number] },
  { left: "80%", width: "20%", delay: 0.48, duration: 1.25, ease: [0.86, 0, 0.07, 1] as [number, number, number, number] },
];

export default function GlobalLoader() {
  const [done, setDone] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const barRef   = useRef<HTMLDivElement>(null);
  const pctRef   = useRef<HTMLSpanElement>(null);
  const lblRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return loadingStore.subscribe(() => {
      const p = loadingStore.progress;

      if (barRef.current)  barRef.current.style.transform = `scaleX(${p / 100})`;
      if (pctRef.current)  pctRef.current.textContent     = `${p}%`;
      if (lblRef.current)  lblRef.current.textContent     = p >= 100 ? "Ready" : "Preparing experience";

      if (loadingStore.revealing && !revealing) {
        setRevealing(true);
        if (loadingStore.reduceMotion) {
           setDone(true);
           document.body.classList.add("loader-revealed");
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealing]);

  if (done) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none" }}>
      {/* The solid background elements (curtains) */}
      {!reduceMotion && CURTAIN_SECTIONS.map((section, i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={revealing ? { y: "-105%" } : { y: 0 }}
          transition={{ duration: section.duration, delay: section.delay, ease: section.ease }}
          onAnimationComplete={() => {
            if (revealing && i === CURTAIN_SECTIONS.length - 1) {
              setDone(true);
              document.body.classList.add("loader-revealed");
            }
          }}
          style={{
            position: "absolute",
            top: 0, bottom: 0,
            left: section.left, width: section.width,
            background: "#e3e2dc",
            willChange: "transform",
          }}
        />
      ))}
      
      {/* The actual loader UI (initials and progress) - fades out instantly when revealing starts */}
      <AnimatePresence>
        {!revealing && (
          <motion.div
            key="loader-ui"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
            }}
          >
            {/* Initials */}
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "3px",
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                color: "#1a1a1a",
                letterSpacing: "-0.04em",
              }}
            >
              <span>VA</span>
              <span style={{ color: "#b45309" }}>.</span>
            </motion.div>

            {/* Progress bar + labels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                width: "220px",
              }}
            >
              <div style={{
                width: "100%", height: "1px",
                background: "rgba(0,0,0,0.12)",
                overflow: "hidden",
              }}>
                <div
                  ref={barRef}
                  style={{
                    height: "100%",
                    background: "#b45309",
                    transformOrigin: "left center",
                    transform: "scaleX(0)",
                    transition: "transform 0.25s linear",
                  }}
                />
              </div>

              <div style={{
                display: "flex", justifyContent: "space-between", width: "100%",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "10px", letterSpacing: "0.18em",
              }}>
                <span ref={lblRef} style={{ color: "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>
                  Preparing experience
                </span>
                <span ref={pctRef} style={{ color: "#b45309", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                  0%
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}