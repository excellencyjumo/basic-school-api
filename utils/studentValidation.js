// validations/studentValidation.js
const Joi = require('joi');

const createStudentValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateStudentValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
});

module.exports = { createStudentValidation, updateStudentValidation };