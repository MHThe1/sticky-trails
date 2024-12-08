import React, { useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import { AddNoteWindow } from "../components/AddNoteWindow";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";
import { useNotes } from "../hooks/useNotes";
import { useAuthContext } from "../hooks/useAuthContext";
import { Grid, List, Filter } from "lucide-react";

const colorOptions = [
  { name: "All", value: "" },
  { name: "Red", value: "red" },
  { name: "Green", value: "green" },
  { name: "Blue", value: "blue" },
  { name: "Yellow", value: "yellow" },
  { name: "Purple", value: "purple" },
  { name: "Pink", value: "pink" },
  { name: "Indigo", value: "indigo" },
];

export const HomePage: React.FC = () => {
  const { user } = useAuthContext();
  const {
    notes,
    setNotes,
    addNote,
    editNote,
    deleteNote,
    updateNotePriorities,
  } = useNotes(user);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [boxesPerRow, setBoxesPerRow] = useState<number>(4);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const handleReorder = (
    sourceId: string,
    sourceIndex: number,
    targetIndex: number
  ) => {
    const nextNotes = swap(notes, sourceIndex, targetIndex);
    setNotes(nextNotes);
    updateNotePriorities(nextNotes);
    console.log(sourceId)
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBoxesPerRow(1);
      } else if (window.innerWidth < 768) {
        setBoxesPerRow(2);
      } else if (window.innerWidth < 1024) {
        setBoxesPerRow(3);
      } else {
        setBoxesPerRow(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredNotes = selectedColor
    ? notes.filter((note) => note.color === selectedColor)
    : notes;

  return (
    <div className="min-h-screen pt-6 transition-colors duration-200">
      <div className="mx-auto px-4">
        {/* Filter and Grid/List View Section */}
        <div className="flex justify-between items-center mb-6 mx-auto max-w-5xl">
          {/* Filter Section */}
          <div className="flex items-center space-x-2">
            <Filter size={24} className="text-gray-600 dark:text-gray-400" />
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          {/* Grid/List View Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-2 rounded ${
                isGridView
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-2 rounded ${
                !isGridView
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <GridContextProvider onChange={handleReorder}>
          <GridDropZone
            id="notes"
            boxesPerRow={isGridView ? boxesPerRow : 1}
            rowHeight={isGridView ? 280 : 100}
            style={{
              height: `${Math.max(
                280,
                (isGridView ? 280 : 100) *
                  Math.ceil(filteredNotes.length / boxesPerRow)
              )}px`,
            }}
          >
            {filteredNotes.map((note) => (
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
