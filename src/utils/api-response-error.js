/**
 * Send successful response
 */
const sendSuccess = (
  res,
  data = null,
  message = 'Success',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send error response
 */
const sendError = (
  res,
  error = null,
  message = 'An error occurred',
  statusCode = 400
) => {
  // Log error for server-side debugging
  console.error(error);

  return res.status(statusCode).json({
    success: false,
    message: message || error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
