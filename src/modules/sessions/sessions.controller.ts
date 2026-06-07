import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { SessionsService } from "./sessions.service";

/** GET /sessions */
const getAllSessions = catchAsync(async (req: Request, res: Response) => {
  const { filter } = req.query as { filter?: string };
  const result = await SessionsService.getAllSessions(filter);
  res.send(result);
});

/** POST /sessions */
const createSession = catchAsync(async (req: Request, res: Response) => {
  const result = await SessionsService.createSession(req.body);
  res.send(result);
});

/** GET /sessions/:id */
const getSessionById = catchAsync(async (req: Request, res: Response) => {
  const result = await SessionsService.getSessionById(req.params.id as string);
  res.send(result);
});

/** PUT /sessions/:id */
const updateSession = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status, isFree, amount } = req.body;
  const result = await SessionsService.updateSession(id, status, isFree, amount);
  res.send(result);
});

/** DELETE /sessions/:id */
const deleteSession = catchAsync(async (req: Request, res: Response) => {
  const result = await SessionsService.deleteSession(req.params.id as string);
  res.send(result);
});

export const SessionsController = {
  getAllSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
};
