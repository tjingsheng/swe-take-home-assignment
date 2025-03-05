import fs from "fs/promises";
import path from "path";
import { writeToPath } from "fast-csv";
import { faker } from "@faker-js/faker";

const DATA_FOLDER = "data"; // TODO: Move to a config file
const CSV_FILE = "data.csv"; // TODO: Move to a config file
const SEED_ROWS = 100000;
const MIN_SALARY = 0;
const MAX_SALARY = 10000;

faker.seed(0);

async function seed(): Promise<void> {
  try {
    const folderPath = path.join(process.cwd(), DATA_FOLDER);
    const filePath = path.join(folderPath, CSV_FILE);

    try {
      await fs.access(folderPath);
    } catch {
      console.log(
        `The data folder does not exist. Creating one at ${folderPath}`
      );
      await fs.mkdir(folderPath);
    }

    const seedData = Array.from({ length: SEED_ROWS }, () => ({
      NAME: faker.person.firstName(),
      SALARY: faker.finance.amount({
        dec: 2,
        min: MIN_SALARY,
        max: MAX_SALARY,
      }),
    }));

    writeToPath(filePath, seedData, { headers: true });

    console.log(`CSV file seeded successfully at ${filePath}`);
  } catch (error) {
    console.error("Error writing CSV file:", error);
  }
}

(async () => {
  await seed();
  console.log("🌱 Seeding completed 🌱");
})();
