import React, { useState, useEffect } from 'react';

interface Tab {
  id: string;
  url: string;
  inputValue: string;
  title: string;
  history: string[];
  historyIndex: number;
}

interface BrowserAppProps {
  initialUrl?: string;
}

const BrowserApp: React.FC<BrowserAppProps> = ({ initialUrl }) => {
  const defaultUrl = 'https://www.google.com/search?igu=1';
  const defaultDisplayUrl = 'https://www.google.com';

  // --- 📦 INITIAL STATE ---
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: 'initial-' + Math.random().toString(36).substr(2, 4), 
      url: initialUrl || defaultUrl, 
      inputValue: initialUrl || defaultDisplayUrl,
      title: initialUrl ? 'Portfolio' : 'Google',
      history: [initialUrl || defaultUrl],
      historyIndex: 0
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // --- 🛠️ NAVIGATION LOGIC ---
  const navigateTo = (newUrl: string) => {
    let target = newUrl.trim();
    if (!target) return;

    // Smart URL formatting
    if (!target.startsWith('http') && !target.startsWith('blob:')) {
      target = `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
    }

    setTabs(prev => prev.map(t => {
      if (t.id !== activeTabId) return t;

      // Update history stack (clear forward history)
      const newHistory = t.history.slice(0, t.historyIndex + 1);
      newHistory.push(target);

      return {
        ...t,
        url: target,
        inputValue: target,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        title: target.includes('prajwalshelar') ? 'Portfolio' : 
               target.includes('google') ? 'Google' : 'Web Page'
      };
    }));
  };

  const goBack = () => {
    if (activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[newIndex];
      setTabs(prev => prev.map(t => 
        t.id === activeTabId ? { ...t, url: prevUrl, inputValue: prevUrl, historyIndex: newIndex } : t
      ));
    }
  };

  const goForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[newIndex];
      setTabs(prev => prev.map(t => 
        t.id === activeTabId ? { ...t, url: nextUrl, inputValue: nextUrl, historyIndex: newIndex } : t
      ));
    }
  };

  const reload = () => {
    const currentUrl = activeTab.url;
    // Force iframe reload by temporarily clearing URL
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: '' } : t));
    setTimeout(() => {
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: currentUrl } : t));
    }, 50);
  };

  // --- 📑 TAB MANAGEMENT ---
  const addTab = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setTabs([...tabs, {
      id: newId,
      url: defaultUrl,
      inputValue: defaultDisplayUrl,
      title: 'New Tab',
      history: [defaultUrl],
      historyIndex: 0
    }]);
    setActiveTabId(newId);
  };

  const removeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // Don't close last tab, just reset it
      setTabs([{
        id: 'initial-' + Math.random().toString(36).substr(2, 4),
        url: defaultUrl,
        inputValue: defaultDisplayUrl,
        title: 'Google',
        history: [defaultUrl],
        historyIndex: 0
      }]);
      return;
    }

    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white select-none overflow-hidden font-sans">
      
      {/* 📑 TAB BAR */}
      <div className="flex items-center bg-neutral-200 px-2 pt-2 space-x-0.5 shrink-0 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center h-9 px-4 rounded-t-lg text-[11px] transition-all cursor-pointer min-w-[140px] max-w-[200px] border-r border-neutral-300 relative
              ${activeTabId === tab.id 
                ? 'bg-neutral-100 text-black border-none z-10 shadow-[0_-1px_4px_rgba(0,0,0,0.1)]' 
                : 'bg-neutral-300/60 text-neutral-500 hover:bg-neutral-200/80'}`}
          >
            <span className="truncate flex-1 pr-6 font-medium">{tab.title}</span>
            
            <button 
              onClick={(e) => removeTab(tab.id, e)}
              className={`absolute right-2 w-5 h-5 flex items-center justify-center rounded-md transition-all
                ${activeTabId === tab.id 
                  ? 'opacity-100 text-neutral-400 hover:bg-neutral-300 hover:text-black' 
                  : 'opacity-0 group-hover:opacity-100 text-neutral-500 hover:bg-neutral-400/40'}`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        
        <button 
          onClick={addTab}
          className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 rounded-md transition-colors text-xl font-light ml-1"
        >
          +
        </button>
      </div>

      {/* 🔍 NAVIGATION / ADDRESS BAR */}
      <div className="h-12 bg-neutral-100 border-b border-neutral-300 flex items-center px-4 space-x-4 shrink-0">
        <div className="flex items-center space-x-1">
          <button 
            disabled={activeTab.historyIndex === 0}
            onClick={goBack}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors 
              ${activeTab.historyIndex === 0 ? 'text-neutral-300' : 'text-neutral-600 hover:bg-neutral-200'}`}
          >
            ❮
          </button>
          <button 
            disabled={activeTab.historyIndex === activeTab.history.length - 1}
            onClick={goForward}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors 
              ${activeTab.historyIndex === activeTab.history.length - 1 ? 'text-neutral-300' : 'text-neutral-600 hover:bg-neutral-200'}`}
          >
            ❯
          </button>
          <button 
            onClick={reload}
            className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            ↻
          </button>
        </div>
        
        <form 
          className="flex-1" 
          onSubmit={(e) => { e.preventDefault(); navigateTo(activeTab.inputValue); }}
        >
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] opacity-40">🔒</div>
            <input 
              className="w-full bg-white border border-neutral-300 rounded-full px-8 py-1.5 text-xs text-black outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
              value={activeTab.inputValue}
              onChange={(e) => {
                const val = e.target.value;
                setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, inputValue: val } : t));
              }}
              placeholder="Search Google or enter URL"
            />
          </div>
        </form>
      </div>

      {/* 🌐 IFRAME VIEWPORT */}
      <div className="flex-1 bg-white relative">
        {tabs.map((tab) => (
          <iframe 
            key={tab.id}
            src={tab.url} 
            className={`w-full h-full border-none bg-white absolute inset-0 ${activeTabId === tab.id ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`} 
            title={`Browser-Tab-${tab.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowserApp;