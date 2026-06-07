import { Router } from "express";
import { UsersController } from "./users.controller";
import validate from "../../middlewares/validate.middleware";
import { updateUserRoleSchema } from "./users.validation";

const router = Router();

router.get("/users", UsersController.getAllUsers);
router.post("/users", UsersController.createUser);
router.put(
  "/users/:id",
  validate(updateUserRoleSchema),
  UsersController.updateUserRole
);

export default router;
