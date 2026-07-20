"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  { id: "1",  src: "/images/surrendraw.png",  name: "Surrendraw",      size: "L" },
  { id: "2",  src: "/images/surrendraw1.png", name: "Surrendraw UI",   size: "S" },
  { id: "3",  src: "/images/aditya.png",      name: "Creative Dev",    size: "M" },
  { id: "4",  src: "/images/aditya1.png",     name: "Aditya Show",     size: "L" },
  { id: "5",  src: "/images/aditya2.png",     name: "Aditya About",    size: "S" },
  { id: "6",  src: "/images/sentinetal.png",  name: "Sentinetal",      size: "M" },
  { id: "7",  src: "/images/sentinetal1.png", name: "Sentinetal Dash", size: "S" },
  { id: "8",  src: "/images/sentinetal2.png", name: "Mobile UI",       size: "L" },
  { id: "9",  src: "/images/mlpart1.png",     name: "ML Visuals",      size: "M" },
  { id: "10", src: "/images/qualcomm.png",    name: "AI Ops",          size: "S" },
  { id: "11", src: "/images/flutter.png",     name: "Cross-platform",  size: "M" },
  { id: "12", src: "/images/pythoncertificate.png", name: "Data Env",  size: "L" },
  { id: "13", src: "/images/Screenshot%202026-05-10%20151938.png", name: "Alpha Concept", size: "S" },
  { id: "14", src: "/images/Screenshot%202026-05-23%20225458.png", name: "Analytics V2",  size: "M" },
  { id: "15", src: "/images/Screenshot%202026-05-23%20225622.png", name: "Mobile Dash",   size: "S" },
];

const ROW_1 = GALLERY_ITEMS.slice(0, 7);
const ROW_2 = GALLERY_ITEMS.slice(7);

// Size classes defined outside render — no recalculation per card
const SIZE: Record<string, string> = {
  L: "w-[320px] md:w-[480px] h-[220px] md:h-[320px]",
  M: "w-[260px] md:w-[380px] h-[180px] md:h-[260px]",
  S: "w-[220px] md:w-[300px] h-[280px] md:h-[400px]",
};

const GalleryCard = ({ item, isFirst }: { item: typeof GALLERY_ITEMS[0]; isFirst: boolean }) => (
  <div className={`gallery-card relative flex-shrink-0 rounded-2xl border-[2px] border-amber-500/20 ${isFirst ? "" : "-ml-6 md:-ml-10"} opacity-0`}>
    <div className={`relative overflow-hidden rounded-2xl bg-[#162A1E] ${SIZE[item.size]}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.name}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="object-cover w-full h-full select-none"
        style={{ imageRendering: "auto" }}
      />
    </div>
  </div>
);

export default function WorkGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref    = useRef<HTMLDivElement>(null);
  const row2Ref    = useRef<HTMLDivElement>(null);

  /* Entrance: only animates the FIRST set of cards, not all 3 duplicates */
  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".gallery-card");
    if (!cards) return;
    // Animate only first 15 (one copy) — the rest are off-screen anyway
    const firstSet = Array.from(cards).slice(0, 15);
    gsap.fromTo(
      firstSet,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: "power3.out",
        stagger: { amount: 0.8, from: "start" },
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        // Make the other copies visible instantly without animating
        onStart: () => {
          const rest = Array.from(cards).slice(15);
          rest.forEach((c) => ((c as HTMLElement).style.opacity = "1"));
        },
      }
    );
  }, { scope: sectionRef });

  /* Scroll-position → translateX
   * KEY FIX: cache sectionTop once, only re-measure on resize (not every scroll)
   */
  useEffect(() => {
    let sectionTop = 0;
    let ticking = false;

    const measure = () => {
      if (sectionRef.current) {
        sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      }
    };

    const applyTransform = () => {
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      const tx = offset - 200;
      if (row1Ref.current) row1Ref.current.style.transform = `translate3d(${tx}px,0,0)`;
      if (row2Ref.current) row2Ref.current.style.transform = `translate3d(${-tx}px,0,0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(applyTransform);
        ticking = true;
      }
    };

    measure();
    applyTransform();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0B1F12] border-t border-white/10" style={{ contain: "layout style" }}>

      {/* Editorial header */}
      <div className="relative z-10 w-full px-6 md:px-12 pt-28 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="font-medium text-[clamp(2.25rem,4.5vw,4rem)] tracking-tight text-[#F7F7F4] mb-6">
          WORK GALLERY
        </h2>
        <p className="text-[#A8B0A7] text-[clamp(1rem,1.2vw,1.15rem)] max-w-2xl text-balance leading-relaxed font-medium">
          A visual archive of products, interfaces, experiments, and ideas built across web, mobile, AI, and design.
        </p>
      </div>

      {/* Edge-fade mask — static overlay on top, NOT a parent of animated rows */}
      <div className="relative z-10 w-full pb-24">
        {/* Fade overlay — separate layer, never repaints during scroll */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to right, #0B1F12 0%, transparent 8%, transparent 92%, #0B1F12 100%)",
          }}
        />
        {/* Row 1 */}
        <div className="mb-8 md:mb-12 overflow-hidden">
          <div ref={row1Ref} className="flex items-center gap-3" style={{ width: "max-content", willChange: "transform", contain: "layout" }}>
            {[0, 1, 2].map((g) => (
              <div key={`r1-${g}`} className="flex items-center gap-3 flex-shrink-0">
                {ROW_1.map((item, i) => (
                  <GalleryCard key={item.id} item={item} isFirst={g === 0 && i === 0} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="pb-12 overflow-hidden">
          <div ref={row2Ref} className="flex items-center gap-3" style={{ width: "max-content", willChange: "transform", contain: "layout" }}>
            {[0, 1, 2].map((g) => (
              <div key={`r2-${g}`} className="flex items-center gap-3 flex-shrink-0">
                {ROW_2.map((item, i) => (
                  <GalleryCard key={item.id} item={item} isFirst={g === 0 && i === 0} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
