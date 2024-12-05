import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LucideIcon,
  AlertCircle,
  Book,
  Briefcase,
  Calendar,
  Music,
  Star,
  Clock,
  Edit,
  Trash,
} from "lucide-react";
import { EditNote } from "./EditNote";
import { DeleteConfirmation } from "./DeleteConfirmation";

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  isListView?: boolean;
}

const colorConfig: Record<
  string,
  { bg: string; text: string; icon: LucideIcon }
> = {
  yellow: { bg: "bg-yellow-500", text: "text-gray-900", icon: Star },
  green: { bg: "bg-green-500", text: "text-gray-100", icon: Briefcase },
  blue: { bg: "bg-blue-500", text: "text-gray-100", icon: Book },
  pink: { bg: "bg-pink-500", text: "text-gray-100", icon: Music },
  purple: { bg: "bg-purple-500", text: "text-gray-100", icon: Calendar },
  indigo: { bg: "bg-indigo-500", text: "text-gray-100", icon: AlertCircle },
  red: { bg: "bg-red-500", text: "text-gray-100", icon: AlertCircle },
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  isListView = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");

  const {
    bg,
    text,
    icon: Icon,
  } = colorConfig[note.color] || colorConfig.yellow;

  // Format the time dynamically
  const updateFormattedTime = () => {
    const now = new Date();
    const date = new Date(note.createdAt);
    const diffMs = now.getTime() - date.getTime();

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      setFormattedTime(`${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`);
    } else if (diffMinutes < 60) {
      setFormattedTime(`${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`);
    } else if (diffHours < 24) {
      setFormattedTime(`${diffHours} hour${diffHours > 1 ? "s" : ""} ago`);
    } else if (diffDays < 31) {
      setFormattedTime(`${diffDays} day${diffDays > 1 ? "s" : ""} ago`);
    } else {
      setFormattedTime(date.toLocaleDateString());
    }
  };

  // Update the time difference every second
  useEffect(() => {
    updateFormattedTime(); // Initial update
    const interval = setInterval(updateFormattedTime, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [note.createdAt]);

  const handleEdit = (
    id: string,
    updates: { title: string; content: string; color: string }
  ) => {
    onEdit(id, updates);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(note._id);
    setIsDeleting(false);
  };

  return (
    <>
      <motion.div
        className={`${bg} ${
          isListView ? "p-4" : "p-6"
        } rounded-lg shadow-lg w-full h-full overflow-hidden relative group`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute top-0 left-0 right-0 h-6 cursor-move" />
        <div className={`pointer-events-none ${isListView ? "flex items-center" : ""}`}>
          <div
            className={`flex items-center justify-between ${
              isListView ? "w-1/4" : "mb-4"
            }`}
          >
            <h3 className={`text-xl font-bold truncate ${text}`}>{note.title}</h3>
            <Icon className={`w-6 h-6 ${text}`} />
          </div>
          <p
            className={`${text} opacity-80 overflow-hidden ${
              isListView ? "w-1/2 mx-4" : "h-32"
            } text-sm`}
          >
            {note.content}
          </p>
          <div
            className={`${
              isListView ? "w-1/4 text-right" : "mt-4"
            } text-xs ${text} opacity-60 flex items-center justify-between`}
          >
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formattedTime}
            </span>
            <span className="flex items-center">
              <Icon className="w-4 h-4 mr-1" />
              {note.color.charAt(0).toUpperCase() + note.color.slice(1)}
            </span>
          </div>
        </div>
        <div
          className={`drag-handle absolute ${
            isListView
              ? "right-4 top-1/2 transform -translate-y-1/2"
              : "left-0 right-0 bottom-6"
          } flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className={`p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200`}
          >
            <Edit size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleting(true);
            }}
            className={`p-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-200`}
          >
            <Trash size={24} />
          </button>
        </div>
      </motion.div>
      <div className="drag-handle">
        {isEditing && (
          <EditNote
            note={note}
            onEdit={handleEdit}
            onClose={() => setIsEditing(false)}
          />
        )}
        {isDeleting && (
          <DeleteConfirmation
            noteTitle={note.title}
            color={note.color}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleting(false)}
          />
        )}
      </div>
    </>
  );
};
