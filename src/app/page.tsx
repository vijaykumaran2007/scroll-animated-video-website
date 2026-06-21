'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  ExternalLink, 
  Layers, 
  Terminal, 
  Cpu, 
  ArrowDownRight,
  ChevronDown
} from 'lucide-react';
import CreatureTracker from './components/CreatureTracker';

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

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Framer motion scroll hook for parallax fade out on the Hero content
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const heroTranslateY = useTransform(scrollY, [0, 450], [0, -60]);
  const heroScale = useTransform(scrollY, [0, 450], [1, 0.96]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-zinc-950 selection:bg-emerald-500 selection:text-black">
      
      {/* ── STICKY HERO SECTION ── */}
      <section className="sticky top-0 h-[100dvh] w-full z-0 overflow-hidden bg-black flex flex-col justify-between">
        
        {/* Background Creature Tracker */}
        <CreatureTracker />

        {/* Floating Gradient Overlay to blend top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-[1]" />

        {/* Floating Navigation Bar (Aligned to Skills Guideline) */}
        <header className="fixed top-4 left-4 right-4 max-w-7xl mx-auto h-16 flex items-center justify-between z-50 bg-zinc-950/70 border border-zinc-900 rounded-full px-6 backdrop-blur-md">
          <Link href="/" className="font-space-grotesk font-semibold text-lg tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors">
            VIJAY ADITHIYA
          </Link>
          <nav className="flex items-center gap-6">
            <a href="#projects" className="text-xs font-mono tracking-widest text-zinc-400 hover:text-white transition-colors">
              WORK
            </a>
            <a href="https://github.com/vijaykumaran2007" target="_blank" rel="noopener noreferrer" className="text-xs font-mono tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/20 px-4 py-1.5 rounded-full bg-emerald-950/10 hover:bg-emerald-950/30 transition-all">
              GITHUB
            </a>
          </nav>
        </header>

        {/* Hero Central Content Overlay (Optimized Spacing & Text Placement) */}
        <motion.div 
          style={{ opacity: heroOpacity, translateY: heroTranslateY, scale: heroScale }}
          className="relative max-w-7xl mx-auto w-full px-6 flex-1 flex flex-col justify-center items-start z-10 pointer-events-none pt-24"
        >
          {/* Eyebrow / Location badge */}
          <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-3.5 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">COIMBATORE, TAMIL NADU</span>
          </div>

          {/* Name Display - Font: Space Grotesk */}
          <h1 className="font-space-grotesk font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.95] select-none max-w-4xl">
            BUILDING MOBILE &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500">INTELLIGENT SYSTEMS</span>
          </h1>

          {/* Subtext Tagline - Font: Manrope. Max 20 words constraint */}
          <p className="font-sans font-light text-base md:text-lg text-zinc-400 max-w-xl mt-6 leading-relaxed">
            Computer science student engineering high-performance mobile software using Flutter and deploying machine learning models.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mt-8 pointer-events-auto">
            <a 
              href="#projects" 
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono uppercase tracking-wider px-6 py-3 rounded-full hover:scale-105 active:scale-98 transition-all duration-250 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              Discover Projects
            </a>
            <a 
              href="mailto:vijaykumaran2007@gmail.com" 
              className="border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/80 text-white font-medium text-xs font-mono uppercase tracking-wider px-6 py-3 rounded-full hover:border-zinc-700 hover:scale-105 active:scale-98 transition-all duration-250 backdrop-blur-sm cursor-pointer"
            >
              Contact
            </a>
          </div>
        </motion.div>

        {/* Scroll Indicator Cue */}
        <div className="relative w-full max-w-7xl mx-auto px-6 pb-10 flex justify-between items-center z-10 text-zinc-600 font-mono text-[9px] tracking-widest pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="inline-block animate-bounce"><ChevronDown className="w-3.5 h-3.5 text-zinc-650" /></span>
            <span>SCROLL TO SLIDE CONTENT OVER HERO</span>
          </div>
          <div>
            <span>[ SYSTEM LOADED ]</span>
          </div>
        </div>

      </section>

      {/* ── PROJECTS SECTION (SLIDES DIRECTLY ON TOP OF HERO) ── */}
      <main id="projects" className="relative z-10 bg-zinc-950 shadow-[0_-32px_64px_rgba(0,0,0,0.8)] border-t border-zinc-900 rounded-t-3xl">
        
        {/* Top visual gradient beam */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent pointer-events-none" />

        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-emerald-400 mb-3 uppercase">SELECTED WORK</p>
              <h2 className="font-space-grotesk font-semibold text-3xl md:text-5xl text-white tracking-tight">EXPERIMENTS & APPLICATIONS</h2>
            </div>
            <p className="text-sm font-sans font-light text-zinc-400 max-w-md mt-4 md:mt-0 leading-relaxed">
              Demonstrating production-ready cross-platform software integration, data-driven disease analytics, and interactive timeline rendering.
            </p>
          </div>

          {/* Asymmetric Project Bento Layout (DESIGN_VARIANCE: 6, NO equal 3-column rows) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Project 1: Hospital Management System (8 Cols) */}
            <div className="lg:col-span-8 group relative bg-zinc-900/20 hover:bg-zinc-900/50 border border-zinc-900 hover:border-emerald-500/20 rounded-2xl p-8 md:p-12 flex flex-col justify-between transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500" />
              
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <span className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/10">
                      <Layers className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">CROSS-PLATFORM ARCHITECTURE</span>
                  </div>
                  <a 
                    href="https://heartomate.web.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors bg-zinc-950/80 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <h3 className="font-space-grotesk font-medium text-2xl md:text-3xl text-white mb-4">Hospital Management System</h3>
                <p className="font-sans font-light text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl mb-8">
                  Developed a robust cross-platform mobile and web application to coordinate hospital operations. Implemented patient records indexing, real-time medicine tracking, and automated bed allocation updates powered by Firebase Firestore and real-time streams.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Flutter', 'Firebase SDK', 'Provider', 'Cloud Firestore', 'Material Design'].map((tech) => (
                    <span key={tech} className="text-xs font-mono bg-zinc-950 text-zinc-300 border border-zinc-900 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="border-t border-zinc-900/60 pt-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>ROLE: SOLE DEVELOPER</span>
                  <span>LIVE: HEARTOMATE.WEB.APP</span>
                </div>
              </div>
            </div>

            {/* Project 2: Disease Outbreak System (4 Cols) */}
            <div className="lg:col-span-4 group relative bg-zinc-900/20 hover:bg-zinc-900/50 border border-zinc-900 hover:border-emerald-500/20 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[70px] pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-500" />
              
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <span className="p-3 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-500/10">
                      <Cpu className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">ANALYTICS</span>
                  </div>
                  <a 
                    href="https://diseasedetectiveai.web.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors bg-zinc-950/80 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <h3 className="font-space-grotesk font-medium text-xl md:text-2xl text-white mb-4">Disease Outbreak System</h3>
                <p className="font-sans font-light text-sm text-zinc-400 leading-relaxed mb-8">
                  Built a web dashboard linked with prediction APIs to present insights. Handled asynchronous HTTP integrations to map complex dataset variations.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Web App', 'REST API', 'Data Visualization'].map((tech) => (
                    <span key={tech} className="text-xs font-mono bg-zinc-950 text-zinc-300 border border-zinc-900 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="border-t border-zinc-900/60 pt-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>LIVE: DISEASEDETECTIVEAI.WEB.APP</span>
                </div>
              </div>
            </div>

            {/* Project 3: Aditya Paper Works (Full Width 12 Cols) */}
            <div className="lg:col-span-12 group relative bg-zinc-900/20 hover:bg-zinc-900/50 border border-zinc-900 hover:border-emerald-500/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 justify-between items-stretch transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500" />
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                      <span className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/10">
                        <Terminal className="w-5 h-5" />
                      </span>
                      <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">INTERACTIVE SYSTEMS</span>
                    </div>
                    <a 
                      href="https://adityapaperworks.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors bg-zinc-950/80 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <h3 className="font-space-grotesk font-medium text-2xl md:text-3xl text-white mb-4">Aditya Paper Works Website</h3>
                  <p className="font-sans font-light text-sm md:text-base text-zinc-400 leading-relaxed max-w-3xl mb-8">
                    Designed and shipped a professional website for a paper product manufacturing manufacturer. Standardized on advanced timeline sequencing and micro-interactions powered by GSAP Animations.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['HTML5', 'CSS3', 'GSAP Animations', 'Responsive Grids'].map((tech) => (
                    <span key={tech} className="text-xs font-mono bg-zinc-950 text-zinc-300 border border-zinc-900 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:w-1/3 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-zinc-900/60 pt-6 md:pt-0 md:pl-8">
                <div className="w-full text-left md:text-right">
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 block mb-1">CAPABILITIES</span>
                  <span className="text-white text-sm">GSAP Timelines & Rendering</span>
                </div>
                <div className="w-full text-left md:text-right mt-4 md:mt-0">
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 block mb-1">LAYOUT</span>
                  <span className="text-emerald-400 text-sm">Flexible CSS Columns</span>
                </div>
                <a 
                  href="https://adityapaperworks.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full mt-8 md:mt-0 flex items-center justify-between gap-3 text-xs font-mono bg-zinc-950 border border-zinc-900 hover:border-emerald-500/30 text-white p-4 rounded-xl cursor-pointer hover:bg-zinc-900 transition-all group/btn"
                >
                  <span>LAUNCH DEMO</span>
                  <ArrowDownRight className="w-4 h-4 text-emerald-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>

          {/* Bottom simple meta footer section */}
          <div className="mt-24 pt-8 border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-zinc-500 gap-4">
            <div className="flex items-center gap-3">
              <span>© {new Date().getFullYear()} VIJAY ADITHIYA</span>
              <span>•</span>
              <a href="mailto:vijaykumaran2007@gmail.com" className="hover:text-emerald-400 transition-colors">VIJAYKUMARAN2007@GMAIL.COM</a>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://linkedin.com/in/vijay-adithiya" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>LINKEDIN</span>
              </a>
              <a href="https://github.com/vijaykumaran2007" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GITHUB</a>
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
