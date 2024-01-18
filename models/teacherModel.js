const mongoose = require('mongoose');
const { Schema } = mongoose;

const teacherSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registered_date: { type: Date, default: Date.now },
  courses_handling: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  // more fields will be added later
});

module.exports = mongoose.model('Teacher', teacherSchema);
