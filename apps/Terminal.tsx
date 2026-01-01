
import React, { useState, useRef, useEffect } from 'react';
import { AppID } from '../types';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

interface TerminalProps {
  openApp: (id: AppID, title?: string) => void;
  initialCommand?: string | null;
  onCommandProcessed?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ openApp, initialCommand, onCommandProcessed }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'DeskOS v1.2.0 (FOSal Runtime)', type: 'success' },
    { text: 'Type "help" to list available system commands.', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    if (initialCommand) {
      handleCommand(initialCommand);
      if (onCommandProcessed) onCommandProcessed();
    }
  }, [initialCommand]);

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const mainCmd = parts[0].toLowerCase();
    const newLines: TerminalLine[] = [{ text: `>_ ${cmd}`, type: 'input' }];

    switch (mainCmd) {
      case 'help':
        newLines.push({ text: 'SYSTEM COMMANDS:\n  sysinfo   - View DeskOS hardware abstraction\n  whoami    - User profile details\n  journey   - Prajwal\'s career path\n  open <app>- Launch application\n  ls        - List virtual file system\n  clear     - Clear terminal buffer\n  goals     - Engineering roadmap', type: 'output' });
        break;
      case 'sysinfo':
        newLines.push({ text: 'OS: DeskOS v1.2.0\nKernel: FOSal Abstraction v1.2\nArchitecture: Browser-Hosted Runtime\nUI: React-Native-Web-Style\nUptime: 100%', type: 'output' });
        break;
      case 'whoami':
        newLines.push({ text: 'Prajwal Shelar\nRole: Software Engineer\nFocus: Backend, Systems, and AI\nLocation: Bengaluru', type: 'output' });
        break;
      case 'journey':
        newLines.push({ text: '2017: B.Sc Physics (Hons)\n2022: MCA Admission\n2023: IMD Rainfall Patent Filing\n2024: DeskOS Development & Graduation.', type: 'output' });
        break;
      case 'open':
        if (parts[1]) {
          const app = parts[1] as AppID;
          openApp(app);
          newLines.push({ text: `Executing ${app}.app binary...`, type: 'success' });
        } else {
          newLines.push({ text: 'Usage: open <app_name>', type: 'error' });
        }
        break;
      case 'ls':
        newLines.push({ text: 'Documents/  Code/  Projects/  Notes/  Resume.pdf', type: 'output' });
        break;
      case 'clear':
        setLines([]);
        return;
      case 'goals':
        newLines.push({ text: '• Architect highly concurrent distributed systems\n• Optimize client-side OS-like abstractions\n• Advance climate tech via predictive modeling', type: 'output' });
        break;
      default:
        newLines.push({ text: `dsh: command not found: ${mainCmd}`, type: 'error' });
    }

    setLines(prev => [...prev, ...newLines]);
  };

  return (
    <div className="bg-[#0c0c0c] p-5 h-full font-mono text-[13px] leading-relaxed overflow-y-auto text-white/90">
      {lines.map((line, i) => (
        <div key={i} className={`whitespace-pre-wrap mb-1 ${
          line.type === 'input' ? 'text-blue-400 font-bold' : 
          line.type === 'error' ? 'text-red-400' : 
          line.type === 'success' ? 'text-green-400' : 'text-white/60'
        }`}>
          {line.text}
        </div>
      ))}
      <div className="flex mt-1">
        <span className="text-blue-500 mr-2 font-bold select-none">&gt;_</span>
        <input
          autoFocus
          className="bg-transparent border-none outline-none text-white flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (handleCommand(input), setInput(''))}
        />
      </div>
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export default Terminal;
