
import React, { useState } from 'react';
import { AppID } from '../types';

interface CodeEditorProps {
  openApp: (id: AppID, title?: string, url?: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ openApp }) => {
  const [files, setFiles] = useState({
    'index.html': '<html>\n  <head>\n    <link rel="stylesheet" href="style.css">\n  </head>\n  <body>\n    <div class="container">\n      <h1>FOSal Live</h1>\n      <p>Code, Build, and Run within the OS abstraction.</p>\n      <button id="btn">Interactive Action</button>\n    </div>\n    <script src="script.js"></script>\n  </body>\n</html>',
    'style.css': 'body {\n  background: radial-gradient(circle, #1a1a1a 0%, #000 100%);\n  color: #fff;\n  font-family: "Inter", sans-serif;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.container {\n  text-align: center;\n  padding: 40px;\n  background: rgba(255,255,255,0.05);\n  border-radius: 30px;\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255,255,255,0.1);\n}\n\nh1 {\n  background: linear-gradient(45deg, #3b82f6, #9333ea);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  font-size: 4rem;\n  margin: 0;\n}\n\nbutton {\n  background: #3b82f6;\n  color: white;\n  border: none;\n  padding: 12px 30px;\n  border-radius: 12px;\n  cursor: pointer;\n  font-weight: bold;\n  margin-top: 20px;\n  transition: all 0.2s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);\n}',
    'script.js': 'document.getElementById("btn").addEventListener("click", () => {\n  alert("Frontend OS Abstraction Layer (FOSal) Logic Triggered!");\n});'
  });
  const [activeTab, setActiveTab] = useState<keyof typeof files>('index.html');

  const handleRun = () => {
    const combined = `
      ${files['index.html']}
      <style>${files['style.css']}</style>
      <script>${files['script.js']}</script>
    `;
    const blob = new Blob([combined], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    openApp('browser', 'FOSal Preview', url);
  };

  const handleExport = () => {
    const content = files[activeTab];
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Tab Bar */}
      <div className="h-11 bg-[#252526] flex items-center shrink-0 border-b border-white/5 select-none">
        {(Object.keys(files) as Array<keyof typeof files>).map(file => (
          <div 
            key={file}
            onClick={() => setActiveTab(file)}
            className={`px-5 h-full flex items-center text-[11px] font-medium cursor-pointer border-r border-white/5 transition-all ${activeTab === file ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500' : 'text-white/40 hover:bg-white/5'}`}
          >
            <span className="mr-2 opacity-50">{file.endsWith('.html') ? '🌐' : file.endsWith('.css') ? '🎨' : '📜'}</span>
            {file}
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex items-center space-x-3 mr-4">
          <button 
            onClick={handleExport} 
            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-[10px] font-black transition-all border border-white/10 active:scale-95"
          >
            EXPORT {activeTab.toUpperCase()}
          </button>
          <button 
            onClick={handleRun} 
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black transition-all shadow-xl active:scale-95"
          >
            RUN LIVE
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="w-12 bg-[#1e1e1e] border-r border-white/5 flex flex-col items-center pt-5 text-[11px] text-white/10 font-mono select-none">
          {Array.from({ length: 100 }).map((_, i) => <div key={i} className="h-6 leading-6">{i + 1}</div>)}
        </div>
        {/* Text Area */}
        <textarea
          spellCheck={false}
          className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] font-mono p-5 text-[14px] outline-none resize-none leading-6"
          value={files[activeTab]}
          onChange={(e) => setFiles(prev => ({ ...prev, [activeTab]: e.target.value as any }))}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-blue-600 flex items-center px-4 justify-between text-[10px] text-white font-bold tracking-tight">
        <div className="flex space-x-4">
          <span>{activeTab}</span>
          <span className="opacity-50">UTF-8</span>
        </div>
        <div>
          <span>FOSal Runtime: v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
