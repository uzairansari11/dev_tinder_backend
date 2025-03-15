const express = require('express');
const { authMiddleware } = require('../middleware/auth-middleware');
const { UserModel } = require('../models/user-model');
const {
  ConnectionRequestModel,
} = require('../models/connection-request-model');
const { asyncHandler } = require('../utils/async-handler');
const { sendSuccess } = require('../utils/api-response-error');
const { NotFoundError, BadRequestError } = require('../utils/error');
const connectRequestRouter = express.Router();

connectRequestRouter.post(
  '/request/send/:status/:userId',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
    const loggedInUser = req.user;
    const loggedInUserId = req.user._id;
    const status = req.params.status;
    const destinationUserId = req.params.userId;

    const allowedStatus = ['ignored', 'interested'];

    const isStatusAllowed = allowedStatus.includes(status);

    if (!isStatusAllowed) return next(new BadRequestError('Invalid Status'));

    const isDestinationUserIdExists =
      await UserModel.findById(destinationUserId);
    if (!isDestinationUserIdExists)
      return next(
        new NotFoundError(
          'The user does not exist whom you are trying to send the request.'
        )
      );

    const isRequestAlreadyExists = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId: loggedInUser, toUserId: destinationUserId },
        { fromUserId: destinationUserId, toUserId: loggedInUser },
      ],
    });

    if (isRequestAlreadyExists)
      return next(new BadRequestError('Request already sent.'));

    const connection = new ConnectionRequestModel({
      fromUserId: loggedInUserId,
      toUserId: destinationUserId,
      status,
    });
    await connection.save();
    sendSuccess(res, null, 'Request send successfully');
  })
);

connectRequestRouter.patch(
  '/request/review/:status/:requestId',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;
    const { status, requestId } = req.params;

    /* ********** check status ********** */
    const allowedStatus = ['accepted', 'rejected'];

    if (!allowedStatus.includes(status))
      return next(new BadRequestError('Status not valid'));

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: 'interested',
    });

    if (!connectionRequest) return next(new BadRequestError('Invalid Request'));

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    sendSuccess(res, data, `Request ${status}`);
  })
);

module.exports = { connectRequestRouter };
