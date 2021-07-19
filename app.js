const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const morgan = require("morgan")
const passport = require("passport")
const session = require("express-session")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
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

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

//connect DB
connectDB()

//logging morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

//handlebars helper
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs")

//handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
)
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

//set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

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
