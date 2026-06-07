import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

type UserRole = "student" | "tutor" | "admin";

const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Create a user. Mirrors original behavior — no duplicate check,
 * just insert. Frontend handles duplicate prevention via Firebase.
 */
const createUser = async (data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  picture?: string;
  role?: UserRole;
  [key: string]: unknown;
}) => {
  const { email, firstName, lastName, phone, picture, role } = data;

  // Upsert to handle re-registration from Firebase auth
  return prisma.user.upsert({
    where: { email },
    update: {
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      phone: phone ?? undefined,
      picture: picture ?? undefined,
    },
    create: {
      email,
      firstName,
      lastName,
      phone,
      picture,
      role: role ?? "student",
    },
    select:{
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      picture: true,
      role: true,
    }
  });
};

const updateUserRole = async (id: string, role: UserRole) => {
  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const result = await prisma.user.updateMany({
    where: { id, deletedAt: null },
    data: { role },
  });

  if (result.count === 0) {
    throw new ApiError(404, "User not found");
  }

  return { message: "User role updated successfully" };
};

export const UsersService = { getAllUsers, createUser, updateUserRole };
