import express, { type Router } from "express";
import { readData } from "../db/read.ts";
import multer from "multer";
import { writeData } from "../db/write.ts";
import { Person } from "../types.ts";
import {
  parseCSV,
  sortFilterLimitData,
  validateQueryParams,
} from "../helpers.ts";

export const apiRouter: Router = express.Router();
const upload = multer();

apiRouter.get("/health", (_, res, next) => {
  try {
    res.json({ message: "healthy!" });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/users", async (req, res, next) => {
  try {
    const queryParams = validateQueryParams(req.query);
    const data = await readData();
    const sortedFilteredLimitedData = sortFilterLimitData(data, queryParams);
    res.json({ results: sortedFilteredLimitedData });
  } catch (error) {
    next(error);
  }
});

// TODO: We should use application/x-www-form-urlencoded as required, instead of multipart/form-data for file uploads
apiRouter.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    const fileBuffer = req.file.buffer;
    const csvData = await parseCSV<Person>(fileBuffer);
    await writeData(csvData);
    res.json({ success: 1 });
  } catch (error) {
    next(error);
  }
});
