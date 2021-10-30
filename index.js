import express from 'express'
import mongoose from 'mongoose'
import router from './controller/index.js'
import logger from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

const instance = process.env.INSTANCE
const mongoURI = process.env[`${instance}_MONGODB_URI`]
const mongoParams = process.env[`${instance}_MONGODB_PARAM`]

const mongoDBName = process.env.MONGODB_DB

const connectDB = async () => {
    const db = await mongoose.connect(`${mongoURI}/${mongoDBName}${mongoParams}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    console.log(`MongoDB Connected: ${db.connection.host}`)
  }
connectDB()

const app = express()
const port = 4000

app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.use(logger('dev'))

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  next();
});
app.use('/', router)

app.listen(port, () => {
  console.log(`App listening at Port ${port}`)
})