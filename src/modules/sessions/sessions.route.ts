import { Router } from "express";
import { SessionsController } from "./sessions.controller";
import validate from "../../middlewares/validate.middleware";
import { updateSessionSchema } from "./sessions.validation";

const router = Router();

router.get("/sessions", SessionsController.getAllSessions);
router.post("/sessions", SessionsController.createSession);
router.get("/sessions/:id", SessionsController.getSessionById);
router.put(
  "/sessions/:id",
  validate(updateSessionSchema),
  SessionsController.updateSession
);
router.delete("/sessions/:id", SessionsController.deleteSession);

export default router;
