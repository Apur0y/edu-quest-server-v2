import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

const getAllNotes = async () => {
  return prisma.studentNote.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

const createNote = async (data: {
  studentId?: string;
  title: string;
  description: string;
  [key: string]: unknown;
}) => {
  const { title, description, studentId } = data;
  return prisma.studentNote.create({
    data: {
      title,
      description,
      studentId: studentId || "00000000-0000-0000-0000-000000000000",
    },
  });
};

const updateNote = async (
  id: string,
  data: { title: string; description: string }
) => {
  const result = await prisma.studentNote.updateMany({
    where: { id, deletedAt: null },
    data: { title: data.title, description: data.description },
  });

  if (result.count === 0) throw new ApiError(404, "Note not found");
  // Return mongo-like UpdateResult for API compatibility
  return { modifiedCount: result.count, matchedCount: result.count, acknowledged: true };
};

const deleteNote = async (id: string) => {
  const result = await prisma.studentNote.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  if (result.count === 0) throw new ApiError(404, "Note not found");
  return { deletedCount: result.count, acknowledged: true };
};

export const NotesService = { getAllNotes, createNote, updateNote, deleteNote };
