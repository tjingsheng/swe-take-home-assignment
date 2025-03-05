export const CONFIG = {
  // db
  DATA_FOLDER: "data",
  CSV_FILE: "data.csv",

  // seed
  SEED_ROWS: 10000,
  SEED_MIN_SALARY: 0,
  SEED_MAX_SALARY: 5000,

  // query parameters
  DEFAULT_MIN: 0,
  DEFAULT_MAX: 4000,
  DEFAULT_OFFSET: 0,
  DEFAULT_LIMIT: null,
  DEFAULT_SORT: null,
  LOCALE: "en-SG",
} as const;
