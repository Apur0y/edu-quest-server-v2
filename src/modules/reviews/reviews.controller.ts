import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ReviewsService } from "./reviews.service";

const getAllReviews = catchAsync(async (_req: Request, res: Response) => {
  res.send(await ReviewsService.getAllReviews());
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  res.send(await ReviewsService.createReview(req.body));
});

export const ReviewsController = { getAllReviews, createReview };
