import express, { type Router } from "express";
import { readData } from "../db/read.ts";
import multer from "multer";
import { writeData } from "../db/write.ts";

import {
  parseCSV,
  sortFilterLimitData,
  validatePersons,
  validateQueryParams,
} from "../helpers.ts";

export const apiRouter: Router = express.Router();
const upload = multer();

apiRouter.get("/health", (_, res, next) => {
  try {
    res.json({ success: 1 });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/users", async (req, res, next) => {
  try {
    const queryParams = validateQueryParams(req.query);
    const csvData = await readData();
    const persons = validatePersons(csvData);
    const sortedFilteredLimitedPersons = sortFilterLimitData(
      persons,
      queryParams
    );

    res.json({ results: sortedFilteredLimitedPersons, success: 1 });
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/upload", async (req, res, next) => {
  try {
    const csvData = req.body.file;
    if (!csvData) {
      throw new Error("No CSV data provided");
    }

    const csvString = decodeURIComponent(csvData);

    const existingData = await readData();
    const existingPersons = validatePersons(existingData);

    const newPersons = validatePersons(await parseCSV(csvString));

    console.log("newPersons", newPersons);
    const newNames = new Set(newPersons.map((p) => p.name));
    const filteredExistingPersons = existingPersons.filter(
      (p) => !newNames.has(p.name)
    );

    const updatedPersons = [...filteredExistingPersons, ...newPersons];
    await writeData(updatedPersons);

    const addedCount = updatedPersons.length - existingPersons.length;
    const updatedCount = newPersons.length - addedCount;

    res.json({
      success: 1,
      updatedPersons: updatedCount,
      addedPersons: addedCount,
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.post(
  "/upload-optimised",
  upload.single("file"),
  async (req, res, next) => {
    try {
      const fileBuffer = req.file?.buffer;
      if (!fileBuffer) {
        throw new Error("No file uploaded");
      }

      const existingData = await readData();
      const existingPersons = validatePersons(existingData);

      const csvData = await parseCSV(fileBuffer);
      const newPersons = validatePersons(csvData);

      const newNames = new Set(newPersons.map((p) => p.name));
      const filteredExistingPersons = existingPersons.filter(
        (p) => !newNames.has(p.name)
      );

      const updatedPersons = [...filteredExistingPersons, ...newPersons];
      await writeData(updatedPersons);

      const addedCount = updatedPersons.length - existingPersons.length;
      const updatedCount = newPersons.length - addedCount;

      res.json({
        success: 1,
        updatedPersons: updatedCount,
        addedPersons: addedCount,
      });
    } catch (error) {
      next(error);
    }
  }
);
