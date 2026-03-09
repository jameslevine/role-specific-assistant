import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../constants";
import { Schema } from "joi";

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.details[0].message,
      });
    }
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.details[0].message,
      });
    }
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.details[0].message,
      });
    }
    next();
  };
};
