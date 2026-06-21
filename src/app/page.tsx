'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  ExternalLink, 
  Award, 
  BookOpen, 
  Layers, 
  Terminal, 
  Cpu, 
  ArrowDownRight,
  Sparkles,
  MapPin,
  ChevronDown
} from 'lucide-react';

// Custom SVG LinkedinIcon to avoid package versioning issues
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import CreatureTracker from './components/CreatureTracker';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Framer motion scroll hook for parallax fade out on the Hero content
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -40]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-zinc-950 selection:bg-emerald-500 selection:text-black">
      
      {/* ── STICKY HERO SECTION ── */}
      <section className="sticky top-0 h-[100dvh] w-full z-0 overflow-hidden bg-black flex flex-col justify-between">
        
        {/* Background Creature Tracker */}
        <CreatureTracker />

        {/* Floating Gradient Overlay to blend top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-[1]" />

        {/* Global Navigation */}
        <header className="relative w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-20">
          <Link href="/" className="font-audiowide text-2xl tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors">
            VA<span className="text-white">.</span>
          </Link>
          <nav className="flex items-center gap-6 md:gap-8">
            <a href="#projects" className="text-xs font-mono tracking-wider text-zinc-400 hover:text-white transition-colors">
              01// PROJECTS
            </a>
            <a href="#skills" className="text-xs font-mono tracking-wider text-zinc-400 hover:text-white transition-colors">
              02// SKILLS
            </a>
            <a href="#about" className="text-xs font-mono tracking-wider text-zinc-400 hover:text-white transition-colors">
              03// PROFILE
            </a>
            <a href="https://github.com/vijaykumaran2007" target="_blank" rel="noopener noreferrer" className="text-xs font-mono tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-950/20 backdrop-blur-sm">
              GITHUB
            </a>
          </nav>
        </header>

        {/* Hero Central Content */}
        <motion.div 
          style={{ opacity: heroOpacity, translateY: heroTranslateY, scale: heroScale }}
          className="relative max-w-7xl mx-auto w-full px-6 flex-1 flex flex-col justify-center items-start z-10 pointer-events-none mt-[-40px]"
        >
          {/* Eyebrow badge */}
          <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-900/60 backdrop-blur-md px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">Coimbatore, Tamil Nadu</span>
          </div>

          {/* Name Display */}
          <h1 className="font-audiowide text-5xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.95] select-none max-w-4xl">
            VIJAY <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500">ADITHIYA E</span>
          </h1>

          {/* Title and Short Value Prop */}
          <p className="font-sans text-base md:text-lg text-zinc-400 max-w-xl mt-6 leading-relaxed">
            Computer Science Student. Designing high-performance cross-platform apps and training machine learning systems to bridge ideas and automation.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8 pointer-events-auto">
            <a 
              href="#projects" 
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-6 py-3 rounded-full hover:scale-105 active:scale-98 transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
              Selected Work
            </a>
            <a 
              href="#contact" 
              className="border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-white font-medium text-sm px-6 py-3 rounded-full hover:border-zinc-700 hover:scale-105 active:scale-98 transition-all duration-200 backdrop-blur-sm"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>

        {/* Instruction Footer Hint */}
        <div className="relative w-full max-w-7xl mx-auto px-6 pb-8 flex justify-between items-center z-10 text-zinc-500 font-mono text-[10px] tracking-widest pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="inline-block animate-bounce"><ChevronDown className="w-3.5 h-3.5 text-zinc-500" /></span>
            <span>SCROLL TO SLIDE PORTFOLIO OVER HERO</span>
          </div>
          <div className="hidden sm:block">
            <span>[ TRACKING: MOUSE COORDINATES & TILT ]</span>
          </div>
        </div>

      </section>

      {/* ── MAIN CONTENT (SLIDES ON TOP OF HERO) ── */}
      <main className="relative z-10 bg-zinc-950 shadow-[0_-32px_64px_rgba(0,0,0,0.8)] border-t border-zinc-900 rounded-t-3xl">
        
        {/* Subtle top light bar border effect */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent pointer-events-none" />

        {/* ── PROJECTS SECTION ── */}
        <section id="projects" className="max-w-7xl mx-auto px-6 py-24 md:py-32 border-b border-zinc-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="text-xs font-mono tracking-widest text-emerald-400 mb-3">01 // INNOVATIONS</p>
              <h2 className="font-audiowide text-3xl md:text-5xl text-white tracking-tight">SELECTED PROJECTS</h2>
            </div>
            <p className="text-sm font-sans text-zinc-400 max-w-md mt-4 md:mt-0 leading-relaxed">
              A curated showcase of cross-platform apps, web platforms, and data visualizations utilizing modern rendering and cloud databases.
            </p>
          </div>

          {/* Asymmetric Project Grid (DESIGN_VARIANCE: 6) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Card 1: Hospital Management System */}
            <div className="lg:col-span-8 group relative bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-emerald-500/20 rounded-2xl p-6 md:p-10 flex flex-col justify-between transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/10">
                      <Layers className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-mono tracking-wider text-emerald-400">FLUTTER & FIREBASE</span>
                  </div>
                  <a 
                    href="https://heartomate.web.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors bg-zinc-900/80 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <h3 className="font-audiowide text-2xl md:text-3xl text-white mb-4">Hospital Management System</h3>
                <p className="font-sans text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl mb-8">
                  Designed and engineered a cross-platform Flutter application tailored to orchestrate hospital operations. Enabled patient records indexing, real-time medicine stock tracking, and automated bed allocation updates using Cloud Firestore.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Flutter', 'Firebase', 'Provider', 'Cloud Firestore', 'Material Design'].map((tech) => (
                    <span key={tech} className="text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="border-t border-zinc-850 pt-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>ROLE: SOLE DEVELOPER</span>
                  <span>LIVE: HEARTOMATE.WEB.APP</span>
                </div>
              </div>
            </div>

            {/* Card 2: Disease Outbreak System */}
            <div className="lg:col-span-4 group relative bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-emerald-500/20 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-500" />
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-500/10">
                      <Cpu className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-mono tracking-wider text-cyan-400">WEB & DATA VIZ</span>
                  </div>
                  <a 
                    href="https://diseasedetectiveai.web.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors bg-zinc-900/80 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <h3 className="font-audiowide text-xl md:text-2xl text-white mb-4">Disease Outbreak System</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-8">
                  Engineered an analytical web-based dashboard designed to connect with outbreak prediction APIs, formatting and mapping real-time infectious tracking data into interactive graphical displays.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Web App', 'API Integration', 'Data Viz', 'Asynchronous Flow'].map((tech) => (
                    <span key={tech} className="text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="border-t border-zinc-850 pt-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>LIVE: DISEASEDETECTIVEAI.WEB.APP</span>
                </div>
              </div>
            </div>

            {/* Card 3: Aditya Paper Works */}
            <div className="lg:col-span-12 group relative bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-emerald-500/20 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 justify-between items-stretch transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/10">
                        <Terminal className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-mono tracking-wider text-emerald-400">GSAP INTERACTIVE WEB</span>
                    </div>
                    <a 
                      href="https://adityapaperworks.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors bg-zinc-900/80 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <h3 className="font-audiowide text-2xl md:text-3xl text-white mb-4">Aditya Paper Works Website</h3>
                  <p className="font-sans text-sm md:text-base text-zinc-400 leading-relaxed max-w-3xl mb-8">
                    Built a highly interactive business portfolio website for a paper product manufacturing manufacturer. Designed responsive structures layered with micro-interactions and smooth scroll-triggered page events using GSAP Animations.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['HTML5', 'CSS3', 'GSAP', 'Responsive Layout', 'Animation Timelines'].map((tech) => (
                    <span key={tech} className="text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:w-1/3 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-zinc-800/80 pt-6 md:pt-0 md:pl-8">
                <div className="w-full text-left md:text-right">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 block mb-1">PROJECT SCOPE</span>
                  <span className="text-white font-medium text-sm">Full Frontend Delivery</span>
                </div>
                <div className="w-full text-left md:text-right mt-4 md:mt-0">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 block mb-1">VISUAL ENGINEERING</span>
                  <span className="text-emerald-400 font-medium text-sm">Scroll-Driven Animation</span>
                </div>
                <a 
                  href="https://adityapaperworks.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full mt-6 md:mt-0 flex items-center justify-between gap-3 text-xs font-mono bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 text-white p-4 rounded-xl cursor-pointer hover:bg-zinc-850 transition-all group/btn"
                >
                  <span>LAUNCH APW SITE</span>
                  <ArrowDownRight className="w-4 h-4 text-emerald-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ── SKILLS & EDUCATION BENTO SECTION ── */}
        <section id="skills" className="max-w-7xl mx-auto px-6 py-24 md:py-32 border-b border-zinc-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="text-xs font-mono tracking-widest text-emerald-400 mb-3">02 // ARSENAL</p>
              <h2 className="font-audiowide text-3xl md:text-5xl text-white tracking-tight">EXPERTISE & CAPABILITY</h2>
            </div>
            <p className="text-sm font-sans text-zinc-400 max-w-md mt-4 md:mt-0 leading-relaxed">
              Combining core Computer Science academic courses with hands-on applications in Machine Learning, Flutter cross-platform architecture, and web systems.
            </p>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Box 1: Programming Languages */}
            <div className="md:col-span-8 bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block mb-4">CORE CODING</span>
                <h3 className="font-audiowide text-xl md:text-2xl text-white mb-3">Languages & Algorithms</h3>
                <p className="text-sm text-zinc-400 mb-8 max-w-xl">
                  Intermediate proficiency in Python for ML models, data manipulation, and scripting. Fluent in Dart for mobile and web systems structure.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-900/60">
                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-1">PYTHON</span>
                  <span className="text-sm font-semibold text-white">Intermediate</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-1">DART</span>
                  <span className="text-sm font-semibold text-white">Advanced</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-1">HTML/CSS</span>
                  <span className="text-sm font-semibold text-white">Semantic / Flex</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-1">JAVASCRIPT</span>
                  <span className="text-sm font-semibold text-white">ES6 / Async</span>
                </div>
              </div>
            </div>

            {/* Box 2: Academic Statistics */}
            <div className="md:col-span-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block mb-4">ACADEMICS</span>
                <h3 className="font-audiowide text-xl text-white mb-2">Anna University</h3>
                <span className="text-3xl font-audiowide text-emerald-400 block my-4">8.5 <span className="text-xs font-mono text-zinc-500">CGPA</span></span>
              </div>
              <div className="border-t border-zinc-900/60 pt-4">
                <span className="text-xs font-mono text-zinc-400 block mb-1">PSG Institute of Technology & Applied Research</span>
                <span className="text-xs text-zinc-500">B.E. Computer Science (2029 Expected)</span>
              </div>
            </div>

            {/* Box 3: Flutter App Dev */}
            <div className="md:col-span-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block mb-4">ENGINEERING</span>
                <h3 className="font-audiowide text-xl text-white mb-3">Flutter Development</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Building cross-platform apps for mobile and web. Solid integration of State Management, REST APIs, and responsive design patterns.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>MOBILE / WEB</span>
                <span>STATE: PROVIDER</span>
              </div>
            </div>

            {/* Box 4: Machine Learning */}
            <div className="md:col-span-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block mb-4">INTELLIGENCE</span>
                <h3 className="font-audiowide text-xl text-white mb-3">Machine Learning</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Focusing on model architecture, supervised algorithms, feature scaling, model fitting, validation, and dataset preparation.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>SUPERVISED STUDY</span>
                <span>PYTHON / NUMPY</span>
              </div>
            </div>

            {/* Box 5: Cloud & Backend */}
            <div className="md:col-span-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block mb-4">INFRASTRUCTURE</span>
                <h3 className="font-audiowide text-xl text-white mb-3">Backend Systems</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Integration of Google Firebase tools including Cloud Firestore document schema, Real-time Database listeners, and Firebase Auth.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>FIREBASE CLOUD</span>
                <span>REAL-TIME PIPES</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── PROFILE & ACHIEVEMENTS SECTION ── */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-24 md:py-32 border-b border-zinc-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            
            {/* Left Column: Academic Credentials and Achievements */}
            <div className="lg:col-span-5">
              <p className="text-xs font-mono tracking-widest text-emerald-400 mb-3">03 // HISTORY</p>
              <h2 className="font-audiowide text-3xl md:text-5xl text-white tracking-tight mb-8">ACADEMIC PROFILE</h2>
              
              <div className="relative border-l border-zinc-800 pl-6 space-y-10 py-2">
                {/* PSG iTech */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-zinc-950" />
                  <span className="text-[10px] font-mono text-emerald-400 tracking-wider">2025 — 2029 (EXPECTED)</span>
                  <h4 className="text-lg font-bold text-white mt-1">B.E. Computer Science & Engineering</h4>
                  <p className="text-xs font-mono text-zinc-500 mt-1">PSG Institute of Technology and Applied Research (Anna University)</p>
                  <div className="mt-2 inline-block bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-xs font-mono text-zinc-300">CGPA: 8.5/10</div>
                </div>

                {/* CBSE 12th */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-zinc-700 border-4 border-zinc-950" />
                  <span className="text-[10px] font-mono text-zinc-500 tracking-wider">COMPLETED 2025</span>
                  <h4 className="text-base font-bold text-white mt-1">12th Grade (HSC) — CBSE</h4>
                  <p className="text-xs font-mono text-zinc-500 mt-1">Lisieux CMI Public School</p>
                  <div className="mt-2 inline-block bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-xs font-mono text-zinc-300">Score: 95.2%</div>
                </div>

                {/* CBSE 10th */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-zinc-700 border-4 border-zinc-950" />
                  <span className="text-[10px] font-mono text-zinc-500 tracking-wider">COMPLETED 2023</span>
                  <h4 className="text-base font-bold text-white mt-1">10th Grade (SSLC) — CBSE</h4>
                  <p className="text-xs font-mono text-zinc-500 mt-1">Lisieux CMI Public School</p>
                  <div className="mt-2 inline-block bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-xs font-mono text-zinc-300">Score: 92.4%</div>
                </div>
              </div>
            </div>

            {/* Right Column: Certifications and Memberships */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              {/* Credentials list */}
              <div>
                <h3 className="font-audiowide text-2xl text-white mb-6">CERTIFICATIONS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Cert 1 */}
                  <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-emerald-400 block mb-1">DEEPLEARNING.AI</span>
                    <span className="font-semibold text-sm text-zinc-200 block mb-1">Supervised Machine Learning</span>
                    <span className="text-[11px] text-zinc-500 block leading-tight">Regression & Classification by Andrew Ng</span>
                  </div>

                  {/* Cert 2 */}
                  <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-emerald-400 block mb-1">QUALCOMM</span>
                    <span className="font-semibold text-sm text-zinc-200 block mb-1">Qualcomm AI Upskilling</span>
                    <span className="text-[11px] text-zinc-500 block leading-tight">Advanced industry upskill curricula</span>
                  </div>

                  {/* Cert 3 */}
                  <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-cyan-400 block mb-1">UDEMY</span>
                    <span className="font-semibold text-sm text-zinc-200 block mb-1">Flutter & Dart – Full Guide</span>
                    <span className="text-[11px] text-zinc-500 block leading-tight">Cross-platform engineering buildout</span>
                  </div>

                  {/* Cert 4 */}
                  <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-zinc-500 block mb-1">ONWINGSPAN</span>
                    <span className="font-semibold text-sm text-zinc-200 block mb-1">Python Programming (Foundations)</span>
                    <span className="text-[11px] text-zinc-500 block leading-tight">Algorithmic and logical models</span>
                  </div>

                </div>
              </div>

              {/* Achievements & Communities Bento Row */}
              <div className="mt-8 pt-8 border-t border-zinc-900">
                <h3 className="font-audiowide text-2xl text-white mb-4">HONORS & LEADERSHIP</h3>
                <ul className="space-y-3 font-sans text-sm text-zinc-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-1"><Award className="w-4 h-4 shrink-0" /></span>
                    <span><strong>Finalist</strong> - GDG Hackathonic 2.0 (Team: <code>main()</code> characters), PSG iTech</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-1"><Award className="w-4 h-4 shrink-0" /></span>
                    <span><strong>Finalist</strong> - Yuktha Hackathon, PSG iTech</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-zinc-500 mt-1"><BookOpen className="w-4 h-4 shrink-0" /></span>
                    <span><strong>Member</strong> - Google Developer Groups (GDG), PSG iTech Chapter</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-zinc-500 mt-1"><BookOpen className="w-4 h-4 shrink-0" /></span>
                    <span><strong>Member</strong> - Coding Club, PSG Institute of Technology</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* ── CONTACT & FOOTER SECTION ── */}
        <section id="contact" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="bg-gradient-to-br from-zinc-900/30 to-zinc-900/10 border border-zinc-900 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row gap-12 justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-xl">
              <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase block mb-3">CONNECTION PIPELINE</span>
              <h2 className="font-audiowide text-3xl md:text-5xl text-white tracking-tight mb-4">START A PROJECT</h2>
              <p className="font-sans text-sm md:text-base text-zinc-400 leading-relaxed mb-8">
                Aspiring for opportunities to deploy backend infrastructure, application architecture, or machine learning pipelines. Drop a line if you want to collaborate.
              </p>

              {/* Direct Channels */}
              <div className="flex flex-col gap-4 font-mono text-xs">
                <a href="mailto:vijaykumaran2007@gmail.com" className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 transition-colors group">
                  <span className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-emerald-500/20"><Mail className="w-4 h-4 text-zinc-400" /></span>
                  <span>vijaykumaran2007@gmail.com</span>
                </a>
                <a href="https://linkedin.com/in/vijay-adithiya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 transition-colors group">
                  <span className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-emerald-500/20"><LinkedinIcon className="w-4 h-4 text-zinc-400" /></span>
                  <span>linkedin.com/in/vijay-adithiya</span>
                </a>
              </div>
            </div>

            {/* CTA action wrapper box */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a 
                href="mailto:vijaykumaran2007@gmail.com" 
                className="w-full text-center bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-8 py-4 rounded-full transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Shoot Email</span>
              </a>
              <a 
                href="https://linkedin.com/in/vijay-adithiya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-white font-medium text-sm px-8 py-4 rounded-full transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <LinkedinIcon className="w-4 h-4 text-emerald-400" />
                <span>Message LinkedIn</span>
              </a>
            </div>

          </div>

          {/* Copyright footer */}
          <footer className="mt-20 border-t border-zinc-900/60 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-4">
            <div>
              <span>© {new Date().getFullYear()} VIJAY ADITHIYA E. DEPLOYED FROM COIMBATORE.</span>
            </div>
            <div className="flex gap-6">
              <a href="https://github.com/vijaykumaran2007" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">GITHUB</a>
              <a href="https://linkedin.com/in/vijay-adithiya" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">LINKEDIN</a>
            </div>
          </footer>
        </section>

      </main>

    </div>
  );
}
