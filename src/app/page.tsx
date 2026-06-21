"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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
} from "lucide-react";
import CreatureTracker from "./components/CreatureTracker";

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
      "Marketing site for a paper-products manufacturer, with custom scroll-driven timelines and responsive layout from scratch.",
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
      "SaaS platform for Engineering Graphics education allowing digital drawings and instant AI-powered feedback on structural similarity and correctness, simplifying college assessments with automated grading.",
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
      "AI EHR integrating ML diagnostics, outbreak mapping, and clinical decision support. Fuses 3 medical analysis layers for non-invasive insights. 2nd Runner-up at international hackathon.",
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

const EDUCATION: ReadonlyArray<{
  school: string;
  qualification: string;
  detail: string;
  year: string;
}> = [
  {
    school: "PSG iTech, Anna University",
    qualification: "B.E. Computer Science & Engineering",
    detail: "CGPA 8.5 / 10",
    year: "2025 - 2029",
  },
  {
    school: "Lisieux CMI Public School, CBSE",
    qualification: "Class XII (HSC)",
    detail: "95.2%",
    year: "2025",
  },
  {
    school: "Lisieux CMI Public School, CBSE",
    qualification: "Class X (SSLC)",
    detail: "92.4%",
    year: "2023",
  },
];

const HONORS: ReadonlyArray<string> = [
  "Finalist, GDG Hackathonic 2.0",
  "Finalist, Yuktha Hackathon",
];

