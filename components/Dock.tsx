import React, {useState} from 'react';
import { AppID } from '../types';
import { SYSTEM_APPS } from '../constants';

interface DockProps {
  openApp: (id: AppID) => void;
  activeApp: AppID | null;
  minimizedApps: AppID[];
  theme: 'light' | 'dark';
}

const Dock: React.FC<DockProps> = ({ openApp, activeApp, minimizedApps, theme }) => {
  const [pressedApp, setPressedApp] = useState<AppID | null>(null);

  const dockBg =
    theme === 'dark'
      ? 'glass-dark'
      : 'bg-white/40 backdrop-blur-xl border-black/5 shadow-2xl';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[95vw] max-w-[640px]">
      {/* Scroll Container */}
      <div
        className={`
          flex items-end gap-3 px-3 pt-2 pb-3
          overflow-x-auto flex-nowrap
          rounded-[24px] border transition-all duration-500
          ${dockBg}
          scrollbar-hide
          touch-pan-x overscroll-x-contain
        `}
      >
        {SYSTEM_APPS.map((app) => (
          <button
          key={app.id}
          onMouseDown={() => setPressedApp(app.id as AppID)}
          onMouseUp={() => setPressedApp(null)}
          onMouseLeave={() => setPressedApp(null)}
          onClick={() => openApp(app.id as AppID)}
          className={`
            group relative flex flex-col items-center
            transition-transform duration-200 ease-out
            origin-bottom
            ${pressedApp === app.id ? 'scale-125 -translate-y-2' : 'scale-100'}
          `}
        >
            <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center text-3xl shadow-lg border border-white/10">
              {app.icon}
            </div>

            {/* Tooltip (desktop only) */}
            <div className="hidden md:block absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-black/80 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap">
              {app.name}
            </div>

            {(activeApp === app.id ||
              minimizedApps.includes(app.id as AppID)) && (
              <div
                className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                  theme === 'dark' ? 'bg-white' : 'bg-black'
                } ${
                  minimizedApps.includes(app.id as AppID)
                    ? 'opacity-40'
                    : 'shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                }`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};


export default Dock;
