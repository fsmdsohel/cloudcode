import dotenv from "dotenv";
dotenv.config();

export const config = {
  app: {
    port: parseInt(process.env.PORT || "8000", 10),
  },
  db: {
    url: process.env.DATABASE_URL || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    expiresIn: "15m",
    refreshExpiresIn: "30d",
    expiresInMilliseconds: 15 * 60 * 1000, // 15 minutes
    refreshExpiresInMilliseconds: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};
