import mongoose from "mongoose";
import Note from '../models/notes.model.mjs';

export const getNotes = async (req, res) => {
    const user_id = req.user._id;
    try {
      const notes = await Note.find({user_id});
      res.status(200).json({success: true, data: notes});
    } catch (error) {
      console.error("Error fetching notes:", error.message);
      res.status(500).json({ success: false, message: "Error fetching notes" });
    }
};

export const postNote = async (req, res) => {
    const note = req.body;
  
    if (!note.title || !note.content) {
      return res.status(400).json({ message: "Missing title or content" });
    }
  
    const newNote = new Note(note);
  
    try {
      const user_id = req.user._id;
      const newNote = new Note({
        ...note, // Spread the request body
        user_id, // Add the user_id explicitly
      });
      await newNote.save();
      res.status(201).json({success: true, data: newNote});
    } catch (error) {
      console.error("Error saving note:", error.message);
      res.status(500).json({success: false, message: "Error saving note" });
    }
};

export const updateNote = async (req, res) => {
    const { id } = req.params;
  
    const note = req.body;
  
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({success: false, message: "Invalid ID" });
    }
  
    try {
      const updatedNote = await Note.findByIdAndUpdate(id, note, {new: true});
      res.status(200).json({success: true, data: updatedNote});
    } catch (error) {
      console.error("Error updating note:", error.message);
      res.status(500).json({success: false, message: "Error updating note" });
    }
};

export const deleteNote = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success: false, message: "Invalid ID" });
      }
      
    try {
      await Note.findByIdAndDelete(id);
      res.status(200).json({success: true, message: "Note deleted successfully"});
    } catch (error) {
      console.error("Error deleting note:", error.message);
      res.status(500).json({success: false, message: "Error deleting note" });
    }
};
