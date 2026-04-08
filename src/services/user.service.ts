import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

const prisma = new PrismaClient();

export const findAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      firstname: true,
      lastname: true,
      createdAt: true,
    },
  });
};

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      firstname: true,
      lastname: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const updateUserById = async (id: string, data: any) => {
  // Check if email or username is taken if they are being updated
  if (data.email || data.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { NOT: { id } },
          {
            OR: [
              ...(data.email ? [{ email: data.email }] : []),
              ...(data.username ? [{ username: data.username }] : []),
            ],
          },
        ],
      },
    });

    if (existingUser) {
      throw new AppError('Email or username already in use', 400);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      firstname: true,
      lastname: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const deleteUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  return true;
};
