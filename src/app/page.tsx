"use client";

import { useScroll, useTransform, motion, AnimatePresence, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Copy } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CreatureTracker from "./components/CreatureTracker";
import WorkGallery from "./components/WorkGallery";
import CertificatesGallery from "./components/CertificatesGallery";

gsap.registerPlugin(ScrollTrigger);

/* Inline brand icons — lucide-react doesn't expose GitHub/LinkedIn */
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
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
};

const PROJECTS: ReadonlyArray<Project> = [
  {
    num: "01",
    title: "Aditya Paper Works",
    blurb: "Marketing site for a paper-products manufacturer featuring custom scroll-driven timelines and a fully responsive layout built from scratch.",
    url: "https://adityapaperworks.vercel.app/",
    stackLabel: "HTML / GSAP",
    category: "Web",
    year: "2025",
    stack: ["HTML5", "CSS3", "GSAP", "Responsive Layout"],
    images: ["/images/aditya.png", "/images/aditya1.png", "/images/aditya2.png"],
  },
  {
    num: "02",
    title: "Surrendraw",
    blurb: "A platform for Engineering Graphics education that enables digital drawings and instant AI-powered feedback on structural accuracy, simplifying college assessments through automated grading.",
    url: "https://surrenddraw.web.app/",
    stackLabel: "React / FastAPI",
    category: "Web",
    year: "2024",
    stack: ["React", "Python", "FastAPI", "OpenCV", "AI Grading"],
    images: ["/images/surrendraw.png", "/images/surrendraw1.png", "/images/surrendraw.png"],
  },
  {
    num: "03",
    title: "Sentinel3",
    blurb: "An AI-powered EHR integrating ML diagnostics, outbreak mapping, and clinical decision support. Combines three medical analysis layers for non-invasive insights. 2nd Runner-up at an international hackathon.",
    url: "https://sentinel3ai.vercel.app/",
    stackLabel: "Agentic AI / EHR",
    category: "Web",
    year: "2024",
    stack: ["ML", "EHR Systems", "Agentic AI", "Python", "React"],
    images: ["/images/sentinetal.png", "/images/sentinetal1.png", "/images/sentinetal2.png"],
  },
];

const SKILLS: ReadonlyArray<{ group: string; items: string[] }> = [
  { group: "Languages", items: ["Python", "Dart", "JavaScript", "TypeScript"] },
  { group: "Mobile", items: ["Flutter", "Firebase", "Provider", "Material Design"] },
  { group: "Machine Learning", items: ["Supervised Learning", "Model Training", "Regression", "Classification"] },
  { group: "Web", items: ["HTML5", "CSS3", "GSAP"] },
];

/* Glow per project index — defined once outside render */
const THEME_GLOWS = [
  "radial-gradient(circle at 70% 30%, rgba(34,197,94,0.06) 0%, transparent 60%)",
  "radial-gradient(circle at 30% 70%, rgba(59,130,246,0.06) 0%, transparent 60%)",
  "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 60%)",
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ─────────────────────────────── ROOT ─────────────────────────────── */

export default function Home() {
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], [0, 600]);

  return (
    <div className="relative min-h-screen bg-[#0B1F12] text-[#F7F7F4] selection:bg-indigo-500 selection:text-indigo-950">
      <div className="relative w-full z-0 overflow-hidden">
        <Hero heroBgY={heroBgY} />
      </div>
      <Skills />
      <Projects />
      <CertificatesGallery />
      <WorkGallery />
      <Contact />
    </div>
  );
}

/* ─────────────────────────────── HERO ─────────────────────────────── */

