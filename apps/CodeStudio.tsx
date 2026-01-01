
import React, { useState } from 'react';
import { AppID } from '../types';

const TEMPLATES = {
  'HTML Boilerplate': {
    'index.html': '<html>\n  <head>\n    <title>FOSal Project</title>\n    <link rel="stylesheet" href="style.css">\n  </head>\n  <body>\n    <h1>New FOSal Application</h1>\n    <div id="root"></div>\n    <script src="script.js"></script>\n  </body>\n</html>',
    'style.css': 'body {\n  font-family: system-ui;\n  padding: 40px;\n  background: #f0f0f0;\n}',
    'script.js': 'console.log("FOSal Runtime Started");'
  },
  'Portfolio Starter': {
    'index.html': '<div class="card">\n  <h1>Prajwal Shelar</h1>\n  <p>Software Engineer</p>\n</div>',
    'style.css': '.card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }',
    'script.js': ''
  }
};

interface CodeStudioProps {
  openApp: (id: AppID, title?: string, url?: string) => void;
}

const CodeStudio: React.FC<CodeStudioProps> = ({ openApp }) => {
  const [files, setFiles] = useState(TEMPLATES['HTML Boilerplate']);
  const [activeTab, setActiveTab] = useState<string>('index.html');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleRun = () => {
    const combined = `
      ${files['index.html']}
      <style>${files['style.css']}</style>
      <script>${files['script.js']}</script>
    `;
    const blob = new Blob([combined], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    openApp('browser', 'Preview: ' + activeTab, url);
  };

  const loadTemplate = (name: keyof typeof TEMPLATES) => {
    setFiles(TEMPLATES[name]);
    setActiveTab('index.html');
    setShowTemplates(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Tool Bar */}
      <div className="h-12 bg-[#2d2d2d] flex items-center px-4 space-x-4 border-b border-black/20 shrink-0">
        <button 
          onClick={() => setShowTemplates(!showTemplates)}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
        >
          Templates
        </button>
        <div className="flex-1 flex overflow-x-auto space-x-1">
          {Object.keys(files).map(f => (
            <button 
              key={f}
              onClick={() => setActiveTab(f)}
              className={`px-4 h-8 flex items-center text-[11px] rounded-t-lg transition-all ${activeTab === f ? 'bg-[#1e1e1e] text-blue-400' : 'hover:bg-white/5 text-white/40'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={handleRun} className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all shadow-xl">
          Run Project
        </button>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {showTemplates && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-20">
            <div className="bg-[#2d2d2d] rounded-3xl p-8 max-w-xl w-full border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-black mb-6">Choose Starter Template</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(TEMPLATES).map(t => (
                  <button 
                    key={t}
                    onClick={() => loadTemplate(t as any)}
                    className="p-6 bg-white/5 hover:bg-blue-600/20 rounded-2xl border border-white/5 text-left transition-all"
                  >
                    <div className="font-bold text-white mb-1">{t}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">3 Files • Core Web</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowTemplates(false)} className="mt-8 w-full py-3 text-xs font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="w-12 bg-[#1e1e1e] border-r border-white/5 flex flex-col items-center pt-5 text-[11px] font-mono text-white/10 select-none">
          {Array.from({ length: 50 }).map((_, i) => <div key={i} className="h-6">{i + 1}</div>)}
        </div>
        <textarea
          spellCheck={false}
          className="flex-1 bg-transparent p-5 font-mono text-sm outline-none resize-none leading-relaxed"
          value={files[activeTab as keyof typeof files]}
          onChange={(e) => setFiles({ ...files, [activeTab]: e.target.value })}
        />
      </div>

      <div className="h-6 bg-[#007acc] flex items-center px-4 justify-between text-[10px] text-white font-bold tracking-tight shrink-0">
        <div>Ln 1, Col 1 • UTF-8 • {activeTab}</div>
        <div>FOSal CodeStudio Runtime v1.2</div>
      </div>
    </div>
  );
};

export default CodeStudio;
