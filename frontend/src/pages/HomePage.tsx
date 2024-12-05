import React, { useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import { AddNoteWindow } from "../components/AddNoteWindow";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";

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

  const addNote = async (newNote: {
    title: string;
    content: string;
    color: string;
  }) => {
    try {
      const response = await axios.post<{ data: Note }>("/api/notes", newNote);
      setNotes((prevNotes) => [...prevNotes, response.data.data]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const editNote = async (id: string, updates: Partial<Note>) => {
    try {
      const response = await axios.put<{ data: Note }>(
        `/api/notes/${id}`,
        updates
      );
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

  const updateNotePriorities = async (newNotes: Note[]) => {
    const updatedNotes = newNotes.map((note, index) => ({
      ...note,
      priority: index,
    }));

    try {
      await Promise.all(
        updatedNotes.map((note) =>
          axios.put(`/api/notes/${note._id}`, { priority: note.priority })
        )
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error updating note priorities:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
        <h1 className="text-2xl font-semibold text-white">Loading Notes...</h1>
      </div>
    );
  }

  function onChange(
    sourceId: string,
    sourceIndex: number,
    targetIndex: number
  ) {
    const nextState = swap(notes, sourceIndex, targetIndex);
    setNotes(nextState);
    updateNotePriorities(nextState);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-white">
          My Sticky Trail
        </h1>
        <GridContextProvider onChange={onChange}>
          <GridDropZone
            id="notes"
            boxesPerRow={4}
            rowHeight={280}
            style={{ height: `${280 * Math.ceil(notes.length / 4)}px` }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {notes.map((note) => (
              <GridItem key={note._id}>
                <div className="h-full">
                  <NoteCard note={note} onEdit={editNote} onDelete={deleteNote} />
                </div>
              </GridItem>
            ))}
          </GridDropZone>
        </GridContextProvider>

        <AddNoteWindow onAddNote={addNote} />
      </div>
    </div>
  );
};

