/* Importing modules */
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routing/auth');
const { profileRouter } = require('./routing/profile');
const { connectRequestRouter } = require('./routing/connection-request');
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

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectRequestRouter);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
