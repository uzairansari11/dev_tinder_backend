

/* ********** Custom Error Class Using Error Base Class*********** */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Passing message to base class i:e Error
    this.statusCode = statusCode; // Setting statusCode to current error instance
    this.status = statusCode >= 4004 && statusCode < 500 ? 'fail' : 'error'; // Setting status base on status code

    this.isOperational = true; // Indicates expected errors

    /* Preserving error traces of base class

    1 - current object : this
    2 - custom error class : this.constructor
    */
    Error.captureStackTrace(this, this.constructor);
  }
}

/* ************ Bad Request Error ****************** */
class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

/* ************* Not Found Error *************** */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/* ************* Unauthorized Error ******************** */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
};
