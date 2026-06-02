import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";

const userCreate = async (payload: Prisma.UserCreateInput) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
   const user = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      picture: payload.picture,
      role:"STUDENT",
      status:"ACTIVE",
      isVerified: false,
      password: hashedPassword,
    },
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      picture: true,
      isVerified: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
   
  return user;
};

const getAllUsers = async ({
  page,
  limit,
  search,
  isVerified,
  role,
}: {
  page: number;
  limit: number;
  search?: string;
  isVerified?: boolean;
  role?: string;
}) => {
  const where: any = {};

  if (search) {
    where.OR = [
      {
        firstName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (isVerified !== undefined) {
    where.isVerified = isVerified;
  }

  if (role) {
    where.role = role;
  }

  const result = await prisma.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const totalItems = await prisma.user.count({ where });

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

const updateUser = async (id: string, payload: Prisma.UserUpdateInput) => {

 let hashedPassword;
  if (payload.password) {
    hashedPassword = await bcrypt.hash(payload.password as string, 10);
  }
    const user = await prisma.user.update({
    where: { id },
    data: { ...payload, password: hashedPassword },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      picture: true,
      isVerified: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return user;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      picture: true,
      isVerified: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return user;
};

export const userService = {
  userCreate,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
