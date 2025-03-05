import fs from "fs";
import path from "path";
import { format } from "fast-csv";
import { CONFIG } from "../config.ts";

export async function writeData(
  newData: Record<string, unknown>[]
): Promise<void> {
  const folderPath = path.join(process.cwd(), CONFIG.DATA_FOLDER);
  const filePath = path.join(folderPath, CONFIG.CSV_FILE);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(folderPath)) {
      try {
        fs.mkdirSync(folderPath, { recursive: true });
      } catch (err) {
        console.error("Error creating data folder:", err);
        return reject(new Error("Failed to create data folder."));
      }
    }

    if (!Array.isArray(newData) || newData.length === 0) {
      return reject(new Error("No valid data provided to write."));
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
      transform: (row: Record<string, unknown>) => {
        return Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.toUpperCase(), value])
        );
      },
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
      newData.forEach((row) => {
        if (!row.name || !row.salary) {
          console.warn("Skipping invalid row:", row);
          return;
        }
        csvStream.write(row);
      });
    } catch (err) {
      console.error("Error writing rows:", err);
      return reject(new Error("Error writing data to CSV."));
    }

    csvStream.end();
  });
}
