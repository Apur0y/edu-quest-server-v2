import prisma from "../../config/db";

const getAllReviews = async () => {
  return prisma.review.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

const createReview = async (data: Record<string, unknown>) => {
  const { title, description, rating, courseId, userId } = data;
  return prisma.review.create({
    data: {
      title: title as string | undefined,
      description: description as string | undefined,
      rating: (rating as number) || 5,
      courseId: courseId as string | undefined,
      userId: userId as string | undefined,
    },
  });
};

export const ReviewsService = { getAllReviews, createReview };
