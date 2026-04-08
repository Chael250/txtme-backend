import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/appError.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.utils.js';

const prisma = new PrismaClient();

export const registerUser = async (data: any) => {
  const { email, username, password, firstname, lastname } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      firstname,
      lastname,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstname: true,
      lastname: true,
    },
  });

  return newUser;
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    accessToken,
    refreshToken,
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      firstname: true,
      lastname: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
