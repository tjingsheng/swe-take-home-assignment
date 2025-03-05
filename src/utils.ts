import { Readable } from "stream";
import { parse } from "fast-csv";

export function parseCSV<T>(buffer: Buffer): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    const readableStream = Readable.from(buffer.toString());

    readableStream
      .pipe(parse({ headers: true }))
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}
