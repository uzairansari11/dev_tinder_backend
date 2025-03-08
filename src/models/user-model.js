const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  contact: {
    type: Number,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: {
      values: ['Male', 'Female'],
      message: `{VALUE} is not supported`,
    },
  },
})

const UserModel = mongoose.model('User', userSchema)

module.exports = { UserModel }
