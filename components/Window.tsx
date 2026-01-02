import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  // --- DRAG LOGIC ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus();
    setIsDragging(true);
    
    // Capture offset so window doesn't "snap" its top-left to the cursor
    setDragOffset({ 
      x: e.clientX - win.x, 
      y: e.clientY - win.y 
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // 🛡️ Boundary constraints: Keep title bar accessible below top MenuBar
    const boundedY = Math.max(32, newY); 
    const boundedX = newX; // Allow horizontal freedom
    
    onUpdatePos(boundedX, boundedY);
  }, [isDragging, dragOffset, onUpdatePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (win.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col border border-white/10 overflow-hidden shadow-2xl
        ${win.isMaximized ? '' : 'rounded-xl'} 
        bg-[#1a1a1a]/95 backdrop-blur-3xl animate-window-open`}
      style={{
        left: win.isMaximized ? 0 : win.x,
        top: win.isMaximized ? 32 : win.y,
        width: win.isMaximized ? '100%' : win.width,
        height: win.isMaximized ? 'calc(100vh - 32px - 80px)' : win.height,
        zIndex: win.zIndex,
        /* 💡 Performance Trick: No CSS transitions while dragging for buttery smooth 60fps */
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
      }}
      onClick={onFocus}
    >
      {/* 🏗️ WINDOWS-STYLE TITLE BAR (Drag Handle) */}
      <div 
        className={`h-10 bg-black/40 border-b border-white/5 flex items-center justify-between px-4 select-none shrink-0 
          ${win.isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`} 
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        {/* App Identity */}
        <div className="flex items-center gap-3">
          <span className="text-lg opacity-80">{appIcon}</span>
          <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] truncate max-w-[150px]">
            {win.title}
          </span>
        </div>

        {/* Windows OS Controls */}
        <div className="flex items-center gap-1">
          <button 
            title="Minimize" 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors group"
          >
            <div className="w-3 h-[1.5px] bg-white/40 group-hover:bg-white" />
          </button>
          
          <button 
            title="Maximize" 
            onClick={(e) => { e.stopPropagation(); onMaximize(); }} 
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors group"
          >
            <div className="w-3 h-3 border-[1.5px] border-white/40 group-hover:border-white rounded-[1px]" />
          </button>

          <button 
            title="Close" 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500 transition-colors group"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40 group-hover:text-white">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 🧩 APP CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>

      {/* 📐 RESIZE HANDLE (Bottom Right) */}
      {!win.isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-[100] group"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = win.width;
            const startH = win.height;

            const handleResize = (ev: MouseEvent) => {
              const newW = Math.max(350, startW + (ev.clientX - startX));
              const newH = Math.max(250, startH + (ev.clientY - startY));
              onUpdateSize(newW, newH);
            };
            
            const stopResize = () => {
              document.removeEventListener('mousemove', handleResize);
              document.removeEventListener('mouseup', stopResize);
            };
            
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', stopResize);
          }}
        >
           {/* Visual Resize Indicator */}
           <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-r-2 border-b-2 border-white/10 rounded-br-sm group-hover:border-blue-500 transition-colors" />
        </div>
      )}
    </div>
  );
};

export default Window;