import React, { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Github, Globe, MessageSquare, LeafyGreen } from 'lucide-react';

interface CinematicLayerProps {
  onComplete: () => void;
}

const InfoBlock: React.FC<{ 
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right'; 
  opacity: number; 
  children: React.ReactNode;
  label?: string;
  scrollOffset: number;
}> = ({ position, opacity, children, label, scrollOffset, interactive = false }) => {
  const posClasses = {
    'top-left': 'top-6 md:top-12 left-6 md:left-12 text-left',
    'top-right': 'top-6 md:top-12 right-6 md:right-12 text-right',
    'bottom-left': 'bottom-20 md:bottom-12 left-6 md:left-12 text-left',
    'bottom-right': 'bottom-20 md:bottom-12 right-6 md:right-12 text-right',
    'left': 'left-4 md:left-12 top-1/2 -translate-y-1/2 text-left hidden sm:block',
    'right': 'right-4 md:right-12 top-1/2 -translate-y-1/2 text-right hidden sm:block',
  };

  // Slide-in effect: items move up as they appear
  const translateY = (1 - opacity) * 30;

  return (
    <div 
  className={`fixed ${posClasses[position]} z-[120] ${
    interactive ? 'pointer-events-auto' : 'pointer-events-none'
  } transition-all duration-700 ease-out`}
  style={{ opacity, transform: `translateY(${translateY}px)` }}
>
      <div className="bg-black/90 backdrop-blur-2xl p-4 md:p-6 rounded-xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] min-w-[160px] md:min-w-[260px]">
        {label && (
          <div className="text-[10px] md:text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2 border-b border-white/10 pb-2">
            {label}
          </div>
        )}
        <div className="text-white font-mono text-[11px] md:text-[14px] leading-relaxed tracking-wider uppercase font-bold">
          {children}
        </div>
      </div>
    </div>
  );
};

