// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/authMiddleware');

// Routes related to courses
router.post('/courses', authMiddleware.authenticateUser, authorizeRole('admin'), courseController.createCourse);
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:id', courseController.getCourseById);
router.put('/courses/:id', authMiddleware.authenticateUser, authorizeRole('admin'), courseController.updateCourseById);
router.delete('/courses/:id', authMiddleware.authenticateUser, authorizeRole('admin'), courseController.deleteCourseById);

module.exports = router;
