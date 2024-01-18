const { verifyToken } = require('../utils/jwt');
const Admin  = require('../models/adminModel');
const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');


const authenticateUser = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. Token not provided.' });
  }

  const token = authorizationHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    
    // Extract role and email from the decoded token
    const { role, email } = decoded;
    
    // Based on the role, find the user in the respective model
    let user;
    if (role == 'teacher') {
      user = await Teacher.findOne({ email });
    } else if (role == 'student') {
      user = await Student.findOne({ email });
    } else if (role == 'admin') {
      user = await Admin.findOne({ email });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    // Attach user information to the request object
    req.user = { role, email, userId: user._id.toString() };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.', error });
  }
};


const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden - Insufficient privileges' });
    }

    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
