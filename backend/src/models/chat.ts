import Joi from "joi";
import { MAX_MESSAGE_LENGTH } from "../constants";

export const chatBodySchema = Joi.object({
  message: Joi.string().max(MAX_MESSAGE_LENGTH).required(),
  conversationId: Joi.string().optional(),
  includePrivateDocs: Joi.boolean().optional().default(true),
});

export const chatParamsSchema = Joi.object({
  roleSlug: Joi.string()
    .valid("electrician", "plumber", "bricklayer", "carpenter", "painter")
    .insensitive()
    .lowercase()
    .required(),
});
