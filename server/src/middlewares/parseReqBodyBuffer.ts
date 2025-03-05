import { type NextFunction, type Request, type Response } from "express";

export function parseRequestBodyBuffer(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const reqBody: unknown = req.body;

  if (!Buffer.isBuffer(reqBody)) {
    next();
    return;
  }

  try {
    req.body = JSON.parse(reqBody.toString()) as unknown;
  } catch (error) {
    console.warn(
      `Failed to parse request body as JSON, error: ${String(error)}`
    );
    req.body = {};
  }

  next();
}
