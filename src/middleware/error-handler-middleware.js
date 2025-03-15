// middleware/errorHandler.js

const { sendError } = require('../utils/api-response-error');
const { AppError } = require('../utils/error');

// Handle mongoose validation errors
const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new AppError(`Validation failed: ${errors.join('. ')}`, 400);
};

// Handle mongoose duplicate key errors
const handleDuplicateKeyError = err => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `${field} already exists. Please use another value.`,
    400
  );
};

// Handle JWT errors
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

// Main error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('ERROR:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Send error response
  const statusCode = error.statusCode || 500;
  
  const message = error.isOperational
    ? error.message
    : process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : error.message;

  return sendError(res, error, message, statusCode);
};

module.exports = { errorHandler };
