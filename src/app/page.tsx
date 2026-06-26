"use client";

import { useScroll, useTransform, motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Cpu,
  Code2,
  Layers,
  Mail,
  GraduationCap,
  Award,
  MapPin,
  ExternalLink,
  Copy,
} from "lucide-react";
import CreatureTracker from "./components/CreatureTracker";
import WorkGallery from "./components/WorkGallery";

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


const CERTIFICATIONS: ReadonlyArray<{
  name: string;
  issuer: string;
  image: string;
  category: string;
}> = [
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
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Hero content fades out as the projects panel slides over it.
  const heroOpacity = useTransform(scrollY, [0, 480], [1, 0]);
  const heroTranslateY = useTransform(scrollY, [0, 480], [0, -32]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0a0a0b] text-[#fafaf9] selection:bg-emerald-500 selection:text-emerald-950"
    >
      <div className="relative w-full">
        <Hero heroOpacity={heroOpacity} heroTranslateY={heroTranslateY} />
        <Skills />
      </div>
      <Projects />
      <Certifications />
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
}: {
  heroOpacity: ReturnType<typeof useTransform<number, number>>;
  heroTranslateY: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <section className="sticky top-0 h-[100dvh] w-full z-0 overflow-hidden bg-[#0a0a0b] flex flex-col justify-between">
      <CreatureTracker />

      {/* Subtle vertical scrim - keeps the creature visible without a heavy black wash. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/70 via-transparent to-[#0a0a0b]/85 pointer-events-none z-[1]"
      />

      {/* Floating navigation - no status dot, no monochromatic eyebrow chip. */}
      <header className="fixed top-5 left-5 right-5 max-w-5xl mx-auto h-14 hidden md:flex items-center justify-between z-50 bg-[#0a0a0b]/75 border border-[#1f1f23] rounded-full px-5 backdrop-blur-xl">
        <a
          href="#top"
          className="font-semibold text-base tracking-[-0.01em] text-[#fafaf9] hover:text-emerald-400 transition-colors"
        >
          Vijay Adithiya
        </a>
        <nav className="flex items-center gap-4 sm:gap-7 text-[13px] font-medium">
          <a
            href="#projects"
            className="text-[#a1a1aa] hover:text-[#fafaf9] transition-colors"
          >
            Projects
          </a>
          <a
            href="#about"
            className="text-[#a1a1aa] hover:text-[#fafaf9] transition-colors"
          >
            About
          </a>
          <a
            href="mailto:vijaykumaran2007@gmail.com"
            className="text-[#a1a1aa] hover:text-[#fafaf9] transition-colors"
          >
            Contact
          </a>
        </nav>
      </header>


      {/* Hero content - max-width discipline, no glowing CTA, no shimmer overlay. */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroTranslateY }}
        className="relative max-w-5xl md:ml-8 w-full px-6 flex-1 flex flex-col justify-end pb-8 md:pb-20 z-10"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400 mb-5">
            <MapPin className="inline-block w-3 h-3 -mt-0.5 mr-1.5 align-middle" />
            Coimbatore, India
          </p>
          <h1 className="text-[clamp(1.875rem,4vw,3.75rem)] font-semibold tracking-[-0.02em] leading-[1.05] text-[#fafaf9] text-balance">
            Building mobile apps,
            <span className="text-emerald-400"> machine learning </span>
            systems, and immersive web experiences.
          </h1>
          <p className="mt-4 md:mt-6 text-[15px] md:text-[17px] leading-[1.6] text-[#fafaf9] max-w-xl">
            I&apos;m Vijay, a CS undergrad at PSG iTech. I build with Flutter
            and Firebase, dive deep into machine learning, and craft websites that feel alive.
          </p>
          <div className="mt-6 md:mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-[#fafaf9] text-[#0a0a0b] font-semibold text-sm px-5 py-3 rounded-full hover:bg-emerald-400 hover:text-[#052e16] active:translate-y-[1px] transition-colors"
            >
              View selected work
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:vijaykumaran2007@gmail.com"
              className="inline-flex items-center gap-2 bg-transparent text-[#fafaf9] font-medium text-sm px-5 py-3 rounded-full border border-[#2a2a30] hover:border-[#fafaf9] active:translate-y-[1px] transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email me
            </a>
          </div>
        </div>
      </motion.div>

      {/* GitHub button — sits bottom-right, covers the AI watermark */}
      <a
        href="https://github.com/vijaykumaran2007"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-24 z-50 hidden md:flex items-center justify-center w-14 h-14 bg-[#0a0a0b]/80 border border-[#2a2a30] hover:border-emerald-400 text-[#a1a1aa] hover:text-emerald-400 rounded-full backdrop-blur-md transition-all duration-200"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </a>
    </section>
  );
}

