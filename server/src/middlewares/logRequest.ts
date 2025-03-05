import { type NextFunction, type Request, type Response } from "express";

export function logRequest(req: Request, _res: Response, next: NextFunction) {
  let bufferedBody: string | undefined;

  try {
    if (Buffer.isBuffer(req.body)) {
      bufferedBody = req.body.toString("base64");
      req.body = JSON.parse(req.body.toString()) as unknown;
    }
  } catch {
    bufferedBody = undefined;
  }

  const singaporeTime = new Date()
    .toLocaleString("en-SG", {
      timeZone: "Asia/Singapore",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");

  console.log("Incoming Request", {
    sgt: singaporeTime,
    headers: req.headers,
    bodyType: typeof req.body,
    rawBody: req.body as unknown,
    bufferedBody,
    method: req.method,
    path: req.path,
  });

  next();
}
