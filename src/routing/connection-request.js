const express = require('express');
const { authMiddleware } = require('../middleware/auth-middleware');
const { UserModel } = require('../models/user-model');
const {
  ConnectionRequestModel,
} = require('../models/connection-request-model');
const connectRequestRouter = express.Router();

connectRequestRouter.post(
  '/request/send/:status/:userId',
  authMiddleware,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const loggedInUserId = req.user._id;
      const status = req.params.status;
      const destinationUserId = req.params.userId;

      const allowedStatus = ['ignored', 'interested'];

      const isStatusAllowed = allowedStatus.includes(status);

      if (!isStatusAllowed)
        throw new Error('Request not allowed bad status ' + status);

      const isDestinationUserIdExists =
        await UserModel.findById(destinationUserId);
      if (!isDestinationUserIdExists)
        throw new Error(
          'The user does not exist whom you are trying to send the request.'
        );

      const isRequestAlreadyExists = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: loggedInUser, toUserId: destinationUserId },
          { fromUserId: destinationUserId, toUserId: loggedInUser },
        ],
      });

      if (isRequestAlreadyExists) throw new Error('Request already sent.');

      const connection = new ConnectionRequestModel({
        fromUserId: loggedInUserId,
        toUserId: destinationUserId,
        status,
      });
      await connection.save();
      sendSuccess(res, null, 'Request send successfully');
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  }
);

connectRequestRouter.patch(
  '/request/review/:status/:requestId',
  authMiddleware,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const loggedInUserId = loggedInUser._id;
      const { status, requestId } = req.params;

      /* ********** check status ********** */
      const allowedStatus = ['accepted', 'rejected'];

      if (!allowedStatus.includes(status)) throw new Error('Status not valid');

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: 'interested',
      });

      if (!connectionRequest) throw new Error('Invalid Request');

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      sendSuccess(res, data, `Request ${status}`);
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  }
);

module.exports = { connectRequestRouter };
