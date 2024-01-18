const Admin  = require('../models/adminModel');
const { generateToken } = require('../utils/jwt');
const { comparePasswords } = require('../utils/hash');

// Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin || !comparePasswords(password,admin.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = generateToken({ role: 'admin', email });
    console.log(token);
    // Send the token in the headers
    res.status(200).header('Authorization', `Bearer ${token}`).json({ message: 'Admin login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin logout
const logoutAdmin = (req, res) => {
  try {

    // Clear the token in the request headers
    req.headers.authorization = '';

    // Send a successful message without a token
    res.json({ message: 'Admin logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { loginAdmin, logoutAdmin };
