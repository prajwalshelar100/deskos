
import React, { useState } from 'react';

const LiveRoom: React.FC = () => {
  const [roomID, setRoomID] = useState<string | null>(null);
  const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
  const [input, setInput] = useState('');

  const createRoom = () => {
    setRoomID(Math.random().toString(36).substr(2, 6).toUpperCase());
    setMessages([{ user: 'System', text: 'Secure ephemeral room created. No logs are saved.' }]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { user: 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="h-full bg-[#0a0a0a] text-white flex flex-col">
      {!roomID ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
          <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center text-5xl animate-pulse">📡</div>
          <div>
            <h1 className="text-3xl font-black mb-2">LiveRoom</h1>
            <p className="text-white/40 max-w-sm mx-auto text-sm">Create ephemeral, secure communication channels. Peer-to-peer data abstraction. No storage.</p>
          </div>
          <button 
            onClick={createRoom}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold shadow-2xl transition-all active:scale-95"
          >
            Create Private Room
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-14 bg-white/5 border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Room: {roomID}</span>
            </div>
            <button onClick={() => setRoomID(null)} className="text-[10px] font-bold text-white/30 hover:text-red-400">EXIT ROOM</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.user === 'You' ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] text-white/20 font-bold uppercase mb-1">{m.user}</span>
                <div className={`px-4 py-2 rounded-2xl text-sm ${m.user === 'You' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5">
            <div className="flex space-x-2">
              <input 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Type a secure message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all">
                ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveRoom;
