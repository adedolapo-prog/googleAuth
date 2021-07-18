const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const morgan = require("morgan")
const exphbs = require("express-handlebars")
const app = express()
const indexRoute = require("./routes/index")
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

//handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", ".hbs")

//static folders
app.use(express.static(path.join(__dirname, "public")))

//routes
app.use("/", indexRoute)

//creating server
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
})
