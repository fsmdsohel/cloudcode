import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import logger from "@/utils/logger";
import dotenv from "dotenv";
dotenv.config();

// Configure GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: `${process.env.API_URL}/api/v1/auth/github/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        // Extract user data from GitHub profile
        const githubUser = {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          login: profile.username,
        };

        return done(null, githubUser);
      } catch (error) {
        logger.error("GitHub strategy error:", error);
        return done(error);
      }
    }
  )
);

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${process.env.API_URL}/api/v1/auth/google/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        // Extract user data from Google profile
        const googleUser = {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          displayName: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
        };

        return done(null, googleUser);
      } catch (error) {
        logger.error("Google strategy error:", error);
        return done(error);
      }
    }
  )
);

// Since we're using stateless JWT auth, we don't need complex session handling
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
