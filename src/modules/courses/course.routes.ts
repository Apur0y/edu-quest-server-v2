import express from "express";
import { courseController } from "./course.controller";

const courseRoutes = express.Router();

// Create a new course
courseRoutes.post("/", courseController.createCourse);

// Get all courses with filters
courseRoutes.get("/", courseController.getAllCourses);

// Get upcoming courses
courseRoutes.get("/upcoming", courseController.getUpcomingCourses);

// Get courses by specific tutor
courseRoutes.get("/tutor/:tutorId", courseController.getCoursesByTutor);

// Get course by ID
courseRoutes.get("/:id", courseController.getCourseById);

// Update course by ID
courseRoutes.patch("/:id", courseController.updateCourse);

// Delete course by ID
courseRoutes.delete("/:id", courseController.deleteCourse);

export default courseRoutes;
