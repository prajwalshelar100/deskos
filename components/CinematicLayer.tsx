import React, { useState, useEffect, useRef } from 'react';

interface CinematicLayerProps {
  onComplete: () => void;
}

const InfoBlock: React.FC<{ 
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right'; 
  opacity: number; 
  children: React.ReactNode;
  label?: string;
  scrollOffset: number;
}> = ({ position, opacity, children, label, scrollOffset }) => {
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
      className={`fixed ${posClasses[position]} z-[100] pointer-events-none transition-all duration-700 ease-out`}
      style={{ 
        opacity, 
        transform: `translateY(${translateY}px)`,
      }}
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
      <InfoBlock position="top-left" opacity={getMotionProps(2, 25).opacity} label="Profile" scrollOffset={scrollPos}>
        Prajwal Shelar<br/>Software Developer
      </InfoBlock>
      <InfoBlock position="top-right" opacity={getMotionProps(2, 25).opacity} label="Status" scrollOffset={scrollPos}>
        9.41 MCA<br/>FOSal v1.2
      </InfoBlock>
      <InfoBlock position="bottom-left" opacity={getMotionProps(2, 25).opacity} label="Status" scrollOffset={scrollPos}>
        9.41 MCA<br/>FOSal v1.2
      </InfoBlock>
      <InfoBlock position="bottom-right" opacity={getMotionProps(2, 25).opacity} label="Status" scrollOffset={scrollPos}>
        9.41 MCA<br/>FOSal v1.2
      </InfoBlock>
      
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500" 
        style={getMotionProps(0, 25)}
      >
        <div className="relative w-44 h-44 md:w-80 md:h-80 mb-8 overflow-hidden rounded-full border-4 border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.3)] z-20">
          <img 
            src={USER_PHOTO_URL} 
            alt="Prajwal Shelar" 
            className="w-full h-full object-cover  contrast-125 hover:grayscale-0 transition-all duration-700"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://www.prajwalshelar.online/profile.jpg"; }}
          />
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-color" />
        </div>
        
        <h1 className="text-white text-6xl md:text-[11rem] font-black tracking-tighter text-center leading-[0.85] drop-shadow-2xl">
          PRAJWAL<br/><span className="text-blue-500">SHELAR</span>
        </h1>

        {scrollPos < 5 && (
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-[100] pointer-events-auto">
    <div className="px-6 py-3 bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-400 font-mono text-[10px] tracking-[0.4em] animate-bounce">
      SCROLL TO INITIATE
    </div>
    <div className="text-blue-500 mt-2 animate-pulse">↓</div>
  </div>
)}
      </div>

      {/* ACT 2: ARCHIVES */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6" style={getMotionProps(28, 58)}>
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {[
            { title: "MCA Master's", desc: "Systems Programming & ML Architectures", icon: "🎓", sub: "DSCE Bengaluru" },
            { title: "Physics Hons", desc: "Analytical grounding in mathematical systems", icon: "⚛️", sub: "Amity University" }
          ].map((item, idx) => (
            <div key={idx} className="bg-black/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] border border-white/20 shadow-2xl">
               <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">{item.icon}</div>
               <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{item.title}</h2>
               <p className="text-blue-400 font-mono text-sm uppercase tracking-widest mb-4">{item.sub}</p>
               <p className="text-white/70 text-sm md:text-lg font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ACT 3: PATENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6" style={getMotionProps(62, 82)}>
        <div className="text-center space-y-6">
           <div className="inline-block px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)]">Intellectual Property</div>
           <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter">PATENT<br/>#118561</h2>
           <p className="text-white/80 text-lg md:text-3xl max-w-3xl mx-auto font-light italic">
             "Engineering <span className="text-blue-500 font-bold">spatio-temporal logic</span> for climate complexity analysis."
           </p>
        </div>
      </div>

      {/* ACT 4: WORKFORCE */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6" style={getMotionProps(80, 98)}>
        <div className="max-w-3xl w-full space-y-8">
           <h3 className="text-white text-4xl md:text-7xl font-black tracking-tighter uppercase text-center">Workforce Matrix</h3>
           <div className="space-y-4">
              {[
                { role: "Research Intern", co: "DSCE MCA-VTU", year: "2024" },
                { role: "Java Developer", co: "Motioncut", year: "2023" }
              ].map((job, i) => (
                <div key={i} className="flex justify-between items-center p-6 md:p-10 bg-black/60 border border-white/10 rounded-3xl backdrop-blur-md">
                   <div>
                      <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] block mb-2">{job.role}</span>
                      <span className="text-white text-xl md:text-3xl font-bold">{job.co}</span>
                   </div>
                   <span className="text-white/40 font-mono text-lg">{job.year}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* FINAL TRANSITION */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl z-[1000]" style={{ 
        opacity: scrollPos > 96 ? (scrollPos - 96) / 4 : 0,
        pointerEvents: scrollPos > 98 ? 'auto' : 'none'
      }}>
        <div className="text-center space-y-12">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-5xl shadow-[0_0_100px_rgba(37,99,235,0.6)] animate-bounce">
            🛸
          </div>
          <h3 className="text-white text-5xl md:text-8xl font-black tracking-tighter uppercase">DeskOS<br/><span className="text-blue-500">INITIALIZED</span></h3>
          <button 
            onClick={onComplete}
            className="px-16 py-6 bg-white text-black hover:bg-blue-600 hover:text-white rounded-full font-black text-sm uppercase tracking-[0.5em] transition-all transform hover:scale-110 active:scale-90"
          >
            Enter Workstation
          </button>
        </div>
      </div>

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