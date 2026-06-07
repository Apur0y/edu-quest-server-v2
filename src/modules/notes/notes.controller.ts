import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { NotesService } from "./notes.service";

const getAllNotes = catchAsync(async (_req: Request, res: Response) => {
  res.send(await NotesService.getAllNotes());
});

const createNote = catchAsync(async (req: Request, res: Response) => {
  res.send(await NotesService.createNote(req.body));
});

const updateNote = catchAsync(async (req: Request, res: Response) => {
  res.send(await NotesService.updateNote(req.params.id as string, req.body));
});

const deleteNote = catchAsync(async (req: Request, res: Response) => {
  res.send(await NotesService.deleteNote(req.params.id as string));
});

export const NotesController = { getAllNotes, createNote, updateNote, deleteNote };
