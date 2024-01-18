// validations/courseValidation.js
const Joi = require('joi');

const createCourseValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

const updateCourseValidation = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
});

module.exports = { createCourseValidation, updateCourseValidation };