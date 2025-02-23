import prisma from "@/controllers/prismaClient";
import bcrypt from "bcrypt";
import logger from "@/utils/logger";
import {
  generateAuthTokens,
  verifyToken,
  addToBlacklist,
} from "@/services/tokenService";
import redisClient from "@/config/redis";
import { User } from "@prisma/client";
interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  privacy: boolean;
}

interface GithubUser {
  id: string;
  email?: string;
  name?: string;
  login?: string;
  username?: string;
  displayName?: string;
}

interface GoogleUser {
  id: string;
  email?: string;
  name?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
}

interface LoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const registerUserService = async (
  userData: RegisterUserData
): Promise<Omit<User, "password">> => {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
      select: { id: true }, // Only select id field for efficiency
    });

    if (existingUser) {
      throw new Error("EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error: any) {
    if (error.message === "EMAIL_EXISTS") {
      throw new Error("This email is already registered");
    }
    // Log the error for debugging
    logger.error("Registration error:", error);
    throw new Error(error.message || "Registration failed");
  }
};

export const loginUserService = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!user?.password || !user.email) {
    logger.warn("Login failed: Invalid credentials", { email });
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    logger.warn("Login failed: Invalid password", { email });
    throw new Error("Invalid credentials");
  }

  const tokens = await generateAuthTokens({
    id: user.id,
    email: user.email,
  });

  return {
    tokens,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    },
  };
};

export const getUserProfileService = async (user: any) => {
  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      privacy: true,
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const validateSessionService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new Error("Invalid session");
  }

  return user;
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = await verifyToken(refreshToken, "refresh");
  if (!decoded) {
    throw new Error("Invalid refresh token");
  }

  const storedToken = await redisClient.get(`refresh_${decoded.id}`);
  if (!storedToken || storedToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  return generateAuthTokens({
    id: decoded.id,
    email: decoded.email,
  });
};

export const logoutService = async (
  userId: string,
  accessToken: string,
  refreshToken: string
) => {
  await Promise.all([
    addToBlacklist(accessToken, userId),
    addToBlacklist(refreshToken, userId),
    redisClient.del(`refresh_${userId}`),
  ]);

  logger.info(`User ${userId} logged out successfully`);
};

export const findOrCreateGithubUser = async (
  githubUser: GithubUser
): Promise<{
  user: User;
  tokens: { accessToken: string; refreshToken: string };
}> => {
  try {
    // First try to find user by GitHub ID
    let user = await prisma.user.findUnique({
      where: { githubId: githubUser.id },
    });

    // If no user found by GitHub ID, try email
    if (!user && githubUser.email) {
      user = await prisma.user.findUnique({
        where: { email: githubUser.email },
      });
    }

    // If user exists, update GitHub ID if needed
    if (user) {
      if (!user.githubId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { githubId: githubUser.id },
        });
      }
    } else {
      // Create new user
      const names = githubUser.name?.split(" ") || [githubUser.login];
      user = await prisma.user.create({
        data: {
          githubId: githubUser.id,
          email: githubUser.email,
          firstName: names[0],
          lastName: names.slice(1).join(" ") || null,
          acceptTerms: true, // GitHub OAuth implies acceptance
        },
      });
    }

    // Generate tokens
    const tokens = await generateAuthTokens({
      id: user.id,
      email: user.email || "",
    });

    return { user, tokens };
  } catch (error) {
    logger.error("GitHub user creation error:", error);
    throw new Error("Failed to create user from GitHub");
  }
};

export const findOrCreateGoogleUser = async (
  googleUser: GoogleUser
): Promise<{
  user: User;
  tokens: { accessToken: string; refreshToken: string };
}> => {
  try {
    // First try to find user by Google ID
    let user = await prisma.user.findUnique({
      where: { googleId: googleUser.id },
    });

    // If no user found by Google ID, try email
    if (!user && googleUser.email) {
      user = await prisma.user.findUnique({
        where: { email: googleUser.email },
      });
    }

    // If user exists, update Google ID if needed
    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleUser.id },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          googleId: googleUser.id,
          email: googleUser.email,
          firstName:
            googleUser.firstName ||
            googleUser.displayName?.split(" ")[0] ||
            null,
          lastName:
            googleUser.lastName ||
            googleUser.displayName?.split(" ").slice(1).join(" ") ||
            null,
          acceptTerms: true, // Google OAuth implies acceptance
        },
      });
    }

    // Generate tokens
    const tokens = await generateAuthTokens({
      id: user.id,
      email: user.email || "",
    });

    return { user, tokens };
  } catch (error) {
    logger.error("Google user creation error:", error);
    throw new Error("Failed to create user from Google");
  }
};
