import express from "express";
import { deleteNote, getNotes, postNote, updateNote } from "../controllers/note.controller.mjs";

const router = express.Router();

router.get("/", getNotes);

router.post("/", postNote);

router.put("/:id", updateNote)

router.delete("/:id", deleteNote);

export default router;