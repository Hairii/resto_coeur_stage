import Joi from "joi";

export const  evenementsSchema = Joi.object({
    titre: Joi.string().min(2).max(150).required().messages({
        "string.base": "Le titre doit être une chaîne de caractères",
        "string.min": "Le titre doit avoir au moins 2 caractères",
        "string.max": "Le titre ne peut pas dépasser 150 caractères",
        "any.required": "Le titre est obligatoire",
    }),

    description: Joi.string().max(1000).allow("", null).messages({
        "string.max": "La description ne peut pas dépasser 1000 caractères"
    }),

     lieu: Joi.string().max(200).allow("", null).messages({
    "string.max": "Le lieu ne peut pas dépasser 200 caractères",
  }),
 
  date_debut: Joi.date().iso().required().messages({
    "date.base": "La date de début doit être une date valide.",
    "date.format": "La date de début doit être au format (YYYY-MM-DD)",
    "any.required": "La date de début est obligatoire",
  }),
 
  date_fin: Joi.date().iso().min(Joi.ref("date_debut")).allow(null).messages({
    "date.base": "La date de fin doit être une date valide",
    "date.format": "La date de fin doit être au format (YYYY-MM-DD)",
    "date.min": "La date de fin doit être égale ou postérieure à la date de début",
  }),
  heure_debut: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null, "").messages({
      "string.pattern.base": "L'heure de début doit être au format HH:mm",
    }),

  heure_fin: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null, "").messages({
      "string.pattern.base": "L'heure de fin doit être au format HH:mm",
    }),
})