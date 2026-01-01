
export type AppID = 'finder' | 'terminal' | 'codestudio' | 'projects' | 'notes' | 'resume' | 'browser' | 'assistant' | 'calculator' | 'liveroom' | 'about' | 'launchpad';

export interface WindowState {
  id: string;
  appId: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  prevPos?: { x: number; y: number; width: number; height: number };
}

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  icon?: string;
  children?: FileNode[];
  appId?: AppID;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  demoUrl?: string;
  githubUrl?: string;
  researchUrl?: string;
  image?: string;
}
