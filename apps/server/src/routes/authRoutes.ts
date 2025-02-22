import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  validateSession,
  refreshAccessToken,
  githubCallback,
  googleCallback,
} from "@/controllers/authController";
import { validateRequest } from "@/middleware/validateRequest";
import { registerSchema, loginSchema } from "@/schemas/authSchemas";
import passport from "passport";
import { verifyAccessToken } from "@/middleware/authMiddleware";

const router = Router();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", validateRequest(registerSchema), registerUser);

/**
 * @route POST /auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post("/login", validateRequest(loginSchema), loginUser);

/**
 * @route GET /auth/github
 * @desc Redirect to GitHub for authentication
 * @access Public
 */
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

/**
 * @route GET /auth/github/callback
 * @desc GitHub callback URL
 * @access Public
 */
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=github_auth_failed`,
  }),
  githubCallback
);

/**
 * @route GET /auth/google
 * @desc Redirect to Google for authentication
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @route GET /auth/google/callback
 * @desc Google callback URL
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=google_auth_failed`,
  }),
  googleCallback
);

/**
 * @route POST /auth/logout
 * @desc Logout user and blacklist tokens
 * @access Private - Need token to blacklist
 */
router.post("/logout", verifyAccessToken, logout);

/**
 * @route GET /auth/validate
 * @desc Validate user session
 * @access Private
 */
router.get("/validate", verifyAccessToken, validateSession);

/**
 * @route POST /auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post("/refresh", refreshAccessToken);

export default router;
