import express, { type Application } from "express";
import { apiRouter } from "./routes/index.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import dotenvx from "@dotenvx/dotenvx";
import { logRequest } from "./middlewares/logRequest.ts";
import { parseRequestBodyBuffer } from "./middlewares/parseReqBodyBuffer.ts";
import serverless from "serverless-http";

const envPath = process.env.NODE_ENV === "development" ? `../.env` : undefined;

dotenvx.config({ path: envPath });

const app: Application = express();

if (process.env.NODE_ENV !== "development") {
  app.use(logRequest);
}

app.use(parseRequestBodyBuffer);

app.use(express.urlencoded({ extended: true }));

app.use("/", apiRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});

export const handler = serverless(app);
