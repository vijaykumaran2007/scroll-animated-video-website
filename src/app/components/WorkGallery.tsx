"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  { id: '1', src: "/images/surrendraw.png", name: "Surrendraw", category: "Web App", desc: "Interactive canvas experience", size: "L" },
  { id: '2', src: "/images/surrendraw1.png", name: "Surrendraw UI", category: "Design", desc: "Dashboard interface", size: "S" },
  { id: '3', src: "/images/aditya.png", name: "Creative Dev", category: "Portfolio", desc: "Interactive portfolio", size: "M" },
  { id: '4', src: "/images/aditya1.png", name: "Aditya Show", category: "UI/UX", desc: "Project showcase", size: "L" },
  { id: '5', src: "/images/aditya2.png", name: "Aditya About", category: "Web", desc: "Smooth animations", size: "S" },
  { id: '6', src: "/images/sentinetal.png", name: "Sentinetal", category: "App", desc: "Data visualization", size: "M" },
  { id: '7', src: "/images/sentinetal1.png", name: "Sentinetal Dash", category: "Dashboard", desc: "Analytics interface", size: "S" },
  { id: '8', src: "/images/sentinetal2.png", name: "Mobile UI", category: "Mobile", desc: "Responsive design", size: "L" },
  { id: '9', src: "/images/mlpart1.png", name: "ML Visuals", category: "Experiment", desc: "Algorithm visualization", size: "M" },
  { id: '10', src: "/images/qualcomm.png", name: "AI Ops", category: "Case Study", desc: "Hardware optimization", size: "S" },
  { id: '11', src: "/images/flutter.png", name: "Cross-platform", category: "Mobile", desc: "Flutter application", size: "M" },
  { id: '12', src: "/images/pythoncertificate.png", name: "Data Env", category: "Tools", desc: "Development environment", size: "L" },
  { id: '13', src: "/images/Screenshot%202026-05-10%20151938.png", name: "Alpha Concept", category: "Design", desc: "Early UI exploration", size: "S" },
  { id: '14', src: "/images/Screenshot%202026-05-23%20225458.png", name: "Analytics V2", category: "UI/UX", desc: "Refined data view", size: "M" },
  { id: '15', src: "/images/Screenshot%202026-05-23%20225622.png", name: "Mobile Dash", category: "Mobile", desc: "Responsive layout", size: "S" },
];

const ROW_1 = GALLERY_ITEMS.slice(0, 7);
const ROW_2 = GALLERY_ITEMS.slice(7);

