const express = require('express')
const app = express()
const dotenv = require('dotenv')

dotenv.config()
const mongoose = require('mongoose')

app.get("/",(req,res)=>{
    res.send('hello from backend')
})

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error.message)
    }
}

connectDB();

const port = process.env.PORT 

app.listen(port,()=>{
    console.log('Server is running on port ' + port)
})