const express = require('express');
const { authMiddleware } = require('../middleware/auth-middleware');
const {
  ConnectionRequestModel,
} = require('../models/connection-request-model');
const { UserModel } = require('../models/user-model');
const { sendSuccess } = require('../utils/api-response-error');
const { asyncHandler } = require('../utils/async-handler');

const userRouter = express.Router();
const FROM_USER_DATA_POPULATE = 'firstName lastName age photoUrl about skills';
/* ******** Received Request with async handler wrapper ******* */
userRouter.get(
  '/requests/received',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;

    const data = await ConnectionRequestModel.find({
      $and: [{ toUserId: loggedInUserId }, { status: 'interested' }],
    }).populate('fromUserId', FROM_USER_DATA_POPULATE);
    sendSuccess(res, data);
  })
);

/* ******** Connection with async handler wrapper ******* */

userRouter.get(
  '/connections',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUserId, status: 'accepted' },
        { fromUserId: loggedInUserId, status: 'accepted' },
      ],
    })
      .populate('fromUserId', FROM_USER_DATA_POPULATE)
      .populate('toUserId', FROM_USER_DATA_POPULATE);

    const data = connections.map(connection => {
      if (connection.fromUserId._id.toString() === loggedInUserId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    sendSuccess(res, data);
  })
);

/* ******** Feeds  with async handler wrapper ******* */

userRouter.get(
  '/feed',
  authMiddleware,
  asyncHandler(async (req, res) => {
    /* *********** Validation for page and limit ************** */
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 30);
    const skip = (page - 1) * limit;
    /* *************************************************** */

    /* ***********
  1- user must not see self
  2- people whom user already sent request or people who sent request to user
  3- people whom user ignored or interested
  4- people who is already in connection list
  5- people who rejected user or vice-versa
  ********* */

    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;

    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    });

    const uniqueIds = new Set();
    uniqueIds.add(loggedInUserId.toString());

    connections.forEach(connection => {
      uniqueIds.add(connection.fromUserId.toString());
    });

    console.log(uniqueIds);

    const users = await UserModel.find({
      _id: { $nin: Array.from(uniqueIds) },
    })
      .skip(skip)
      .limit(limit)
      .select(FROM_USER_DATA_POPULATE);
    sendSuccess(res, users);
  })
);
module.exports = { userRouter };
