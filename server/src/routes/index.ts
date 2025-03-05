import express, { type Router } from "express";

import multer from "multer";

import {
  parseCSV,
  sortFilterLimitData,
  validatePersons,
  validateQueryParams,
} from "../helpers.ts";
import { readCsv } from "../db/readCsv.ts";
import { writeCsv } from "../db/writeCsv.ts";

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
    const csvData = await readCsv();
    const persons = validatePersons(csvData);
    const sortedFilteredLimitedPersons = sortFilterLimitData(
      persons,
      queryParams,
    );

    res.json({
      results: sortedFilteredLimitedPersons,
      success: 1,
      count: sortedFilteredLimitedPersons.length,
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    let csvData: string;

    if (req.file) {
      csvData = req.file.buffer.toString();
    } else if (req.body.file) {
      csvData = decodeURIComponent(req.body.file);
    } else {
      throw new Error("No CSV data provided");
    }

    const existingData = await readCsv();
    const existingPersons = validatePersons(existingData);

    const newPersons = validatePersons(await parseCSV(csvData));
    const newNames = new Set(newPersons.map((p) => p.name));
    const filteredExistingPersons = existingPersons.filter(
      (p) => !newNames.has(p.name),
    );

    const updatedPersons = [...filteredExistingPersons, ...newPersons];
    await writeCsv(updatedPersons);

    const addedCount = updatedPersons.length - existingPersons.length;
    const updatedCount = newPersons.length - addedCount;

    const message =
      updatedCount === 0 && addedCount === 0
        ? "No changes. Please make sure your headers are correct"
        : undefined;

    res.json({
      success: 1,
      updatedPersons: updatedCount,
      addedPersons: addedCount,
      message,
    });
  } catch (error) {
    next(error);
  }
});
