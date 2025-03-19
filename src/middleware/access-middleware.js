const { AppError } = require('../utils/error');

const accessMiddleware = (...roles) => {
  return (req, _res, next) => {
    // Check if user exists first
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const userRole = req.user.role;

    // Handle case where user has no role assigned
    if (!userRole) {
      return next(new AppError('User has no role assigned', 403));
    }

    const matchRole = roles.includes(userRole);

    if (!matchRole) {
      return next(
        new AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403)
      );
    }

    next();
  };
};

module.exports = { accessMiddleware };
