import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
}

const colorConfig: Record<string, { bg: string; inpbg: string; text: string }> = {
    yellow: { bg: "bg-yellow-400", inpbg: "bg-yellow-300", text: "text-gray-900" },
    green: { bg: "bg-green-400", inpbg: "bg-green-300", text: "text-gray-900" },
    blue: { bg: "bg-blue-400", inpbg: "bg-blue-300", text: "text-gray-900" },
    pink: { bg: "bg-pink-400", inpbg: "bg-pink-300", text: "text-gray-900" },
    purple: { bg: "bg-purple-400", inpbg: "bg-purple-300", text: "text-gray-900" },
    indigo: { bg: "bg-indigo-400", inpbg: "bg-indigo-300", text: "text-gray-900" },
    red: { bg: "bg-red-400", inpbg: "bg-red-300", text: "text-gray-900" },
  };

interface EditNoteProps {
  note: Note;
  onEdit: (id: string, updates: { title: string; content: string; color: string }) => void;
  onClose: () => void;
}

export const EditNote: React.FC<EditNoteProps> = ({ note, onEdit, onClose }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(note._id, { title, content, color });
  };

  const { bg, inpbg, text } = colorConfig[color];

  return (
    <motion.div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${bg} rounded-lg p-8 w-full max-w-md`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Note</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full rounded-md ${inpbg} p-1 ${text} border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`mt-1 block w-full rounded-md ${inpbg} p-1 ${text} border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <select
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className={`mt-1 block w-full rounded-md ${inpbg} p-1 ${text} border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
            >
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="pink">Pink</option>
              <option value="purple">Purple</option>
              <option value="indigo">Indigo</option>
              <option value="red">Red</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

