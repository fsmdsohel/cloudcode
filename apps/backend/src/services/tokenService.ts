import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "@/config/env";
import {
  TokenPayload,
  AuthTokens,
  TokenType,
  UserForToken,
} from "../types/auth";
import redisClient from "@/config/redis";
import logger from "@/utils/logger";

export const generateAuthTokens = async (
  user: UserForToken
): Promise<AuthTokens> => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
  };

  // Generate fresh tokens
  const accessToken = generateToken(payload, "access");
  const refreshToken = generateToken(payload, "refresh");

  // Store new refresh token
  await storeRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
};

export const generateToken = (
  payload: TokenPayload,
  type: TokenType
): string => {
  const secret =
    type === "access" ? config.jwt.secret : config.jwt.refreshSecret;
  const expiresIn: number =
    type === "access"
      ? parseInt(config.jwt.expiresIn)
      : parseInt(config.jwt.refreshExpiresIn);
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async (
  token: string,
  type: TokenType
): Promise<TokenPayload> => {
  try {
    // Check blacklist first
    if (await isBlacklisted(token)) {
      throw new Error("Token is blacklisted");
    }

    const secret =
      type === "access" ? config.jwt.secret : config.jwt.refreshSecret;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    return decoded;
  } catch (error) {
    throw { code: "TOKEN_INVALID", message: "Invalid token" };
  }
};

export const storeRefreshToken = async (
  userId: string,
  token: string
): Promise<void> => {
  await redisClient.set(`refresh_${userId}`, token, {
    EX: 30 * 24 * 60 * 60, // 30 days
  });
  logger.info(`Stored refresh token for user ${userId}`);
};

export const validateRefreshToken = async (
  userId: string,
  token: string
): Promise<boolean> => {
  const storedToken = await redisClient.get(`refresh_${userId}`);
  return storedToken === token;
};

export const invalidateTokens = async (userId: string): Promise<void> => {
  await redisClient.del(`refresh_${userId}`);
  logger.info(`Invalidated tokens for user ${userId}`);
};

export const addToBlacklist = async (token: string, userId: string) => {
  await redisClient.set(`bl_${token}`, userId, {
    EX: 30 * 24 * 60 * 60, // 30 days
  });
  logger.info(`Token blacklisted for user ${userId}`);
};

export const isBlacklisted = async (token: string): Promise<boolean> => {
  const exists = await redisClient.exists(`bl_${token}`);
  return exists === 1;
};
