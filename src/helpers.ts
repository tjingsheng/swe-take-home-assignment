import { Readable } from "stream";
import { parse } from "fast-csv";
import { z } from "zod";

// TODO: Move to a config file
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 4000;
const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = null;
const DEFAULT_SORT = null;
const LOCALE = "en-SG";

const personSchema = z.object({
  name: z.string(),
  salary: z.coerce.number().nonnegative(),
});
type Person = z.infer<typeof personSchema>;

export function validatePersons(data: unknown[]): Person[] {
  const validatePerson = (person: unknown): Person | undefined => {
    const validation = personSchema.safeParse(person);
    if (!validation.success) {
      console.error("Invalid person data:", validation.error);
      return undefined;
    }
    return validation.data;
  };

  return data
    .map(validatePerson)
    .filter((person): person is Person => person !== undefined);
}

export function headerTransform(headers: (string | null | undefined)[]) {
  return headers.map((header) => (header ? header.toLowerCase() : ""));
}

export function parseCSV(buffer: Buffer): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    if (!buffer || buffer.length === 0) {
      return reject(new Error("Buffer is empty or invalid"));
    }

    const results: unknown[] = [];

    try {
      const readableStream = Readable.from(buffer.toString());
      readableStream
        .pipe(
          parse({
            headers: headerTransform,
          })
        )
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", (err) => {
          console.error("CSV parsing error:", err);
          reject(new Error("Failed to parse CSV file"));
        });
    } catch (error) {
      reject(new Error("Failed to create readable stream from csv buffer"));
    }
  });
}

export function validateQueryParams(queryParams: Record<string, unknown>) {
  const queryParamNumber = z.coerce.number().nonnegative();
  const sortSchema = z.enum(["NAME", "SALARY"]);
  const parseQueryParam = <T>(
    schema: z.ZodType<T>,
    value: unknown,
    defaultValue: T
  ): T => {
    const result = schema.safeParse(value);
    if (!result.success) {
      console.log(`Error parsing query param:`, result.error);
      return defaultValue;
    }
    return result.data;
  };

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
