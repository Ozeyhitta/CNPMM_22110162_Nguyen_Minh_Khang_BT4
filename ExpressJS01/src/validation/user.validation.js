const { validate, Joi } = require("express-validation");

exports.registerValidation = validate({
  body: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

exports.loginValidation = validate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

exports.forgotValidation = validate({
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
});

exports.checkOtpValidation = validate({
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  }),
});

exports.resetPasswordValidation = validate({
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    password: Joi.string().min(6).required(),
  }),
});
