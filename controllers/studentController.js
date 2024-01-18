const Student = require('../models/studentModel');
const bcrypt = require('../utils/hash');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hashPassword(password);

    // Create a new student
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
    });

    // Save the student to the database
    const savedStudent = await newStudent.save();

    // Return the saved student data in the response
    return res.status(201).json({
      name: savedStudent.name,
      email: savedStudent.email,
      password: savedStudent.password,
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    return res.status(200).json(students);
  } catch (error) {
    console.error('Error getting students:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a specific student by ID
exports.getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error('Error getting student by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a student by ID
exports.updateStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, email, password } = req.body;

    // Check if the student exists
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Hash the password if provided
    let hashedPassword = existingStudent.password;
    if (password) {
      hashedPassword = await bcrypt.hashPassword(password);
    }

    // Update the student
    existingStudent.name = name;
    existingStudent.email = email;
    existingStudent.password = hashedPassword;

    // Save the updated student to the database
    await existingStudent.save();
    return res.status(200).json({name:existingStudent.name,email:existingStudent.email});
  } catch (error) {
    console.error('Error updating student by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a student by ID
exports.deleteStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Check if the student exists
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete the student
    await Student.findByIdAndDelete(existingStudent._id);
    
    return res.status(204).send("Student deleted successfully");
  } catch (error) {
    console.error('Error deleting student by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
