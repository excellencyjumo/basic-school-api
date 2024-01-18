// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/authMiddleware");
const validateFn = require("../middlewares/validateFn");
const {
  createStudentValidation,
  updateStudentValidation,
} = require("../utils/studentValidation");

// Routes related to students
router.post(
    "/students",
    authMiddleware.authenticateUser,
    authorizeRole(["admin"]),
    validateFn(createStudentValidation),
    studentController.createStudent
);
router.get(
    "/students",
    authMiddleware.authenticateUser,
    studentController.getAllStudents
);
router.get(
    "/students/:id",
    authMiddleware.authenticateUser,
    studentController.getStudentById
);
router.put(
    "/students/:id",
    authMiddleware.authenticateUser,
    authorizeRole(["admin"]),
    validateFn(updateStudentValidation),
    studentController.updateStudentById
);
router.delete(
    "/students/:id",
    authMiddleware.authenticateUser,
    authorizeRole(["admin"]),
    studentController.deleteStudentById
);

module.exports = router;
