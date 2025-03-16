const express = require('express');
const { signupValidator } = require('../utils/validation');
const { UserModel } = require('../models/user-model');
const authRouter = express.Router();
const validator = require('validator');
const { config } = require('../config/config');
const { sendSuccess } = require('../utils/api-response-error');
const { asyncHandler } = require('../utils/async-handler');
const { BadRequestError } = require('../utils/error');
authRouter.post(
  '/signup',
  asyncHandler(async (req, res) => {
    signupValidator(req);

    const { firstName, lastName, email, password, gender } = req.body;
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password,
      gender,
    });

    /* ************* Saving this instance to database & it will return an promise  ************* */

    await user.save();

    /* ************* Sending response to client  ************* */

    sendSuccess(res, null, 'Account created successfully');
  })
);
authRouter.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!validator.isEmail(email))
      return next(new Error('Invalid credentials'));
    console.log('post login api');

    const user = await UserModel.findOne({ email });
    if (!user) return next(new BadRequestError('Invalid credentials'));
    console.log('user password', password, 'db saved password', user.password);
    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid)
      return next(new BadRequestError('Invalid credentials'));

    /* *************  Generating jwt token  ************************** */
    const token = await user.getJWT();
    /* *********  sending cookies to client also use cookie-parser library to parse it . A middleware developed by express js team ************* */
    // After validation, fetch user data again with only the fields you want to return
    const data = await UserModel.findById(user._id).select(
      'firstName lastName photoUrl gender'
    );
    res.cookie('token', token, config.cookieOptions);
    sendSuccess(res, data, 'Login successful!!');
  })
);
module.exports = { authRouter };
