import { Readable } from "stream";
import { parse } from "fast-csv";
import { z } from "zod";
import { Person } from "./types.ts";

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

const queryParamNumber = z.coerce.number().nonnegative();
const sortSchema = z.enum(["NAME", "SALARY"]);

// TODO: Move to a config file
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 4000;
const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = null;
const DEFAULT_SORT = null;
const LOCALE = "en-SG";

function parseQueryParam<T>(
  schema: z.ZodType<T>,
  value: unknown,
  defaultValue: T
): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    console.log(`Error parsing query param:`, result.error);
    return defaultValue;
  }
  return result.data;
}

export function validateQueryParams(queryParams: Record<string, unknown>) {
  return {
    min: parseQueryParam(queryParamNumber, queryParams?.min, DEFAULT_MIN),
    max: parseQueryParam(queryParamNumber, queryParams?.max, DEFAULT_MAX),
    offset: parseQueryParam(
      queryParamNumber,
      queryParams?.offset,
      DEFAULT_OFFSET
    ),
    limit: parseQueryParam(queryParamNumber, queryParams?.limit, DEFAULT_LIMIT),
    sort: parseQueryParam(sortSchema, queryParams?.sort, DEFAULT_SORT),
  };
}

export function sortFilterLimitData(
  data: Person[],
  params: ReturnType<typeof validateQueryParams>
) {
  const { min, max, offset, limit, sort } = params;

  const filteredData = data.filter((person) => {
    const salary = Number(person.salary);
    return salary >= min && salary <= max;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sort === "NAME") {
      return a.name.localeCompare(b.name, LOCALE);
    } else if (sort === "SALARY") {
      return Number(a.salary) - Number(b.salary);
    }
    return 0;
  });

  const limitedData = limit
    ? sortedData.slice(offset, offset + limit)
    : sortedData.slice(offset);

  return limitedData;
}
