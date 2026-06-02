import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const userCreate = async (payload: any) => {
  const user = await prisma.user.create({
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      status: true,
    },
  });
  return user;
};

const getAllUsers = async ({
  page,
  limit,
  search,
  isVerified,
}: {
  page: number;
  limit: number;
  search: string;
    isVerified?: boolean;
}) => {
  const where: any = {
    AND: [
     search && { OR: [
        {
          name: {
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
      ]},
      {

          isVerified: isVerified,
      }
    ],
  };

  const result = await prisma.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalItem = await prisma.user.count({
    where,
    skip: (page - 1) * limit,
    take: limit,
  });
  return {
    pagination: {
      page,
      limit,
      totalItem,
      totalPage: Math.ceil(totalItem / limit),
    },
    data: result,
  };
};

export const userService = { userCreate, getAllUsers };
