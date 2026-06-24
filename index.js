import express from "express";
import mongoose from "mongoose";


const app = express()
app.use(cors())

app.use(express.json())

const connectionString = process.env.MONGO_URI


mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database connected Successfully")
    }
).catch(
    ()=>{
        console.log("Database connection failed")
    }
)

app.listen(5000, 
    ()=>{
        console.log("Server is running on port 5000")
    }
)