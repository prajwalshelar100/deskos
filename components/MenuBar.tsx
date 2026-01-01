
import React, { useState, useEffect } from 'react';

interface MenuBarProps {
  activeApp: string;
  theme: 'light' | 'dark';
  onFile: () => void;
  onEdit: () => void;
  onView: () => void;
  onWindow: () => void;
  onHelp: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ activeApp, theme, onFile, onEdit, onView, onWindow, onHelp }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' });
  };

  const menuStyle = theme === 'dark' 
    ? 'bg-black/40 text-white border-white/5' 
    : 'bg-white/60 text-black border-black/5';

  return (
    <div className={`absolute top-0 left-0 w-full h-8 backdrop-blur-xl text-[13px] flex items-center justify-between px-4 z-[9999] border-b transition-colors duration-500 ${menuStyle}`}>
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-1">
          <span className="font-black text-xs leading-none cursor-default bg-blue-600 px-1.5 py-0.5 rounded text-white mr-1 shadow-sm">DeskOS</span>
          <span className="text-[10px] opacity-40 font-mono hidden sm:block">FOSal v1.2</span>
        </div>
        <span className="font-bold capitalize tracking-tight opacity-90">{activeApp}</span>
        <div className="hidden md:flex space-x-5 ml-4 opacity-70 font-medium">
          <button onClick={onFile} className="hover:text-blue-500 transition-colors">File</button>
          <button onClick={onEdit} className="hover:text-blue-500 transition-colors">Theme</button>
          <button onClick={onView} className="hover:text-blue-500 transition-colors">View</button>
          <button onClick={onWindow} className="hover:text-blue-500 transition-colors">Window</button>
          <button onClick={onHelp} className="hover:text-blue-500 transition-colors">Help</button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 pr-4 border-r border-current/10">
          <span className="cursor-default opacity-80 text-[10px]">📶</span>
          <span className="cursor-default opacity-80 text-[10px]">🔋 100%</span>
        </div>
        <span className="cursor-default font-semibold text-[11px] opacity-90">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default MenuBar;
