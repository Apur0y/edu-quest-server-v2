import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

// POST /jwt — issue JWT token
router.post("/jwt", AuthController.issueToken);

export default router;
