import fs from "fs";
import path from "path";
import { parse } from "fast-csv";
import { Person } from "../types.ts";

const DATA_FOLDER = "data"; // TODO: Move to a config file
const CSV_FILE = "data.csv"; // TODO: Move to a config file

export async function readData(): Promise<Person[]> {
  const folderPath = path.join(process.cwd(), DATA_FOLDER);
  const filePath = path.join(folderPath, CSV_FILE);
  const data: Person[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        parse({
          headers: (headers) => headers.map((header) => header?.toLowerCase()),
        })
      )
      .on("data", (row) => data.push(row))
      .on("end", () => resolve(data))
      .on("error", (error) => reject(error));
  });
}
