import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface DeleteConfirmationProps {
  noteTitle: string;
  color: string;
  onConfirm: () => void;
  onCancel: () => void;
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

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  noteTitle,
  color,
  onConfirm,
  onCancel,
}) => {
  const { bg, text } = colorConfig[color] || colorConfig["yellow"]; // Default to yellow if color not provided

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
          <h2 className={`text-2xl font-bold ${text}`}>Delete Note</h2>
          <button onClick={onCancel} className={`text-gray-500 hover:text-gray-700`}>
            <X size={24} />
          </button>
        </div>
        <p className={`mb-4 ${text}`}>
          Are you sure you want to delete the note <strong>"{noteTitle}"</strong>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-900 bg-gray-400 bg-opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
