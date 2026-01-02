import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppID, WindowState } from './types';
import { SYSTEM_APPS, SOCIAL_LINKS } from './constants';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import WindowManager from './components/WindowManager';
import CinematicLayer from './components/CinematicLayer';
import { Github, Linkedin, Mail, Info, UserRound } from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeAppId, setActiveAppId] = useState<AppID | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com/search?igu=1');

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [terminalCommand, setTerminalCommand] = useState<string | null>(null);

  const [wallpaper] = useState(
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2560'
  );

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && showIntro) setShowIntro(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showIntro]);
      

    


  const openApp = useCallback(
    (appId: AppID, title?: string, initialUrl?: string, autoCmd?: string) => {
      if (initialUrl) setBrowserUrl(initialUrl);
      if (autoCmd) setTerminalCommand(autoCmd);

      setWindows(prev => {
        const existing = prev.find(w => w.appId === appId);
        const newZ = zIndexCounter + 1;

        if (existing) {
          setZIndexCounter(newZ);
          setActiveAppId(appId);
          return prev.map(w =>
            w.appId === appId
              ? { ...w, isMinimized: false, zIndex: newZ }
              : w
          );
        }

        const appData = SYSTEM_APPS.find(a => a.id === appId);
        setZIndexCounter(newZ);
        setActiveAppId(appId);

        const isMobile =
          viewMode === 'mobile' || window.innerWidth < 768;

        const defaultWidth = isMobile ? window.innerWidth * 0.9 : 850;
        const defaultHeight = isMobile ? window.innerHeight * 0.7 : 600;

        return [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            appId,
            title: title || appData?.name || 'New Window',
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: newZ,
            x: isMobile ? 20 : 100 + prev.length * 30,
            y: isMobile ? 60 : 100 + prev.length * 30,
            width: defaultWidth,
            height: defaultHeight,
          },
        ];
      });
    },
    [zIndexCounter, viewMode]
  );
  // 1. Create a persistent "lock" that survives re-renders
const hasTriggeredInit = useRef(false);

useEffect(() => {
  // 2. Check if intro is over AND if we haven't triggered this yet
  if (!showIntro && !hasTriggeredInit.current) {
    
    // 3. Immediately lock it so no other render can enter this block
    hasTriggeredInit.current = true;

    console.log("OS Initialized: Opening Portfolio..."); // Debug check

    const timer = setTimeout(() => {
      openApp(
        'browser', 
        'Portfolio', 
        'https://prajwalshelar.online',
      );
    }, 1200); // Slightly longer delay to ensure UI is stable

    return () => clearTimeout(timer);
  }
}, [showIntro, openApp]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id
          ? w.isMaximized
            ? { ...w, isMaximized: false, ...(w.prevPos || {}) }
            : {
                ...w,
                isMaximized: true,
                prevPos: {
                  x: w.x,
                  y: w.y,
                  width: w.width,
                  height: w.height,
                },
                x: 0,
                y: 32,
                width: window.innerWidth,
                height: window.innerHeight - 120,
              }
          : w
      )
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setZIndexCounter(prevZ => {
      const newZ = prevZ + 1;
      setWindows(wins =>
        wins.map(w =>
          w.id === id
            ? { ...w, zIndex: newZ, isMinimized: false }
            : w
        )
      );
      return newZ;
    });
  }, []);

  const updateWindowPos = useCallback((id: string, x: number, y: number) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, x, y: Math.max(32, y) } : w
      )
    );
  }, []);

  const updateWindowSize = useCallback(
    (id: string, width: number, height: number) => {
      setWindows(prev =>
        prev.map(w =>
          w.id === id
            ? {
                ...w,
                width: Math.max(200, width),
                height: Math.max(150, height),
              }
            : w
        )
      );
    },
    []
  );

  const handleFreshStart = () => {
    setWindows([]);
    setActiveAppId(null);
  };

