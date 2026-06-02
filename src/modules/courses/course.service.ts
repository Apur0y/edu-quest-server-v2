import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createCourse = async (payload: Prisma.CourseCreateInput) => {
  const course = await prisma.course.create({
    data: payload,
    include: {
      tutor: true,
    },
  });
  return course;
};

const getCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      tutor: true,
      enrollments: true,
      reviews: true,
      materials: true,
      categories: true,
    },
  });
  return course;
};

const getAllCourses = async ({
  page,
  limit,
  search,
  tutorId,
  session,
}: {
  page: number;
  limit: number;
  search?: string;
  tutorId?: string;
  session?: string;
}) => {
  const where: any = {};

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (tutorId) {
    where.tutorId = tutorId;
  }

  if (session) {
    where.session = session;
  }

  const result = await prisma.course.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      tutor: true,
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalItems = await prisma.course.count({ where });

  return {
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
    data: result,
  };
};

const updateCourse = async (id: string, payload: Prisma.CourseUpdateInput) => {
  const course = await prisma.course.update({
    where: { id },
    data: payload,
    include: {
      tutor: true,
    },
  });
  return course;
};

const deleteCourse = async (id: string) => {
  const course = await prisma.course.delete({
    where: { id },
  });
  return course;
};

const getCoursesByTutor = async (tutorId: string, page: number = 1, limit: number = 10) => {
  const courses = await prisma.course.findMany({
    where: { tutorId },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalItems = await prisma.course.count({ where: { tutorId } });

  return {
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
    data: courses,
  };
};

const getUpcomingCourses = async (page: number = 1, limit: number = 10) => {
  const now = new Date();

  const courses = await prisma.course.findMany({
    where: {
      registrationStart: {
        gte: now,
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      tutor: true,
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
    orderBy: { registrationStart: "asc" },
  });

  const totalItems = await prisma.course.count({
    where: {
      registrationStart: {
        gte: now,
      },
    },
  });

  return {
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
    data: courses,
  };
};

export const courseService = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCoursesByTutor,
  getUpcomingCourses,
};
