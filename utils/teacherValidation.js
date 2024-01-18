// validations/teacherValidation.js
const Joi = require('joi');

const createTeacherValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateTeacherValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
});

module.exports = { createTeacherValidation, updateTeacherValidation };