import express, { type Application } from "express";
import { apiRouter } from "./routes/index.ts";

const app: Application = express();

app.use("/", apiRouter);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
