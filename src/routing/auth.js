const express = require('express');
const { signupValidator } = require('../utils/validation');
const { UserModel } = require('../models/user-model');
const bcrypt = require('bcrypt');
const authRouter = express.Router();
const validator = require('validator');
const { config } = require('../config/config');
const { sendSuccess } = require('../utils/api-response-error');

authRouter.post('/signup', async (req, res) => {
  try {
    /* ********** Create an instance of UserModel ******** */
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
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) throw new Error('Invalid credentials');
    console.log('post login api');

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    console.log('user password', password, 'db saved password', user.password);
    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) throw new Error('Invalid credentials');

    /* *************  Generating jwt token  ************************** */
    const token = await user.getJWT();
    /* *********  sending cookies to client also use cookie-parser library to parse it . A middleware developed by express js team ************* */

    res.cookie('token', token, config.cookieOptions);
    sendSuccess(res, null, 'Login successful!!');
  } catch (error) {
    console.log('error is here', error);
    res.status(400).send({
      message: error.message,
    });
  }
});
module.exports = { authRouter };
