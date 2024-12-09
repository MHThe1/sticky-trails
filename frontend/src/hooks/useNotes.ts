import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  token: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  priority: number;
  createdAt: string;
}

interface NewNote {
  title: string;
  content: string;
  color: string;
}

export const useNotes = (user: User | null) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  const fetchNotes = async () => {
    try {
      const response = await axios.get<{ data: Note[] }>(`${import.meta.env.VITE_API_BASE_URL}/api/notes`, getHeaders());
      setNotes(response.data.data.sort((a, b) => a.priority - b.priority));
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (newNote: NewNote) => {
    try {
      const response = await axios.post<{ data: Note }>(`${import.meta.env.VITE_API_BASE_URL}/api/notes`, newNote, getHeaders());
      setNotes((prevNotes) => [...prevNotes, response.data.data]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const editNote = async (id: string, updates: Partial<Note>) => {
    try {
      const response = await axios.put<{ data: Note }>(`${import.meta.env.VITE_API_BASE_URL}/api/notes/${id}`, updates, getHeaders());
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? response.data.data : note))
      );
    } catch (error) {
      console.error(`Error editing note with ID ${id}:`, error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/notes/${id}`, getHeaders());
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error(`Error deleting note with ID ${id}:`, error);
    }
  };

  const updateNotePriorities = async (newNotes: Note[]) => {
    const updatedNotes = newNotes.map((note, index) => ({
      ...note,
      priority: index,
    }));

    try {
      await Promise.all(
        updatedNotes.map((note) =>
          axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/notes/${note._id}`, { priority: note.priority }, getHeaders())
        )
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error updating note priorities:", error);
    }
  };

  return {
    notes,
    setNotes,
    loading,
    addNote,
    editNote,
    deleteNote,
    updateNotePriorities,
  };
};
