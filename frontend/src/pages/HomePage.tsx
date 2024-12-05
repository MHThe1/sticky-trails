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
  createdAt: string;
}

export const HomePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [boxesPerRow, setBoxesPerRow] = useState<number>(4);

  useEffect(() => {
    fetchNotes();
    const updateGridView = () => {
      if (window.innerWidth < 640) {
        setBoxesPerRow(1);
      } else if (window.innerWidth < 1024) {
        setBoxesPerRow(2);
      } else {
        setBoxesPerRow(4);
      }
    };

    updateGridView();
    window.addEventListener("resize", updateGridView);

    return () => {
      window.removeEventListener("resize", updateGridView);
    };
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
      <Navbar isGridView={isGridView} setIsGridView={setIsGridView} />
      <div className="mx-auto px-4 py-8">
        <GridContextProvider onChange={onChange}>
          <GridDropZone
            id="notes"
            boxesPerRow={isGridView ? boxesPerRow : 1}
            rowHeight={isGridView ? 280 : 100}
            style={{
              height: `${(isGridView ? 280 : 100) * Math.ceil(notes.length / boxesPerRow)}px`,
            }}
          >
            {notes.map((note) => (
              <GridItem key={note._id}>
                <div className={`h-full p-4 ${!isGridView && "flex"}`}>
                  <NoteCard
                    note={note}
                    onEdit={editNote}
                    onDelete={deleteNote}
                    isListView={!isGridView}
                  />
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
