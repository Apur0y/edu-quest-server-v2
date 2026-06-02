import express from "express";
import { userController } from "./user.controller";

const userRoutes = express.Router();

// Create a new user
userRoutes.post("/", userController.createUser);

// Get all users with filters
userRoutes.get("/", userController.getAllUsers);

// Get user by ID
userRoutes.get("/:id", userController.getUserById);

// Update user by ID
userRoutes.patch("/:id", userController.updateUser);

// Delete user by ID
userRoutes.delete("/:id", userController.deleteUser);

export default userRoutes;