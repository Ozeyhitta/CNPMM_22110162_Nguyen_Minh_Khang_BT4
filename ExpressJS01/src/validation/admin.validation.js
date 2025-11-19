const { validate, Joi } = require("express-validation");

exports.updateUserRoleValidation = validate({
  body: Joi.object({
    role: Joi.string().valid("user", "admin").required(),
  }),
});

exports.createUserValidation = validate({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("user", "admin").optional(),
  }),
});

exports.updateUserValidation = validate({
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid("user", "admin").optional(),
  }),
});
