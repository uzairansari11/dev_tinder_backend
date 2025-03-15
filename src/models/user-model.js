const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: {
      /* ******* By putting unique in a field it will be automatically indexed ********* */
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      minLength: 2,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email address in not valid');
        }
      },
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
      // validate(value) {
      //   if (!['male', 'female', 'other'].includes(value)) {
      //     throw new Error('Gender is not valid')
      //   }
      // },
      enum: {
        values: ['male', 'female', 'other'],
        message: `{VALUE} is not valid gender`,
      },
      lowercase: true,
      required: true,
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Photo Url is not valid');
        }
      },
      default: function () {
        if (this.gender === 'male') {
          return 'https://img.freepik.com/free-vector/cute-boy-standing-position-showing-thumb_96037-450.jpg?t=st=1741516495~exp=1741520095~hmac=10d16da3e0a18f006ada5cebdb812384441516863e87ce98c7b752f840dc6d70&w=1380';
        }
        if (this.gender === 'female') {
          return 'https://img.freepik.com/free-vector/street-fashion-girl_1196-988.jpg?t=st=1741516830~exp=1741520430~hmac=dab2c376e6b556e9d82143516f424547939f033dfdd654ae0388c9176b990e15&w=740';
        }
        return 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?t=st=1741516993~exp=1741520593~hmac=8b43ffbd95b2160d4ca6f4e2929da814d41414c07008a7f02887f3285141c6b1&w=740';
      },
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
  { timestamps: true },
);

/* *********** Indexing using firstName and lastName for faster query result ********************/

userSchema.index({ firstName: 1, lastName: 1 });

/* ************************************** */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user?._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '7d',
  });
  return token;
};

userSchema.methods.isPasswordValid = async function (userInputPassword) {
  const user = this;
  const hashedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    hashedPassword,
  );
  console.log("isPassword",isPasswordValid)
  return isPasswordValid;
};
const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };
