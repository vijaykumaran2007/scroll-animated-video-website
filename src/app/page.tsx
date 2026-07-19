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

  // Hero content fades out as the projects panel slides over it.
  const heroOpacity = useTransform(scrollY, [0, 480], [1, 0]);
  const heroTranslateY = useTransform(scrollY, [0, 480], [0, -32]);
  
  // Parallax effect for the entire hero background and content
  const heroParallaxY = useTransform(scrollY, [0, 1000], [0, -750]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#e3e2dc] text-[#111111] selection:bg-indigo-500 selection:text-indigo-950"
    >
      <div className="relative w-full">
        <Hero heroOpacity={heroOpacity} heroTranslateY={heroTranslateY} heroParallaxY={heroParallaxY} />
        <Skills />
      </div>
      <Projects />
      <CertificatesGallery />
      <WorkGallery />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------- HERO ---------------------------------------------------------- */

function Hero({
  heroOpacity,
  heroTranslateY,
  heroParallaxY,
}: {
  heroOpacity: ReturnType<typeof useTransform<number, number>>;
  heroTranslateY: ReturnType<typeof useTransform<number, number>>;
  heroParallaxY: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <section className="sticky top-0 h-[100dvh] w-full z-0 overflow-hidden bg-[#e3e2dc]">
      
      {/* Parallax wrapper for the creature and text */}
      <motion.div style={{ y: heroParallaxY }} className="absolute inset-0 w-full h-full flex flex-col justify-end pointer-events-none z-0">
        
        <div className="absolute inset-0 pointer-events-auto">
          <CreatureTracker />
        </div>



      {/* Hero content - matches the image layout */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroTranslateY }}
        className="relative max-w-[90rem] mx-auto w-full px-8 flex-1 flex flex-col justify-end pb-12 md:pb-24 z-10 pointer-events-auto"
      >
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
      </motion.div>
      </motion.div>

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
      className="relative z-10 bg-[#e3e2dc] border-t border-[#c8c7c1] transform-gpu"
    >
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <SectionHeader
          eyebrow="Projects"
          title="Selected work"
          intro="Three projects across mobile, web, and ML — each one started as a problem worth solving."
        />

        <div className="mt-16 flex flex-col items-center mt-[15vh]">
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
  const img1Ref = useRef<HTMLImageElement>(null);
  const img2Ref = useRef<HTMLImageElement>(null);
  const img3Ref = useRef<HTMLImageElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // Direct DOM updates — no setState, no re-renders on every mousemove
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (img1Ref.current) img1Ref.current.style.transform = `scale(1.08) translate3d(${x * -10}px, ${y * -10}px, 0)`;
    if (img2Ref.current) img2Ref.current.style.transform = `scale(1.08) translate3d(${x * -14}px, ${y * -14}px, 0)`;
    if (img3Ref.current) img3Ref.current.style.transform = `scale(1.08) translate3d(${x * -12}px, ${y * -12}px, 0)`;
  };

  const handleMouseLeave = () => {
    if (img1Ref.current) img1Ref.current.style.transform = "scale(1.08) translate3d(0px, 0px, 0)";
    if (img2Ref.current) img2Ref.current.style.transform = "scale(1.08) translate3d(0px, 0px, 0)";
    if (img3Ref.current) img3Ref.current.style.transform = "scale(1.08) translate3d(0px, 0px, 0)";
  };

  const themeGlows = [
    "radial-gradient(circle at 80% 20%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    "radial-gradient(circle at 80% 20%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    "radial-gradient(circle at 80% 20%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    "radial-gradient(circle at 80% 20%, rgba(234,179,8,0.12) 0%, transparent 60%)",
  ];

  const themeBorderHover = [
    "hover:border-indigo-500/30",
    "hover:border-blue-500/30",
    "hover:border-indigo-500/30",
    "hover:border-pink-500/30",
    "hover:border-yellow-500/30",
  ];

  return (
    <div
      ref={containerRef}
      className="h-[75vh] md:h-[80vh] sticky flex items-center justify-center w-full"
      style={{ top: `calc(5.5rem + ${index * 32}px)` }}
    >
      <motion.div
        style={{ scale }}
        className={`w-full max-w-5xl rounded-[30px] sm:rounded-[40px] md:rounded-[48px] border border-[#c8c7c1] bg-[#d5d4ce] p-4 sm:p-5 md:p-6 shadow-2xl overflow-hidden relative group/card transition-colors duration-500 ${themeBorderHover[index]}`}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
          style={{ background: themeGlows[index] }}
        />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 md:mb-5">
            <span
              className="font-black leading-none select-none text-[#111111]/10"
              style={{ fontSize: "clamp(2rem, 6vw, 80px)" }}
            >
              {project.num}
            </span>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#444444] text-xs uppercase tracking-widest font-semibold border border-[#b4b3ad] rounded-full px-3 py-1 bg-[#111111]/5">
                  {project.category}
                </span>
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#111111]/5 text-[#444444] border border-[#111111]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-[#111111] leading-tight">
                {project.title}
              </h3>
              <p className="text-sm text-[#444444] leading-relaxed max-w-lg font-medium">
                {project.blurb}
              </p>
            </div>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 rounded-full border border-[#b4b3ad] px-5 py-2.5 text-[#111111] text-xs font-bold uppercase tracking-widest hover:bg-[#111111]/10 hover:border-[#111111] hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 w-fit flex-shrink-0"
              >
                View
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex gap-3 md:gap-4 project-hover-card group/img overflow-hidden"
          >
            <div
              className="flex flex-col gap-3 md:gap-4"
              style={{ width: "40%" }}
            >
              <div
                className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[32px] bg-zinc-950/80"
                style={{ height: "clamp(90px, 12vw, 170px)" }}
              >
                <Image
                  ref={img1Ref}
                  src={project.images[0]}
                  alt={`${project.title} 1`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  style={{
                    transform: "scale(1.08) translate3d(0px, 0px, 0)",
                    transition: "transform 0.15s ease-out",
                    willChange: "transform",
                  }}
                />
              </div>
              <div
                className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[32px] bg-zinc-950/80"
                style={{ height: "clamp(120px, 18vw, 250px)" }}
              >
                <Image
                  ref={img2Ref}
                  src={project.images[1]}
                  alt={`${project.title} 2`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  style={{
                    transform: "scale(1.08) translate3d(0px, 0px, 0)",
                    transition: "transform 0.15s ease-out",
                    willChange: "transform",
                  }}
                />
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[32px] bg-zinc-950/80">
              <Image
                ref={img3Ref}
                src={project.images[2]}
                alt={`${project.title} 3`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{
                  transform: "scale(1.08) translate3d(0px, 0px, 0)",
                  transition: "transform 0.15s ease-out",
                  willChange: "transform",
                }}
              />
            </div>
          </a>
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
      staggerChildren: 0.12,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

function Skills() {
  return (
    <section
      id="about"
      className="relative z-10 bg-[#e3e2dc] border-t border-[#c8c7c1] shadow-[0_-30px_60px_rgba(0,0,0,0.75)]"
    >
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
          {/* ABOUT / SKILLS */}
          <div>
            <SectionHeader
              eyebrow="About"
              title="What I work with"
              intro="Tools I reach for daily — comfortable across the full stack: design, code, and deploy."
            />
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-14 grid grid-cols-2 gap-px bg-[#c8c7c1] rounded-2xl overflow-hidden border border-[#c8c7c1]"
            >
              {SKILLS.map((group) => (
                <motion.div
                  key={group.group}
                  variants={staggerItem}
                  className="bg-[#e3e2dc] p-6 md:p-7 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-indigo-400">
                    <Code2 className="w-3.5 h-3.5" />
                    {group.group}
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-[14px] text-[#111111] leading-snug"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* EXPERIENCE */}
          <div>
            <SectionHeader
              eyebrow="Experience"
              title="Where I&apos;ve been"
              intro="Communities, teams, and active involvement."
            />
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-14 flex flex-col gap-4"
            >
              {[
                "Member of PSG iTech Software Development Cell",
                "GDG PSG iTech active member",
                "Coding Club member",
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  className="flex items-start gap-4 bg-[#d5d4ce] p-6 rounded-2xl border border-[#c8c7c1] transition-colors hover:border-[#b4b3ad]"
                >
                  <div className="mt-1.5 text-indigo-400 text-[10px]">●</div>
                  <div className="text-[16px] font-medium text-[#111111] leading-snug">
                    {item}
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
