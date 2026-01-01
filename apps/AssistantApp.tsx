
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const AssistantApp: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Hello! I am your PrajwalOS system assistant. How can I help you explore Prajwal\'s work today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are the AI assistant for PrajwalOS, a personal OS portfolio of Prajwal Shelar. 
          Prajwal is a Software Engineer specializing in Java, Systems, and Climate Data Analysis (IMD Rainfall Analyzer).
          He has an MCA with 9.41 CGPA.
          Be professional, helpful, and concise. Help users find specific projects or learn about his journey.`
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', text: response.text || "I'm having trouble thinking right now." }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to neural core. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-[14px] leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'glass-dark text-white/90'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-dark px-4 py-2 rounded-2xl text-[14px] animate-pulse">Assistant is thinking...</div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="relative flex items-center">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Ask about Prajwal's projects, skills, or career..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantApp;
