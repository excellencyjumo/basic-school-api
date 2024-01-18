// routes/adminRoutes.js
const express = require('express');
const { loginAdmin, logoutAdmin } = require('../controllers/adminController');
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin login route
router.post('/admin/login', loginAdmin);

// Admin logout route
router.post('/admin/logout', authenticateUser, authorizeRole(['admin']), logoutAdmin);

module.exports = router;
