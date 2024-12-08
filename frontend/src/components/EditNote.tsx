import React, { useState } from "react";
import { motion } from "framer-motion";

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
}

const colorConfig: Record<string, { bg: string; inpbg: string; text: string }> = {
  yellow: { bg: "bg-yellow-500", inpbg: "bg-yellow-300", text: "text-gray-900" },
  green: { bg: "bg-green-500", inpbg: "bg-green-300", text: "text-gray-900" },
  blue: { bg: "bg-blue-500", inpbg: "bg-blue-300", text: "text-gray-900" },
  pink: { bg: "bg-pink-500", inpbg: "bg-pink-300", text: "text-gray-900" },
  purple: { bg: "bg-purple-500", inpbg: "bg-purple-300", text: "text-gray-900" },
  indigo: { bg: "bg-indigo-500", inpbg: "bg-indigo-300", text: "text-gray-900" },
  red: { bg: "bg-red-500", inpbg: "bg-red-300", text: "text-gray-900" },
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${bg} rounded-lg p-6 w-full max-w-sm`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
            <div className="flex space-x-2">
              {Object.keys(colorConfig).map((colorKey) => {
                const { bg: circleBg } = colorConfig[colorKey];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setColor(colorKey)}
                    className={`w-8 h-8 rounded-full ${circleBg} border-2 ${color === colorKey ? "border-indigo-900" : "border-gray-50"}`}
                  />
                );
              })}
            </div>
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

