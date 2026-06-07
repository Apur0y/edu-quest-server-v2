import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

const getAllBooked = async () => {
  return prisma.enrollment.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

const getBookedById = async (id: string) => {
  const booked = await prisma.enrollment.findFirst({
    where: { id, deletedAt: null },
  });

  if (!booked) throw new ApiError(404, "Data not found");
  return booked;
};

/**
 * POST /booked
 * Original: accepts any body from frontend (no strict schema).
 * We store all relevant flat fields from the original booked collection.
 */
const createBooked = async (data: Record<string, unknown>) => {
  const {
    userId,
    courseId,
    sessionTitle,
    tutorName,
    tutorEmail,
    studentEmail,
    studentName,
    registrationFee,
    sessionImage,
    sessionId,
  } = data;

  // Resolve user by email if userId not provided
  let resolvedUserId = userId as string | undefined;
  if (!resolvedUserId && studentEmail) {
    const user = await prisma.user.findUnique({
      where: { email: studentEmail as string },
    });
    resolvedUserId = user?.id;
  }

  // Resolve course if courseId not provided
  let resolvedCourseId = courseId as string | undefined;
  if (!resolvedCourseId && sessionId) {
    const course = await prisma.course.findFirst({
      where: { id: sessionId as string },
    });
    resolvedCourseId = course?.id;
  }

  // Fallback: create enrollment without FK if IDs can't be resolved
  if (!resolvedUserId || !resolvedCourseId) {
    // Store as a loose enrollment without FK constraints (legacy data support)
    return prisma.enrollment.create({
      data: {
        userId: resolvedUserId || "00000000-0000-0000-0000-000000000000",
        courseId: resolvedCourseId || "00000000-0000-0000-0000-000000000000",
        sessionTitle: sessionTitle as string | undefined,
        tutorName: tutorName as string | undefined,
        tutorEmail: tutorEmail as string | undefined,
        studentEmail: studentEmail as string | undefined,
        studentName: studentName as string | undefined,
        registrationFee: registrationFee as number | undefined,
        sessionImage: sessionImage as string | undefined,
        sessionId: sessionId as string | undefined,
      },
    });
  }

  return prisma.enrollment.create({
    data: {
      userId: resolvedUserId,
      courseId: resolvedCourseId,
      sessionTitle: sessionTitle as string | undefined,
      tutorName: tutorName as string | undefined,
      tutorEmail: tutorEmail as string | undefined,
      studentEmail: studentEmail as string | undefined,
      studentName: studentName as string | undefined,
      registrationFee: registrationFee as number | undefined,
      sessionImage: sessionImage as string | undefined,
      sessionId: sessionId as string | undefined,
    },
  });
};

export const BookedService = { getAllBooked, getBookedById, createBooked };
