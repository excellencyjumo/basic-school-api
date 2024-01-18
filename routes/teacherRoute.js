// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/authMiddleware');

// Routes related to teachers
router.post('/teachers', authMiddleware.authenticateUser, authorizeRole(["admin"]), teacherController.createTeacher);
router.get('/teachers', authMiddleware.authenticateUser, teacherController.getAllTeachers);
router.get('/teachers/:id', authMiddleware.authenticateUser, teacherController.getTeacherById);
router.put('/teachers/:id', authMiddleware.authenticateUser, authorizeRole(["admin"]), teacherController.updateTeacherById);
router.delete('/teachers/:id', authMiddleware.authenticateUser, authorizeRole(["admin"]), teacherController.deleteTeacherById);

module.exports = router;