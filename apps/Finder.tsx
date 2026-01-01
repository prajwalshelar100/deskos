
import React, { useState } from 'react';
import { VFS } from '../constants';
import { FileNode, AppID } from '../types';
import { toast } from "sonner";


interface FinderProps {
  openApp: (id: AppID, title?: string) => void;
}

const Finder: React.FC<FinderProps> = ({ openApp }) => {
  const [currentDir, setCurrentDir] = useState<FileNode>(VFS.children![0].children![0]); // /Users/Prajwal
  const [activeSection, setActiveSection] = useState('Prajwal');

  const navigateTo = (node: FileNode) => {
    if (node.type === 'directory') {
      setCurrentDir(node);
      setActiveSection(node.name);
    } else if (node.appId) {
      openApp(node.appId, node.name);
    }
  };

  const handleSidebarClick = (name: string) => {
    setActiveSection(name);
    if (name === 'Prajwal') {
      setCurrentDir(VFS.children![0].children![0]);
    } else if (name === 'Recents') {
      // For demo, just show root users or keep current
      toast.message("Recents is currently being indexed by FOSal.");
    } else if (name === 'Downloads') {toast("Downloads folder is empty", {
      duration: 2000,
    });
    
    } else {
      toast.message(`${name} location is offline.`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 bg-white/5 border-r border-white/10 p-5 flex flex-col space-y-6 shrink-0">
          <div>
            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 px-2">Favorites</div>
            <div className="space-y-0.5">
              <button 
                onClick={() => handleSidebarClick('Prajwal')}
                className={`w-full text-left text-[12px] px-3 py-1.5 rounded-lg flex items-center space-x-2.5 transition-colors ${activeSection === 'Prajwal' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-white/60'}`}
              >
                <span className="text-sm">📂</span>
                <span className="font-medium">Prajwal</span>
              </button>
              <button 
                onClick={() => handleSidebarClick('Recents')}
                className={`w-full text-left text-[12px] px-3 py-1.5 rounded-lg flex items-center space-x-2.5 transition-colors ${activeSection === 'Recents' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-white/60'}`}
              >
                <span className="text-sm">🕒</span>
                <span>Recents</span>
              </button>
              <button 
                onClick={() => handleSidebarClick('Downloads')}
                className={`w-full text-left text-[12px] px-3 py-1.5 rounded-lg flex items-center space-x-2.5 transition-colors ${activeSection === 'Downloads' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-white/60'}`}
              >
                <span className="text-sm">📥</span>
                <span>Downloads</span>
              </button>
            </div>
          </div>
          
          <div>
            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 px-2">Locations</div>
            <div className="space-y-0.5">
              <button 
                onClick={() => handleSidebarClick('FOSal Core')}
                className={`w-full text-left text-[12px] px-3 py-1.5 rounded-lg flex items-center space-x-2.5 transition-colors ${activeSection === 'FOSal Core' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-white/60'}`}
              >
                <span className="text-sm">⚙️</span>
                <span>FOSal Core</span>
              </button>
            </div>
          </div>
        </div>

        {/* File Grid */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {currentDir.children?.map((node, i) => (
              <div 
                key={i} 
                className="group flex flex-col items-center space-y-2 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-default select-none"
                onDoubleClick={() => navigateTo(node)}
                onTouchEnd={() => navigateTo(node)}
              >
                <div className="w-14 h-14 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                  {node.type === 'directory' ? '📁' : (node.name.endsWith('.pdf') ? '📕' : '📄')}
                </div>
                <div className="text-[11px] text-center font-medium text-white/70 group-hover:text-blue-400 transition-colors truncate w-full">
                  {node.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-9 border-t border-white/5 bg-black/40 flex items-center px-6 justify-between text-[10px] text-white/30 font-medium shrink-0">
        <span>{currentDir.children?.length || 0} items</span>
        <span className="uppercase tracking-widest">Storage: Fully Abstracted</span>
      </div>
    </div>
  );
};

export default Finder;
