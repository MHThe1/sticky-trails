import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { NoteCard } from "../components/NoteCard";
import { AddNoteWindow } from "../components/AddNoteWindow";
import axios from "axios";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  priority: number;
  updatedAt: string;
}

export const HomePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get<{ data: Note[] }>("/api/notes");
      setNotes(response.data.data.sort((a, b) => a.priority - b.priority));
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (newNote: { title: string; content: string; color: string }) => {
    try {
      const response = await axios.post<{ data: Note }>("/api/notes", newNote);
      setNotes((prevNotes) => [...prevNotes, response.data.data]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const editNote = async (id: string, updates: Partial<Note>) => {
    try {
      const response = await axios.put<{ data: Note }>(`/api/notes/${id}`, updates);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? response.data.data : note))
      );
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const updateNotePriorities = async (newLayout: any[]) => {
    const updatedNotes = notes.map((note) => {
      const layoutItem = newLayout.find((item) => item.i === note._id);
      return { ...note, priority: layoutItem ? layoutItem.y * 4 + layoutItem.x : note.priority };
    });

    try {
      await Promise.all(
        updatedNotes.map((note) =>
          axios.put(`/api/notes/${note._id}`, { priority: note.priority })
        )
      );
      setNotes(updatedNotes.sort((a, b) => a.priority - b.priority));
    } catch (error) {
      console.error("Error updating note priorities:", error);
    }
  };

  const handleLayoutChange = (newLayout: any[]) => {
    updateNotePriorities(newLayout);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
        <h1 className="text-2xl font-semibold text-white">Loading Notes...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 p-8">
      <h1 className="text-5xl font-bold mb-8 text-center text-white">
        My Sticky Trail
      </h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: notes.map((note, i) => ({ i: note._id, x: i % 4, y: Math.floor(i / 4), w: 1, h: 1 })) }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={250}
        width={1100}
        margin={[20, 20]}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={false}
      >
        {notes.map((note) => (
          <div key={note._id}>
            <NoteCard note={note} onEdit={editNote} onDelete={deleteNote} />
          </div>
        ))}
      </ResponsiveGridLayout>
      <AddNoteWindow onAddNote={addNote} />
    </div>
  );
};

