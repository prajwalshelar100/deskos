
import React from 'react';
import { AppID, WindowState } from '../types';
import Window from './Window';
import Terminal from '../apps/Terminal';
import Finder from '../apps/Finder';
import CodeStudio from '../apps/CodeStudio';
import ProjectsApp from '../apps/ProjectsApp';
import NotesApp from '../apps/NotesApp';
import ResumeViewer from '../apps/ResumeViewer';
import BrowserApp from '../apps/BrowserApp';
import AssistantApp from '../apps/AssistantApp';
import Calculator from '../apps/Calculator';
import LiveRoom from '../apps/LiveRoom';
import AboutProject from '../apps/AboutProject';
import Launchpad from '../apps/Launchpad';

interface WindowManagerProps {
  windows: WindowState[];
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPos: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, w: number, h: number) => void;
  openApp: (id: AppID, title?: string, url?: string) => void;
  browserUrl: string;
  terminalCommand: string | null;
  onCommandProcessed: () => void;
  theme: 'light' | 'dark';
}

const WindowManager: React.FC<WindowManagerProps> = ({ 
  windows, closeWindow, minimizeWindow, toggleMaximize, focusWindow, updateWindowPos, updateWindowSize, openApp, browserUrl, terminalCommand, onCommandProcessed, theme
}) => {
  const renderApp = (win: WindowState) => {
    switch (win.appId) {
      case 'terminal': return <Terminal openApp={openApp} initialCommand={terminalCommand} onCommandProcessed={onCommandProcessed} />;
      case 'finder': return <Finder openApp={openApp} />;
      case 'codestudio': return <CodeStudio openApp={openApp} />;
      case 'projects': return <ProjectsApp />;
      case 'notes': return <NotesApp />;
      case 'resume': return <ResumeViewer />;
      case 'browser': return <BrowserApp initialUrl={browserUrl} />;
      case 'assistant': return <AssistantApp />;
      case 'calculator': return <Calculator />;
      case 'liveroom': return <LiveRoom />;
      case 'about': return <AboutProject />;
      case 'launchpad': return <Launchpad openApp={openApp} onClose={() => closeWindow(win.id)} />;
      default: return <div className="p-8">App {win.appId} is coming soon.</div>;
    }
  };

  return (
    <>
      {windows.map((win) => (
        <Window
          key={win.id}
          window={win}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => toggleMaximize(win.id)}
          onFocus={() => focusWindow(win.id)}
          onUpdatePos={(x, y) => updateWindowPos(win.id, x, y)}
          onUpdateSize={(w, h) => updateWindowSize(win.id, w, h)}
        >
          {renderApp(win)}
        </Window>
      ))}
    </>
  );
};

export default WindowManager;
