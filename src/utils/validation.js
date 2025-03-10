const validator = require('validator')

const signupValidator = (req) => {
  const { firstName, lastName, email, password } = req.body
  console.log('email', email)
  if (!firstName || !lastName) {
    throw new Error('Please provide proper first name and last name')
  }

  if (!validator.isEmail(email)) {
    throw new Error('Please provide a valid email')
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Please provide strong password')
  }
}

module.exports = { signupValidator }
