const { validate, Joi } = require("express-validation");

exports.createProductValidation = validate({
  body: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    category: Joi.string().min(2).max(100).required(),
    price: Joi.number().integer().min(0).required(),
    thumbnail: Joi.string().uri().optional().allow(""),
  }),
});

exports.updateProductValidation = validate({
  body: Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    category: Joi.string().min(2).max(100).optional(),
    price: Joi.number().integer().min(0).optional(),
    thumbnail: Joi.string().uri().optional().allow(""),
  }),
});

exports.getProductsValidation = validate({
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    category: Joi.string().optional().allow(""),
  }),
});