// Simple pseudo-random generator based on index to avoid hydration mismatch
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const GalleryCard = ({ item, isFirst, isTopRow, index }: { item: typeof GALLERY_ITEMS[0], isFirst: boolean, isTopRow: boolean, index: number }) => {
  const sizeClasses = 
    item.size === 'L' ? 'w-[320px] md:w-[480px] h-[220px] md:h-[320px]' :
    item.size === 'M' ? 'w-[260px] md:w-[380px] h-[180px] md:h-[260px]' :
    'w-[220px] md:w-[300px] h-[280px] md:h-[400px]';

  // Deterministic "random" values based on item index, fixed to 2 decimals to avoid SSR precision hydration mismatch
  const floatDelay = (pseudoRandom(index * 13) * 5).toFixed(2);
  const floatDuration = (8 + pseudoRandom(index * 27) * 4).toFixed(2);
  const zIndex = Math.floor(pseudoRandom(index * 31) * 20);
  
  // Parallax multiplier (top row closer = more movement)
  const parallax = isTopRow ? 6 : 3;

  return (
    <div 
      className={`gallery-card relative group flex-shrink-0 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] rounded-2xl border border-black/5 hover:border-black/10 ${isTopRow ? 'shadow-xl hover:shadow-2xl' : 'shadow-md hover:shadow-xl'} ${isFirst ? '' : '-ml-6 md:-ml-10'} opacity-0 will-change-transform cursor-pointer`}
      style={{ zIndex }}
    >
      {/* CSS Float & Mouse Parallax Wrapper */}
      <div 
        className="w-full h-full animate-float"
        style={{ 
          animationDuration: `${floatDuration}s`, 
          animationDelay: `-${floatDelay}s`,
          transform: `translate3d(calc(var(--mx, 0) * ${parallax}px), calc(var(--my, 0) * ${parallax}px), 0)`
        }}
      >
        <div className={`relative overflow-hidden rounded-2xl bg-[#d4d3ce] ${sizeClasses}`}>
          <img
            src={item.src}
            alt={item.name}
            loading="lazy"
            draggable={false}
            className="object-cover w-full h-full select-none transition-all duration-300 group-hover:brightness-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-indigo-300 text-[10px] uppercase tracking-wider font-bold mb-1.5 block">{item.category}</span>
              <h4 className="text-white text-xl md:text-2xl font-medium mb-1">{item.name}</h4>
              <p className="text-white/80 text-xs md:text-sm mb-4 line-clamp-1">{item.desc}</p>
              <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">View Project &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WorkGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ─── ENTRANCE ANIMATION (Individual Cards) ─────────
    gsap.fromTo('.gallery-card', 
      { opacity: 0, y: 40, scale: 0.96, filter: 'blur(6px)', rotation: () => Math.random() * 2 - 1 },
      { 
        opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', rotation: 0, 
        duration: 1, ease: 'power3.out', 
        stagger: { amount: 1.5, from: "random" },
        clearProps: "transform,filter", // clear only these so hover CSS works, leaving inline opacity:1 intact
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: sectionRef });

  useEffect(() => {
    // ─── MOUSE PARALLAX TRACKING ─────────
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      sectionRef.current.style.setProperty('--mx', x.toString());
      sectionRef.current.style.setProperty('--my', y.toString());
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // ─── SCROLL DRIVEN INFINITE ROW ANIMATION ─────────
    const section = sectionRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!section || !row1 || !row2) return;

    const LERP = 0.1;
    const DRIFT1 = 0.4; // Top row faster
    const DRIFT2 = 0.2; // Bottom row slower
    const MAX_VEL = 12;

    let loop1 = 0;
    let loop2 = 0;

    const measure = () => {
      // Loop width is exactly the width of one full duplicated group
      if (row1.children.length >= 2) loop1 = row1.children[1].getBoundingClientRect().width;
      if (row2.children.length >= 2) loop2 = row2.children[1].getBoundingClientRect().width;
    };
    setTimeout(measure, 100);
    window.addEventListener('resize', measure);

    let x1 = 0, x2 = 0, tX1 = 0, tX2 = 0, d1 = 0, d2 = 0;
    let lastY = window.scrollY;
    let vel = 0;
    let rafId = 0;

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const vp = window.innerHeight;
      const sTop = rect.top + window.scrollY;
      const entry = window.scrollY + vp;
      if (entry < sTop) return;
      const range = rect.height + vp;
      const progress = Math.max(0, Math.min(range, entry - sTop));
      const offset = (progress / range) * 500;
      tX1 = -offset; // Top moves left
      tX2 = offset;  // Bottom moves right
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
      const vb = Math.max(-MAX_VEL, Math.min(MAX_VEL, vel * 0.15));
      vel *= 0.8;
      
      d1 -= (DRIFT1 + Math.abs(vb * 0.5));
      d2 += (DRIFT2 + Math.abs(vb * 0.3));
      
      x1 += (tX1 - x1) * LERP;
      x2 += (tX2 - x2) * LERP;
      
      const fx1 = x1 + d1;
      const fx2 = x2 + d2;
      
      if (loop1 > 0 && loop2 > 0) {
        const wx1 = ((fx1 % loop1) + loop1) % loop1 - loop1;
        const wx2 = ((fx2 % loop2) + loop2) % loop2 - loop2;
        row1.style.transform = `translate3d(${wx1.toFixed(2)}px,0,0)`;
        row2.style.transform = `translate3d(${wx2.toFixed(2)}px,0,0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#e3e2dc] border-t border-[#c8c7c1]">
      <style jsx global>{`
        @keyframes float-card {
          0%, 100% { transform: translateY(0) rotate(0); }
          33% { transform: translateY(-4px) rotate(0.4deg); }
          66% { transform: translateY(4px) rotate(-0.4deg); }
        }
        .animate-float {
          animation: float-card infinite ease-in-out;
        }
      `}</style>

      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.06)_100%)] z-0 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply z-0 pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/40 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Editorial Header */}
      <div className="relative z-10 w-full px-6 md:px-12 pt-28 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="font-medium text-[clamp(2.25rem,4.5vw,4rem)] tracking-tight text-[#111111] mb-6">
          WORK GALLERY
        </h2>
        <p className="text-[#555555] text-[clamp(1rem,1.2vw,1.15rem)] max-w-2xl text-balance leading-relaxed font-medium">
          A visual archive of products, interfaces, experiments, and ideas built across web, mobile, AI, and design.
        </p>
      </div>

      {/* Edge Fade Masks & Gallery Container */}
      <div 
        className="relative z-10 w-full pb-24"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', 
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' 
        }}
      >
        {/* Row 1 — Closer, faster, moves left */}
        <div className="overflow-hidden mb-8 md:mb-12">
          <div ref={row1Ref} className="flex" style={{ willChange: "transform", width: "max-content" }}>
            {[0, 1, 2].map((groupIndex) => (
              <div key={`r1-grp-${groupIndex}`} className="flex items-center flex-shrink-0">
                {ROW_1.map((item, i) => (
                  <GalleryCard 
                    key={i} 
                    item={item} 
                    isFirst={groupIndex === 0 && i === 0} 
                    isTopRow={true} 
                    index={i + groupIndex * ROW_1.length}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Farther, slower, moves right */}
        <div className="overflow-hidden pb-12">
          <div ref={row2Ref} className="flex" style={{ willChange: "transform", width: "max-content" }}>
            {[0, 1, 2].map((groupIndex) => (
              <div key={`r2-grp-${groupIndex}`} className="flex items-center flex-shrink-0">
                {ROW_2.map((item, i) => (
                  <GalleryCard 
                    key={i} 
                    item={item} 
                    isFirst={groupIndex === 0 && i === 0} 
                    isTopRow={false} 
                    index={i + groupIndex * ROW_2.length + 100} // offset index so it's different from ROW_1
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