const SidebarIcon = ({ icon, onClick, label, isLast }: any) => (
  <div
    className={`group relative flex items-center justify-center w-8 h-8 md:w-12 md:h-12 cursor-pointer rounded-xl transition-all 
      md:mb-3 
      ${isLast ? 'md:mt-auto bg-blue-600/20 border border-blue-500/30' : ''} 
      ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-black'}`}
    onClick={onClick}
  >
    {/* Centered Icon Container */}
    <div className="flex items-center justify-center pointer-events-none">
      {icon}
    </div>
    
    {/* 🏷️ Tooltip Fix: This moves the text out of the sidebar flow */}
    <div className="absolute left-12 md:left-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none
                    bg-black/80 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap translate-x-[-10px] group-hover:translate-x-0 z-[10001]">
      {label}
    </div>
  </div>
);

  if (showIntro) {
    return <CinematicLayer onComplete={() => setShowIntro(false)} />;
  }

  return (
    /* 🔒 FIX #1: OS ROOT IS FIXED, NOT RELATIVE */
    <div
      className="fixed inset-0 overflow-hidden bg-cover bg-center select-none animate-window-open transition-opacity duration-1000"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${
          theme === 'dark' ? 'bg-black/40' : 'bg-white/20'
        }`}
      />

      {/* Desktop frame */}
      <div
        className={`relative h-full w-full overflow-x-hidden overflow-y-visible transition-all duration-500
          ${
            viewMode === 'mobile'
              ? 'mx-auto my-8 max-h-[85vh] w-[min(400px,95vw)] border-[12px] border-black/90 rounded-[50px] shadow-[0_0_80px_rgba(0,0,0,0.6)]'
              : ''
          }`}
      >
        <MenuBar
          activeApp={activeAppId || 'DeskOS'}
          theme={theme}
          onFile={() => openApp('finder')}
          onEdit={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          onView={() =>
            setViewMode(v => (v === 'desktop' ? 'mobile' : 'desktop'))
          }
          onWindow={handleFreshStart}
          onHelp={() => openApp('terminal', 'Help', undefined, 'help')}
        />

/* Floating Social Sidebar */
<div
  className={`absolute backdrop-blur-md rounded-xl border flex shadow-2xl z-[9000] transition-all duration-500
    /* 📱 Mobile Axis Controls */
    top-8 left-1/4 -translate-x-1/2 
    w-[240px]           /* Precise Width */
    h-12              /* Precise Height (Smaller) */
    flex-row justify-between items-center px-2
    scale-90            /* Overall Scale Down for Mobile */
    
    /* 🖥️ Desktop Axis Controls (md) */
    md:scale-100
    md:top-12 md:left-4 md:translate-x-0 
    md:w-16 md:h-[calc(100vh-180px)] 
    md:flex-col md:py-6 md:px-0 md:justify-start md:rounded-2xl`}
  style={{
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  }}
>
     {/* GitHub - Using Lucide */}
  <SidebarIcon 
    icon={<Github size={20} strokeWidth={2} className="md:w-6 md:h-6" />} 
    onClick={() => window.open(SOCIAL_LINKS.github, '_blank')} 
    label="GitHub" 
  />

{/* LinkedIn - Using Lucide */}
<SidebarIcon 
    icon={<Linkedin size={20} strokeWidth={2} className="md:w-6 md:h-6 fill-current" />} 
    onClick={() => window.open(SOCIAL_LINKS.linkedin, '_blank')} 
    label="LinkedIn" 
  />

 {/* Gmail - Using Lucide */}
 <SidebarIcon 
    icon={<Mail size={20} strokeWidth={2} className="md:w-6 md:h-6" />} 
    onClick={() => (window.location.href = `mailto:${SOCIAL_LINKS.email}`)} 
    label="Contact" 
  />

  {/* Portfolio - User Icon */}
  <SidebarIcon 
    icon={<UserRound size={22} strokeWidth={2.5} className="text-blue-400 md:w-7 md:h-7" />} 
    onClick={() => window.open(SOCIAL_LINKS.portfolio, '_blank')} 
    label="My Portfolio" 
  />
{/* Info - Using Lucide */}
<SidebarIcon 
    icon={<Info size={20} strokeWidth={2} className="md:w-6 md:h-6" />} 
    onClick={() => openApp('about')} 
    label="About Project" 
    isLast 
  />
        </div>

        {/* 🔒 FIX #2: Window compositor is ABSOLUTE */}
        <main className="absolute top-[32px] bottom-[96px] left-0 right-0 overflow-hidden">

          <WindowManager
            windows={windows}
            closeWindow={closeWindow}
            minimizeWindow={minimizeWindow}
            toggleMaximize={toggleMaximize}
            focusWindow={focusWindow}
            updateWindowPos={updateWindowPos}
            updateWindowSize={updateWindowSize}
            openApp={openApp}
            browserUrl={browserUrl}
            terminalCommand={terminalCommand}
            onCommandProcessed={() => setTerminalCommand(null)}
            theme={theme}
          />
        </main>

        <Dock
          openApp={openApp}
          activeApp={activeAppId}
          minimizedApps={windows.filter(w => w.isMinimized).map(w => w.appId)}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default App;
