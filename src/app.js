/* Importing modules */
require('dotenv').config()
const express = require('express')
const { connectDB } = require('./config/database')
const { UserModel } = require('./models/user-model')

/* Instance of express js application */
const app = express()

const PORT = process.env.PORT_NUMBER || 8080

/* ***********************GLOBAL MIDDLEWARES********************** */

/*  *****************  
1- JSON MIDDLEWARE 

Size Limits: By default, it accepts payloads up to 100kb. 
*************** */

app.use(express.json({ limit: '1mb' }))

/* ******************************************* */

app.post('/signup', async (req, res) => {
  try {
    /* ********** Create an instance of UserModel ******** */

    const user = new UserModel(req.body)

    /* ************* Saving this instance to database & it will return an promise  ************* */

    const userResponse = await user.save()

    /* ************* Sending response to client  ************* */
    res.send({
      message: 'User Created Successfully',
      data: {
        userResponse,
      },
    })
  } catch (error) {
    res.status(400).send({
      message: 'Error saving user!' + error,
    })
  }
})

app.listen(PORT, async () => {
  try {
    await connectDB()
    console.log(`Server is running on port ${PORT}`)
  } catch (error) {
    console.log(error)
  }
})
