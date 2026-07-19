"use client";

import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Code2,
  Mail,
  Award,
  MapPin,
  ExternalLink,
  Copy,
} from "lucide-react";
import CreatureTracker from "./components/CreatureTracker";
import WorkGallery from "./components/WorkGallery";
import CertificatesGallery from "./components/CertificatesGallery";

/* Inline brand icons. This version of lucide-react does not expose
   GitHub / LinkedIn names, so we hand-roll SVG paths that match the
   lucide-outline style (24x24 viewBox, 2px stroke, round caps). */
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width={4} height={12} x={2} y={9} rx={1} />
    <circle cx={4} cy={4} r={2} />
  </svg>
);

type Project = {
  num: string;
  title: string;
  blurb: string;
  url: string;
  stackLabel: string;
  category: string;
  year: string;
  stack: ReadonlyArray<string>;
  images: string[];
  accentWash?: boolean;
};

const PROJECTS: ReadonlyArray<Project> = [
  {
    num: "01",
    title: "Aditya Paper Works",
    blurb:
      "Marketing site for a paper-products manufacturer featuring custom scroll-driven timelines and a fully responsive layout built from scratch.",
    url: "https://adityapaperworks.vercel.app/",
    stackLabel: "HTML / GSAP",
    category: "Web",
    year: "2025",
    stack: ["HTML5", "CSS3", "GSAP", "Responsive Layout"],
    images: [
      "/images/aditya.png",
      "/images/aditya1.png",
      "/images/aditya2.png",
    ],
    accentWash: true,
  },
  {
    num: "02",
    title: "Surrendraw",
    blurb:
      "A platform for Engineering Graphics education that enables digital drawings and instant AI-powered feedback on structural accuracy, simplifying college assessments through automated grading.",
    url: "https://surrenddraw.web.app/",
    stackLabel: "React / FastAPI",
    category: "Web",
    year: "2024",
    stack: ["React", "Python", "FastAPI", "OpenCV", "AI Grading"],
    images: [
      "/images/surrendraw.png",
      "/images/surrendraw1.png",
      "/images/surrendraw.png",
    ],
  },
  {
    num: "03",
    title: "Sentinel3",
    blurb:
      "An AI-powered EHR integrating ML diagnostics, outbreak mapping, and clinical decision support. Combines three medical analysis layers for non-invasive insights. 2nd Runner-up at an international hackathon.",
    url: "https://sentinel3ai.vercel.app/",
    stackLabel: "Agentic AI / EHR",
    category: "Web",
    year: "2024",
    stack: ["ML", "EHR Systems", "Agentic AI", "Python", "React"],
    images: [
      "/images/sentinetal.png",
      "/images/sentinetal1.png",
      "/images/sentinetal2.png",
    ],
    accentWash: true,
  },
];

