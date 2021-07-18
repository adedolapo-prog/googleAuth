const mongoose = require("mongoose")

module.exports = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    console.log("awesome, connected to db")
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