const CERTIFICATIONS: ReadonlyArray<{
  name: string;
  issuer: string;
  year: string;
  image: string;
}> = [
  {
    name: "Supervised Machine Learning: Regression & Classification",
    issuer: "DeepLearning.AI",
    year: "2024",
    image: "/images/mlpart1.png",
  },
  {
    name: "Qualcomm AI Upskilling Program",
    issuer: "Qualcomm",
    year: "2024",
    image: "/images/qualcomm.png",
  },
  {
    name: "Python Programming Foundation",
    issuer: "Onwingspan",
    year: "2023",
    image: "/images/pythoncertificate.png",
  },
  {
    name: "Flutter & Dart: The Complete Development Guide",
    issuer: "Udemy",
    year: "2023",
    image: "/images/flutter.png",
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
      <Hero heroOpacity={heroOpacity} heroTranslateY={heroTranslateY} />
      <Projects />
      <Skills />
      <Education />
      <Certifications />
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
      <header className="fixed top-5 left-5 right-5 max-w-5xl mx-auto h-14 flex items-center justify-between z-50 bg-[#0a0a0b]/75 border border-[#1f1f23] rounded-full px-5 backdrop-blur-xl">
        <a
          href="#top"
          className="font-semibold text-base tracking-[-0.01em] text-[#fafaf9] hover:text-emerald-400 transition-colors"
        >
          Vijay Adithiya
        </a>
        <nav className="flex items-center gap-7 text-[13px] font-medium">
          <a
            href="#projects"
            className="text-[#a1a1aa] hover:text-[#fafaf9] transition-colors"
          >
            Projects
          </a>
          <a
            href="#about"
            className="text-[#a1a1aa] hover:text-[#fafaf9] transition-colors hidden sm:inline"
          >
            About
          </a>
          <a
            href="mailto:vijaykumaran2007@gmail.com"
            className="text-[#fafaf9] hover:text-emerald-400 transition-colors"
          >
            Contact
          </a>
        </nav>
      </header>

      {/* Hero content - max-width discipline, no glowing CTA, no shimmer overlay. */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroTranslateY }}
        className="relative max-w-5xl mx-auto w-full px-6 flex-1 flex flex-col justify-end pb-16 md:pb-20 z-10"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400 mb-5">
            <MapPin className="inline-block w-3 h-3 -mt-0.5 mr-1.5 align-middle" />
            Coimbatore, India
          </p>
          <h1 className="text-[clamp(2.5rem,5.4vw,5rem)] font-semibold tracking-[-0.02em] leading-[1.02] text-[#fafaf9] text-balance">
            Building mobile apps and
            <span className="text-emerald-400"> machine learning </span>
            systems, deliberately.
          </h1>
          <p className="mt-6 text-[17px] leading-[1.55] text-[#a1a1aa] max-w-xl">
            I&apos;m Vijay, a CS undergrad at PSG iTech. I build with Flutter
            and Firebase by day, and train ML models by night.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
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
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0px)");
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const threshold = Math.max(rect.width, rect.height) / 2 + padding;
      if (distance < threshold) {
        setTransition(activeTransition);
        const moveX = distanceX / strength;
        const moveY = distanceY / strength;
        setTransform(`translate3d(${moveX}px, ${moveY}px, 0px)`);
      } else {
        setTransition(inactiveTransition);
        setTransform("translate3d(0px, 0px, 0px)");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  const handleMouseLeave = () => {
    setTransition(inactiveTransition);
    setTransform("translate3d(0px, 0px, 0px)");
  };

  return (
    <div
      ref={ref}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
        willChange: "transform",
      }}
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
      className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23] rounded-t-[2rem] shadow-[0_-30px_60px_rgba(0,0,0,0.75)]"
    >
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <SectionHeader
          eyebrow="Projects"
          title="Selected work"
          intro="Five projects across mobile, web, and ML. Each one started as a problem worth solving."
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
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
        className={`w-full max-w-5xl rounded-[30px] sm:rounded-[40px] md:rounded-[48px] border border-[#1f1f23] bg-[#0C0C0C] p-4 sm:p-5 md:p-6 shadow-2xl overflow-hidden relative group/card transition-all duration-500 ${themeBorderHover[index]}`}
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
            
            <Magnet padding={40} strength={4} className="w-fit flex-shrink-0 hidden md:flex">
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
            <div className="flex flex-col gap-3 md:gap-4" style={{ width: "40%" }}>
              <div className="overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[32px] bg-zinc-950/80" style={{ height: "clamp(90px, 12vw, 170px)" }}>
                <img
                  src={project.images[0]}
                  alt={`${project.title} 1`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(1.08) translate3d(${mousePos.x * -10}px, ${mousePos.y * -10}px, 0px)`,
                    transition: "transform 0.15s ease-out",
                  }}
                />
              </div>
              <div className="overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[32px] bg-zinc-950/80" style={{ height: "clamp(120px, 18vw, 250px)" }}>
                <img
                  src={project.images[1]}
                  alt={`${project.title} 2`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(1.08) translate3d(${mousePos.x * -14}px, ${mousePos.y * -14}px, 0px)`,
                    transition: "transform 0.15s ease-out",
                  }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[32px] bg-zinc-950/80">
              <img
                src={project.images[2]}
                alt={`${project.title} 3`}
                loading="lazy"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(1.08) translate3d(${mousePos.x * -12}px, ${mousePos.y * -12}px, 0px)`,
                  transition: "transform 0.15s ease-out",
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

function Skills() {
  return (
    <section
      id="about"
      className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]"
    >
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
          {/* ABOUT / SKILLS */}
          <div>
            <SectionHeader
              eyebrow="About"
              title="What I work with"
              intro="Tools I reach for daily. Comfortable across the full stack of an app - design, code, deploy."
            />
            <div className="mt-14 grid grid-cols-2 gap-px bg-[#1f1f23] rounded-2xl overflow-hidden border border-[#1f1f23]">
              {SKILLS.map((group) => (
                <div
                  key={group.group}
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
                </div>
              ))}
            </div>
          </div>

          {/* EXPERIENCE */}
          <div>
            <SectionHeader
              eyebrow="Experience"
              title="Where I've been"
              intro="Communities, teams, and active involvements."
            />
            <div className="mt-14 flex flex-col gap-4">
              {[
                "Member of PSG iTech Software Development Cell",
                "GDG PSG iTech active member",
                "Coding Club member",
                "Hackathon finalist"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-[#131316] p-6 rounded-2xl border border-[#1f1f23] transition-colors hover:border-[#2a2a30]">
                  <div className="mt-1.5 text-emerald-400 text-[10px]">●</div>
                  <div className="text-[16px] font-medium text-[#fafaf9] leading-snug">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- EDUCATION ----------------------------------------------------- */

function Education() {
  return (
    <section className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-28">
        <SectionHeader
          eyebrow="Education"
          title="Where I studied"
          intro="Foundation first. Curriculum I work through because it builds the right habits."
        />

        <ol className="mt-14 flex flex-col">
          {EDUCATION.map((row, idx) => (
            <li
              key={row.qualification + row.year}
              className={`flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-10 py-7 ${
                idx === 0 ? "border-t border-[#1f1f23]" : ""
              } border-b border-[#1f1f23]`}
            >
              <div className="flex items-start gap-4 md:gap-6 flex-1">
                <span className="font-mono text-[11px] text-[#71717a] tabular-nums pt-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[17px] font-medium text-[#fafaf9] tracking-[-0.01em]">
                    {row.qualification}
                  </div>
                  <div className="mt-1 text-[14px] text-[#a1a1aa]">
                    {row.school}
                  </div>
                </div>
              </div>
              <div className="md:text-right flex md:block items-baseline gap-6 md:gap-0">
                <div className="text-[14px] text-[#fafaf9] font-mono tabular-nums">
                  {row.detail}
                </div>
                <div className="text-[12px] text-[#71717a] font-mono">
                  {row.year}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
            <Award className="w-3.5 h-3.5" />
            Honors & Certification
          </div>
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
            {HONORS.map((h) => (
              <li
                key={h}
                className="text-[14px] text-[#a1a1aa] flex items-start gap-3"
              >
                <span className="text-emerald-400 mt-2">·</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- CERTIFICATIONS ------------------------------------------------ */

function Certifications() {
  return (
    <section className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]">
      <div className="w-full px-4 md:px-12 py-24 md:py-28">
        <div className="max-w-5xl mx-auto mb-14">
          <SectionHeader
            eyebrow="Certifications"
            title="Licenses & Certifications"
            intro="Professional credentials and specialized training courses."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={cert.name}
              className={`group relative rounded-2xl border border-[#1f1f23] hover:border-emerald-500/30 p-6 md:p-8 transition-colors bg-[#131316] overflow-hidden flex flex-col justify-between ${
                i === 0
                  ? "md:col-span-2 md:row-span-2"
                  : i === 3
                  ? "md:col-span-3 md:row-span-2"
                  : "md:col-span-1 md:row-span-1"
              }`}
            >
              <div className="absolute inset-0 z-0 opacity-50 group-hover:opacity-100 transition-all duration-700">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/80 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-emerald-400 mb-5">
                  <Award className="w-3.5 h-3.5" />
                  {cert.issuer}
                </div>
                <div>
                  <h3 className={`font-semibold text-[#fafaf9] leading-snug group-hover:text-emerald-400 transition-colors ${i === 0 || i === 3 ? "text-[24px] md:text-3xl" : "text-[17px] md:text-xl"}`}>
                    {cert.name}
                  </h3>
                  <div className="mt-3 text-[12px] font-mono text-[#a1a1aa]">
                    Issued {cert.year}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT ------------------------------------------------------- */

function Contact() {
  return (
    <section className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400 mb-5">
              <Cpu className="inline-block w-3 h-3 -mt-0.5 mr-1.5 align-middle" />
              Contact
            </p>
            <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] font-semibold tracking-[-0.02em] leading-[1.05] text-[#fafaf9] text-balance">
              Have a project, internship, or just want to talk Flutter?
            </h2>
            <p className="mt-5 text-[16px] leading-[1.6] text-[#a1a1aa] max-w-md">
              I&apos;m open to internships, hackathon teams, and interesting
              collaborators. Email is the fastest way to reach me.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <a
              href="mailto:vijaykumaran2007@gmail.com"
              className="group inline-flex items-center justify-between gap-4 bg-[#fafaf9] text-[#0a0a0b] rounded-full px-6 py-4 font-semibold text-[15px] hover:bg-emerald-400 hover:text-[#052e16] active:translate-y-[1px] transition-colors md:w-fit"
            >
              vijaykumaran2007@gmail.com
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://github.com/vijaykumaran2007"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#2a2a30] text-[#a1a1aa] hover:text-[#fafaf9] hover:border-[#fafaf9] transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/vijay-adithiya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#2a2a30] text-[#a1a1aa] hover:text-[#fafaf9] hover:border-[#fafaf9] transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:vijaykumaran2007@gmail.com"
                aria-label="Email"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#2a2a30] text-[#a1a1aa] hover:text-[#fafaf9] hover:border-[#fafaf9] transition-colors"
              >
                <Mail className="w-4 h-4" />
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
  return (
    <footer className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] font-mono text-[#71717a]">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>
            &copy; {new Date().getFullYear()} Vijay Adithiya E. Coimbatore.
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://linkedin.com/in/vijay-adithiya"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#fafaf9] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/vijaykumaran2007"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#fafaf9] transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:vijaykumaran2007@gmail.com"
            className="hover:text-[#fafaf9] transition-colors"
          >
            Email
          </a>
        </div>
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
