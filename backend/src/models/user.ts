import Joi from "joi";

export const userUpdateBodySchema = Joi.object({
  firstName: Joi.string().max(100).optional(),
  lastName: Joi.string().max(100).optional(),
  selectedRole: Joi.string()
    .valid("electrician", "plumber", "bricklayer", "carpenter", "painter")
    .insensitive()
    .lowercase()
    .optional(),
});

export const subscriptionCheckoutBodySchema = Joi.object({
  tier: Joi.string().valid("pro", "business").required(),
  successUrl: Joi.string().required(),
  cancelUrl: Joi.string().required(),
});
