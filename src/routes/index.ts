import express, { type Router } from "express";

export const apiRouter: Router = express.Router();

apiRouter.get("/health", (_, res) => {
  res.json({ message: "healthy!" });
});
