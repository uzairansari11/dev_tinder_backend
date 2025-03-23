const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user-model');
const { UnauthorizedError } = require('../utils/error');

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return next(new UnauthorizedError());
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { _id } = decode;

    const user = await UserModel.findById(_id);

    if (!user) throw new Error('User not found');
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = { authMiddleware };
