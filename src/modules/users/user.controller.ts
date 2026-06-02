import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Email, firstName, lastName, and password are required",
      });
    }

    const user = await userService.userCreate(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search ? (req.query.search as string) : undefined;
    const isVerified = req.query.isVerified ? (req.query.isVerified as string) === "true" : undefined;
    const role = req.query.role ? (req.query.role as string) : undefined;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    const result = await userService.getAllUsers({ page, limit, search, isVerified, role });
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
 

    const user = await userService.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await userService.deleteUser(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

export const userController = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};