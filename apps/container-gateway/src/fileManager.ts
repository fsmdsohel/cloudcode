import express, { Request, Response } from "express";
import fs from "fs";
import logger from "@/utils/logger";

const router = express.Router();

// Endpoint to list files and directories
router.get("/files", (req: Request, res: Response) => {
  const dirPath = (req.query.path as string) || "."; // Explicitly cast to string

  logger.debug(`Listing directory contents for path: ${dirPath}`);

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      logger.error(`Error reading directory ${dirPath}: ${err}`);
      return res.status(500).json({ error: "Unable to read directory" });
    }

    const fileList = files.map((file) => ({
      name: file.name,
      isDirectory: file.isDirectory(),
    }));

    logger.debug(`Successfully listed ${fileList.length} items in ${dirPath}`);
    res.json(fileList);
  });
});

// Endpoint to read a file
router.get("/files/read", (req: Request, res: Response) => {
  const filePath = req.query.path as string; // Explicitly cast to string

  if (!filePath) {
    logger.warn("File read request received without path parameter");
    res.status(400).json({ error: "File path is required" });
  }

  logger.debug(`Reading file contents from: ${filePath}`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      logger.error(`Error reading file ${filePath}: ${err}`);
      return res.status(500).json({ error: "Unable to read file" });
    }

    logger.debug(`Successfully read file ${filePath}`);
    res.json({ content: data });
  });
});

export default router;
