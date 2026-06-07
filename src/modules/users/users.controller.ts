import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UsersService } from "./users.service";

type UserRole = "student" | "tutor" | "admin";

/** GET /users */
const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await UsersService.getAllUsers();
  res.send(result);
});

/** POST /users */
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UsersService.createUser(req.body);
  res.send(result);
});

/** PUT /users/:id */
const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { role } = req.body as { role: UserRole };
  const result = await UsersService.updateUserRole(id, role);
  res.status(200).json(result);
});

export const UsersController = { getAllUsers, createUser, updateUserRole };
