const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const app = express()

const connectDB = require("./dbConnection/dbConnect")

//load config
dotenv.config({ path: "./config/config.env" })

const PORT = process.env.PORT

//connect DB
connectDB()

//logging morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

//creating server
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
})
