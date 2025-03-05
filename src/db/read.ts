import fs from "fs";
import path from "path";
import { parse } from "fast-csv";

import { headerTransform } from "../helpers.ts";
import { CONFIG } from "../config.ts";

export async function readData(): Promise<unknown[]> {
  const folderPath = path.join(process.cwd(), CONFIG.DATA_FOLDER);
  const filePath = path.join(folderPath, CONFIG.CSV_FILE);
  const data: unknown[] = [];

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`CSV file not found: ${filePath}`));
    }

    try {
      const stream = fs.createReadStream(filePath);

      stream
        .on("error", (err) => {
          console.error(`File Read Error: ${err.message}`);
          reject(new Error("Failed to read the CSV file."));
        })
        .pipe(
          parse({
            headers: headerTransform,
            ignoreEmpty: true,
            trim: true,
            strictColumnHandling: false,
          })
        )
        .on("error", (err) => {
          console.error(`CSV Parsing Error: ${err.message}`);
          reject(new Error("Failed to parse CSV data."));
        })
        .on("data", (row) => {
          data.push(row);
        })
        .on("end", () => {
          if (data.length === 0) {
            console.warn("CSV file is empty or contains no valid data.");
          }
          resolve(data);
        });
    } catch (error) {
      console.error("Unexpected Error:", error);
      reject(
        new Error("An unexpected error occurred while processing the CSV.")
      );
    }
  });
}
