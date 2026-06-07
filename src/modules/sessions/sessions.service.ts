import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

type SessionStatus = "pending" | "approved" | "rejected";

/**
 * GET /sessions?filter=status1,status2
 * Original: uses $nin to EXCLUDE the listed statuses.
 */
const getAllSessions = async (filter?: string) => {
  let whereClause: object = { deletedAt: null };

  if (filter) {
    const excludedStatuses = filter.split(",").map((s) => s.trim()) as SessionStatus[];
    whereClause = {
      deletedAt: null,
      status: { notIn: excludedStatuses },
    };
  }

  return prisma.course.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });
};

const createSession = async (data: Record<string, unknown>) => {
  const {
    title,
    description,
    registrationFee,
    session,
    status,
    tutorId,
    registrationStart,
    registrationEnd,
    classStart,
    classEnd,
    ...rest
  } = data;

  return prisma.course.create({
    data: {
      title: (title as string) || "Untitled",
      description: description as string | undefined,
      registrationFee: (registrationFee as number) || 0,
      session: session as string | undefined,
      status: (status as SessionStatus) || "pending",
      tutorId: tutorId as string | undefined,
      registrationStart: registrationStart
        ? new Date(registrationStart as string)
        : undefined,
      registrationEnd: registrationEnd
        ? new Date(registrationEnd as string)
        : undefined,
      classStart: classStart ? new Date(classStart as string) : undefined,
      classEnd: classEnd ? new Date(classEnd as string) : undefined,
    },
  });
};

const getSessionById = async (id: string) => {
  const session = await prisma.course.findFirst({
    where: { id, deletedAt: null },
  });
  if (!session) throw new ApiError(404, "Session not found");
  return session;
};

/**
 * PUT /sessions/:id
 * Original: updates { status, registrationFee }
 * isFree=true → fee=0, otherwise fee=amount
 */
const updateSession = async (
  id: string,
  status: string,
  isFree: boolean,
  amount?: number
) => {
  const registrationFee = isFree ? 0 : (amount ?? 0);
  const updateFields = { status: status as SessionStatus, registrationFee };

  const result = await prisma.course.updateMany({
    where: { id, deletedAt: null },
    data: updateFields,
  });

  if (result.count === 0) {
    throw new ApiError(404, "Session not found");
  }

  return {
    message: "Session updated successfully",
    updatedFields: updateFields,
  };
};

const deleteSession = async (id: string) => {
  const result = await prisma.course.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  if (result.count === 0) {
    throw new ApiError(404, "Session not found");
  }

  // Return mongo-like result for API compatibility
  return { deletedCount: 1, acknowledged: true };
};

export const SessionsService = {
  getAllSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
};
