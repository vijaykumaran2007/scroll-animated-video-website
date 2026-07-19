"use client";

import { useEffect, useRef } from "react";

const ALL_IMAGES: string[] = [
  "/images/surrendraw.png",
  "/images/surrendraw1.png",
  "/images/aditya.png",
  "/images/aditya1.png",
  "/images/aditya2.png",
  "/images/sentinetal.png",
  "/images/sentinetal1.png",
  "/images/sentinetal2.png",
  "/images/mlpart1.png",
  "/images/qualcomm.png",
  "/images/flutter.png",
  "/images/pythoncertificate.png",
  "/images/Screenshot%202026-05-10%20151938.png",
  "/images/Screenshot%202026-05-23%20225458.png",
  "/images/Screenshot%202026-05-23%20225622.png",
];

const ROW_1 = ALL_IMAGES.slice(0, 8);
const ROW_2 = ALL_IMAGES.slice(8);
const ROW_1_TRIPLED = [...ROW_1, ...ROW_1, ...ROW_1];
const ROW_2_TRIPLED = [...ROW_2, ...ROW_2, ...ROW_2];

export default function WorkGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!section || !row1 || !row2) return;

    const LERP = 0.18;
    const DRIFT = 0.28;
    const MAX_VEL = 8;

    const mq = window.matchMedia("(max-width: 768px)");
    // Smaller card sizes than the reference
    let imgW = mq.matches ? 240 : 380;
    let itemW = imgW + 10;
    let loop1 = ROW_1.length * itemW;
    let loop2 = ROW_2.length * itemW;

    const onMq = () => {
      imgW = mq.matches ? 240 : 380;
      itemW = imgW + 10;
      loop1 = ROW_1.length * itemW;
      loop2 = ROW_2.length * itemW;
    };
    mq.addEventListener("change", onMq);

    let x1 = 0, x2 = 0, tX1 = 0, tX2 = 0, d1 = 0, d2 = 0;
    let lastY = window.scrollY;
    let vel = 0;
    let rafId = 0;

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const vp = window.innerHeight;
      const sTop = rect.top + window.scrollY;
      const entry = window.scrollY + vp;
      if (entry < sTop) { tX1 = 0; tX2 = 0; return; }
      const range = rect.height + vp;
      const progress = Math.max(0, Math.min(range, entry - sTop));
      const offset = (progress / range) * 340;
      tX1 = offset - 170;
      tX2 = -(offset - 170);
    };

    computeTarget();
    x1 = tX1; x2 = tX2;

    const onScroll = () => {
      const now = window.scrollY;
      vel = now - lastY;
      lastY = now;
      computeTarget();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      const vb = Math.max(-MAX_VEL, Math.min(MAX_VEL, vel * 0.18));
      vel *= 0.72;
      d1 += DRIFT + vb;
      d2 -= DRIFT + vb;
      x1 += (tX1 - x1) * LERP;
      x2 += (tX2 - x2) * LERP;
      const fx1 = x1 + d1;
      const fx2 = x2 + d2;
      const wx1 = ((fx1 % loop1) + loop1) % loop1 - loop1;
      const wx2 = ((fx2 % loop2) + loop2) % loop2 - loop2;
      row1.style.transform = `translate3d(${wx1.toFixed(2)}px,0,0)`;
      row2.style.transform = `translate3d(${wx2.toFixed(2)}px,0,0)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#e3e2dc] border-t border-[#c8c7c1]"
    >
      {/* Section label */}
      <div className="px-6 md:px-12 pt-16 pb-8 max-w-5xl mx-auto flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-400">
          Work gallery
        </p>
        <span className="font-mono text-[10px] text-[#3f3f46] tracking-[0.1em] uppercase">
          All projects · All shots
        </span>
      </div>

      {/* Row 1 — drifts right */}
      <div className="overflow-hidden mb-2.5">
        <div
          ref={row1Ref}
          className="flex gap-2.5"
          style={{ willChange: "transform", width: "max-content" }}
        >
          {ROW_1_TRIPLED.map((src, i) => (
            <div
              key={`r1-${i}`}
              className="flex-shrink-0 rounded-xl overflow-hidden border border-[#c8c7c1]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                className="object-cover select-none block w-[240px] h-[154px] md:w-[380px] md:h-[244px]"
                style={{ filter: "grayscale(5%) brightness(0.88)", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — drifts left */}
      <div className="overflow-hidden pb-16 md:pb-20">
        <div
          ref={row2Ref}
          className="flex gap-2.5"
          style={{ willChange: "transform", width: "max-content" }}
        >
          {ROW_2_TRIPLED.map((src, i) => (
            <div
              key={`r2-${i}`}
              className="flex-shrink-0 rounded-xl overflow-hidden border border-[#c8c7c1]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                className="object-cover select-none block w-[240px] h-[154px] md:w-[380px] md:h-[244px]"
                style={{ filter: "grayscale(5%) brightness(0.88)", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
