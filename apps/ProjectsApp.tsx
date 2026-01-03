import React, { useState } from 'react';
import { PROJECTS } from '../constants';

const ProjectsApp: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <>
      {/* MAIN CONTENT */}
      <div className="h-full bg-[#121212] overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Projects</h1>
            <p className="text-white/70">
              A collection of systems, tools, and research explorations.
            </p>
          </div>

          <div className="grid gap-8">
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                className="glass rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* IMAGE */}
                  <div
                    className="md:w-1/3 h-48 md:h-auto overflow-hidden cursor-pointer"
                    onClick={() => setActiveImage(project.image)}
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-8 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">{project.name}</h2>
                      <p className="text-blue-400 font-medium text-sm">
                        {project.tagline}
                      </p>
                    </div>

                    <p className="text-white/60 leading-relaxed text-sm">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/60 border border-white/10 uppercase tracking-tighter"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-4 pt-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                        >
                          View Source
                        </a>
                      )}
                      {project.researchUrl && (
                        <a
                          href={project.researchUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                        >
                          Read Research
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE VIEW */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 overflow-y-auto"
          onClick={() => setActiveImage(null)}
        >
          {/* CLOSE BUTTON */}
          <button
            className="fixed top-6 right-6 z-50 text-white/80 hover:text-white text-3xl"
            onClick={() => setActiveImage(null)}
            aria-label="Close image"
          >
            ✕
          </button>

          {/* IMAGE */}
          <div
            className="flex justify-center px-6 py-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt="Project full view"
              className="w-full max-w-6xl h-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsApp;
