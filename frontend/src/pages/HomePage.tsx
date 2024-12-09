import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { NoteCard } from "../components/NoteCard"
import { AddNoteWindow } from "../components/AddNoteWindow"
import { useNotes } from "../hooks/useNotes"
import { useAuthContext } from "../hooks/useAuthContext"
import { Grid, List, Filter } from 'lucide-react'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  draggable,
  dropTargetForElements,
  monitorForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

const colorOptions = [
  { name: "All", value: "" },
  { name: "Red", value: "red" },
  { name: "Green", value: "green" },
  { name: "Blue", value: "blue" },
  { name: "Yellow", value: "yellow" },
  { name: "Purple", value: "purple" },
  { name: "Pink", value: "pink" },
  { name: "Indigo", value: "indigo" },
]

function getInstanceId() {
  return Symbol('instance-id')
}

const InstanceIdContext = createContext<symbol | null>(null)

type State = 'idle' | 'dragging' | 'over'

const DraggableNote: React.FC<{ note: any; onEdit: any; onDelete: any; isListView: boolean }> = ({ note, onEdit, onDelete, isListView }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>('idle');
  const instanceId = useContext(InstanceIdContext);

  useEffect(() => {
    const el = ref.current;
    if (!el || !instanceId) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: 'note', id: note._id, instanceId }),
        onDragStart: () => setState('dragging'),
        onDrop: () => setState('idle'),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ id: note._id }),
        getIsSticky: () => true,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId &&
          source.data.type === 'note' &&
          source.data.id !== note._id,
        onDragEnter: () => setState('over'),
        onDragLeave: () => setState('idle'),
        onDrop: () => setState('idle'),
      })
    );
  }, [instanceId, note._id]);

  return (
    <div
      ref={ref}
      className={`w-full transition-transform duration-300 ease-in-out
        ${state === 'idle' ? 'hover:scale-105' : ''}
        ${state === 'over' ? 'scale-110 shadow-lg' : ''}
      `}
      style={{
        transform: state === 'dragging' ? 'scale(1.05)' : 'scale(1)',
        opacity: 1,
      }}
    >
      <NoteCard note={note} onEdit={onEdit} onDelete={onDelete} isListView={isListView} />
    </div>
  );
};


export const HomePage: React.FC = () => {
  const { user } = useAuthContext()
  const { notes, setNotes, addNote, editNote, deleteNote, updateNotePriorities } = useNotes(user)
  const [isGridView, setIsGridView] = useState<boolean>(true)
  const [boxesPerRow, setBoxesPerRow] = useState<number>(4)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [instanceId] = useState(getInstanceId)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBoxesPerRow(1)
      } else if (window.innerWidth < 768) {
        setBoxesPerRow(2)
      } else if (window.innerWidth < 1024) {
        setBoxesPerRow(3)
      } else {
        setBoxesPerRow(4)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const filteredNotes = selectedColor ? notes.filter((note) => note.color === selectedColor) : notes

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.instanceId === instanceId,
      onDrop: ({ source, location }) => {
        const destination = location.current.dropTargets[0]
        if (!destination) return

        const sourceId = source.data.id
        const destinationId = destination.data.id

        if (typeof sourceId !== 'string' || typeof destinationId !== 'string') return

        const sourceIndex = filteredNotes.findIndex(note => note._id === sourceId)
        const destinationIndex = filteredNotes.findIndex(note => note._id === destinationId)

        if (sourceIndex === -1 || destinationIndex === -1) return

        const newNotes = [...filteredNotes]
        const [removed] = newNotes.splice(sourceIndex, 1)
        newNotes.splice(destinationIndex, 0, removed)

        setNotes(newNotes)
        updateNotePriorities(newNotes)
      },
    })
  }, [instanceId, filteredNotes, setNotes, updateNotePriorities])

  return (
    <InstanceIdContext.Provider value={instanceId}>
      <div className="min-h-screen pt-6 transition-colors duration-200">
        <div className="mx-auto px-10">
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

          {/* Notes Grid */}
          <div
            className={`grid gap-4 mx-auto ${
              isGridView
                ? `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${boxesPerRow}`
                : "grid-cols-1"
            }`}
          >
            {filteredNotes.map((note) => (
              <DraggableNote
                key={note._id}
                note={note}
                onEdit={editNote}
                onDelete={deleteNote}
                isListView={!isGridView}
              />
            ))}
          </div>

          <AddNoteWindow onAddNote={addNote} />
        </div>
      </div>
    </InstanceIdContext.Provider>
  )
}

