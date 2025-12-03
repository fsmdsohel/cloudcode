import prisma from "@/controllers/prismaClient";
import { UpdateUserDto, UserResponseDto } from "@/dtos/user.dto";
import logger from "@/utils/logger";
import bcrypt from "bcrypt";
import { User, UserActivity } from "@prisma/client";

export const getUserProfileService = async (
  userId: string
): Promise<UserResponseDto> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      privacy: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserProfileService = async (
  userId: string,
  data: UpdateUserDto
): Promise<UserResponseDto> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      privacy: true,
      createdAt: true,
    },
  });

  return user;
};

export const deleteUserProfileService = async (
  userId: string
): Promise<void> => {
  await prisma.user.delete({
    where: { id: userId },
  });

  logger.info(`User profile deleted: ${userId}`);
};

export const getAllUsersService = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
    },
  });
};

export const updateUserByIdService = async (
  userId: string,
  data: UpdateUserDto
): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const deleteUserByIdService = async (userId: string): Promise<User> => {
  return prisma.user.delete({ where: { id: userId } });
};

export const updateUserPasswordService = async (
  userId: string,
  data: { currentPassword: string; newPassword: string }
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user || !user.password) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  logger.info(`Password updated for user: ${userId}`);
};

export const updateUserPreferencesService = async (
  userId: string,
  preferences: Record<string, any>
): Promise<Record<string, any>> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { preferences },
    select: { preferences: true },
  });

  logger.info(`Preferences updated for user: ${userId}`);
  return user.preferences as Record<string, any>;
};

export const getUserActivityService = async (
  userId: string
): Promise<UserActivity[]> => {
  const activities = await prisma.userActivity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      metadata: true,
      createdAt: true,
      userId: true,
    },
  });

  return activities;
};
