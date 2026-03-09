import Joi from "joi";
import { SUPPORTED_FILE_TYPES } from "../constants";

export const documentUploadBodySchema = Joi.object({
  fileName: Joi.string().max(255).required(),
  fileType: Joi.string()
    .valid(...SUPPORTED_FILE_TYPES)
    .required(),
  fileSize: Joi.number().integer().positive().required(),
  description: Joi.string().max(500).optional(),
});

export const documentParamsSchema = Joi.object({
  roleSlug: Joi.string().required(),
  documentId: Joi.string().required(),
});

export const documentListQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).optional().default(20),
  lastEvaluatedKey: Joi.string().optional(),
  status: Joi.string().valid("processing", "ready", "failed").optional(),
});