function Hero({ heroBgY }: { heroBgY: MotionValue<number> }) {
  return (
    <section id="hero-section" className="relative h-[100dvh] w-full z-0 overflow-hidden flex flex-col bg-[#0B1F12]">
      {/* Parallax background */}
      <motion.div
        style={{ y: heroBgY }}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 will-change-transform"
      >
        <div className="absolute inset-0 pointer-events-auto origin-bottom">
          <CreatureTracker />
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="relative max-w-[90rem] mx-auto w-full px-8 flex-1 flex flex-col justify-end pb-12 md:pb-24 z-10 pointer-events-auto">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-24">
          <div className="max-w-4xl flex flex-col gap-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-600 -mb-4">
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

          <div className="max-w-md pb-6 md:pb-12">
            <p className="text-[18px] leading-[1.4] text-white/90 mb-8 font-medium text-balance">
              I&apos;m Vijay, a CS undergrad at PSG iTech. I build with Flutter
              and Firebase, dive deep into machine learning, and craft websites that feel alive.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-[10px] text-[15px] font-semibold hover:bg-white/90 transition-colors"
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

      {/* Floating nav */}
      <header className="absolute top-5 left-5 right-5 max-w-[90rem] mx-auto h-14 hidden md:flex items-center justify-between z-50 px-5 pointer-events-auto">
        <a href="#top" className="font-medium text-[20px] tracking-tight text-white hover:text-white/80 transition-colors">
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

      {/* GitHub button */}
      <a
        href="https://github.com/vijaykumaran2007"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-24 z-50 hidden md:flex items-center justify-center w-14 h-14 bg-[#0B1F12]/80 border border-white/20 hover:border-amber-500/60 text-[#A8B0A7] hover:text-amber-600 rounded-full backdrop-blur-md transition-all duration-200"
      >
        <GithubIcon className="w-[22px] h-[22px] stroke-[2px]" />
      </a>
    </section>
  );
}

/* ─────────────────────────────── PROJECTS ─────────────────────────── */

function Projects() {
  return (
    <section id="projects" className="relative z-10 pt-24 pb-48 md:pt-32">
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
            <ProjectCard key={project.title} project={project} index={i} total={PROJECTS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale   = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.2, 0]);
  const y       = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const isEven  = index % 2 === 0;

  return (
    <>
      {/* Scroll-progress tracker — sits in flow at correct position */}
      <div ref={containerRef} className="absolute w-full h-[100vh] pointer-events-none" style={{ top: `${index * 100}vh` }} />

      <div className="h-[100vh] sticky top-0 flex items-center justify-center w-full origin-top">
        <motion.div
          style={{ scale, opacity, y }}
          className="w-full h-[85vh] md:h-[80vh] rounded-[32px] md:rounded-[48px] border-[2px] border-amber-500/20 bg-[#162A1E] p-6 md:p-10 overflow-hidden relative group/card flex flex-col will-change-transform"
        >
          <div className="absolute inset-0 pointer-events-none z-0" style={{ background: THEME_GLOWS[index] }} />

          <div className={`relative z-10 flex flex-col h-full gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
            {/* Text */}
            <div className="flex flex-col flex-1 justify-center gap-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-black leading-none text-[#F7F7F4]/20 tabular-nums" style={{ fontSize: "clamp(3rem, 8vw, 100px)" }}>
                  {project.num}
                </span>
                <span className="text-[#F7F7F4] text-[11px] uppercase tracking-[0.2em] font-bold border border-white/10 rounded-full px-4 py-1.5 bg-white/5">
                  {project.category}
                </span>
              </div>

              <div>
                <h3 className="text-3xl md:text-5xl font-black text-[#F7F7F4] leading-[1.1] tracking-tight mb-4 text-balance">
                  {project.title}
                </h3>
                <p className="text-[17px] text-[#A8B0A7] leading-[1.6] max-w-md font-medium">
                  {project.blurb}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {project.stack.map((tag) => (
                  <span key={tag} className="text-[12px] font-semibold px-3 py-1 rounded-[8px] bg-white/5 text-[#F7F7F4]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3.5 text-white text-[13px] font-bold uppercase tracking-widest hover:bg-white/20 transition-colors duration-300"
                >
                  View Project
                  <div className="overflow-hidden relative w-4 h-4">
                    <ExternalLink className="w-4 h-4 absolute top-0 left-0 transition-transform duration-300 group-hover/btn:translate-x-4 group-hover/btn:-translate-y-4" />
                    <ExternalLink className="w-4 h-4 absolute top-0 left-0 -translate-x-4 translate-y-4 transition-transform duration-300 group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
                  </div>
                </a>
              </div>
            </div>

            {/* Images */}
            <div className="flex-1 relative h-full min-h-[300px]">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 w-full h-full flex gap-4 p-4 group/img"
              >
                <div className={`flex flex-col gap-4 ${isEven ? "w-[40%]" : "w-[60%]"} h-full justify-center`}>
                  <div
                    className="relative overflow-hidden rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] bg-[#0B1F12]"
                    style={{ height: isEven ? "45%" : "100%" }}
                  >
                    <Image
                      src={project.images[isEven ? 0 : 2]}
                      alt={`${project.title} screenshot 1`}
                      fill loading="lazy"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
                    />
                  </div>
                  {isEven && (
                    <div className="relative overflow-hidden rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] bg-[#0B1F12] h-[55%]">
                      <Image
                        src={project.images[1]}
                        alt={`${project.title} screenshot 2`}
                        fill loading="lazy"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
                      />
                    </div>
                  )}
                </div>

                <div className={`flex flex-col gap-4 ${isEven ? "w-[60%]" : "w-[40%]"} h-full justify-center`}>
                  <div
                    className="relative overflow-hidden rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] bg-[#0B1F12]"
                    style={{ height: isEven ? "100%" : "45%" }}
                  >
                    <Image
                      src={project.images[isEven ? 2 : 0]}
                      alt={`${project.title} screenshot 3`}
                      fill loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
                    />
                  </div>
                  {!isEven && (
                    <div className="relative overflow-hidden rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] bg-[#0B1F12] h-[55%]">
                      <Image
                        src={project.images[1]}
                        alt={`${project.title} screenshot 4`}
                        fill loading="lazy"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
                      />
                    </div>
                  )}
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ─────────────────────────────── SKILLS ───────────────────────────── */

function Skills() {
  return (
    <section id="about" className="relative z-30 w-full pt-40 pb-24 md:pb-32 bg-[#0B1F12]">
      <div className="max-w-[90rem] mx-auto px-8 relative z-20">

        {/* Skills / Tools */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-32 md:mb-48">
          <div className="lg:w-[40%] flex flex-col items-start">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[clamp(2.75rem,5vw,4.5rem)] font-medium tracking-tight text-[#F7F7F4] leading-[1.05] text-balance"
            >
              Crafting <br className="hidden lg:block" />experiences.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 text-[17px] text-[#A8B0A7] font-medium max-w-sm leading-[1.5]"
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
                  <span className="text-[12px] font-bold tracking-[0.15em] text-white/60 uppercase pl-1">{group.group}</span>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {group.items.map((skill) => (
                      <motion.div
                        key={skill}
                        variants={staggerItem}
                        className="px-5 py-2.5 rounded-[12px] bg-[#162A1E] border border-white/10 text-[#F7F7F4] font-semibold text-[14px] cursor-default will-change-transform"
                        style={{ transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1), background 0.2s, border-color 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.02)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.background = ""; }}
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

        {/* Experience / Timeline */}
        <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-24">
          <div className="lg:w-[40%] flex flex-col items-start">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[clamp(2.75rem,5vw,4.5rem)] font-medium tracking-tight text-[#F7F7F4] leading-[1.05] text-balance"
            >
              Where I&apos;ve <br className="hidden lg:block" />been.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 text-[17px] text-[#A8B0A7] font-medium max-w-sm leading-[1.5]"
            >
              Communities, teams, and milestones that have shaped my perspective and approach to engineering.
            </motion.p>
          </div>

          <div className="lg:w-[60%] relative mt-8 lg:mt-0">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute left-[27px] top-4 w-[1px] bg-gradient-to-b from-amber-500/40 via-white/10 to-transparent"
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
                { title: "Member", org: "Coding Club" },
              ].map((exp, idx) => (
                <motion.div key={idx} variants={staggerItem} className="relative pl-16 group">
                  <div className="absolute left-[23px] top-6 w-[9px] h-[9px] rounded-full bg-[#0B1F12] border-[2px] border-[#888888] z-10"
                    style={{ transition: "background 0.3s, border-color 0.3s, transform 0.3s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background="#d97706"; el.style.borderColor="#d97706"; el.style.transform="scale(1.6)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background=""; el.style.borderColor=""; el.style.transform=""; }}
                  />
                  <div className="bg-[#162A1E] border border-white/10 px-6 py-5 rounded-[16px] group-hover:-translate-y-0.5 group-hover:bg-white/10 transition-transform duration-300">
                    <span className="text-[11px] font-bold tracking-[0.2em] text-amber-600 uppercase mb-1.5 block">{exp.title}</span>
                    <h3 className="text-[19px] md:text-[21px] font-bold text-[#F7F7F4] leading-tight tracking-tight">{exp.org}</h3>
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

/* ─────────────────────────────── CONTACT ───────────────────────────── */

function Contact() {
  const sectionRef   = useRef<HTMLElement>(null);
  const bgTextRef    = useRef<HTMLSpanElement>(null);
  const eyebrowRef   = useRef<HTMLParagraphElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const descRef      = useRef<HTMLParagraphElement>(null);
  const emailCardRef     = useRef<HTMLDivElement>(null);
  const emailCardRectRef = useRef<DOMRect | null>(null);
  const ghCardRef        = useRef<HTMLAnchorElement>(null);
  const liCardRef        = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("vijaykumaran2007@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Entrance timeline — every element has its own curve, nothing generic
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 72%" } });

    // Watermark drifts in slowly behind everything
    tl.fromTo(bgTextRef.current,
      { opacity: 0, y: 40 },
      { opacity: 0.04, y: 0, duration: 1.6, ease: "power4.out" }, 0);

    // Eyebrow slides up with a tiny blur-to-clear feel
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1,  y: 0, duration: 0.8, ease: "power3.out" }, 0.25);

    // Heading lines cascade with generous stagger
    const lines = headingRef.current?.querySelectorAll(".line-inner");
    if (lines) tl.fromTo(lines,
      { opacity: 0, y: 48, skewY: 1.5 },
      { opacity: 1,  y: 0, skewY: 0, duration: 0.9, stagger: 0.14, ease: "power4.out" }, 0.4);

    // Description eases in slightly later
    tl.fromTo(descRef.current,
      { opacity: 0, y: 22 },
      { opacity: 1,  y: 0, duration: 0.75, ease: "power3.out" }, 0.88);

    // Email card rises with a subtle scale
    tl.fromTo(emailCardRef.current,
      { opacity: 0, y: 32, scale: 0.975 },
      { opacity: 1,  y: 0, scale: 1, duration: 1.0, ease: "expo.out" }, 0.6);

    // Social cards staggered after
    tl.fromTo([ghCardRef.current, liCardRef.current],
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1,  y: 0, scale: 1, duration: 0.75, stagger: 0.1, ease: "power3.out" }, 0.95);

    // No scrub parallax here — scrub ScrollTriggers fire on every scroll tick
    // and were the primary cause of jank in this section.
  }, { scope: sectionRef });

  /* Restrained 3D tilt — max ±6deg, silky cubic-bezier */
  const onTiltEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    emailCardRectRef.current = e.currentTarget.getBoundingClientRect();
  };
  const onTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el   = e.currentTarget;
    const rect = emailCardRectRef.current;
    if (!rect) return;
    const x = ((e.clientX - rect.left)  / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)   / rect.height - 0.5) * -12;
    el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-5px)`;
  };
  const onTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    emailCardRectRef.current = null;
    e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#0B1F12] overflow-hidden">
      <style jsx global>{`
        @keyframes contact-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.7; }
          50%       { transform: scale(2.4); opacity: 0;   }
        }
        .contact-pulse { animation: contact-pulse 2.8s ease-out infinite; }
      `}</style>

      {/* Hairline top separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="relative">
        {/* Ambient light orbs — static, no CSS animation */}
        <div className="absolute top-[-15%] left-[-8%] w-[60%] h-[90%] rounded-full bg-amber-700/[0.05] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-6%] w-[50%] h-[75%] rounded-full bg-emerald-900/[0.06] blur-[120px] pointer-events-none" />

        {/* Film grain — almost imperceptible, just adds warmth */}
        <div
          className="absolute inset-0 opacity-[0.022] mix-blend-overlay pointer-events-none z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        {/* Large background watermark typography */}
        <span
          ref={bgTextRef}
          className="absolute select-none pointer-events-none z-0 font-black leading-none tracking-tighter whitespace-nowrap opacity-0"
          style={{
            fontSize: "clamp(6rem,22vw,24rem)",
            color: "rgba(247,247,244,0.04)",
            top: "48%", left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          LET&apos;S BUILD
        </span>

        {/* ── Content ── */}
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-8 md:px-12 pt-32 pb-40">

          {/* Eyebrow label with extending rule */}
          <div className="flex items-center gap-5 mb-24">
            <p ref={eyebrowRef} className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-600 font-bold opacity-0 whitespace-nowrap">
              Get in touch
            </p>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-600/20 via-white/[0.06] to-transparent" />
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-20 xl:gap-32 items-start">

            {/* ── Left column: editorial typography ── */}
            <div className="flex flex-col gap-10">
              <h2
                ref={headingRef}
                className="text-[clamp(2.5rem,5.2vw,4.75rem)] font-bold tracking-tight leading-[1.04] text-[#F7F7F4] text-balance"
              >
                {["Have a project,", "an opportunity,", "or just want to talk?"].map((line, i) => (
                  <div key={i} className="overflow-hidden py-[0.06em]">
                    <div className="line-inner" style={{ opacity: 0, display: "block" }}>{line}</div>
                  </div>
                ))}
              </h2>

              <p
                ref={descRef}
                className="text-[17px] leading-[1.85] text-[#A8B0A7] max-w-[40ch] font-medium opacity-0"
              >
                I&apos;m open to internships, hackathon teams, and interesting collaborations. Email is the fastest way to reach me — I reply within a day.
              </p>
            </div>

            {/* ── Right column: cards ── */}
            <div className="flex flex-col gap-3.5">

              {/* Email card — elevated primary card with 3D tilt */}
              <div
                ref={emailCardRef}
                onClick={handleCopy}
                onMouseEnter={onTiltEnter}
                onMouseMove={onTiltMove}
                onMouseLeave={onTiltLeave}
                className="relative group cursor-pointer rounded-[26px] opacity-0"
                style={{
                  willChange: "transform",
                  transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Gradient border on hover */}
                <div className="absolute -inset-[1px] rounded-[27px] bg-gradient-to-br from-amber-500/30 via-white/[0.05] to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative rounded-[26px] bg-[#0F1D14] border border-white/[0.09] group-hover:border-white/[0.16] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_12px_40px_-10px_rgba(0,0,0,0.5)] p-7 md:p-8 overflow-hidden transition-[border-color,box-shadow] duration-400">
                  {/* Top specular */}
                  <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

                  {/* Header row */}
                  <div className="flex items-start justify-between mb-7">
                    <div>
                      <span className="block text-[9.5px] font-bold uppercase tracking-[0.28em] text-amber-600 mb-1">Primary</span>
                      <span className="block text-[13px] font-medium text-white/40">Email address</span>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] group-hover:border-white/[0.18] group-hover:bg-white/[0.07] transition-all duration-300">
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Email */}
                  <p className="text-[1.1rem] sm:text-[1.25rem] md:text-[1.38rem] font-bold text-[#F7F7F4] tracking-tight leading-tight break-all mb-6">
                    vijaykumaran2007@gmail.com
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-white/25 font-medium tracking-wider">Click to copy</span>
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] group-hover:bg-white/[0.08] group-hover:border-white/[0.14] transition-all duration-300">
                      <Copy className="w-[12px] h-[12px] text-[#F7F7F4]/50 group-hover:text-[#F7F7F4]/80 transition-colors duration-300" />
                      <span className="text-[11px] font-semibold text-[#F7F7F4]/50 group-hover:text-[#F7F7F4]/80 transition-colors duration-300">Copy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social cards — side by side, same aesthetic language */}
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  {
                    ref: ghCardRef,
                    href: "https://github.com/vijaykumaran2007",
                    icon: <GithubIcon className="w-[16px] h-[16px] text-[#F7F7F4]/70 group-hover:text-[#F7F7F4] transition-colors duration-300" />,
                    label: "GitHub",
                    sub: "Explore projects",
                  },
                  {
                    ref: liCardRef,
                    href: "https://linkedin.com/in/vijay-adithiya",
                    icon: <LinkedinIcon className="w-[16px] h-[16px] text-[#F7F7F4]/70 group-hover:text-[#F7F7F4] transition-colors duration-300" />,
                    label: "LinkedIn",
                    sub: "Let\u2019s connect",
                  },
                ].map(({ ref, href, icon, label, sub }) => (
                  <a
                    key={label}
                    ref={ref as React.RefObject<HTMLAnchorElement>}
                    href={href}
                    target="_blank" rel="noopener noreferrer"
                    className="group relative flex flex-col gap-6 rounded-[22px] bg-[#0F1D14] border border-white/[0.08] hover:border-white/[0.16] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] p-5 hover:-translate-y-1 hover:shadow-[0_20px_48px_-14px_rgba(0,0,0,0.4)] transition-all duration-300 will-change-transform opacity-0 overflow-hidden"
                  >
                    {/* Top specular */}
                    <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    {/* Hover sheen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="w-8 h-8 bg-white/[0.04] border border-white/[0.08] group-hover:border-white/[0.16] group-hover:bg-white/[0.07] rounded-[9px] flex items-center justify-center transition-all duration-300">
                        {icon}
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>

                    <div className="relative z-10">
                      <span className="block font-bold text-[#F7F7F4] text-[13.5px] leading-tight mb-0.5">{label}</span>
                      <span className="block text-[11.5px] text-white/35 group-hover:text-white/55 font-medium transition-colors duration-300">{sub}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Footer rule ── */}
          <div className="mt-32 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-[12px] text-white/20 font-medium tracking-wide">
              © {new Date().getFullYear()} Vijay Adithiya — All rights reserved
            </span>
            <span className="text-[12px] text-white/15 font-medium tracking-wide">
              Coimbatore, India
            </span>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-[#0B1F12]/90 backdrop-blur-md text-white pl-3.5 pr-5 py-2.5 rounded-full text-[13px] font-semibold shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] border border-white/[0.08]"
          >
            <div className="flex items-center justify-center w-5 h-5 bg-emerald-500/15 rounded-full">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            Email copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────────────────────── SECTION HEADER ──────────────────── */

function SectionHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-600 mb-4">{eyebrow}</p>
      <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold tracking-[-0.02em] leading-[1.08] text-[#F7F7F4] text-balance">
        {title}
      </h2>
      <p className="mt-4 text-[16px] leading-[1.6] text-[#A8B0A7] max-w-[55ch]">{intro}</p>
    </div>
  );
}
