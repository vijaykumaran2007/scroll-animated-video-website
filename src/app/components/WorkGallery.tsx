"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

import Image from "next/image";

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
] as const;

const ROW_1 = GALLERY_ITEMS.slice(0, 7);
const ROW_2 = GALLERY_ITEMS.slice(7);

const SIZE: Record<string, string> = {
  L: "w-[320px] md:w-[480px] h-[220px] md:h-[320px]",
  M: "w-[260px] md:w-[380px] h-[180px] md:h-[260px]",
  S: "w-[220px] md:w-[300px] h-[280px] md:h-[400px]",
};

type GalleryItem = typeof GALLERY_ITEMS[number];

const GalleryCard = ({ item }: { item: GalleryItem }) => (
  <div
    className={`gallery-card relative flex-shrink-0 rounded-2xl border-[2px] border-amber-500/20 -ml-6 md:-ml-10 opacity-0`}
    style={{
      contain: "layout paint",
      willChange: "opacity, transform",
    }}
  >
    <div className={`relative overflow-hidden rounded-2xl bg-[#162A1E] ${SIZE[item.size]}`}>
      <Image
        src={item.src}
        alt={item.name}
        loading="lazy"
        draggable={false}
        className="object-cover w-full h-full select-none"
        style={{ imageRendering: "auto" }}
        width={item.size === "L" ? 480 : item.size === "M" ? 380 : 300}
        height={item.size === "L" ? 320 : item.size === "M" ? 260 : 400}
        unoptimized
      />
    </div>
  </div>
);

export default function WorkGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  // Infinite auto-scroll using rAF
  useEffect(() => {
    if (!initialized) return;

    let rafId: number;
    let x1 = -9999; // Initialize safely
    let x2 = 0;
    let w1 = 0;
    let w2 = 0;

    const measure = () => {
      if (row1Ref.current && row1Ref.current.children.length > ROW_1.length) {
        const c1 = row1Ref.current.children[0] as HTMLElement;
        const c2 = row1Ref.current.children[ROW_1.length] as HTMLElement;
        w1 = c2.offsetLeft - c1.offsetLeft;
        if (x1 === -9999) x1 = -w1; // Start off shifted so it can move right
      }
      if (row2Ref.current && row2Ref.current.children.length > ROW_2.length) {
        const c1 = row2Ref.current.children[0] as HTMLElement;
        const c2 = row2Ref.current.children[ROW_2.length] as HTMLElement;
        w2 = c2.offsetLeft - c1.offsetLeft;
      }
    };

    // Slight delay to ensure images/layout are painted before measuring
    const t = setTimeout(measure, 100);
    window.addEventListener('resize', measure);

    const applyTransform = () => {
      if (w1 > 0 && w2 > 0 && x1 !== -9999) {
        // Row 1 moves right
        x1 += 0.8;
        if (x1 >= 0) x1 -= w1;
        
        // Row 2 moves left
        x2 -= 0.8;
        if (Math.abs(x2) >= w2) x2 += w2;

        if (row1Ref.current) row1Ref.current.style.transform = `translate3d(${x1}px, 0, 0)`;
        if (row2Ref.current) row2Ref.current.style.transform = `translate3d(${x2}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(applyTransform);
    };

    rafId = requestAnimationFrame(applyTransform);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [initialized]);

  // Initialize after first paint
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Entrance animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (!row1Ref.current || !row2Ref.current) return;
      
      const r1Cards = Array.from(row1Ref.current.children);
      const r2Cards = Array.from(row2Ref.current.children);
      
      const visibleR1 = r1Cards.slice(0, ROW_1.length * 2);
      const visibleR2 = r2Cards.slice(0, ROW_2.length * 2);
      const visibleSet = [...visibleR1, ...visibleR2];
      
      const hiddenR1 = r1Cards.slice(ROW_1.length * 2);
      const hiddenR2 = r2Cards.slice(ROW_2.length * 2);

      gsap.fromTo(
        visibleSet,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: { amount: 0.8, from: "start" },
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
          onStart: () => {
            [...hiddenR1, ...hiddenR2].forEach((c) => {
              (c as HTMLElement).style.opacity = "1";
            });
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0B1F12] border-t border-white/10"
      style={{ contain: "layout style paint" }}
    >
      {/* Editorial header */}
      <div className="relative z-10 w-full px-6 md:px-12 pt-28 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="font-medium text-[clamp(2.25rem,4.5vw,4rem)] tracking-tight text-[#F7F7F4] mb-6">
          WORK GALLERY
        </h2>
        <p className="text-[#A8B0A7] text-[clamp(1rem,1.2vw,1.15rem)] max-w-2xl text-balance leading-relaxed font-medium">
          A visual archive of products, interfaces, experiments, and ideas built across web, mobile, AI, and design.
        </p>
      </div>

      {/* Edge-fade mask — static overlay */}
      <div className="relative z-10 w-full pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to right, #0B1F12 0%, transparent 8%, transparent 92%, #0B1F12 100%)",
          }}
        />

        {/* Row 1 — scrolls right */}
        <div className="mb-8 md:mb-12 overflow-hidden">
          <div
            ref={row1Ref}
            className="flex items-center pl-6 md:pl-10"
            style={{ width: "max-content", willChange: "transform", contain: "layout" }}
          >
            {[0, 1, 2].map((g) => (
              ROW_1.map((item, i) => (
                <GalleryCard key={`${item.id}-${g}`} item={item} />
              ))
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls left */}
        <div className="pb-12 overflow-hidden">
          <div
            ref={row2Ref}
            className="flex items-center pl-6 md:pl-10"
            style={{ width: "max-content", willChange: "transform", contain: "layout" }}
          >
            {[0, 1, 2].map((g) => (
              ROW_2.map((item, i) => (
                <GalleryCard key={`${item.id}-${g}`} item={item} />
              ))
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}