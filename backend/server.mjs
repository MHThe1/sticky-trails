import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.mjs";
import Note from "./models/notes.model.mjs";

dotenv.config();

const app = express();

app.use(express.json()); // parse JSON request bodies

app.get("/", (req, res) => {
  res.send("Server is running on port 5000");
});

app.post("/api/notes", async (req, res) => {
  const note = req.body;

  if (!note.title || !note.content) {
    return res.status(400).json({ message: "Missing title or content" });
  }

  const newNote = new Note(note);

  try {
    await newNote.save();
    res.status(201).json({success: true, data: newNote});
  } catch (error) {
    console.error("Error saving note:", error.message);
    res.status(500).json({success: false, message: "Error saving note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Note.findByIdAndDelete(id);
    res.status(200).json({success: true, message: "Note deleted successfully"});
  } catch (error) {
    console.error("Error deleting note:", error.message);
    res.status(500).json({success: false, message: "Error deleting note" });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("Server is running on port 5000 hit http://localhost:5000/");
});
