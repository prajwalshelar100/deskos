
import React, { useState, useEffect } from 'react';

interface BrowserAppProps {
  initialUrl?: string;
}

const BrowserApp: React.FC<BrowserAppProps> = ({ initialUrl }) => {
  const [url, setUrl] = useState(initialUrl || 'https://www.google.com/search?igu=1');
  const [inputValue, setInputValue] = useState(initialUrl || 'https://www.google.com');

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      setInputValue(initialUrl);
    }
  }, [initialUrl]);

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputValue.trim();
    if (!target) return;
    if (!target.startsWith('http') && !target.startsWith('blob:')) {
      target = `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
    }
    setUrl(target);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-14 bg-neutral-100 border-b border-neutral-300 flex items-center px-6 space-x-5 shrink-0">
        <div className="flex space-x-3 text-neutral-400">
          <button className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center transition-colors text-lg">❮</button>
          <button className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center transition-colors text-lg">❯</button>
        </div>
        <form className="flex-1" onSubmit={handleGo}>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">🔒</div>
            <input 
              className="w-full bg-white border border-neutral-300 rounded-full px-10 py-1.5 text-xs text-black outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search or enter URL"
            />
          </div>
        </form>
        <button onClick={() => setUrl(url)} className="text-neutral-400 hover:text-blue-500">↻</button>
      </div>
      <div className="flex-1 bg-neutral-50 overflow-hidden relative">
        <iframe src={url} className="w-full h-full border-none bg-white" title="Web Navigator" />
      </div>
    </div>
  );
};

export default BrowserApp;
