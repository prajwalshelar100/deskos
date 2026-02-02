import React, { useState } from 'react';

const EstablishContact: React.FC = () => {
  // FORM STATE
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // UI STATES
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  // Replace with your actual Formspree ID
  const FORMSPREE_ID = 'mykpdnge';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('message', formData.message);
      data.append('_gotcha', '');

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });


      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    // MAIN CONTAINER
    <div className="h-full w-full bg-[#030303] text-white flex flex-col relative overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* FUTURISTIC BACKGROUND ELEMENTS */}
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Ambient White Glows */}
      <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* SCROLLABLE AREA */}
      <div className="flex-1 w-full overflow-y-auto scroll-smooth z-10 custom-scrollbar">
        
        {/* CENTERED CONTENT WRAPPER */}
        <div className="min-h-full w-full flex flex-col items-center justify-center p-6 pb-32">
          
          <div className="w-full max-w-lg relative">
            
            {/* DECORATIVE BORDER LINES AROUND THE FORM AREA */}
            <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />
            <div className="absolute -right-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />

            {status === 'success' ? (
              // SUCCESS MESSAGE
              <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/20 rounded-xl p-10 text-center animate-fade-in shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-light tracking-[0.2em] text-white uppercase mb-2">Uplink Secure</h2>
                <p className="text-white/60 font-mono text-xs tracking-wide">Data packet transmitted successfully.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-6 py-2 border border-white/30 rounded text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
                >
                  Reset Signal
                </button>
              </div>
            ) : (
              // CONTACT FORM
              <div className="w-full">
                
                {/* HEADER */}
                <div className="mb-12 text-center relative">
                  <h1 className="text-3xl md:text-4xl font-light tracking-[0.3em] uppercase text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    Establish Contact
                  </h1>
                  <div className="h-[1px] w-24 bg-white/50 mx-auto mb-2" />
                  <p className="text-white/40 text-[10px] font-mono tracking-[0.2em] uppercase">
                    // Secure Channel Ready // Encryption Active
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/10 shadow-2xl">
                  
                  {/* Name Input */}
                  <div className="group relative">
                    <label className="flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      <span>Operator ID (Name)</span>
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="ENTER IDENTIFICATION"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/60 focus:bg-white/10 focus:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500"
                    />
                    {/* Technical corner markers */}
                    <div className="absolute bottom-0 left-0 w-3 h-[1px] bg-white/50 group-focus-within:w-full transition-all duration-700" />
                  </div>

                  {/* Email Input */}
                  <div className="group relative">
                    <label className="flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      <span>Signal Origin (Email)</span>
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="ADDRESS@NETWORK.COM"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/60 focus:bg-white/10 focus:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500"
                    />
                    <div className="absolute bottom-0 left-0 w-3 h-[1px] bg-white/50 group-focus-within:w-full transition-all duration-700" />
                  </div>

                  {/* Message Input */}
                  <div className="group relative">
                    <label className="flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      <span>Transmission Data</span>
                    </label>
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      placeholder="INPUT MESSAGE CONTENT..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/60 focus:bg-white/10 focus:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 resize-none"
                    />
                    <div className="absolute bottom-0 left-0 w-3 h-[1px] bg-white/50 group-focus-within:w-full transition-all duration-700" />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={status === 'submitting'|| status === 'success'}
                    className="group relative w-full overflow-hidden bg-white text-black font-bold py-5 mt-4 tracking-[0.2em] uppercase text-xs hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      {status === 'submitting' ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Initiate Uplink</span>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </>
                      )}
                    </span>
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0" />
                  </button>

                  {status === 'error' && (
                    <p className="text-red-400 font-mono text-[10px] text-center uppercase tracking-widest mt-4">
                      !! ERROR: INVALID INPUT OR NETWORK ISSUE !!

                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishContact;