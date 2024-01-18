const request = require("supertest");
const app = require("../../../server");
const Course = require("../../../models/courseModel");
const Admin = require('../../../models/adminModel');

// Define a test course
const testCourse = {
  name: "Test Course",
  description: "This is a test course description",
};

let adminToken;
let adminData; 

// Insert the test course into the database
beforeAll(async () => {
  // Create an admin account
  adminData = {
    email: 'admin1@test.com',
    password: 'adminPassword',
  };

  await Admin.create(adminData);

  // Log in to get the admin token
  const adminLoginResponse = await request(app)
    .post('/api/admin/login')
    .send(adminData);

  // Extract the admin token from the response headers
  adminToken = adminLoginResponse.headers["authorization"].split(" ")[1];
  await Course.create(testCourse);
});

// Drop the courses collection after all tests
afterAll(async () => {
  await Admin.deleteMany({});
  await Course.deleteMany({});
});

describe("Course Module Integration Tests", () => {
  it("should create a new course", async () => {
    const response = await request(app)
      .post("/api/courses")
      .send({
        name: "New Course",
        description: "This is a new course description",
      })
      .set("Authorization", `Bearer ${adminToken}`); // Replace with your admin token

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "New Course");
    expect(response.body).toHaveProperty(
      "description",
      "This is a new course description"
    );
  });

  it("should get all courses", async () => {
    const response = await request(app).get("/api/courses");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a specific course by ID", async () => {
    const courses = await Course.find();
    const courseId = courses[0]._id;

    const response = await request(app).get(`/api/courses/${courseId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", courses[0].name);
    expect(response.body).toHaveProperty("description", courses[0].description);
  });

  it("should update a course by ID", async () => {
    const courses = await Course.find();
    const courseId = courses[0]._id;

    const response = await request(app)
      .put(`/api/courses/${courseId}`)
      .send({
        name: "Updated Course",
        description: "This is an updated course description",
      })
      .set("Authorization", `Bearer ${adminToken}`); // Replace with your admin token

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Updated Course");
    expect(response.body).toHaveProperty(
      "description",
      "This is an updated course description"
    );
  });

  it("should return a 404 error when updating a non-existing course by ID", async () => {
    const nonExistingCourseId = 'nonexistentid';

    const response = await request(app)
      .put(`/api/courses/${nonExistingCourseId}`)
      .send({
        name: "Updated Course",
        description: "This is an updated course description",
      })
      .set("Authorization", `Bearer ${adminToken}`); 

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Course not found");
  });

  it("should delete a course by ID", async () => {
    const coursesBeforeDeletion = await Course.find();
    const courseId = coursesBeforeDeletion[0]._id;

    const response = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${adminToken}`); 

    expect(response.status).toBe(204);

    const coursesAfterDeletion = await Course.find();
    expect(coursesAfterDeletion.length).toBeLessThan(
      coursesBeforeDeletion.length
    );
  });

  it("should return a 404 error when getting a non-existing course by ID", async () => {
    const nonExistingCourseId = 'nonexistentid';

    const response = await request(app).get(`/api/courses/${nonExistingCourseId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Course not found");
  });

});
