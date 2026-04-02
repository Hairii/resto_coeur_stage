import Joi from "joi";

export const authSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "L'email doit être valide",
    "any.required": "L'email est obligatoire",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 8 caractères",
    "any.required": "Le mot de passe est obligatoire",
  }),
});