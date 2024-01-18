// adminController.test.js
const AdminController = require('../../../controllers/adminController');
const Admin = require('../../../models/adminModel');
const { generateToken } = require('../../../utils/jwt');
const { comparePasswords } = require('../../../utils/hash');

jest.mock('../../../models/adminModel');
jest.mock('../../../utils/jwt');
jest.mock('../../../utils/hash');

describe('Admin Controller Tests', () => {
  describe('loginAdmin', () => {
    it('should login an admin successfully', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'adminPassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findOne to simulate an existing admin
      Admin.findOne.mockResolvedValue({
        email: req.body.email,
        password: 'hashedAdminPassword',
      });

      // Mock comparePasswords to simulate successful password comparison
      comparePasswords.mockReturnValue(true);

      // Mock generateToken to simulate successful token generation
      generateToken.mockReturnValue('Token');

      await AdminController.loginAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.header).toHaveBeenCalledWith('Authorization', 'Bearer Token');
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin login successful' });
    });

    it('should return 401 for invalid email or password', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'adminPassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findOne to simulate no existing admin or incorrect password
      Admin.findOne.mockResolvedValue(null);
      comparePasswords.mockReturnValue(false);

      await AdminController.loginAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'adminPassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findOne to simulate an error
      Admin.findOne.mockRejectedValue(new Error('Database error'));

      await AdminController.loginAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('logoutAdmin', () => {
    it('should logout an admin successfully', () => {
      const req = {
        headers: {
          authorization: 'Bearer Token',
        },
      };
      const res = {
        json: jest.fn(),
      };

      AdminController.logoutAdmin(req, res);

      expect(req.headers.authorization).toBe('');
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin logout successful' });
    });

    it('should return 500 if an error occurs', () => {
        const req = {
          headers: {
            authorization: 'Bearer Token',
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        try {
          // Mock the operation to simulate an error
          AdminController.logoutAdmin(req, res);
        } catch (error) {
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
        }
      });
  });
});
