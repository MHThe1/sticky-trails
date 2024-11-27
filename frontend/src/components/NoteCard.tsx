import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, AlertCircle, Book, Briefcase, Calendar, Music, Star, Clock } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  updatedAt: string;
}

const colorConfig: Record<string, { bg: string; text: string; icon: LucideIcon }> = {
  yellow: { bg: 'bg-yellow-200', text: 'text-yellow-800', icon: Star },
  green: { bg: 'bg-green-200', text: 'text-green-800', icon: Briefcase },
  blue: { bg: 'bg-blue-200', text: 'text-blue-800', icon: Book },
  pink: { bg: 'bg-pink-200', text: 'text-pink-800', icon: Music },
  purple: { bg: 'bg-purple-200', text: 'text-purple-800', icon: Calendar },
  indigo: { bg: 'bg-indigo-200', text: 'text-indigo-800', icon: AlertCircle },
  red: { bg: 'bg-red-200', text: 'text-red-800', icon: AlertCircle },
};

export const NoteCard: React.FC<{ note: Note }> = ({ note }) => {
  const { bg, text, icon: Icon } = colorConfig[note.color] || colorConfig.yellow;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <motion.div
      className={`${bg} p-6 rounded-lg shadow-lg w-full h-full cursor-move overflow-hidden`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold truncate ${text}`}>{note.title}</h3>
        <Icon className={`w-6 h-6 ${text}`} />
      </div>
      <p className={`${text} opacity-80 overflow-hidden h-32 text-sm`}>{note.content}</p>
      <div className={`mt-4 text-xs ${text} opacity-60 flex items-center justify-between`}>
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {formatDate(note.updatedAt)}
        </span>
        <span className="flex items-center">
          <Icon className="w-4 h-4 mr-1" />
          {note.color.charAt(0).toUpperCase() + note.color.slice(1)}
        </span>
      </div>
    </motion.div>
  );
};
