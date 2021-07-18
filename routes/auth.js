const express = require("express")
const passport = require("passport")
const router = express.Router()

/**
 * @desc auth with google
 * @route GET /auth/google
 */

router.get("/google", passport.authenticate("google", { scope: ["profile"] }))

/**
 * @desc google auth callback
 * @route GET /auth/google/callback
 */

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard")
  }
)

/**
 * @desc logout user
 * @route GET /auth/logout
 */

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})
module.exports = router
