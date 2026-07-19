"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const CERTIFICATIONS = [
  {
    name: "Supervised Machine Learning: Regression & Classification",
    issuer: "DeepLearning.AI",
    image: "/images/mlpart1.png",
    category: "Machine Learning",
  },
  {
    name: "Qualcomm AI Upskilling Program",
    issuer: "Qualcomm",
    image: "/images/qualcomm.png",
    category: "AI",
  },
  {
    name: "Python Programming Foundation",
    issuer: "Onwingspan",
    image: "/images/pythoncertificate.png",
    category: "Python",
  },
  {
    name: "Flutter & Dart: The Complete Development Guide",
    issuer: "Udemy",
    image: "/images/flutter.png",
    category: "Mobile Development",
  },
] as const;

export default function CertificatesGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const wrapper = scrollWrapperRef.current;
      if (!wrapper) return;

      const totalWidth = wrapper.scrollWidth - window.innerWidth;
      
      gsap.to(wrapper, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen bg-[#e3e2dc] text-[#111111] overflow-hidden flex items-center"
    >
      {/* Main Heading */}
      <div className="absolute top-12 md:top-16 left-6 md:left-[10vw] z-20 pointer-events-none">
        <h2 className="text-2xl md:text-4xl font-bold tracking-widest text-[#111111] uppercase border-b-2 border-[#111111] pb-2 inline-block">
          Certifications
        </h2>
      </div>

      {/* Decorative vertical text left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <span className="text-[10px] font-bold tracking-widest text-[#111111]">005</span>
      </div>
      

      {/* Decorative vertical text right */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#111111] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Certifications
        </span>
      </div>

      {/* GSAP Scrolling Wrapper */}
      <div 
        ref={scrollWrapperRef} 
        className="flex h-[60vh] gap-32 px-[15vw] items-center whitespace-nowrap will-change-transform"
      >
        {CERTIFICATIONS.map((cert, idx) => (
          <div key={idx} className="relative w-[70vw] md:w-[45vw] shrink-0 h-full group overflow-hidden bg-black">
             <Image
                src={cert.image}
                alt={cert.name}
                fill
                className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
             />
             
             {/* Text Overlay */}
             <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 bg-black/50 w-fit px-2 py-1">{cert.issuer}</span>
                <h3 className="text-lg md:text-xl font-medium text-white whitespace-normal bg-black/50 w-fit px-3 py-1 leading-snug">{cert.name}</h3>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
}
