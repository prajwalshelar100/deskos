
import React from 'react';
import { SYSTEM_APPS } from '../constants';
import { AppID } from '../types';

interface LaunchpadProps {
  openApp: (id: AppID) => void;
  onClose: () => void;
}

const Launchpad: React.FC<LaunchpadProps> = ({ openApp, onClose }) => {
  return (
    <div className="h-full bg-black/60 backdrop-blur-3xl p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
           <h1 className="text-4xl font-black text-white tracking-tighter">Applications</h1>
           <button onClick={onClose} className="text-white/40 hover:text-white text-sm font-bold uppercase tracking-widest">Close</button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {SYSTEM_APPS.map((app) => (
            <div 
              key={app.id} 
              onClick={() => { openApp(app.id as AppID); onClose(); }}
              className="group flex flex-col items-center space-y-4 cursor-pointer p-6 rounded-3xl hover:bg-white/10 transition-all active:scale-95"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center text-4xl shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                {app.icon}
              </div>
              <div className="text-[11px] font-black text-white/60 uppercase tracking-widest text-center group-hover:text-white transition-colors">
                {app.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Launchpad;
