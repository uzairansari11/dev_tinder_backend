const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    status: {
      type: String,
      enum: {
        values: ['ignored', 'accepted', 'rejected', 'interested'],
        message: `{VALUE} is not valid`,
      },
      required: true,
    },
  },
  { timestamps: true },
);

/* **********  compound indexing for faster result   ************** */
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

/* ************      Before saving checking that user is not sending request to self   ******************** */
connectionRequestSchema.pre('save', function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Can't send request to yourself");
  }
  next();
});


const ConnectionRequestModel = mongoose.model(
  'connectRequestModel',
  connectionRequestSchema,
);

module.exports = { ConnectionRequestModel };
