const { validate, Joi } = require("express-validation");

exports.createCategoryValidation = validate({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional().allow(""),
    thumbnail: Joi.string().uri().optional().allow(""),
  }),
});

exports.updateCategoryValidation = validate({
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional().allow(""),
    thumbnail: Joi.string().uri().optional().allow(""),
  }),
});
