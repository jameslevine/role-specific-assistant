import Joi from "joi";

export const conversationParamsSchema = Joi.object({
  roleSlug: Joi.string().required(),
  conversationId: Joi.string().required(),
});

export const conversationListQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).optional().default(20),
  lastEvaluatedKey: Joi.string().optional(),
});

export const conversationUpdateBodySchema = Joi.object({
  title: Joi.string().max(200).required(),
});
