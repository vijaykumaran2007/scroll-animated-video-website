"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const CERTIFICATIONS = [
  {
    name: "Python Programming Foundation",
    issuer: "Onwingspan",
    image: "/images/pythoncertificate.png",
    category: "Python",
    year: "2022",
    description: "Built a solid foundation in Python, covering data structures, algorithms, and application development."
  },
  {
    name: "Flutter & Dart: The Complete Development Guide",
    issuer: "Udemy",
    image: "/images/flutter.png",
    category: "Mobile Development",
    year: "2023",
    description: "Mastered cross-platform mobile development, state management, and Firebase integration."
  },
  {
    name: "Qualcomm AI Upskilling Program",
    issuer: "Qualcomm",
    image: "/images/qualcomm.png",
    category: "AI",
    year: "2024",
    description: "Advanced training in hardware-accelerated AI model deployment and optimization."
  },
  {
    name: "Supervised Machine Learning: Regression & Classification",
    issuer: "DeepLearning.AI",
    image: "/images/mlpart1.png",
    category: "Machine Learning",
    year: "2024",
    description: "Gained expertise in fundamental ML algorithms, regression models, and neural network classification."
  },
] as const;

const CertCard = ({ cert }: { cert: typeof CERTIFICATIONS[number] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
      cardRef.current.style.willChange = 'transform'; // promote only during hover
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const rect = rectRef.current;
    if (!el || !rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    // Direct style write — no GSAP tween created per frame
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02) translateY(-8px)`;
    el.style.boxShadow = "0 20px 40px rgba(245,158,11,0.08)";
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    rectRef.current = null;
    const el = cardRef.current;
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      y: 0,
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      duration: 0.7,
      ease: "power3.out",
      onComplete: () => { el.style.willChange = 'auto'; }, // demote after spring-back
    });
  };

  return (
    // Wrapper has NO initial clip-path — GSAP sets it via gsap.set before animating
    <div className="cert-card-wrapper w-full">
      <div
        ref={cardRef}
        className="group relative w-full flex flex-col overflow-hidden bg-white border border-black/5 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#f7f6f2]">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/20 z-10 pointer-events-none" />
          <Image
            src={cert.image}
            alt={cert.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
          />
        </div>
        <div className="flex flex-col flex-1 p-8 md:p-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-[11px] font-bold tracking-[0.2em] text-amber-500 uppercase">{cert.year}</span>
            <span className="w-1 h-1 rounded-full bg-black/10" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#111111]/40 uppercase">{cert.issuer}</span>
          </div>
          <h3 className="text-2xl font-medium text-[#111111] mb-3 tracking-tight text-balance leading-[1.2]">
            {cert.name}
          </h3>
          <p className="text-[15px] text-[#555555] leading-relaxed font-medium text-balance mt-auto">
            {cert.description}
          </p>
          <div className="mt-8">
            <button className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.15em] text-[#111111]/70 hover:text-[#111111] transition-colors group/btn opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-500">
              View Certificate
              <div className="w-8 h-[1px] bg-black/30 group-hover/btn:bg-black group-hover/btn:w-12 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CertificatesGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const bgVisualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // ─── PHASE 1: ENTRANCE — rounded corners → sharp corners as section moves up ─
      const tlReveal = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        }
      });

      tlReveal.fromTo(innerRef.current,
        {
          borderRadius: "120px",
          y: "12vh",
          scale: 0.85,
        },
        {
          borderRadius: "0px",
          y: "0vh",
          scale: 1,
          ease: "power2.inOut",
        }, 0
      );

      // ─── PHASE 2: HEADER ─────────────────────────────────────────────────────────
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 45%",
          toggleActions: "play none none reverse",
        }
      })
        .fromTo(".cert-label",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "expo.out" }
        )
        .fromTo(".cert-heading",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
          "-=0.8"
        )
        .fromTo(".cert-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.8"
        );

      // ─── PHASE 3: CARDS ───────────────────────────────────────────────────────────
      gsap.set(".cert-card-wrapper", { clipPath: "inset(100% 0% 0% 0%)" });

      gsap.to(".cert-card-wrapper", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.inOut",
        duration: 1.2,
        stagger: 0.18,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 20%",
          toggleActions: "play none none reverse",
        }
      });

      // ─── PHASE 4: EXIT ────────────────────────────────────────────────────────────
      const tlExit = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      tlExit.fromTo(innerRef.current,
        {
          borderRadius: "0px",
          y: "0vh",
          scale: 1,
        },
        {
          borderRadius: "120px",
          y: "-12vh",
          scale: 0.85,
          ease: "power2.inOut",
        }, 0
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full z-20 bg-transparent" style={{ contain: 'layout paint' }}>

      {/* The black panel — starts as a small rounded rectangle and grows */}
      <div
        ref={innerRef}
        className="relative w-full bg-[#e3e2dc] text-[#111111] overflow-hidden will-change-transform"
      >
        {/* Ambient background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e3e2dc] via-[#f7f6f2] to-[#e3e2dc] z-0" />
        <div
          className="layer-noise absolute inset-0 opacity-[0.035] z-0 pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        <div className="layer-light-1 absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[80px] rounded-full pointer-events-none z-0" />
        <div className="layer-light-2 absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none z-0" />

        {/* Abstract geometry parallax */}
        <div
          ref={bgVisualRef}
          className="absolute top-[10%] right-[2%] w-[50vw] h-[50vw] max-w-[700px] border border-black/5 bg-gradient-to-br from-black/[0.03] to-transparent rounded-[4rem] rotate-[20deg] pointer-events-none z-0 overflow-hidden will-change-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/5 to-black/10 opacity-60" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center px-6 md:px-12 pt-24 pb-32">
          <div className="max-w-[90rem] w-full flex flex-col items-center">

            {/* Editorial header */}
            <div className="text-center mb-20 flex flex-col items-center">
              <span className="cert-label text-[12px] font-bold tracking-[0.2em] text-amber-500/90 uppercase block mb-5">
                Milestones
              </span>
              <h2 className="cert-heading text-[clamp(2.75rem,5vw,5rem)] font-medium tracking-tight text-[#111111] leading-none">
                CERTIFICATIONS
              </h2>
              <p className="cert-subtitle text-[#555555] text-[clamp(1rem,1.5vw,1.15rem)] font-medium mt-6 max-w-2xl text-balance">
                A curated timeline of professional development, rigorous technical programs, and industry-recognized qualifications.
              </p>
            </div>

            {/* Premium 2-column grid */}
            <div className="cert-grid grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 w-full max-w-6xl">
              {CERTIFICATIONS.map((cert, i) => (
                <CertCard key={i} cert={cert} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
