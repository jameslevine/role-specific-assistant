import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../constants";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Unhandled error:", err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
};
