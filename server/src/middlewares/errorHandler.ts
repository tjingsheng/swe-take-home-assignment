import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err.stack ?? err.message);
  res.status(500).json({ success: 0, error: err.message });
}