const Magnet = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "w-full flex justify-center",
}: {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}) => {
  const ref         = useRef<HTMLDivElement>(null);
  const rafPending  = useRef(false);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0px)");
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle to one getBoundingClientRect per animation frame
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        if (!ref.current) return;
        const rect    = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance  = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const threshold = Math.max(rect.width, rect.height) / 2 + padding;
        if (distance < threshold) {
          setTransition(activeTransition);
          setTransform(`translate3d(${distanceX / strength}px, ${distanceY / strength}px, 0px)`);
        } else {
          setTransition(inactiveTransition);
          setTransform("translate3d(0px, 0px, 0px)");
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  const handleMouseLeave = () => {
    setTransition(inactiveTransition);
    setTransform("translate3d(0px, 0px, 0px)");
  };

  return (
    <div
      ref={ref}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition, willChange: "transform" }}
      className={className}
    >
      {children}
    </div>
  );
};

/* ---------- PROJECTS ------------------------------------------------------ */

function Projects() {
  return (
    <section
      id="projects"
      className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23] transform-gpu"
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
    "hover:border-green-500/30",
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
        className={`w-full max-w-5xl rounded-[30px] sm:rounded-[40px] md:rounded-[48px] border border-[#2e2e36] bg-[#1c1c21] p-4 sm:p-5 md:p-6 shadow-2xl overflow-hidden relative group/card transition-all duration-500 ${themeBorderHover[index]}`}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
          style={{ background: themeGlows[index] }}
        />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 md:mb-5">
            <span
              className="font-black leading-none select-none text-[#fafaf9]/10"
              style={{ fontSize: "clamp(2rem, 6vw, 80px)" }}
            >
              {project.num}
            </span>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#a1a1aa] text-xs uppercase tracking-widest font-semibold border border-[#2a2a30] rounded-full px-3 py-1 bg-white/5">
                  {project.category}
                </span>
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-white/80 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-lg font-medium">
                {project.blurb}
              </p>
            </div>

            <Magnet
              padding={40}
              strength={4}
              className="w-fit flex-shrink-0 hidden md:flex"
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#2a2a30] px-5 py-2.5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all duration-300 w-fit"
              >
                View
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Magnet>
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
      className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23] rounded-t-[2rem] shadow-[0_-30px_60px_rgba(0,0,0,0.75)]"
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
              className="mt-14 grid grid-cols-2 gap-px bg-[#1f1f23] rounded-2xl overflow-hidden border border-[#1f1f23]"
            >
              {SKILLS.map((group) => (
                <motion.div
                  key={group.group}
                  variants={staggerItem}
                  className="bg-[#0a0a0b] p-6 md:p-7 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-emerald-400">
                    <Code2 className="w-3.5 h-3.5" />
                    {group.group}
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-[14px] text-[#fafaf9] leading-snug"
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
                  className="flex items-start gap-4 bg-[#131316] p-6 rounded-2xl border border-[#1f1f23] transition-colors hover:border-[#2a2a30]"
                >
                  <div className="mt-1.5 text-emerald-400 text-[10px]">●</div>
                  <div className="text-[16px] font-medium text-[#fafaf9] leading-snug">
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

/* ---------- CERTIFICATIONS ------------------------------------------------ */

function CertCard({ cert, i }: { cert: typeof CERTIFICATIONS[number]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const [showImg, setShowImg] = useState(false);

  // Slight delay so the enter animation resets properly on re-hover
  const handleMouseEnter = () => {
    setShowImg(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setShowImg(true));
    });
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    setShowImg(false);
  };

  return (
    <motion.div
      key={cert.name}
      variants={staggerItem}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl border transition-all duration-500 bg-[#141417] overflow-hidden flex flex-col justify-between cursor-pointer ${
        hovered ? "border-emerald-500/60" : "border-[#2e2e36]"
      } ${
        i === 0
          ? "md:col-span-2 md:row-span-2"
          : i === 3
            ? "md:col-span-3 md:row-span-1"
            : "md:col-span-1 md:row-span-1"
      }`}
    >
      {/* Subtle ambient background image */}
      <div className="absolute inset-0 z-0 opacity-15 transition-opacity duration-700 blur-[2px]">
        <Image
          src={cert.image}
          alt={cert.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-[#141417]/90 to-[#141417]/40" />
      </div>

      {/* Certificate reveal overlay on hover */}
      <AnimatePresence>
        {hovered && showImg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-20 rounded-2xl overflow-hidden"
          >
            <Image
              src={cert.image}
              alt={`${cert.name} certificate`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Dark gradient at bottom so text remains readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {/* Badge overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-emerald-400 mb-2">
                <Award className="w-3.5 h-3.5" />
                {cert.issuer}
              </div>
              <p className="text-white font-semibold text-lg leading-snug">{cert.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal card content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-emerald-400">
            <Award className="w-3.5 h-3.5" />
            {cert.issuer}
          </div>
          <div className="text-[10px] font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-[#a1a1aa] px-2.5 py-1 rounded-full backdrop-blur-md">
            {cert.category}
          </div>
        </div>

        <div>
          <h3
            className={`font-semibold text-[#fafaf9] leading-snug transition-colors ${
              i === 0 ? "text-[28px] md:text-4xl" : "text-[20px] md:text-2xl"
            }`}
          >
            {cert.name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

function Certifications() {
  return (
    <section className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]">
      <div className="w-full px-4 md:px-12 py-24 md:py-28">
        <div className="max-w-5xl mx-auto mb-14">
          <SectionHeader
            eyebrow="Certifications"
            title="Licenses &amp; Certifications"
            intro="Formal training and verified credentials demonstrating proficiency in machine learning, mobile development, and core programming paradigms."
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]"
        >
          {CERTIFICATIONS.map((cert, i) => (
            <CertCard key={cert.name} cert={cert} i={i} />
          ))}
        </motion.div>
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
    <section className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400 mb-5">
              Contact
            </p>
            <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] font-semibold tracking-[-0.02em] leading-[1.05] text-[#fafaf9] text-balance">
              Have a project, an internship opportunity, or just want to talk Flutter?
            </h2>
            <p className="mt-5 text-[16px] leading-[1.6] text-[#a1a1aa] max-w-md">
              I&apos;m open to internships, hackathon teams, and interesting
              collaborations. Email is the fastest way to reach me.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <button
              onClick={handleCopy}
              className="group inline-flex items-center justify-between gap-4 bg-[#fafaf9] text-[#0a0a0b] rounded-full px-6 py-4 font-semibold text-[15px] hover:bg-emerald-400 hover:text-[#052e16] active:translate-y-[1px] transition-colors md:w-fit"
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
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full border border-[#2a2a30] text-[#a1a1aa] hover:text-[#fafaf9] hover:border-[#fafaf9] transition-colors font-medium text-[15px]"
              >
                <GithubIcon className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/vijay-adithiya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full border border-[#2a2a30] text-[#a1a1aa] hover:text-[#fafaf9] hover:border-[#fafaf9] transition-colors font-medium text-[15px]"
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
    <footer className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]" style={{ overflowX: "clip" }}>

      {/* Large display name — fills full width dynamically */}
      <div ref={wrapRef} className="w-full px-6 pt-16 pb-4 select-none pointer-events-none">
        <p
          ref={textRef}
          className="font-black text-[#fafaf9] leading-none whitespace-nowrap"
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
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400 mb-4">
        {eyebrow}
      </p>
      <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold tracking-[-0.02em] leading-[1.08] text-[#fafaf9] text-balance">
        {title}
      </h2>
      <p className="mt-4 text-[16px] leading-[1.6] text-[#a1a1aa] max-w-[55ch]">
        {intro}
      </p>
    </div>
  );
}
