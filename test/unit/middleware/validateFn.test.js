// validateFn.test.js
const validateRequestBody = require('../../../middlewares/validateFn');
const Joi = require('joi');

describe('validateRequestBody Middleware Tests', () => {
  it('should pass validation for valid request body', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(18).required(),
      // Add more schema validation based on your actual schema
    });

    const req = {
      body: {
        name: 'John Doe',
        age: 25,
        // Include other properties based on your schema
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    validateRequestBody(schema)(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 for invalid request body', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(18).required(),
      // Add more schema validation based on your actual schema
    });

    const req = {
      body: {
        // Missing required 'name' property
        age: 25,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    validateRequestBody(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: '"name" is required' });
    expect(next).not.toHaveBeenCalled();
  });

  // Add more tests for different scenarios or edge cases based on your actual validation requirements
});
