import { type NextFunction, type Request, type Response } from "express";

export function routeNotFound(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`Route not found: ${req.originalUrl}`);
  res.status(404).json({ success: 0, error: "Route not found" });
}
