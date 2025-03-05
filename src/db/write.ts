import fs from "fs";
import path from "path";
import { format } from "fast-csv";
import { Person } from "../types.ts";

const DATA_FOLDER = "data"; // TODO: Move to a config file
const CSV_FILE = "data.csv"; // TODO: Move to a config file

export async function writeData(newData: Person[]): Promise<void> {
  const folderPath = path.join(process.cwd(), DATA_FOLDER);
  const filePath = path.join(folderPath, CSV_FILE);

  return new Promise((resolve, reject) => {
    const writableStream = fs.createWriteStream(filePath, { flags: "w" });

    const csvStream = format({ headers: true });

    csvStream.pipe(writableStream).on("finish", resolve).on("error", reject);

    newData.forEach((row) => csvStream.write(row));

    csvStream.end();
  });
}
