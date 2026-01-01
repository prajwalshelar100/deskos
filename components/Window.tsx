
import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';
import { SYSTEM_APPS } from '../constants';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdatePos: (x: number, y: number) => void;
  onUpdateSize: (w: number, h: number) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ 
  window: win, onClose, onMinimize, onMaximize, onFocus, onUpdatePos, onUpdateSize, children 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const appIcon = SYSTEM_APPS.find(a => a.id === win.appId)?.icon || '📁';

  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus();
    setIsDragging(true);
    setDragOffset({ x: e.clientX - win.x, y: e.clientY - win.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      onUpdatePos(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onUpdatePos]);

  if (win.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-row border border-white/10 overflow-hidden animate-window-open transition-all duration-300 shadow-2xl
        ${win.isMaximized ? '' : 'rounded-2xl mac-shadow'} 
        bg-[#1a1a1a]/95 backdrop-blur-3xl`}
      style={{
        left: win.isMaximized ? 0 : win.x,
        top: win.isMaximized ? 32 : win.y,
        width: win.isMaximized ? '100%' : win.width,
        height: win.isMaximized ? 'calc(100vh - 32px - 80px)' : win.height,
        zIndex: win.zIndex,
      }}
      onClick={onFocus}
    >
      {/* App Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>

      {/* Sidebar Control Bar - Right Side */}
      <div 
        className="w-12 bg-black/40 border-l border-white/5 flex flex-col items-center pt-6 space-y-4 cursor-default select-none shrink-0" 
        onMouseDown={handleMouseDown}
      >
        <button 
          title="Close" 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-125 transition-all shadow-lg active:scale-90" 
        />
        <button 
          title="Maximize" 
          onClick={(e) => { e.stopPropagation(); onMaximize(); }} 
          className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:brightness-125 transition-all shadow-lg active:scale-90" 
        />
        <button 
          title="Minimize" 
          onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
          className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:brightness-125 transition-all shadow-lg active:scale-90" 
        />
        
        <div className="flex-1 flex flex-col items-center justify-center opacity-20 pointer-events-none space-y-4">
           <span className="text-xl">{appIcon}</span>
           <div className="h-1 w-4 bg-white/30 rounded-full" />
           <div className="h-1 w-2 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Resize handle (bottom right) */}
      {!win.isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-50 group"
          onMouseDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = win.width;
            const startH = win.height;

            const handleResize = (ev: MouseEvent) => {
              onUpdateSize(startW + (ev.clientX - startX), startH + (ev.clientY - startY));
            };
            const stopResize = () => {
              document.removeEventListener('mousemove', handleResize);
              document.removeEventListener('mouseup', stopResize);
            };
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', stopResize);
          }}
        >
           <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-r-2 border-b-2 border-white/20 rounded-br-sm group-hover:border-blue-500 transition-colors" />
        </div>
      )}
    </div>
  );
};

export default Window;
