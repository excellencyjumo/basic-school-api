const StudentController = require('../../../controllers/studentController');
const Student = require('../../../models/studentModel');
const bcrypt = require('../../../utils/hash');

jest.mock('../../../models/studentModel');
jest.mock('../../../utils/hash');


describe('Student Controller Tests', () => {
  describe('createStudent', () => {
    it('should create a new student', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findOne to simulate no existing student with the same email
      Student.findOne.mockResolvedValue(null);

      // Mock hashPassword to simulate successful password hashing
      bcrypt.hashPassword.mockResolvedValue('hashedPassword');

      // Mock save to simulate successful student creation
      const studentCreated = new Student(req.body);
      studentCreated.save.mockResolvedValue({
        name: req.body.name,
        email: req.body.email,
        password: 'hashedPassword',
      });

      await StudentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        name: req.body.name,
        email: req.body.email,
        password: 'hashedPassword',
      });
    });

    it('should return 400 if email is already registered', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findOne to simulate an existing student with the same email
      Student.findOne.mockResolvedValue({
        name: 'Existing Student',
        email: req.body.email,
        password: 'existingHashedPassword',
      });

      await StudentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email is already registered' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findOne to simulate an error
      Student.findOne.mockRejectedValue(new Error('Database error'));

      await StudentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getAllStudents', () => {
    it('should get all students', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock find to simulate successful retrieval of all students
      Student.find.mockResolvedValue([
        { name: 'John Doe', email: 'john.doe@example.com', password: 'hashedPassword1' },
        { name: 'Jane Doe', email: 'jane.doe@example.com', password: 'hashedPassword2' },
      ]);

      await StudentController.getAllStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { name: 'John Doe', email: 'john.doe@example.com', password: 'hashedPassword1' },
        { name: 'Jane Doe', email: 'jane.doe@example.com', password: 'hashedPassword2' },
      ]);
    });

    it('should return 500 if an error occurs', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock find to simulate an error
      Student.find.mockRejectedValue(new Error('Database error'));

      await StudentController.getAllStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getStudentById', () => {
    it('should get a specific student by ID', async () => {
      const req = {
        params: { id: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findById to simulate successful retrieval of a specific student
      Student.findById.mockResolvedValue({ name: 'John Doe', email: 'john.doe@example.com', password: 'hashedPassword' });

      await StudentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ name: 'John Doe', email: 'john.doe@example.com', password: 'hashedPassword' });
    });

    it('should return 404 if the student is not found', async () => {
      const req = {
        params: { id: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findById to simulate no existing student with the provided ID
      Student.findById.mockResolvedValue(null);

      await StudentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        params: { id: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findById to simulate an error
      Student.findById.mockRejectedValue(new Error('Database error'));

      await StudentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('updateStudentById', () => {
    it('should update a specific student by ID', async () => {
      const req = {
        params: { id: '123' },
        body: { name: 'Updated Name', email: 'updated.email@example.com', password: 'updatedPassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findById to simulate an existing student
      Student.findById.mockResolvedValue({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        save: jest.fn(), // Mock save function
      });

      // Mock hashPassword to simulate successful password hashing
      bcrypt.hashPassword.mockResolvedValue('updatedHashedPassword');

      await StudentController.updateStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ name: 'Updated Name', email: 'updated.email@example.com' });
    });

    it('should return 404 if the student is not found', async () => {
      const req = {
        params: { id: '123' },
        body: { name: 'Updated Name', email: 'updated.email@example.com', password: 'updatedPassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findById to simulate no existing student with the provided ID
      Student.findById.mockResolvedValue(null);

      await StudentController.updateStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        params: { id: '123' },
        body: { name: 'Updated Name', email: 'updated.email@example.com', password: 'updatedPassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findById to simulate an error
      Student.findById.mockRejectedValue(new Error('Database error'));

      await StudentController.updateStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('deleteStudentById', () => {
    it('should delete a specific student by ID', async () => {
      const req = {
        params: { id: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock findById to simulate an existing student
      Student.findById.mockResolvedValue({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
      });

      // Mock findByIdAndDelete to simulate successful deletion
      Student.findByIdAndDelete.mockResolvedValue({});

      await StudentController.deleteStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith('Student deleted successfully');
    });

    it('should return 404 if the student is not found', async () => {
      const req = {
        params: { id: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findById to simulate no existing student with the provided ID
      Student.findById.mockResolvedValue(null);

      await StudentController.deleteStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        params: { id: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock findById to simulate an error
      Student.findById.mockRejectedValue(new Error('Database error'));

      await StudentController.deleteStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});
