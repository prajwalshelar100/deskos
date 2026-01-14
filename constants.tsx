
import { FileNode, Project } from './types';

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/prajwalshelar/',
  github: 'https://github.com/prajwalshelar100',
  portfolio: 'https://prajwalshelar-portfolio.vercel.app/',
  email: 'shelar.prajwal.99@gmail.com'
};

export const PROJECTS: Project[] = [
  {
    id: 'deskos',
    name: 'DeskOS',
    tagline: 'A browser-hosted desktop environment for tools, experiments, and systems.',
    description: 'Designed and built a client-side desktop environment that runs entirely in the browser, featuring a window manager, application runtime, virtual file system, and OS-like interaction patterns. DeskOS serves as a personal workspace for building tools, showcasing projects, and experimenting with system-level abstractions.',
    tech: ['React', 'TypeScript', 'Vite', 'Web APIs', 'Cloudflare Pages'],
    githubUrl: 'https://github.com/prajwalshelar100/deskos',
    image: 'deskos.png'
  },
 
  {
    id: 'imd-rainfall',
    name: 'IMD Rainfall Analyzer',
    tagline: 'Deep predictive and spatio-temporal analysis of Indian monsoon data.',
    description: 'Developed an automated tool to analyze and visualize IMD rainfall data, integrating statistical analysis and custom modules. Patented research.',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Scikit-Learn', 'Tkinter'],
    githubUrl: 'https://github.com/prajwalshelar100/imd-rainfall-analyzer',
    image: 'https://prajwalshelar100.github.io/IMDRA.png'
  },
  {
    id: 'image-recognition',
    name: 'Automated Image Recognition',
    tagline: 'Face detection and automatic capture system.',
    description: 'A Java-based system capable of detecting faces and automatically capturing images using Computer Vision (OpenCV).',
    tech: ['Java', 'Swing', 'OpenCV', 'JDBC'],
    githubUrl: 'https://github.com/prajwalshelar100/opencv-microservice',
    image: 'https://prajwalshelar100.github.io/AFRICS.png'
  }
];

export const SYSTEM_APPS = [
  { id: 'launchpad', name: 'Applications', icon: '🚀' },
  { id: 'finder', name: 'Finder', icon: '📂' },
  { id: 'terminal', name: 'Terminal', icon: '>_' },
  { id: 'codestudio', name: 'CodeStudio', icon: '🛠️' },
  { id: 'projects', name: 'Projects', icon: '📁' },
  { id: 'notes', name: 'Notes', icon: '📝' },
  { id: 'calculator', name: 'Calculator', icon: '🧮' },
  { id: 'liveroom', name: 'LiveRoom', icon: '💬' },
  { id: 'browser', name: 'Browser', icon: '🌐' },
  { id: 'assistant', name: 'Assistant', icon: '✨' },
];

export const VFS: FileNode = {
  name: 'root',
  type: 'directory',
  children: [
    {
      name: 'Users',
      type: 'directory',
      children: [
        {
          name: 'Prajwal',
          type: 'directory',
          children: [
            { name: 'Documents', type: 'directory', children: [] },
            { name: 'Code', type: 'directory', children: [] },
            { name: 'Projects', type: 'file', appId: 'projects' },
            { name: 'Resume.pdf', type: 'file', appId: 'resume' },
            { name: 'Notes', type: 'file', appId: 'notes' },
            { name: 'CodeStudio', type: 'file', appId: 'codestudio' },
            { name: 'Terminal', type: 'file', appId: 'terminal' },
          ]
        }
      ]
    }
  ]
};