const CinematicLayer: React.FC<CinematicLayerProps> = ({ onComplete }) => {
  const [scrollPos, setScrollPos] = useState(0); 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const particles = useRef<any[]>([]);
  const particleCount = 350;

  // Use a relative path or a direct URL. Ensure this file is in your /public folder.
  const USER_PHOTO_URL = 'profile.jpg'; 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 2000,
        baseX: Math.random() * 4000 - 2000,
        baseY: Math.random() * 4000 - 2000,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        color: i % 10 === 0 ? '#3b82f6' : '#ffffff',
      });
    }

    const animate = () => {
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.08;
      setScrollPos(currentScroll.current);

      const s = currentScroll.current / 100;
      ctx.fillStyle = '#020202'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.current.forEach((p) => {
        let tx = p.x;
        let ty = p.y;
        let tz = p.z - s * 1800;
        if (tz < 0) tz += 2000;
        
        if (s > 0.15) {
           const structureStrength = Math.min((s - 0.15) * 4, 1);
           const gridX = Math.round(p.baseX / 200) * 200;
           const gridY = Math.round(p.baseY / 200) * 200;
           tx = p.x + (gridX - p.x) * structureStrength;
           ty = p.y + (gridY - p.y) * structureStrength;
        }

        const fov = 800;
        const scale = fov / (fov + tz);
        const x2d = tx * scale + centerX;
        const y2d = ty * scale + centerY;

        if (x2d > 0 && x2d < canvas.width && y2d > 0 && y2d < canvas.height) {
          ctx.beginPath();
          ctx.arc(x2d, y2d, p.size * scale * 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * (1 - tz / 2000);
          ctx.fill();
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY * 0.08;
      targetScroll.current = Math.min(Math.max(targetScroll.current + delta, 0), 100);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const delta = (touchStartY - touchY) * 0.2;
      targetScroll.current = Math.min(Math.max(targetScroll.current + delta, 0), 100);
      touchStartY = touchY;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const getMotionProps = (start: number, end: number) => {
    const fadeRange = 8; // Distance over which it fades in/out
    let opacity = 0;
    
    // SPECIAL FIX: Force Act 1 (start 0) to be visible immediately on load
    if (start === 0 && scrollPos <= fadeRange) {
      // This ensures that at scroll 0, opacity is 1, and it fades out as you reach 'end'
      opacity = 1 - (scrollPos / end);
      if (opacity < 0) opacity = 0;
    } 
    // Standard logic for all other sections
    else if (scrollPos >= start && scrollPos <= end) {
      if (scrollPos < start + fadeRange) {
        // Slide/Fade In
        opacity = (scrollPos - start) / fadeRange;
      } else if (scrollPos > end - fadeRange) {
        // Slide/Fade Out
        opacity = (end - scrollPos) / fadeRange;
      } else {
        // Fully visible in the "sweet spot"
        opacity = 1;
      }
    }
  
    // Adding the Slide-up transform logic for better visibility
    const yOffset = (1 - opacity) * 40;
    
    return { 
      opacity, 
      transform: `translateY(${yOffset}px) scale(${0.95 + (opacity * 0.05)})` 
    };
  };

  return (
    <div className="fixed inset-0 bg-[#020202] z-[100000] overflow-hidden flex flex-col items-center justify-center select-none touch-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      
      {/* SCANLINE GRID */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:50px_50px]" />
    
      <div className="absolute inset-0 ... z-50" style={getMotionProps(0, 25)}></div>
      {/* ACT 1: IDENTITY */}
      
      <InfoBlock position="top-left" opacity={getMotionProps(0, 25).opacity} label="Subject" scrollOffset={scrollPos}>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-white/50 text-[10px] font-mono">Prajwal Shelar</span>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex justify-between items-center gap-4">
            
            <span className="text-blue-400 font-black">Software Developer</span>
          </div>
        </div>
      </InfoBlock>

      {/* ACADEMICS: Enhanced Visual Readout */}
      <InfoBlock position="top-right" opacity={getMotionProps(0, 25).opacity} label="Academics" scrollOffset={scrollPos}>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-white/50 text-[10px] font-mono">MCA</span>
            <span className="text-blue-400 font-black">9.41</span>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex justify-between items-center gap-4">
            <span className="text-white/50 text-[10px] font-mono">BSc</span>
            <span className="text-blue-400 font-black">9.40</span>
          </div>
        </div>
      </InfoBlock>

  {/* ACT 1: QUICK ACCESS – CLASSIC PORTFOLIO */}
{scrollPos <= 25 && (
  <InfoBlock
    position="bottom-left"
    opacity={getMotionProps(0, 25).opacity}
    label="Quick Access"
    interactive
    scrollOffset={scrollPos}
  >
    <a
      href="https://prajwalshelar-portfolio.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-white/70 hover:text-blue-400 transition-colors"
    >
      <span>Open Classic Portfolio</span>
      <span className="text-[10px] opacity-50">↗</span>
    </a>
    <div className="text-[9px] text-white/40 mt-1 font-mono">
      Fast recruiter-friendly overview
    </div>
  </InfoBlock>
)}


      
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500" 
        style={getMotionProps(0, 25)}
      >
        <div className="relative w-44 h-44 md:w-80 md:h-80 mb-8 overflow-hidden rounded-full border-4 border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.3)] z-20">
          <img 
            src={USER_PHOTO_URL} 
            alt="Prajwal Shelar" 
            className="w-full h-full object-cover  contrast-125 hover:grayscale-0 transition-all duration-700"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://prajwalshelar100.github.io/profile.jpg"; }}
          />
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-color" />
        </div>
        
        <h1 className="text-white text-6xl md:text-[11rem] font-black tracking-tighter text-center leading-[0.85] drop-shadow-2xl">
          PRAJWAL<br/><span className="text-blue-500">SHELAR</span>
        </h1>


        {scrollPos < 5 && (
  <div
  className="
    absolute
    bottom-8
    right-6
    md:left-1/2
    md:right-auto
    md:-translate-x-1/2
    flex
    flex-col
    items-center
    z-[200]
    pointer-events-auto
  "
>

  
  <div
  className="
    px-3
    py-2
    md:px-2
    md:py-3
    bg-blue-500/15
    border
    border-blue-400/40
    rounded-full
    text-blue-300
    font-mono
    text-[11px]
    md:text-[15px]
    tracking-[0.25em]
    shadow-md
    backdrop-blur-sm
    animate-bounce
  "
>
  <span className="hidden md:inline">SCROLL DOWN</span>
  <span className="hidden md:hidden">↓</span>
</div>


  <div
    className="
      mt-3
      text-blue-400
      text-2xl
      animate-pulse
      drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]
    "
  >
    ↓
  </div>

</div>

)}

      </div>

      {/* ACT 2: TECHNICAL ARSENAL */}
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 md:px-6 z-50 overflow-y-auto" style={getMotionProps(28, 58)}>
  <div className="max-w-5xl w-full flex flex-col items-center py-10 md:py-0">
    <h3 className="text-blue-400 font-#020202 text-[12px] md:text-2xl tracking-[0.4em] mb-6 md:mb-8 uppercase text-center">
      Technical Arsenal
    </h3>
    
    {/* Main Cards: Stacks on mobile, Grid on desktop */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
      {[
        { title: "Languages", desc: "Java (Core/Adv), Python, C, SQL", icon: "⌨️" },
        { title: "Frameworks", desc: "Spring Boot, Microservices, JPA", icon: "⚙️" },
        { title: "Environments", desc: "AWS, Azure, Linux, Docker/CI/CD", icon: "☁️" }
      ].map((item, idx) => (
        <div key={idx} className="bg-white/5 backdrop-blur-xl p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl">
           <div className="text-2xl md:text-4xl mb-3 md:mb-4">{item.icon}</div>
           <h2 className="text-lg md:text-xl font-black text-white mb-1 md:mb-2 uppercase tracking-tighter">{item.title}</h2>
           <p className="text-white/60 text-[12px] md:text-sm font-mono leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>

    {/* ACT 2: DOMAIN SPECIALIZATION (Clean & Non-Repetitive) */}
<div className="mt-8 md:mt-12 w-full grid grid-cols-2 md:grid-cols-3 gap-y-6 md:gap-y-10 gap-x-4 md:gap-x-12 border-t border-white/10 pt-8 md:pt-10">
  {[
  { label: "Engineering", detail: "Application & System Design" },
  { label: "Data & AI", detail: "Predictive Modeling" },
  { label: "Research", detail: "Spatio-Temporal Analysis" },
  { label: "Backend", detail: "Java & API Development" },
  { label: "Systems", detail: "Linux & OS Fundamentals" },
  { label: "Problem Solving", detail: "Algorithms & Data Structures" }
]
.map((spec, i) => (
    <div key={i} className="flex flex-col group items-center md:items-start">
      <div className="text-blue-500 font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
        {spec.label}
      </div>
      <div className="text-white font-bold text-[11px] md:text-base tracking-tight uppercase leading-tight text-center md:text-left">
        {spec.detail}
      </div>
    </div>
  ))}
</div>
  </div>
</div>

      {/* ACT 3: INNOVATION & IP */}
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 z-50" style={getMotionProps(62, 82)}>
  <div className="text-center space-y-6">
     <div className="inline-block px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)]">
       Published Patent #118561
     </div>
     <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase">Spatio-Temporal<br/>Logic</h2>
     <p className="text-white/80 text-lg md:text-2xl max-w-3xl mx-auto font-light italic">
       "Automated System for Large-Scale Rainfall Analysis and Predictive Modeling."
     </p>
     <div className="pt-8 flex flex-col items-center">
        <span className="text-blue-400 font-mono text-[10px] tracking-widest uppercase mb-4">Key Project</span>
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-md">
          <p className="text-white font-bold text-sm">IMD Rainfall Analyzer (Python + LangChain + HuggingFace)</p>
        </div>
     </div>
  </div>
</div>

      {/* ACT 4: WORKFORCE MATRIX */}
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 z-50" style={getMotionProps(84, 98)}>
  <div className="max-w-4xl w-full space-y-8">
     <h3 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase text-center mb-12">Professional Experience</h3>
     <div className="space-y-6">
        {[
          { 
            role: "Research Project Intern", 
            co: "DSCE MCA-VTU", 
            details: "Spatio-temporal analysis on IMD rainfall data using xarray & geopandas.",
            date: "Apr - July 2024" 
          },
          { 
            role: "Java Developer Intern", 
            co: "Motioncut", 
            details: "Full Stack development utilizing Spring, JDBC, and EJB architectures.",
            date: "Nov - Dec 2023" 
          }
        ].map((job, i) => (
          <div key={i} className="group p-8 bg-gradient-to-r from-white/5 to-transparent border-l-2 border-blue-500 rounded-r-3xl backdrop-blur-md">
             <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]">{job.role}</h4>
                  <h5 className="text-white text-2xl font-bold">{job.co}</h5>
                </div>
                <span className="text-white/30 font-mono text-sm">{job.date}</span>
             </div>
             <p className="text-white/60 text-sm mt-2 font-light">{job.details}</p>
          </div>
        ))}
     </div>
  </div>
</div>

      {/* FINAL TRANSITION - Contact Tags Layout */}
      {scrollPos > 96 && (
<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl z-[1000]" >
  
  {/* System Identity Tags */}
  <InfoBlock position="top-left" opacity={1} label="System Metadata" scrollOffset={scrollPos}>
    User: Prajwal Shelar<br/>
    Host: DeskOS_v2.0.4<br/>
    <span className="text-green-500">System Nominal</span>
  </InfoBlock>

  <InfoBlock position="top-right" opacity={1} label="Security" scrollOffset={scrollPos}>
    Auth: Verified<br/>
    <span className="text-green-500">Access Granted</span><br/>
    ID: PS-9987-X
  </InfoBlock>

  {/* BOTTOM LEFT: Data Export (Size Matched to Uplinks) */}
  <InfoBlock position="bottom-left" opacity={1} label="Data Export" scrollOffset={scrollPos}>
    <div className="pointer-events-auto flex flex-col gap-1">
      {/* File Label */}
      <div className="text-[10px] opacity-40 lowercase mb-1 tracking-tighter">
        PS_Resume_2024.pdf
      </div>

      {/* The Download Link - Styled like your Uplinks */}
      <a 
        href="/PrajwalShelar_Resume.pdf" 
        download="PrajwalShelar_Resume.pdf"
        className="flex items-center gap-2 hover:text-blue-400 transition-colors group"
      >
        <span>Download CV</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="opacity-50 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </a>

      {/* Security Status */}
      <div className="text-[9px] text-green-500/60 mt-1 flex items-center gap-1.5 uppercase tracking-widest">
        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
        Verified
      </div>
    </div>
  </InfoBlock>

  <InfoBlock position="bottom-right" opacity={1} label="Uplinks" scrollOffset={scrollPos}>
    <div className="pointer-events-auto flex flex-col gap-1">
      <a href="mailto:shelar.prajwal.99@gmail.com" target="_blank" className="hover:text-blue-400 transition-colors">Gmail</a>
      <a href="https://github.com/prajwalshelar100" target="_blank" className="hover:text-blue-400 transition-colors">GitHub</a>
      <a href="https://linkedin.com/in/prajwalshelar" target="_blank" className="hover:text-blue-400 transition-colors">LinkedIn</a>
    </div>
  </InfoBlock>

  {/* Central Boot Button */}
  <div className="text-center space-y-12">
    <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-5xl shadow-[0_0_100px_rgba(37,99,235,0.6)] animate-pulse">
      🛸
    </div>
    <h3 className="text-white text-5xl md:text-8xl font-black tracking-tighter uppercase">DeskOS</h3>
    <button 
      onClick={onComplete}
      className="px-16 py-6 bg-white text-black hover:bg-blue-600 hover:text-white rounded-full font-black text-sm uppercase tracking-[0.5em] transition-all transform hover:scale-110 shadow-2xl"
    >
      Initialize Workstation
    </button>
  </div>
</div>
)}
          {/* Persistent Classic Portfolio HUD */}
          {scrollPos > 25 && scrollPos < 96 && (
        <a
          href="https://prajwalshelar-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            fixed
            bottom-6
            left-6
            z-[300]
            pointer-events-auto
            px-3
            py-1.5
            rounded-full
            bg-white/5
            border
            border-white/10
            text-white/40
            text-[9px]
            font-mono
            uppercase
            tracking-[0.25em]
            backdrop-blur-md
            hover:text-blue-400
            hover:border-blue-400/40
            transition-all
          "
        >
          Classic
        </a>
      )}

    
      {/* HUD PROGRESS INDICATOR */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 z-[200]">
        {[5, 40, 70, 90, 100].map((stop, i) => (
          <div 
            key={i} 
            className={`w-[3px] transition-all duration-500 rounded-full ${scrollPos >= (stop - 5) ? 'h-12 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]' : 'h-3 bg-white/20'}`} 
          />
        ))}
      </div>
    </div>
  
  );
};

export default CinematicLayer;