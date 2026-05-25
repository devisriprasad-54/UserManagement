import exp from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import userApp from './APIs/UserApi.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

config()
const app=exp()

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'https://your-render-app.onrender.com']
  : ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:3000']

app.use(cors({
    origin: allowedOrigins
}))

// Serve static files from Frontend build
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(exp.static(path.join(__dirname, '../Frontend/dist')))

const port=process.env.port || 4000

// Apply middleware BEFORE routes
app.use(exp.json())

const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.db_url)
        console.log("DB connected")
        app.listen(port,()=>{
            console.log("server started on port",port)
        })
    }
    catch(e){
        console.log("failed to connect db:",e.message)
        process.exit(1)
    }    
}
connectDB()
app.use('/user-api',userApp)


//error handling middleware
app.use((err,req,res,next)=>{
   if(err.name==="ValidationError"){
    return res.status(400).json({message:"validation failed"})
   }
   if(err.name==="CastError"){
    return res.status(400).json({message:"invalid id"})
   }
    if(err.code===11000){
        return res.status(409).json({message:"duplicate key error"})
    }
    res.status(500).json({message:"internal server error"})
})