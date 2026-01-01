
import React from 'react';

const ResumeViewer: React.FC = () => {
  const handleDownload = () => {
    const content = `PRAJWAL SHELAR\nSoftware Engineer | 9.41 MCA\n\nTECHNICAL SKILLS:\nJava (Core/Adv), Python, C, JavaScript, SQL\nSpring Boot, OpenCV, AWS, Linux\n\nPROJECTS:\n- IMD Rainfall Analyzer\n- Automated Image Recognition\n- Wikipedia Traffic Analysis\n\nPATENT:\nLead inventor of spatio-temporal rainfall analysis system (#118561).`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Prajwal_Shelar_Resume.txt';
    a.click();
  };

  return (
    <div className="h-full bg-neutral-800 flex flex-col">
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex space-x-6 text-[12px] text-white/60 font-medium">
          <span className="cursor-default hover:text-white transition-colors">File</span>
          <span className="cursor-default hover:text-white transition-colors">Edit</span>
          <span className="cursor-default hover:text-white transition-colors">View</span>
        </div>
        <button onClick={handleDownload} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-lg transition-all">
          DOWNLOAD PDF
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-black/50 p-10 flex justify-center">
        <div className="w-[850px] bg-white shadow-2xl p-16 text-black min-h-[1100px] rounded-sm transform origin-top">
          <header className="border-b-4 border-black pb-8 mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Prajwal Shelar</h1>
              <p className="text-xl font-bold mt-2 text-neutral-600">Software Engineer | Systems & AI Specialist</p>
            </div>
            <div className="text-right text-[11px] font-medium leading-relaxed">
              <p>📍 Bengaluru, Karnataka</p>
              <p>📞 +91 9987909499</p>
              <p>📧 shelar.prajwal.100@gmail.com</p>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-300 mb-4 pb-1">Education</h2>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-sm">Dayananda Sagar College of Engineering</p>
                <p className="text-xs italic text-neutral-500">Master's of Computer Application (MCA)</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">9.41 CGPA</p>
                <p className="text-[10px] text-neutral-400">Oct 2022 – Oct 2024</p>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-sm">Amity University</p>
                <p className="text-xs italic text-neutral-500">Bachelor of Science (B.Sc.) in Physics (Hons.)</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">9.40 CGPA</p>
                <p className="text-[10px] text-neutral-400">Aug 2017 – Aug 2020</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-300 mb-4 pb-1">Technical Skills</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-[11px] leading-relaxed">
              <div><strong>Languages:</strong> Java, Python, C, JavaScript, SQL</div>
              <div><strong>Frameworks:</strong> Spring Boot, SpringData JPA, RESTful API</div>
              <div><strong>Systems:</strong> GNU/Linux (Ubuntu, Arch, Kali), AWS, Azure</div>
              <div><strong>Tools:</strong> OpenCV, Git, CI/CD, Docker, Jupyter Lab</div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-300 mb-4 pb-1">Key Research & Projects</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between font-bold text-sm">
                  <h3>IMD Rainfall Analyzer</h3>
                  <span>Nov 2022</span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed text-neutral-700">Developed an automated tool to analyze and visualize IMD rainfall data, integrating statistical analysis and custom modules with a user-friendly GUI. Patent pending for innovative spatio-temporal modeling.</p>
              </div>
              <div>
                <div className="flex justify-between font-bold text-sm">
                  <h3>Image Recognition System</h3>
                  <span>Apr 2024</span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed text-neutral-700">Real-time face detection and automatic capturing system using Java, OpenCV, and JDBC integration.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-300 mb-4 pb-1 text-blue-600">Patents</h2>
            <div className="bg-neutral-50 p-4 border-l-4 border-blue-600">
              <p className="font-bold text-xs uppercase tracking-wider">Patent #118561 (Dec 2024)</p>
              <p className="text-[11px] mt-2 leading-relaxed">Lead inventor of a system for analyzing large-scale rainfall data, enabling spatio-temporal analysis and predictive modeling for agriculture and urban planning.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
