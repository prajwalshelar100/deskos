
import { FileNode, Project } from './types';

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/prajwalshelar/',
  github: 'https://github.com/prajwalshelar100',
  portfolio: 'https://www.prajwalshelar.online/',
  email: 'shelar.prajwal.99@gmail.com'
};

export const PROJECTS: Project[] = [
  {
    id: 'imd-rainfall',
    name: 'IMD Rainfall Analyzer',
    tagline: 'Deep spatio-temporal analysis of Indian monsoon data.',
    description: 'Developed an automated tool to analyze and visualize IMD rainfall data, integrating statistical analysis and custom modules. Patent pending research.',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Scikit-Learn', 'Tkinter'],
    githubUrl: 'https://github.com/prajwalshelar100/rainfall-analyzer',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1f539cf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'image-recognition',
    name: 'Automated Image Recognition',
    tagline: 'Face detection and automatic capture system.',
    description: 'A Java-based system capable of detecting faces and automatically capturing images using Computer Vision (OpenCV).',
    tech: ['Java', 'Swing', 'OpenCV', 'JDBC'],
    githubUrl: 'https://github.com/prajwalshelar100/',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=800'
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
