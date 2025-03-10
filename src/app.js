/* Importing modules */
require('dotenv').config()
const express = require('express')
const { connectDB } = require('./config/database')
const { UserModel } = require('./models/user-model')
const { signupValidator } = require('./utils/validation')
const bcrypt = require('bcrypt')

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
    signupValidator(req)

    const { firstName, lastName, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUND)
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

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
      message: error.message,
    })
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!validator.isEmail(email)) throw new Error('Invalid credentials')

    const user = UserModel.findOne({ email })
    if (!user) throw new Error('Invalid credentials')

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) throw new Error('Invalid credentials')

    res.status(200).send({
      data: 'Hello',
      message: 'Login successful!!',
    })
  } catch (error) {
    res.status(400).send({
      message: error,
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

app.patch('/user/:userId', async (req, res) => {
  try {
    const userId = req.params?.userId

    const data = req.body

    /* ************** 
		findByIdAndUpdate don't accept query it only take _id for searching so that is why,We must use the findOneAndUpdate.

		Additionally passing option like returnDOcument which will return latest updated document . we can also pass before which will return previous document before update
		************* */
    const allowedUpdateFields = ['photoUrl', 'age', 'skills', 'about', 'gender']

    const isFieldsProper = Object.keys(data).every((key) =>
      allowedUpdateFields.includes(key)
    )
    console.log('userId', userId)
    if (!isFieldsProper)
      throw new Error('Some extra fields added which are not allowed.')
    if (data?.skills?.length > 10) {
      throw new Error('Upto 10 skills are allowed.')
    }
    let query = userId.includes('@') ? { email: userId } : { _id: userId }

    const user = await UserModel.findOneAndUpdate(
      // {
      //   $or: [{ _id: userId }, { email: userId }],
      // },
      query,
      data,
      {
        returnDocument: 'after',
        runValidators: true,
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
