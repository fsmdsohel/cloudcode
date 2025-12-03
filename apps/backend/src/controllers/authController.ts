import { Request, Response, CookieOptions } from "express";
import {
  registerUserService,
  loginUserService,
  validateSessionService,
  refreshTokenService,
  logoutService,
  findOrCreateGithubUser,
  findOrCreateGoogleUser,
} from "@/services/authService";
import logger from "@/utils/logger";
import { config } from "@/config/env";

const ACCESS_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/",
  maxAge: config.jwt.expiresInMilliseconds,
};

const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  ...ACCESS_COOKIE_OPTIONS,
  maxAge: config.jwt.refreshExpiresInMilliseconds,
};

// First, let's create separate options for clearing cookies
const CLEAR_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/",
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({
      status: "success",
      message: "Registration successful",
      user,
    });
  } catch (error: any) {
    logger.error("Registration error:", error);

    // Handle email already exists
    if (error.message === "This email is already registered") {
      res.status(409).json({
        status: "error",
        message: error.message,
        code: "EMAIL_EXISTS",
        suggestion: "Please try logging in or use a different email address",
        details: {
          email: "This email is already registered",
        },
      });
      return;
    }

    // Handle validation errors
    if (error.message?.includes("Validation")) {
      res.status(400).json({
        status: "error",
        message: error.message,
        code: "VALIDATION_ERROR",
      });
      return;
    }

    // Generic error response
    res.status(400).json({
      status: "error",
      message: "Registration failed. Please try again.",
      code: "REGISTRATION_FAILED",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { tokens, user } = await loginUserService(email, password);

    // Set httpOnly cookies with correct expiration
    res.cookie("accessToken", tokens.accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (error: any) {
    logger.error("Login error:", error);

    if (error.message === "Invalid credentials") {
      res.status(401).json({
        status: "error",
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
        suggestion: "Please check your credentials and try again",
      });
      return;
    }

    res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // Try to invalidate tokens if they exist, but don't fail if they're invalid
    if (accessToken || refreshToken) {
      try {
        await logoutService(
          req.user?.id || "unknown",
          accessToken,
          refreshToken
        );
      } catch (error) {
        // Log the error but continue with logout
        logger.warn("Failed to invalidate tokens during logout:", error);
      }
    }

    // Clear cookies without maxAge option
    res.clearCookie("accessToken", CLEAR_COOKIE_OPTIONS);
    res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

    res.json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error: any) {
    logger.error("Logout error:", error);
    // Even if there's an error, clear the cookies
    res.clearCookie("accessToken", CLEAR_COOKIE_OPTIONS);
    res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

    res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const validateSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await validateSessionService(req.user!.id);

    res.json({
      status: "success",
      message: "Session is valid",
      user,
    });
  } catch (error: any) {
    logger.error("Session validation error:", error);

    if (error.code) {
      const status = error.code === "INVALID_SESSION" ? 401 : 400;
      res.status(status).json(error);
      return;
    }

    res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({
        status: "error",
        code: "REFRESH_TOKEN_MISSING",
        message: "No refresh token provided",
      });
      return;
    }

    const tokens = await refreshTokenService(refreshToken);

    // Set cookies with explicit expiration times
    res.cookie("accessToken", tokens.accessToken, {
      ...ACCESS_COOKIE_OPTIONS,
      expires: new Date(Date.now() + config.jwt.expiresInMilliseconds),
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      ...REFRESH_COOKIE_OPTIONS,
      expires: new Date(Date.now() + config.jwt.refreshExpiresInMilliseconds),
    });

    res.json({
      status: "success",
      message: "Token refreshed successfully",
    });
  } catch (error: any) {
    logger.error("Token refresh error:", error);

    if (error.code) {
      const status = error.code.includes("INVALID") ? 401 : 400;
      res.status(status).json(error);
      return;
    }

    res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const githubCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error("No user data from GitHub");
    }

    // Find or create user from GitHub data
    const { user, tokens } = await findOrCreateGithubUser(req.user);

    // Set httpOnly cookies
    res.cookie("accessToken", tokens.accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    // Redirect to dashboard with success
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error: any) {
    logger.error("GitHub callback error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/login?error=github_auth_failed`
    );
  }
};

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error("No user data from Google");
    }

    // Find or create user from Google data
    const { user, tokens } = await findOrCreateGoogleUser(req.user);

    // Set httpOnly cookies
    res.cookie("accessToken", tokens.accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    // Redirect to dashboard with success
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error: any) {
    logger.error("Google callback error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/login?error=google_auth_failed`
    );
  }
};
