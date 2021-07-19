const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const morgan = require("morgan")
const passport = require("passport")
const session = require("express-session")
const exphbs = require("express-handlebars")
const MongoStore = require("connect-mongo")
const app = express()
const indexRoute = require("./routes/index")
const authRoute = require("./routes/auth")
const storyRoute = require("./routes/stories")
const connectDB = require("./dbConnection/dbConnect")

//load config
dotenv.config({ path: "./config/config.env" })

//passport config
require("./dbConnection/passport")(passport)

const PORT = process.env.PORT

//parsing input
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//connect DB
connectDB()

//logging morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

//handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", ".hbs")

//sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
)

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folders
app.use(express.static(path.join(__dirname, "public")))

//routes
app.use("/", indexRoute)
app.use("/auth", authRoute)
app.use("/stories", storyRoute)

//creating server
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
})
