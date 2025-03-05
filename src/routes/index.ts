import express, { type Router } from "express";
import { readData } from "../db/read.ts";

export const apiRouter: Router = express.Router();

apiRouter.get("/health", (_, res) => {
  res.json({ message: "healthy!" });
});

apiRouter.get("/users", async (_, res) => {
  const data = await readData();
  res.json({ results: data });
});
