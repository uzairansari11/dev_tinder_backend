const express = require('express');
const { authMiddleware } = require('../middleware/auth-middleware');
const {
  validatePasswordEditData,
  validateEditProfileData,
} = require('../utils/validation');
const { sendSuccess } = require('../utils/api-response-error');
const { asyncHandler } = require('../utils/async-handler');

const profileRouter = express.Router();

profileRouter.get(
  '/view',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const data = req.user;
    sendSuccess(res, data);
  })
);

profileRouter.patch(
  '/edit',
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid edit request');
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    sendSuccess(res, loggedInUser, 'Profile updated successfully');
  })
);
profileRouter.patch(
  '/password',
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (!validatePasswordEditData(req)) {
      throw new Error('Invalid request');
    }
    const loggedInUser = req.user;

    loggedInUser.password = req.password;
    await loggedInUser.save();

    sendSuccess(res, loggedInUser, 'Password updated');
  })
);
module.exports = { profileRouter };
