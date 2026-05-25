import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import cors from 'cors'
import userApp from './APIs/UserApi.js'

config()

const app = express()

// CORS
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || 'https://user-management-55nj.vercel.app']
  : ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:3000']

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

// Routes
app.use('/user-api', userApp)

// Error Handling
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'validation failed' })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'invalid id' })
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'duplicate key error' })
  }
  res.status(500).json({ message: 'internal server error' })
})

// Connect DB and Start Server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.db_url)
    console.log('DB connected')
    app.listen(process.env.PORT || 4000, () => {
      console.log('Server started on port', process.env.PORT || 4000)
    })
  } catch (e) {
    console.log('Failed to connect DB:', e.message)
    process.exit(1)
  }
}

connectDB()
