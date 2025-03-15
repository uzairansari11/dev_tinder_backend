const express = require('express');
const { authMiddleware } = require('../middleware/auth-middleware');
const {
  validatePasswordEditData,
  validateEditProfileData,
} = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get('/view', authMiddleware, async (req, res) => {
  try {
    const data = req.user;
    sendSuccess(res, data);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

profileRouter.patch('/edit', authMiddleware, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid edit request');
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    sendSuccess(res, loggedInUser, 'Profile updated successfully');
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});
profileRouter.patch('/password', authMiddleware, async (req, res) => {
  try {
    if (!validatePasswordEditData(req)) {
      throw new Error('Invalid request');
    }
    const loggedInUser = req.user;

    loggedInUser.password = req.password;
    await loggedInUser.save();

    sendSuccess(res, loggedInUser, 'Password updated');
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});
module.exports = { profileRouter };
