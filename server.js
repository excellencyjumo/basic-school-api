const express = require("express");

// Database-instance
const connectDB = require("./config/database.js");

// Routes
const adminRoutes = require("./routes/adminRoute");
const teacherRoutes = require("./routes/teacherRoute");
const studentRoutes = require("./routes/studentRoute");
const courseRoutes = require("./routes/courseRoute");

// Logger-file
const logger = require("./utils/logger");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

// Routes
app.use("/api", adminRoutes);
app.use("/api", teacherRoutes);
app.use("/api", studentRoutes);
app.use("/api", courseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Connect to MongoDB
connectDB((err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
});
  
// Start the server
const server = app.listen(PORT, () => {
    logger.info("Connected to database");
    logger.info(`Server is running on port ${PORT}`);
});

module.exports = server;
