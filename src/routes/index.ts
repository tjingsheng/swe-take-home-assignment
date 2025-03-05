import express, { type Router } from "express";
import { readData } from "../db/read.ts";
import multer from "multer";
import { writeData } from "../db/write.ts";
import { Person } from "../types.ts";
import { parseCSV } from "../utils.ts";

export const apiRouter: Router = express.Router();
const upload = multer();

apiRouter.get("/health", (_, res) => {
  res.json({ message: "healthy!" });
});

apiRouter.get("/users", async (_, res) => {
  const data = await readData();
  res.json({ results: data });
});

// TODO: We should use application/x-www-form-urlencoded as required, instead of multipart/form-data for file uploads
apiRouter.post("/upload", upload.single("file"), async (req, res) => {
  const fileBuffer = req.file.buffer;
  const csvData = await parseCSV<Person>(fileBuffer);
  await writeData(csvData);
  res.json({ success: 1 });
});
