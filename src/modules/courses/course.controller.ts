import { Request, Response } from "express";
import { courseService } from "./course.service";

const createCourse = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      registrationStart,
      registrationEnd,
      classStart,
      classEnd,
      session,
      registrationFee,
      tutorId,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !registrationStart ||
      !registrationEnd ||
      !classStart ||
      !classEnd ||
      !session ||
      registrationFee === undefined ||
      !tutorId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate dates
    const regStart = new Date(registrationStart);
    const regEnd = new Date(registrationEnd);
    const classStartDate = new Date(classStart);
    const classEndDate = new Date(classEnd);

    if (regEnd <= regStart) {
      return res.status(400).json({
        success: false,
        message: "Registration end date must be after registration start date",
      });
    }

    if (classEndDate <= classStartDate) {
      return res.status(400).json({
        success: false,
        message: "Class end date must be after class start date",
      });
    }

    if (registrationFee < 0) {
      return res.status(400).json({
        success: false,
        message: "Registration fee cannot be negative",
      });
    }

    const course = await courseService.createCourse(req.body);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

const getCourseById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving course",
      error: error.message,
    });
  }
};

const getAllCourses = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search ? (req.query.search as string) : undefined;
    const tutorId = req.query.tutorId ? (req.query.tutorId as string) : undefined;
    const session = req.query.session ? (req.query.session as string) : undefined;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    const result = await courseService.getAllCourses({
      page,
      limit,
      search,
      tutorId,
      session,
    });

    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving courses",
      error: error.message,
    });
  }
};

const updateCourse = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    // Validate dates if provided
    if (req.body.registrationStart && req.body.registrationEnd) {
      if (new Date(req.body.registrationEnd) <= new Date(req.body.registrationStart)) {
        return res.status(400).json({
          success: false,
          message: "Registration end date must be after registration start date",
        });
      }
    }

    if (req.body.classStart && req.body.classEnd) {
      if (new Date(req.body.classEnd) <= new Date(req.body.classStart)) {
        return res.status(400).json({
          success: false,
          message: "Class end date must be after class start date",
        });
      }
    }

    if (req.body.registrationFee !== undefined && req.body.registrationFee < 0) {
      return res.status(400).json({
        success: false,
        message: "Registration fee cannot be negative",
      });
    }

    const course = await courseService.updateCourse(id, req.body);

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (error.code === "P2016") {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const course = await courseService.deleteCourse(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};

const getCoursesByTutor = async (req: Request, res: Response) => {
  try {
    const tutorId = Array.isArray(req.params.tutorId) ? req.params.tutorId[0] : req.params.tutorId;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    const result = await courseService.getCoursesByTutor(tutorId, page, limit);

    res.status(200).json({
      success: true,
      message: "Tutor courses retrieved successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving tutor courses",
      error: error.message,
    });
  }
};

const getUpcomingCourses = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    const result = await courseService.getUpcomingCourses(page, limit);

    res.status(200).json({
      success: true,
      message: "Upcoming courses retrieved successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving upcoming courses",
      error: error.message,
    });
  }
};

export const courseController = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCoursesByTutor,
  getUpcomingCourses,
};
