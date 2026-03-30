import Joi from "joi";
 
export const gazetteSchema = Joi.object({
  titre: Joi.string().min(2).max(150).required().messages({
    "string.base": "Le titre doit être une chaîne de caractères",
    "string.min": "Le titre doit contenir au moins 2 caractères",
    "string.max": "Le titre ne peut pas dépasser 150 caractères",
    "any.required": "Le titre est obligatoire",
  }),
 
  description: Joi.string().max(1000).allow("", null).messages({
    "string.max": "La description ne peut pas dépasser 1000 caractères",
  }),
 
  fichier_pdf: Joi.string().max(255).required().messages({
    "string.base": "Le nom du fichier doit être une chaîne de caractères",
    "string.max": "Le nom du fichier ne peut pas dépasser 255 caractères",
    "any.required": "Le fichier PDF est obligatoire",
  }),
});