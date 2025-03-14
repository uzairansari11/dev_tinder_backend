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
/* Instance of express js application */
const app = express();

const PORT = process.env.PORT_NUMBER || 8080;

/* ***********************GLOBAL MIDDLEWARES********************** */

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
  next(NotFoundError(`Can't find ${req.originalUrl} on the server`));
});

/* **************************** */

/* *********Global Error Handler ************* */

app.use(errorHandler);

/* **************************** */

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
