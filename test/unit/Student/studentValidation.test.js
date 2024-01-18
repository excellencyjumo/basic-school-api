const Joi = require('joi');
const { createStudentValidation, updateStudentValidation } = require('../../../utils/studentValidation');
const { validateRequestBody } = require("../../../middlewares/validateFn");

describe('Student Validation', () => {
  describe('createStudentValidation', () => {
    it('should validate a valid create student request', () => {
      const validStudent = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = createStudentValidation.validate(validStudent);
      expect(result.error).toBeUndefined();
    });

    it('should invalidate an invalid create student request', () => {
      const invalidStudent = {
        name: 'John Doe',
        email: 'invalid-email', // Invalid email format
        password: 'password123',
      };

      const result = createStudentValidation.validate(invalidStudent);
      expect(result.error).toBeDefined();
    });
  });

  describe('updateStudentValidation', () => {
    it('should validate a valid update student request', () => {
      const validUpdate = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newPassword',
      };

      const result = updateStudentValidation.validate(validUpdate);
      expect(result.error).toBeUndefined();
    });

    it('should invalidate an invalid update student request', () => {
      const invalidUpdate = {
        email: 'invalid-email', // Invalid email format
        password: 'newPassword',
      };

      const result = updateStudentValidation.validate(invalidUpdate);
      expect(result.error).toBeDefined();
    });
  });
});


