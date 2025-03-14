const { model } = require('mongoose');
const validator = require('validator');

const signupValidator = (req) => {
  const { firstName, lastName, email, password } = req.body;
  console.log('email', email);
  if (!firstName || !lastName) {
    throw new Error('Please provide proper first name and last name');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Please provide a valid email');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Please provide strong password');
  }
};
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    'photoUrl',
    'age',
    'skills',
    'about',
    'gender',
    'firstName',
    'lastName',
  ];

  // Find any fields that aren't in our allowed list
  const isAllowed = Object.keys(req.body).every((item) =>
    allowedEditFields.includes(item),
  );

  // If there are unauthorized fields, throw an error with their names
  return isAllowed;
};

const validatePasswordEditData = (req) => {
  const allowedEditFields = ['password'];

  const isAllowed = Object.keys(req.body).every((item) =>
    allowedEditFields.includes(item),
  );

  return isAllowed;
};

module.exports = {
  signupValidator,
  validateEditProfileData,
  validatePasswordEditData,
};
