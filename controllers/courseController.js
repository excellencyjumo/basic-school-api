const Course = require('../models/courseModel');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Create a new course
    const newCourse = new Course({
      name,
      description,
    });

    // Save the course to the database
    const savedCourse = await newCourse.save();

    return res.status(201).json({name:savedCourse.name, description:savedCourse.description});
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error getting courses:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a specific course by ID
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error('Error getting course by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a course by ID
exports.updateCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { name, description } = req.body;

    // Check if the course exists
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update the course
    existingCourse.name = name;
    existingCourse.description = description;
    existingCourse.update_date = Date.now(); // Update the update_date field

    // Save the updated course to the database
    const updatedCourse = await existingCourse.save();

    return res.status(200).json({name:updatedCourse.name, description:updatedCourse.description});
  } catch (error) {
    console.error('Error updating course by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a course by ID
exports.deleteCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Check if the course exists
    const existingCourse = await Course.findByIdAndDelete(courseId);
    
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(204).json({});

  } catch (error) {
    console.error('Error deleting course by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
