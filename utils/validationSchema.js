const Joi = require("joi");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const SignUpBodyValidation = (body) => {
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
    phone: joi
      .string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required()
      .label("Phone"),
  });
  return schema.validate(body);
};

// Validation function for Refresh Token request
const RefreshTokenBodyValidation = (body) => {
  // Define schema for validation using Joi object and define validation rules for Refresh Token
  const schema = joi.object({
    refreshToken: joi.string().required().label("Refresh Token"),
  });
  // Validate the request body using the defined schema and return the result
  return schema.validate(body);
};

const RequestForgetPassBodyValidation = (body) => {
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
  });
  return schema.validate(body);
};
const VerifyForgetPassBodyValidation = (body) => {
  const schema = Joi.object({
    token: Joi.string().required().label("Token"),
  });
  return schema.validate(body);
};
const ResetPassBodyValidation = (body) => {
  const schema = Joi.object({
    token: Joi.string().required().label("Token"),
    password: Joi.string().label("Password"),
  });
  return schema.validate(body);
};
module.exports = {
  SignUpBodyValidation,
  RefreshTokenBodyValidation,
  RequestForgetPassBodyValidation,
  VerifyForgetPassBodyValidation,
  ResetPassBodyValidation,
};
