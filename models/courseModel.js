const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: { type: String },
  description: { type: String },
  update_date: { type: Date, default: Date.now },
  // more-fields will be added later
});

module.exports = mongoose.model('Course', courseSchema);