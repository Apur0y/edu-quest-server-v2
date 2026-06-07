import { Router } from "express";
import { BookedController } from "./booked.controller";

const router = Router();

router.get("/booked", BookedController.getAllBooked);
router.get("/booked/:id", BookedController.getBookedById);
router.post("/booked", BookedController.createBooked);

export default router;
