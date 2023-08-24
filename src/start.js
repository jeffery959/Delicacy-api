import express from 'express';
import UserRouter from '../router/UserRouter.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import colors from 'colors';
import cors from 'cors'
dotenv.config()
const app=express()
const Port = process.env.PORT
const MongoDB_URI = process.env.MONGODB_URI

//Middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
//dbConfig
mongoose.connect(`${MongoDB_URI}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{console.log('Mogodb database connected'.underline.blue)})
.catch((err)=>{console.log('Error connecting to MongoDB:',err.message)})


//Routing
app.use('/router',UserRouter)

//Middleware
app.listen(Port,()=>console.log("connected to http://localhost:"+Port))