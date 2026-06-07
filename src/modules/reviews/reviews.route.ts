import { Router } from "express";
import { ReviewsController } from "./reviews.controller";

const router = Router();

router.get("/reviews", ReviewsController.getAllReviews);
router.post("/reviews", ReviewsController.createReview);

export default router;
