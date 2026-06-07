import { Router } from "express";
import { NotesController } from "./notes.controller";

const router = Router();

router.get("/notes", NotesController.getAllNotes);
router.post("/notes", NotesController.createNote);
router.put("/notes/:id", NotesController.updateNote);
router.delete("/notes/:id", NotesController.deleteNote);

export default router;
