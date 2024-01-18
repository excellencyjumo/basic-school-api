const bcrypt = require('bcrypt');
require('dotenv').config();

const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
  return await bcrypt.hash(password, saltRounds);
};

const comparePasswords = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = { hashPassword, comparePasswords };