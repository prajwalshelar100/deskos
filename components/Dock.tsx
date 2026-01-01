
import React from 'react';
import { AppID } from '../types';
import { SYSTEM_APPS } from '../constants';

interface DockProps {
  openApp: (id: AppID) => void;
  activeApp: AppID | null;
  minimizedApps: AppID[];
  theme: 'light' | 'dark';
}

const Dock: React.FC<DockProps> = ({ openApp, activeApp, minimizedApps, theme }) => {
  const dockBg = theme === 'dark' ? 'glass-dark' : 'bg-white/40 backdrop-blur-xl border-black/5 shadow-2xl';

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end p-2 pb-3 space-x-3 rounded-[24px] z-[9999] transition-all duration-500 hover:pb-4 border ${dockBg}`}>
      {SYSTEM_APPS.map((app) => (
        <button
          key={app.id}
          onClick={() => openApp(app.id as AppID)}
          className="group relative flex flex-col items-center transition-all duration-200 transform hover:scale-125 hover:-translate-y-2 origin-bottom"
        >
          <div className={`w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center text-3xl shadow-lg border border-white/10`}>
            {app.icon}
          </div>
          <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-black/80 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap">
            {app.name}
          </div>
          {(activeApp === app.id || minimizedApps.includes(app.id as AppID)) && (
            <div className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-black'} ${minimizedApps.includes(app.id as AppID) ? 'opacity-40' : 'shadow-[0_0_8px_rgba(255,255,255,0.8)]'}`}></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Dock;
