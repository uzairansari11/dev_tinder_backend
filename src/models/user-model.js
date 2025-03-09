const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      minLength: 2,
      unique: true,
    },
    password: { type: String, minLength: 6, required: true },
    contact: {
      type: Number,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      /* The validation only run during insertion if you want it to run on update also you need to enable it inside your route update logic */
      validator(value) {
        if (!['male,female,"other'].includes(value)) {
          throw new Error('Gender is not valid')
        }
      },
      lowercase: true,
      required: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      default: 'This is default about.',
    },
    skills: {
      type: [String],
    },
  },
  /* ******** When we add timestamps :true mongodb add two fields createdAt & updatedAt in order document,
	 and this tracks when document was create and last updated *********  */
  { timestamps: true }
)

const UserModel = mongoose.model('User', userSchema)

module.exports = { UserModel }
