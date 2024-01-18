const request = require('supertest');
const app = require('../../../server');
const { generateToken } = require('../../../utils/jwt');
const Teacher = require('../../../models/teacherModel');
const Student = require('../../../models/studentModel');
const Admin = require('../../../models/adminModel');

// Define test users for each role
const testTeacherUser = {
  email: 'teacher@test.com',
  password: 'teacherPassword',
};

const testStudentUser = {
  email: 'student@test.com',
  password: 'studentPassword',
};

const testAdminUser = {
  email: 'admin@test.com',
  password: 'adminPassword',
};

// Insert the test users into the database
beforeAll(async () => {
  await Teacher.create(testTeacherUser);
  await Student.create(testStudentUser);
  await Admin.create(testAdminUser);
});

// Drop the collections after all tests
afterAll(async () => {
  await Teacher.deleteMany({});
  await Student.deleteMany({});
  await Admin.deleteMany({});
});

describe('Authentication Middleware Integration Tests', () => {
  it('should authenticate admin user and authorize admin route', async () => {
    // Login admin to get a valid token
    const loginResponse = await request(app)
      .post('/api/admin/login')
      .send({ email: testAdminUser.email, password: testAdminUser.password });
    
    //token
    const token  = loginResponse.headers["authorization"].split(' ')[1];
    console.log(token);
    // Use the token to make an authorized request to admin route
    const authorizedResponse = await request(app)
      .post('/api/admin/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(authorizedResponse.status).toBe(200);
    expect(authorizedResponse.body).toHaveProperty('message', 'Admin logout successful');
  });

  it('should not authorize admin route without authentication', async () => {
    // Make a request to admin route without authentication
    const unauthorizedResponse = await request(app)
      .post('/api/admin/logout');

    expect(unauthorizedResponse.status).toBe(401);
    expect(unauthorizedResponse.body).toHaveProperty('message', 'Access denied. Token not provided.');
  });

  it('should not authorize admin route with invalid token', async () => {
    // Make a request to admin route with an invalid token
    const unauthorizedResponse = await request(app)
      .post('/api/admin/logout')
      .set('Authorization', 'Bearer invalidToken');

    expect(unauthorizedResponse.status).toBe(401);
    expect(unauthorizedResponse.body).toHaveProperty('message', 'Invalid token.');
  });

  it('should not authorize admin route with non-admin user', async () => {
    // Create a non-admin user and get its token
    const nonAdminUser = {
      email: 'nonadmin@test.com',
      password: 'nonadminPassword',
    };

    await Teacher.create(nonAdminUser);

    const nonAdminToken = generateToken({ role: 'teacher', email: nonAdminUser.email });

    // Make a request to admin route with a non-admin token
    const unauthorizedResponse = await request(app)
      .post('/api/admin/logout')
      .set('Authorization', `Bearer ${nonAdminToken}`);

    expect(unauthorizedResponse.status).toBe(403);
    expect(unauthorizedResponse.body).toHaveProperty('message', 'Forbidden - Insufficient privileges');
  });
});
