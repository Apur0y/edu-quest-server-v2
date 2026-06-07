import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { BookedService } from "./booked.service";

const getAllBooked = catchAsync(async (_req: Request, res: Response) => {
  const result = await BookedService.getAllBooked();
  res.send(result);
});

const getBookedById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookedService.getBookedById(req.params.id as string);
  res.json(result);
});

const createBooked = catchAsync(async (req: Request, res: Response) => {
  const result = await BookedService.createBooked(req.body);
  res.send(result);
});

export const BookedController = { getAllBooked, getBookedById, createBooked };
