
import React, { useState} from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'About FOSal',
    date: 'Dec 2025',
    content: "FOSal (Frontend OS Abstraction Layer) is a web-based operating system designed to showcase my skills as a software engineer. It's a living workspace built with React and systems-level thinking."
  },
  {
  id: '2',
  title: 'Career Goals',
  date: 'Dec 2025',
  content: 
    "1. Grow as an efficient and skilled software developer.\n" +
    "2. Build robust automation tools.\n" +
    "3. Build scalable and useful applications.\n" +
    "4. Contribute to open source.\n" +
    "5. Create robust developer tools.\n" +
    "6. Solve real-world problems."
},
{
  id: '3',
  title: 'Technical Stack',
  date: 'June 2024',
  content:
    "Core: Java, Spring Boot, Python, React, TypeScript.\n" +
    "Specialties: Full-stack development, systems programming, computer vision, AI/ML."
}
 
];

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string>(INITIAL_NOTES[0].id);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleNoteChange = (content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId ? { ...note, content } : note
    ));
  };

  const handleTitleChange = (title: string) => {
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId ? { ...note, title } : note
    ));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Note',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      content: ''
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notes.length <= 1) return;
    setNotes(prev => {
      const filtered = prev.filter(n => n.id !== id);
      if (id === activeNoteId) {
        setActiveNoteId(filtered[0].id);
      }
      return filtered;
    });
  };

  const exportNote = (format: 'txt' | 'md') => {
    const filename = `${activeNote.title.replace(/\s+/g, '_').toLowerCase()}.${format}`;
    const content = activeNote.content;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-black/40 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">All Notes</div>
          <button 
            onClick={createNewNote}
            className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shadow-lg"
            title="New Note"
          >
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`group relative p-3 rounded-xl text-sm transition-all cursor-pointer truncate flex items-center justify-between ${activeNoteId === note.id ? 'bg-blue-600/90 text-white shadow-md' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex flex-col truncate pr-6">
                <span className="truncate font-semibold">{note.title || 'Untitled'}</span>
                <span className="text-[10px] opacity-40">{note.date}</span>
              </div>
              <button 
                onClick={(e) => deleteNote(note.id, e)}
                className={`absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all ${activeNoteId === note.id ? 'text-white/60' : ''}`}
                title="Delete Note"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
        <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-white/5 backdrop-blur-sm">
          <div className="text-[11px] opacity-40 font-mono tracking-widest uppercase">{activeNote.date}</div>
          <div className="flex items-center space-x-3">
            <button onClick={() => exportNote('txt')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold transition-all border border-white/10 text-white/60 hover:text-white">
              EXPORT .TXT
            </button>
            <button onClick={() => exportNote('md')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold transition-all border border-white/10 text-white/60 hover:text-white">
              EXPORT .MD
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-12 overflow-y-auto bg-gradient-to-b from-transparent to-black/10">
          <div className="max-w-3xl mx-auto space-y-6">
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none text-4xl font-black tracking-tight text-white placeholder:text-white/10"
              value={activeNote.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Note Title"
              spellCheck={false}
            />
            <textarea
              className="w-full bg-transparent border-none outline-none text-white/80 leading-relaxed text-lg font-medium resize-none min-h-[60vh] pb-24"
              value={activeNote.content}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Write your thoughts..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
