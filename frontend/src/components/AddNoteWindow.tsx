import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface AddNoteWindowProps {
  onAddNote: (note: { title: string; content: string; color: string }) => void;
}

const colorConfig: Record<string, { bg: string; inpbg: string; text: string }> =
  {
    yellow: {
      bg: "bg-yellow-400",
      inpbg: "bg-yellow-300",
      text: "text-gray-900",
    },
    green: { bg: "bg-green-400", inpbg: "bg-green-300", text: "text-gray-900" },
    blue: { bg: "bg-blue-400", inpbg: "bg-blue-300", text: "text-gray-100" },
    pink: { bg: "bg-pink-400", inpbg: "bg-pink-300", text: "text-gray-100" },
    purple: {
      bg: "bg-purple-400",
      inpbg: "bg-purple-300",
      text: "text-gray-100",
    },
    indigo: {
      bg: "bg-indigo-400",
      inpbg: "bg-indigo-300",
      text: "text-gray-100",
    },
    red: { bg: "bg-red-400", inpbg: "bg-red-300", text: "text-gray-100" },
  };

export const AddNoteWindow: React.FC<AddNoteWindowProps> = ({ onAddNote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNote({ title, content, color });
    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setColor("yellow");
  };

  const { bg, inpbg, text } = colorConfig[color];

  return (
    <>
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 bg-yellow-400 rounded-lg shadow-lg cursor-pointer overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500" />
        <div className="relative w-full h-full flex items-center justify-center">
          <Plus size={32} className="text-yellow-900" />
        </div>
      </motion.div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`${bg} p-6 rounded-lg w-96 shadow-xl`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${text}`}>Add New Note</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 mb-4 border rounded ${inpbg} ${text} placeholder-gray-600`}
                required
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full p-2 mb-4 border rounded ${inpbg} ${text} placeholder-gray-600 h-32`}
                required
              />
              <div className="flex space-x-2 pb-4">
                {Object.keys(colorConfig).map((colorKey) => {
                  const { bg: circleBg } = colorConfig[colorKey];
                  return (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => setColor(colorKey)}
                      className={`w-8 h-8 rounded-full ${circleBg} border-2 ${
                        color === colorKey
                          ? "border-indigo-900"
                          : "border-gray-50"
                      }`} // Added a more visible stroke
                    />
                  );
                })}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`mr-2 px-4 py-2 ${text} hover:bg-red-700 hover:rounded-lg hover:text-white`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-red-700 text-white rounded hover:${bg}-600 hover:scale-105 translate-x-1`}
                >
                  Add Note
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};
