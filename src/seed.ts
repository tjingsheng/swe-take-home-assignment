import fs from "fs/promises";
import path from "path";
import { writeToPath } from "fast-csv";
import { faker } from "@faker-js/faker";
import { CONFIG } from "./config.ts";

faker.seed(0);

async function seed(): Promise<void> {
  try {
    const folderPath = path.join(process.cwd(), CONFIG.DATA_FOLDER);
    const filePath = path.join(folderPath, CONFIG.CSV_FILE);

    try {
      await fs.access(folderPath);
    } catch {
      console.log(
        `The data folder does not exist. Creating one at ${folderPath}`
      );
      await fs.mkdir(folderPath);
    }

    const seedData = Array.from({ length: CONFIG.SEED_ROWS }, () => ({
      NAME: faker.person.firstName(),
      SALARY: faker.finance.amount({
        dec: 2,
        min: CONFIG.SEED_MIN_SALARY,
        max: CONFIG.SEED_MAX_SALARY,
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
