/* Importing modules */
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routing/auth');
const { profileRouter } = require('./routing/profile');
const { connectRequestRouter } = require('./routing/connection-request');
const { userRouter } = require('./routing/user');
const { AppError, NotFoundError } = require('./utils/error');
const { errorHandler } = require('./middleware/error-handler-middleware');
const cors = require('cors');
let server;
/* **************************** */
process.on('uncaughtException', error => {
  console.log(`${error.name} - ${error.message}`);
  console.log('Shutting down server due to uncaughtException');

  if (server) {
    // Only try to close if server exists
    server.close(() => {
      process.exit(1);
    });
  } else {
    // Server wasn't initialized yet
    process.exit(1);
  }
});
/* ******************************** */

/* Instance of express js application */
const app = express();

const PORT = process.env.PORT_NUMBER || 8080;

/* ***********************GLOBAL MIDDLEWARES********************** */
app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
  })
);
/*  *****************
1- JSON MIDDLEWARE

Size Limits: By default, it accepts payloads up to 100kb.
*************** */

app.use(express.json({ limit: '1mb' }));

/* 2- Cookie parser Middleware */

app.use(cookieParser());

/* ******************************************* */

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/connection', connectRequestRouter);
app.use('/user', userRouter);

/* ***************** Handling Not Found Routes**************** */

app.all('*', (req, _res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on the server`));
});

/* **************************** */

/* *********Global Error Handler ************* */

app.use(errorHandler);

/* **************************** */

server = app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});

process.on('unhandledRejection', error => {
  console.log(`${error.name} - ${error.message}`);

  console.log('Shutting down server due to unhandledPromiseRejection');

  server.close(() => {
    console.log('Server closed');
    process.exit(1);
  });
});

/* *********** Memory Usage ************** */
process.on('memoryUsage', () => {
  const used = process.memoryUsage();
  console.log(
    `Memory usage: RSS: ${Math.round(used.rss / 1024 / 1024)}MB, Heap: ${Math.round(used.heapUsed / 1024 / 1024)}/${Math.round(used.heapTotal / 1024 / 1024)}MB`
  );
});
