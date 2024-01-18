const Teacher = require('../models/teacherModel');
const {hashPassword} = require('../utils/hash');

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new teacher
    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
    });

    // Save the teacher to the database
    await newTeacher.save();

    return res.status(201).json(newTeacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    return res.status(200).json(teachers);
  } catch (error) {
    console.error('Error getting teachers:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a specific teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.status(200).json(teacher);
  } catch (error) {
    console.error('Error getting teacher by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a teacher by ID
exports.updateTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { name, email, password } = req.body;

    // Check if the teacher exists
    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Hash the password if provided
    let hashedPassword = existingTeacher.password;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Update the teacher
    existingTeacher.name = name;
    existingTeacher.email = email;
    existingTeacher.password = hashedPassword;

    // Save the updated teacher to the database
    await existingTeacher.save();

    return res.status(200).json(existingTeacher);
  } catch (error) {
    console.error('Error updating teacher by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a teacher by ID
exports.deleteTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;

    // Check if the teacher exists
    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Delete the teacher
    await existingTeacher.remove();

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting teacher by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
