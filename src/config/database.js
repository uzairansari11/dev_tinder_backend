const mongoose = require('mongoose')

/* connect to database */

const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URL)
    console.log('Database connected successfully')
  } catch (error) {
    console.error('error from db connection', error)
  }
}

module.exports = { connectDB }
