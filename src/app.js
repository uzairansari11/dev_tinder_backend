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

app.get('/feed', async (req, res) => {
  try {
    const users = await UserModel.find()
    if (!users.length) {
      res.send({
        message: 'No user exists',
        data: [],
      })
    }
    res
      .status(200)
      .send({ message: 'User list fetched successfully', data: users })
  } catch (error) {
    res.status(400).send({
      message: 'Error saving user!' + error,
    })
  }
})

app.delete('/user', async (req, res) => {
  try {
    const userId = req.body.userId
    const user = await UserModel.findByIdAndDelete({ _id: userId })

    res.status(200).send({
      message: 'User deleted successfully',
      data: user._id,
    })
  } catch (error) {
    res.status(400).send({
      message: 'Error deleting user!' + error,
    })
  }
})

app.patch('/user', async (req, res) => {
  try {
    const userId = req.body.userId
    const emailId = req.body.emailId
    const data = req.body

    /* ************** 
		findByIdAndUpdate don't accept query it only take _id for searching so that is why,We must use the findOneAndUpdate.

		Additionally passing option like returnDOcument which will return latest updated document . we can also pass before which will return previous document before update
		************* */
    const user = await UserModel.findOneAndUpdate(
      {
        $or: [{ _id: userId }, { emailId }],
      },
      data,
      {
        returnDocument: 'after',
      }
    )

    res.status(200).send({
      message: 'User deleted successfully',
      data: user,
    })
  } catch (error) {
    res.status(400).send({
      message: 'Error updating user!' + error,
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
