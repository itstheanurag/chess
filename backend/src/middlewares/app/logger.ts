import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const ip = req?.ip || req.socket?.remoteAddress;

  console.log(
    `➡️  [${new Date().toISOString()}] ${req.method} ${
      req.originalUrl
    } - IP: ${ip} - UA: ${req.headers["user-agent"] || "unknown"}`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `⬅️  [${new Date().toISOString()}] ${req.method} ${
        req.originalUrl
      } - Status: ${res.statusCode} - IP: ${ip} - Duration: ${duration}ms`
    );
  });

  next();
};
