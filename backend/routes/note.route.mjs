import express from "express";
import { deleteNote, getNotes, postNote, updateNote } from "../controllers/note.controller.mjs";
import { requireAuth } from "../middleware/requireAuth.mjs";

const router = express.Router();

// require authentication
router.use(requireAuth);

router.get("/", getNotes);

router.post("/", postNote);

router.put("/:id", updateNote)

router.delete("/:id", deleteNote);

export default router;