const SKILLS: ReadonlyArray<{ group: string; items: string[] }> = [
  {
    group: "Languages",
    items: ["Python", "Dart", "JavaScript", "TypeScript"],
  },
  {
    group: "Mobile",
    items: ["Flutter", "Firebase", "Provider", "Material Design"],
  },
  {
    group: "Machine Learning",
    items: [
      "Supervised Learning",
      "Model Training",
      "Regression",
      "Classification",
    ],
  },
  {
    group: "Web",
    items: ["HTML5", "CSS3", "GSAP", "REST APIs"],
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Option B Parallax: Background moves at 0.5x speed.
  // 900px is roughly 100vh on desktop.
  const heroBgY = useTransform(scrollY, [0, 900], [0, 450]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#e3e2dc] text-[#111111] selection:bg-indigo-500 selection:text-indigo-950"
    >
      <div className="relative w-full z-0 overflow-hidden">
        <Hero heroBgY={heroBgY} />
      </div>
      <Skills />
      <Projects />
      <CertificatesGallery />
      <WorkGallery />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------- HERO ---------------------------------------------------------- */

function Hero({ heroBgY }: { heroBgY: any }) {
  return (
    <section id="hero-section" className="relative h-[100dvh] w-full z-0 overflow-hidden flex flex-col bg-[#e3e2dc]">
      
      {/* Background Parallax Layer */}
      <motion.div 
        style={{ y: heroBgY }}
        className="absolute inset-0 w-full h-full flex flex-col justify-end pointer-events-none z-0 will-change-transform"
      >
        <div className="absolute inset-0 pointer-events-auto origin-bottom">
          <CreatureTracker />
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="relative max-w-[90rem] mx-auto w-full px-8 flex-1 flex flex-col justify-end pb-12 md:pb-24 z-10 pointer-events-auto">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-24">
          
          {/* Left Side: Big Text & Trust */}
          <div className="max-w-4xl flex flex-col gap-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-400 -mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-3 h-3 -mt-0.5 mr-1.5 align-middle"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Coimbatore, India
            </p>
            <h1 className="text-[clamp(2rem,3.5vw,3.75rem)] font-medium tracking-tight leading-[1.1] text-white text-balance">
              Building mobile apps, <br />
              <span className="text-white/80">machine learning</span> <br />
              systems, and immersive <br />
              web experiences.
            </h1>
          </div>

          {/* Right Side: Subtext and buttons */}
          <div className="max-w-md pb-6 md:pb-12">
            <p className="text-[18px] leading-[1.4] text-white/90 mb-8 font-medium text-balance">
              I&apos;m Vijay, a CS undergrad at PSG iTech. I build with Flutter
              and Firebase, dive deep into machine learning, and craft websites that feel alive.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="flex items-center gap-2 bg-white text-[#111111] px-5 py-3 rounded-[10px] text-[15px] font-semibold hover:bg-white/90 transition-colors"
              >
                View selected work
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m10 8 4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              </a>
              <a
                href="mailto:vijaykumaran2007@gmail.com"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-[10px] text-[15px] font-medium border border-white/20 hover:bg-white/20 transition-colors"
              >
                Email me
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating navigation */}
      <header className="fixed top-5 left-5 right-5 max-w-[90rem] mx-auto h-14 hidden md:flex items-center justify-between z-50 px-5 pointer-events-auto">
        <a
          href="#top"
          className="font-medium text-[20px] tracking-tight text-white hover:text-white/80 transition-colors"
        >
          Vijay Adithiya
        </a>
        <div className="flex items-center gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
          <nav className="flex items-center gap-7 px-6 text-[14px] font-medium text-white/90">
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="mailto:vijaykumaran2007@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </nav>
          <a
            href="mailto:vijaykumaran2007@gmail.com"
            className="flex items-center gap-2 bg-[#000000] text-white px-5 py-2.5 rounded-full text-[14px] font-medium hover:bg-black/80 transition-colors"
          >
            Email me
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m10 8 4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </a>
        </div>
      </header>

      {/* GitHub button — sits bottom-right, covers the AI watermark */}
      <a
        href="https://github.com/vijaykumaran2007"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-24 z-50 hidden md:flex items-center justify-center w-14 h-14 bg-[#e3e2dc]/80 border border-[#b4b3ad] hover:border-indigo-400 text-[#444444] hover:text-indigo-400 rounded-full backdrop-blur-md transition-all duration-200"
      >
        <GithubIcon className="w-[22px] h-[22px] stroke-[2px]" />
      </a>
    </section>
  );
}



/* ---------- PROJECTS ------------------------------------------------------ */

function Projects() {
  return (
    <section
      id="projects"
      className="relative z-10 pt-24 pb-48 md:pt-32 transform-gpu"
    >
      <div className="max-w-[90rem] mx-auto px-8 relative z-10">
        <div className="max-w-2xl mb-24 md:mb-32">
          <SectionHeader
            eyebrow="Projects"
            title="Selected work"
            intro="A curated selection of applications and experiments, built to solve real problems through design and engineering."
          />
        </div>

        <div className="flex flex-col relative w-full">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              total={PROJECTS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track when this card hits the top and starts getting covered by the next card
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Cinematic scroll: Card scales down and fades into the shadows as it gets covered
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.2, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Layout variety: Alternate image/text positions
  const isEven = index % 2 === 0;

  // Extremely lightweight CSS gradients instead of blur filters
  const themeGlows = [
    "radial-gradient(circle at 70% 30%, rgba(34,197,94,0.06) 0%, transparent 60%)",
    "radial-gradient(circle at 30% 70%, rgba(59,130,246,0.06) 0%, transparent 60%)",
    "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 60%)",
    "radial-gradient(circle at 80% 20%, rgba(236,72,153,0.06) 0%, transparent 60%)",
    "radial-gradient(circle at 20% 80%, rgba(234,179,8,0.06) 0%, transparent 60%)",
  ];

  return (
    <div
      ref={containerRef}
      className="h-[100vh] sticky top-0 flex items-center justify-center w-full origin-top"
    >
      <motion.div
        style={{ scale, opacity, y }}
        className="w-full h-[85vh] md:h-[80vh] rounded-[32px] md:rounded-[48px] border border-[#c8c7c1] bg-[#f7f6f2] p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden relative group/card flex flex-col will-change-transform"
      >
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: themeGlows[index] }}
        />

        <div className={`relative z-10 flex flex-col h-full gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          
          {/* Text Content Block */}
          <div className="flex flex-col flex-1 justify-center gap-6">
            <motion.div 
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4 mb-2"
            >
              <span
                className="font-black leading-none text-[#111111]/5 tabular-nums"
                style={{ fontSize: "clamp(3rem, 8vw, 100px)" }}
              >
                {project.num}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#333333] text-[11px] uppercase tracking-[0.2em] font-bold border border-[#c8c7c1] rounded-full px-4 py-1.5 bg-white/50">
                  {project.category}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-3xl md:text-5xl font-black text-[#111111] leading-[1.1] tracking-tight mb-4 text-balance">
                {project.title}
              </h3>
              <p className="text-[17px] text-[#555555] leading-[1.6] max-w-md font-medium">
                {project.blurb}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2 mt-2"
            >
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] font-semibold px-3 py-1 rounded-[8px] bg-black/5 text-[#333333]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4"
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-3 rounded-full bg-[#111111] px-6 py-3.5 text-white text-[13px] font-bold uppercase tracking-widest hover:bg-[#222222] transition-colors duration-300"
              >
                View Case Study
                <div className="overflow-hidden relative w-4 h-4">
                  <ExternalLink className="w-4 h-4 absolute top-0 left-0 transition-transform duration-300 group-hover/btn:translate-x-4 group-hover/btn:-translate-y-4" />
                  <ExternalLink className="w-4 h-4 absolute top-0 left-0 -translate-x-4 translate-y-4 transition-transform duration-300 group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
                </div>
              </a>
            </motion.div>
          </div>

          {/* Cinematic Image Composition */}
          <div className="flex-1 relative h-full min-h-[300px] flex items-center justify-center">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 w-full h-full flex gap-4 p-4 group/img"
            >
              <div className={`flex flex-col gap-4 ${isEven ? 'w-[40%]' : 'w-[60%]'} h-full justify-center`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] bg-[#e3e2dc]"
                  style={{ height: isEven ? "45%" : "100%" }}
                >
                  <Image
                    src={project.images[isEven ? 0 : 2]}
                    alt={`${project.title} screenshot 1`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
                  />
                </motion.div>
                {isEven && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] bg-[#e3e2dc] h-[55%]"
                  >
                    <Image
                      src={project.images[1]}
                      alt={`${project.title} screenshot 2`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
                    />
                  </motion.div>
                )}
              </div>
              
              <div className={`flex flex-col gap-4 ${isEven ? 'w-[60%]' : 'w-[40%]'} h-full justify-center`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, x: isEven ? 20 : -20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] bg-[#e3e2dc]"
                  style={{ height: isEven ? "100%" : "45%" }}
                >
                  <Image
                    src={project.images[isEven ? 2 : 0]}
                    alt={`${project.title} screenshot 3`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
                  />
                </motion.div>
                {!isEven && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, x: -20 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] bg-[#e3e2dc] h-[55%]"
                  >
                    <Image
                      src={project.images[1]}
                      alt={`${project.title} screenshot 4`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
                    />
                  </motion.div>
                )}
              </div>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- SKILLS - semantic first, restrained ------------------------ */

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

function Skills() {
  return (
    <section
      id="about"
      className="relative z-30 w-full pt-40 pb-24 md:pb-32 bg-[#e3e2dc] will-change-transform"
    >
      <div className="max-w-[90rem] mx-auto px-8 relative z-20">
        
        {/* ── SKILLS / TOOLS ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-32 md:mb-48">
          <div className="lg:w-[40%] flex flex-col items-start">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[clamp(2.75rem,5vw,4.5rem)] font-medium tracking-tight text-[#111111] leading-[1.05] text-balance"
            >
              Crafting <br className="hidden lg:block"/> experiences.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 text-[17px] text-[#555555] font-medium max-w-sm leading-[1.5]"
            >
              The curated toolkit I rely on daily to design, architect, and ship high-end digital products.
            </motion.p>
          </div>
          
          <div className="lg:w-[60%] pt-4 lg:pt-0">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col gap-10 w-full"
            >
              {SKILLS.map((group) => (
                <div key={group.group} className="flex flex-col gap-4">
                  <span className="text-[12px] font-bold tracking-[0.15em] text-[#888888] uppercase pl-1">{group.group}</span>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {group.items.map((skill) => (
                      <motion.div
                        key={skill}
                        variants={staggerItem}
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="px-5 py-2.5 rounded-[12px] bg-[#f7f6f2] border border-[#d5d4ce] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] text-[#222222] font-semibold text-[14px] cursor-default will-change-transform transition-colors transition-shadow duration-300 hover:bg-[#ffffff] hover:border-[#b4b3ad] hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.08)]"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── EXPERIENCE / TIMELINE ── */}
        <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-24">
          <div className="lg:w-[40%] flex flex-col items-start">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[clamp(2.75rem,5vw,4.5rem)] font-medium tracking-tight text-[#111111] leading-[1.05] text-balance"
            >
              Where I&apos;ve <br className="hidden lg:block"/> been.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 text-[17px] text-[#555555] font-medium max-w-sm leading-[1.5]"
            >
              Communities, teams, and milestones that have shaped my perspective and approach to engineering.
            </motion.p>
          </div>

          <div className="lg:w-[60%] relative mt-8 lg:mt-0">
            {/* Elegant continuous timeline line */}
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute left-[27px] top-4 w-[1px] bg-gradient-to-b from-amber-500/40 via-[#111111]/10 to-transparent" 
            />
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col gap-6"
            >
              {[
                { title: "Member", org: "PSG iTech Software Development Cell" },
                { title: "Active Member", org: "GDG PSG iTech" },
                { title: "Member", org: "Coding Club" }
              ].map((exp, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  className="relative pl-16 group"
                >
                  {/* Timeline interactive dot */}
                  <div className="absolute left-[23px] top-6 w-[9px] h-[9px] rounded-full bg-[#e3e2dc] border-[2px] border-[#888888] group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:scale-[1.6] transition-all duration-300 z-10 will-change-transform" />
                  
                  {/* Refined Milestone Card - Tighter padding, stronger identity, no backdrop blur */}
                  <div className="bg-[#f7f6f2] border border-[#d5d4ce] px-6 py-5 rounded-[16px] shadow-[0_2px_12px_-6px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5 group-hover:bg-[#ffffff] group-hover:border-[#c8c7c1] transition-all duration-400 will-change-transform">
                    <span className="text-[11px] font-bold tracking-[0.2em] text-amber-600 uppercase mb-1.5 block">
                      {exp.title}
                    </span>
                    <h3 className="text-[19px] md:text-[21px] font-bold text-[#111111] leading-tight tracking-tight">
                      {exp.org}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}



/* ---------- CONTACT ------------------------------------------------------- */

function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("vijaykumaran2007@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-10 bg-[#e3e2dc] border-t border-[#c8c7c1]">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-400 mb-5">
              Contact
            </p>
            <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] font-semibold tracking-[-0.02em] leading-[1.05] text-[#111111] text-balance">
              Have a project, an internship opportunity, or just want to talk Flutter?
            </h2>
            <p className="mt-5 text-[16px] leading-[1.6] text-[#444444] max-w-md">
              I&apos;m open to internships, hackathon teams, and interesting
              collaborations. Email is the fastest way to reach me.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <button
              onClick={handleCopy}
              className="group inline-flex items-center justify-between gap-4 bg-[#111111] text-[#e3e2dc] rounded-full px-6 py-4 font-semibold text-[15px] hover:bg-indigo-400 hover:text-[#e0e7ff] active:translate-y-[1px] transition-colors md:w-fit"
            >
              {copied ? "Copied to clipboard!" : "vijaykumaran2007@gmail.com"}
              {!copied && <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            </button>
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <a
                href="https://github.com/vijaykumaran2007"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full border border-[#b4b3ad] text-[#444444] hover:text-[#111111] hover:border-[#111111] transition-colors font-medium text-[15px]"
              >
                <GithubIcon className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/vijay-adithiya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full border border-[#b4b3ad] text-[#444444] hover:text-[#111111] hover:border-[#111111] transition-colors font-medium text-[15px]"
              >
                <LinkedinIcon className="w-5 h-5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER -------------------------------------------------------- */

function Footer() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => {
      const text = textRef.current;
      const wrap = wrapRef.current;
      if (!text || !wrap) return;
      // Use a very large size so the text definitely overflows, then measure
      text.style.fontSize = "500px";
      text.style.width = "max-content";
      const textWidth = text.scrollWidth;
      text.style.width = "";
      const style = window.getComputedStyle(wrap);
      const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const containerWidth = wrap.offsetWidth - paddingX;
      if (textWidth > 0) {
        text.style.fontSize = `${Math.floor(500 * containerWidth / textWidth)}px`;
      }
    };
    // Wait for fonts before measuring so glyph widths are accurate
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <footer className="relative z-10 bg-[#e3e2dc] border-t border-[#c8c7c1]" style={{ overflowX: "clip" }}>
      {/* Large display name — fills full width dynamically */}
      <div ref={wrapRef} className="w-full px-6 pt-16 pb-4 select-none pointer-events-none">
        <p
          ref={textRef}
          className="font-black text-[#111111] leading-none whitespace-nowrap"
          style={{
            opacity: 0.4,
            letterSpacing: "-0.03em",
            display: "block",
            width: "100%",
          }}
        >
          Vijay Adithiya
        </p>
      </div>
    </footer>
  );
}

/* ---------- SHARED SECTION HEADER (used sparingly) ----------------------- */
/**
 * Per design-taste 4.7, eyebrows are rationed: max 1 per 3 sections.
 * This component is used 4x across 4 distinct sections (Projects, Skills,
 * Education, Contact), so each instance is the section's only eyebrow.
 */

function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-400 mb-4">
        {eyebrow}
      </p>
      <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold tracking-[-0.02em] leading-[1.08] text-[#111111] text-balance">
        {title}
      </h2>
      <p className="mt-4 text-[16px] leading-[1.6] text-[#444444] max-w-[55ch]">
        {intro}
      </p>
    </div>
  );
}
