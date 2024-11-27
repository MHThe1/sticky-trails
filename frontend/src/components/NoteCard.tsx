import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  type LucideIcon,
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

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    bg,
    text,
    icon: Icon,
  } = colorConfig[note.color] || colorConfig.yellow;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleEdit = (
    id: string,
    updates: { title: string; content: string; color: string }
  ) => {
    onEdit(id, updates);
    setIsEditing(false);
  };

  return (
    <>
      <motion.div
        className={`${bg} p-6 rounded-lg shadow-lg w-full h-full cursor-move overflow-hidden relative group`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold truncate ${text}`}>{note.title}</h3>
          <Icon className={`w-6 h-6 ${text}`} />
        </div>
        <p className={`${text} opacity-80 overflow-hidden h-32 text-sm`}>
          {note.content}
        </p>
        <div
          className={`mt-4 text-xs ${text} opacity-60 flex items-center justify-between`}
        >
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(note.updatedAt)}
          </span>
          <span className="flex items-center">
            <Icon className="w-4 h-4 mr-1" />
            {note.color.charAt(0).toUpperCase() + note.color.slice(1)}
          </span>
        </div>
        <div className="absolute left-0 right-0 bottom-6 flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsEditing(true)}
            className={`p-2 ${text} bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200`}
          >
            <Edit size={24} />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className={`p-2 ${text} bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-200`}
          >
            <Trash size={24} />
          </button>
        </div>
      </motion.div>
      {/* {isEditing && (
        <EditNote
          note={note}
          onEdit={handleEdit}
          onClose={() => setIsEditing(false)}
        />
      )} */}
    </>
  );
};
