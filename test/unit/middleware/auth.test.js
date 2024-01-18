// auth.test.js
const auth = require('../../../middlewares/authMiddleware');
const { verifyToken } = require('../../../utils/jwt');
const Admin  = require('../../../models/adminModel');

jest.mock('../../../utils/jwt');
jest.mock('../../../models/adminModel');

describe('Authentication Tests', () => {
  describe('authenticateUser', () => {
    
    it('should authenticate user successfully and attach user information to the request', async () => {
        const req = {
          header: jest.fn().mockReturnValue('Bearer Token'),
          user: undefined, // Simulating an empty user property in the request
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn();
      
        // Mock verifyToken to simulate successful token verification
        verifyToken.mockReturnValue({
          role: 'admin',
          email: 'admin@example.com',
        });
      
        // Mock findOne to simulate an existing admin user
        Admin.findOne.mockResolvedValue({
          _id: 'AdminId',
        });
      
        await auth.authenticateUser(req, res, next);
      
        // Use await before making assertions
        expect(req.user).toEqual({
          role: 'admin',
          email: 'admin@example.com',
          userId: 'AdminId',
        });
        expect(next).toHaveBeenCalled();
      });
      

    it('should return 401 if token is not provided', async () => {
        const req = {
          header: jest.fn().mockReturnValue(undefined), // Simulate no Authorization header
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn();
      
        await auth.authenticateUser(req, res, next);
      
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Token not provided.' });
        expect(next).not.toHaveBeenCalled();
    });
      

    // Add more tests for other scenarios (e.g., invalid token, user not found, etc.)
  });

  describe('authorizeRole', () => {
    it('should authorize role successfully when the user has the required role', () => {
      const req = {
        user: {
          role: 'admin',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const allowedRoles = ['admin', 'teacher'];

      auth.authorizeRole(allowedRoles)(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if the user does not have the required role', () => {
      const req = {
        user: {
          role: 'student',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const allowedRoles = ['admin', 'teacher'];

      auth.authorizeRole(allowedRoles)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden - Insufficient privileges' });
      expect(next).not.toHaveBeenCalled();
    });

    // Add more tests for other scenarios
  });
});


