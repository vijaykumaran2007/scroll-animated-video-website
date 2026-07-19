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
  const maskRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const projects = document.getElementById("projects");
      
      // 1. Cinematic Overlap Transition (Projects recedes)
      if (projects) {
        // Pin projects so Certificates slide over it
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          pin: projects,
          pinSpacing: false,
        });

        // Push projects away (scale down, blur, fade)
        gsap.to(projects, {
          scale: 0.9,
          y: "-5vh",
          opacity: 0.2,
          filter: "blur(12px)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          }
        });
      }

      // 2. Premium Image Reveal (Curved/Rounded Mask)
      gsap.fromTo(maskRef.current,
        { clipPath: "inset(20% 10% 20% 10% round 48px)" },
        { 
          clipPath: "inset(0% 0% 0% 0% round 0px)", 
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          }
        }
      );

      // 3. Staggered Typography Reveal
      const tlText = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });
      
      tlText.fromTo(".cert-label", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      ).fromTo(".cert-heading",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      // 4. Staggered Card Reveal with Spring-like easing
      gsap.fromTo(".cert-card", 
        { opacity: 0, y: 120, scale: 0.9, rotationX: 5 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          rotationX: 0, 
          duration: 1.2, 
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 5. Ambient Background Object (Floating Glass) Parallax
      gsap.to(".abstract-glass", {
        yPercent: -40,
        rotation: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // 6. Horizontal Scroll (Original functionality)
      const wrapper = scrollWrapperRef.current;
      if (wrapper) {
        const totalWidth = wrapper.scrollWidth - window.innerWidth;
        
        gsap.to(wrapper, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            // pin: true, // Disabled to avoid React reconciliation issues
            anticipatePin: 1,
          }
        });
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full z-20 bg-transparent"
    >
      <div 
        ref={maskRef}
        className="absolute inset-0 bg-[#e3e2dc] text-[#111111] overflow-hidden flex items-center will-change-transform"
      >
        {/* Large Visual: Abstract Glass Object */}
        <div className="abstract-glass absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] rounded-full blur-[80px] opacity-60 bg-gradient-to-br from-indigo-300/40 via-purple-300/40 to-amber-200/40 pointer-events-none mix-blend-multiply" />
        
        {/* Ambient Particles / Grain */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay z-0"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }} 
        />

        {/* Main Heading */}
        <div className="absolute top-12 md:top-16 left-6 md:left-[10vw] z-20 pointer-events-none flex flex-col gap-2">
          <span className="cert-label text-[10px] font-bold tracking-[0.2em] text-indigo-600 uppercase">
            Chapter 02
          </span>
          <h2 className="cert-heading text-2xl md:text-5xl font-black tracking-tight text-[#111111] border-b-2 border-[#111111]/10 pb-4 inline-block">
            Certifications
          </h2>
        </div>

        {/* Decorative vertical text left */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-40">
          <span className="text-[10px] font-bold tracking-widest text-[#111111]">005</span>
        </div>

        {/* Decorative vertical text right */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-40">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#111111] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Validation
          </span>
        </div>

        {/* GSAP Scrolling Wrapper */}
        <div 
          ref={scrollWrapperRef} 
          className="flex h-[60vh] gap-16 md:gap-32 px-[15vw] items-center whitespace-nowrap will-change-transform z-10"
        >
          {CERTIFICATIONS.map((cert, idx) => (
            <div key={idx} className="cert-card relative w-[75vw] md:w-[45vw] shrink-0 h-full group overflow-hidden bg-black/5 rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-black/5 backdrop-blur-sm">
               <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-cover md:object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] scale-105 group-hover:scale-100"
               />
               
               {/* Text Overlay */}
               <div className="absolute bottom-6 md:bottom-8 left-6 right-6 md:left-8 md:right-8 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-8 group-hover:translate-y-0 pointer-events-none">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/90 bg-black/60 backdrop-blur-md w-fit px-3 py-1.5 rounded-full">{cert.issuer}</span>
                  <h3 className="text-lg md:text-2xl font-bold text-white whitespace-normal bg-black/60 backdrop-blur-md w-fit px-4 py-2 rounded-[12px] leading-snug shadow-xl">{cert.name}</h3>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}