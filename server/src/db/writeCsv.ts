import fs from "fs";
import path from "path";
import { format } from "fast-csv";
import axios from "axios";
import { CONFIG } from "../config.ts";

export async function writeCsv(
  newData: Record<string, unknown>[],
): Promise<void> {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isProduction = NODE_ENV === "production";

  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(newData) || newData.length === 0) {
      return reject(new Error("No valid data provided to write."));
    }

    if (!isProduction) {
      const folderPath = path.join(process.cwd(), CONFIG.DATA_FOLDER);
      const filePath = path.join(folderPath, CONFIG.CSV_FILE);

      if (!fs.existsSync(folderPath)) {
        try {
          fs.mkdirSync(folderPath, { recursive: true });
        } catch (err) {
          console.error("Error creating data folder:", err);
          return reject(new Error("Failed to create data folder."));
        }
      }

      let writableStream: fs.WriteStream;
      try {
        writableStream = fs.createWriteStream(filePath, { flags: "w" });
      } catch (err) {
        console.error("File Write Error:", err);
        return reject(new Error("Failed to open file for writing."));
      }

      const csvStream = format({
        headers: true,
        transform: (row: Record<string, unknown>) =>
          Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key.toUpperCase(),
              value,
            ]),
          ),
      });

      writableStream
        .on("error", (err) => {
          console.error("Stream Write Error:", err);
          reject(new Error("Failed to write CSV file."));
        })
        .on("finish", resolve);

      csvStream
        .on("error", (err) => {
          console.error("CSV Formatting Error:", err);
          reject(new Error("Error in CSV formatting."));
        })
        .pipe(writableStream);

      try {
        newData.forEach((row) => csvStream.write(row));
      } catch (err) {
        console.error("Error writing rows:", err);
        return reject(new Error("Error writing data to CSV."));
      }

      csvStream.end();
    } else {
      const GIST_ID = process.env.GIST_ID;
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      const GIST_FILENAME = process.env.GIST_FILENAME || "data.csv";

      if (!GIST_ID || !GITHUB_TOKEN) {
        return reject(
          new Error(
            "GIST_ID or GITHUB_TOKEN is missing from environment variables.",
          ),
        );
      }

      try {
        const csvString = await new Promise<string>((resolve, reject) => {
          const csvChunks: string[] = [];
          const csvStream = format({
            headers: true,
            transform: (row: Record<string, unknown>) =>
              Object.fromEntries(
                Object.entries(row).map(([key, value]) => [
                  key.toUpperCase(),
                  value,
                ]),
              ),
          });

          csvStream
            .on("error", (err) =>
              reject(new Error(`CSV Formatting Error: ${err.message}`)),
            )
            .on("data", (chunk) => csvChunks.push(chunk.toString()))
            .on("end", () => resolve(csvChunks.join("")));

          newData.forEach((row) => csvStream.write(row));
          csvStream.end();
        });

        console.log("csvString:", csvString);

        const gistUrl = `https://api.github.com/gists/${GIST_ID}`;
        const headers = { Authorization: `token ${GITHUB_TOKEN}` };

        const response = await axios.patch(
          gistUrl,
          {
            files: {
              [GIST_FILENAME]: {
                content: csvString,
              },
            },
          },
          { headers },
        );

        if (response.status === 200) {
          console.log("Successfully updated Gist:", response.data.html_url);
          resolve();
        } else {
          throw new Error(`Failed to update Gist. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error updating Gist:", error);
        reject(new Error("Failed to write data to GitHub Gist."));
      }
    }
  });
}
