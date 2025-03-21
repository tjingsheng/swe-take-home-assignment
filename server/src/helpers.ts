import { Readable } from "stream";
import { parse } from "fast-csv";
import { z } from "zod";
import { CONFIG } from "./config.ts";

const personSchema = z.object({
  name: z.string(),
  salary: z.coerce.number().nonnegative(),
});
type Person = z.infer<typeof personSchema>;

export function validatePersons(data: unknown[]): Person[] {
  const validatePerson = (person: unknown): Person | undefined => {
    const validation = personSchema.safeParse(person);
    if (!validation.success) {
      console.error("Invalid person data:", person);
      console.log("Skipping invalid person data", person);
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

export function parseCSV(input: Buffer | string): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    if (!input || input.length === 0) {
      return reject(new Error("Buffer is empty or invalid"));
    }

    const results: unknown[] = [];

    try {
      const readableStream = Readable.from(input.toString());
      readableStream
        .pipe(
          parse({
            headers: headerTransform,
          }),
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
  const sortSchema = z.union([
    z.enum(["NAME", "SALARY"]),
    z.array(z.enum(["NAME", "SALARY"])),
  ]);
  const parseQueryParam = <T>(
    schema: z.ZodType<T>,
    value: unknown,
    defaultValue: T,
  ): T => {
    const result = schema.safeParse(value);
    if (!result.success) {
      return defaultValue;
    }
    return result.data;
  };

  return {
    min: parseQueryParam(
      queryParamNumber,
      queryParams?.min,
      CONFIG.DEFAULT_MIN,
    ),
    max: parseQueryParam(
      queryParamNumber,
      queryParams?.max,
      CONFIG.DEFAULT_MAX,
    ),
    offset: parseQueryParam(
      queryParamNumber,
      queryParams?.offset,
      CONFIG.DEFAULT_OFFSET,
    ),
    limit: parseQueryParam(
      queryParamNumber,
      queryParams?.limit,
      CONFIG.DEFAULT_LIMIT,
    ),
    sort: parseQueryParam(sortSchema, queryParams?.sort, CONFIG.DEFAULT_SORT),
  };
}

export function sortFilterLimitData(
  data: Person[],
  params: ReturnType<typeof validateQueryParams>,
) {
  const { min, max, offset, limit, sort } = params;

  const filteredData = data.filter((person) => {
    const salary = Number(person.salary);
    return salary >= min && salary <= max;
  });

  const sortKeys = Array.isArray(sort) ? sort : [sort];
  const sortedData = filteredData.sort((a, b) => {
    for (const criteria of sortKeys) {
      if (criteria === "NAME") {
        const result = a.name.localeCompare(b.name, CONFIG.LOCALE);
        if (result !== 0) return result;
      } else if (criteria === "SALARY") {
        const result = Number(a.salary) - Number(b.salary);
        if (result !== 0) return result;
      }
    }
    return 0;
  });

  const limitedData = limit
    ? sortedData.slice(offset, offset + limit)
    : sortedData.slice(offset);

  return limitedData;
}
