import React, { useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import { AddNoteWindow } from "../components/AddNoteWindow";
import { Navbar } from "../components/Navbar";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";
import { useNotes } from "../hooks/useNotes";
import { useAuthContext } from "../hooks/useAuthContext";

export const HomePage: React.FC = () => {
  const { user } = useAuthContext();
  const {
    notes,
    loading,
    addNote,
    editNote,
    deleteNote,
    updateNotePriorities,
  } = useNotes(user);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [boxesPerRow, setBoxesPerRow] = useState<number>(4);

  // Dynamically adjust grid view based on screen size
  useEffect(() => {
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

  // Handle grid item reordering
  const handleReorder = (sourceId: string, sourceIndex: number, targetIndex: number) => {
    const reorderedNotes = swap(notes, sourceIndex, targetIndex);
    updateNotePriorities(reorderedNotes);
  };

  // Skip loading state if user is not logged in
  if (loading && user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
        <h1 className="text-2xl font-semibold text-white">Loading Notes...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      {/* Navbar is always visible */}
      <Navbar isGridView={isGridView} setIsGridView={setIsGridView} />
      <div className="mx-auto px-4 py-8">
        <GridContextProvider onChange={handleReorder}>
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
