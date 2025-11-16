const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");
const {saveRedirectUrl}=require('../middleware.js')

router.get("/signup", async (req, res) => {
  res.render("users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      let registeredUser = await User.register(newUser, password);
      // - After signup → user is created but NOT logged in
      // - Passport gives `req.login()` to log them in programmatically
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      // if already registerd user tries to signup again
      req.flash("failure", e.message);
      res.redirect("/signup");
    }
  })
);
router.get("/login",saveRedirectUrl, async (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "true",
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl||"/listings"
    res.redirect(redirectUrl);
  })
);
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});
module.exports = router;
