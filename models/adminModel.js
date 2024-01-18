const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // more fields will be added later
});

module.exports = mongoose.model('Admin', adminSchema);