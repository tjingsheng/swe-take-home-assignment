import fs from "fs";
import path from "path";
import { parse } from "fast-csv";
import axios from "axios";
import { Readable } from "stream";

import { headerTransform } from "../helpers.ts";
import { CONFIG } from "../config.ts";

export async function readCsv(): Promise<unknown[]> {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isProduction = NODE_ENV === "production";
  const data: unknown[] = [];

  let stream: Readable;

  try {
    if (!isProduction) {
      const folderPath = path.join(process.cwd(), CONFIG.DATA_FOLDER);
      const filePath = path.join(folderPath, CONFIG.CSV_FILE);

      if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file not found: ${filePath}`);
      }

      console.log(`Reading CSV from local file: ${filePath}`);
      stream = fs.createReadStream(filePath);
    } else {
      console.log("Running in production mode.");
      const GIST_ID = process.env.GIST_ID;
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

      if (!GIST_ID || !GITHUB_TOKEN) {
        throw new Error(
          "GIST_ID or GITHUB_TOKEN is missing from environment variables.",
        );
      }

      const gistUrl = `https://api.github.com/gists/${GIST_ID}`;
      const headers = { Authorization: `token ${GITHUB_TOKEN}` };
      const gistResponse = await axios.get(gistUrl, { headers });

      const fileKey = Object.keys(gistResponse.data.files).find((file) =>
        file.endsWith(".csv"),
      );
      if (!fileKey) {
        throw new Error("No CSV file found in the Gist.");
      }

      const csvFileUrl = gistResponse.data.files[fileKey].raw_url;
      const csvResponse = await axios.get(csvFileUrl, {
        responseType: "stream",
      });

      stream = csvResponse.data;
    }

    return new Promise((resolve, reject) => {
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
          }),
        )
        .on("error", (err) => {
          console.error(`CSV Parsing Error: ${err.message}`);
          reject(new Error("Failed to parse CSV data."));
        })
        .on("data", (row) => data.push(row))
        .on("end", () => {
          if (data.length === 0) {
            console.warn("CSV file is empty or contains no valid data.");
          }
          resolve(data);
        });
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    throw new Error("Failed to fetch and parse the CSV.");
  }
}
