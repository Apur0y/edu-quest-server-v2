import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

const getAllMaterials = async () => {
  return prisma.material.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * POST /materials — matches original multipart/form-data fields:
 * title, sessionId, tutorEmail, link
 */
const createMaterial = async (data: {
  title: string;
  sessionId?: string;
  tutorEmail?: string;
  link?: string;
}) => {
  const { title, sessionId, tutorEmail, link } = data;

  // Try to resolve tutor by email
  let tutorId: string | undefined;
  if (tutorEmail) {
    const tutor = await prisma.user.findUnique({ where: { email: tutorEmail } });
    tutorId = tutor?.id;
  }

  // Try to resolve course by sessionId
  let courseId: string | undefined;
  if (sessionId) {
    const course = await prisma.course.findFirst({ where: { id: sessionId } });
    courseId = course?.id;
  }

  return prisma.material.create({
    data: {
      title,
      sessionId,
      tutorEmail,
      link,
      tutorId,
      courseId,
    },
  });
};

const deleteMaterial = async (id: string) => {
  const result = await prisma.material.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  if (result.count === 0) throw new ApiError(404, "Material not found");
  return { deletedCount: result.count, acknowledged: true };
};

export const MaterialsService = {
  getAllMaterials,
  createMaterial,
  deleteMaterial,
};
