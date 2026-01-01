
import React from 'react';

const AboutProject: React.FC = () => {
  return (
    <div className="h-full bg-neutral-900 text-white overflow-y-auto p-12">
      <div className="max-w-2xl mx-auto space-y-10 pb-20">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">Technical Dossier</div>
          <h1 className="text-6xl font-black tracking-tighter">DeskOS</h1>
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase opacity-60">FOSal v1.2 Engine</p>
        </div>

        <div className="space-y-6 text-neutral-400 leading-relaxed">
          <p className="text-lg text-white/80 font-medium">
            DeskOS (Desktop Operating System) is a high-fidelity browser-hosted environment designed to showcase systems-oriented frontend architecture.
          </p>
          
          <div className="grid grid-cols-2 gap-8 py-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-2">The Concept</h3>
              <p className="text-xs">FOSal (Frontend Operating System Abstraction Layer) serves as the underlying runtime, managing windows, state, and application lifecycle entirely on the client-side.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-2">Open Source</h3>
              <p className="text-xs">This project is fully open-source. It aims to bridge the gap between static portfolios and interactive developer workstations.</p>
            </div>
          </div>

          <h2 className="text-white text-xl font-black pt-4">Architecture Highlights</h2>
          <ul className="space-y-4 list-none">
            <li className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">01</span>
              <span><strong>Window Manager:</strong> A proprietary z-index and coordinate management system for true multi-window multitasking.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">02</span>
              <span><strong>App Ecosystem:</strong> Native-like modules for Code, Calculation, and Communication (CodeStudio, LiveRoom).</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">03</span>
              <span><strong>VFS:</strong> A Virtual File System abstraction that mirrors traditional Unix directory structures.</span>
            </li>
          </ul>

          <div className="pt-10 border-t border-white/10 text-center">
            <div className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mb-6">Designed & Engineered by</div>
            <h2 className="text-3xl font-black">Prajwal Shelar</h2>
            <div className="mt-8 flex justify-center space-x-6">
               <a href="https://github.com/prajwalshelar100" target="_blank" className="text-xs font-bold text-blue-400 hover:text-white transition-colors underline decoration-blue-500/30 underline-offset-4">Source Code</a>
               <a href="https://www.prajwalshelar.online/" target="_blank" className="text-xs font-bold text-blue-400 hover:text-white transition-colors underline decoration-blue-500/30 underline-offset-4">Portfolio</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
