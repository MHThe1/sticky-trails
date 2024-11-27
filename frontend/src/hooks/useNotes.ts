import { useState, useEffect } from 'react';

export interface Note {
  _id: string;
  title: string;
  content: string;
  priority: number;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      if (data.success) {
        setNotes(data.data.sort((a: Note, b: Note) => b.priority - a.priority));
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const updateNotePriority = async (id: string, newPriority: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      });
      const data = await response.json();
      if (data.success) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === id ? { ...note, priority: newPriority } : note
          ).sort((a, b) => b.priority - a.priority)
        );
      }
    } catch (error) {
      console.error('Error updating note priority:', error);
    }
  };

  return { notes, updateNotePriority };
}

