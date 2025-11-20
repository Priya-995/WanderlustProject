const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const {saveRedirectUrl}=require('../middleware.js')
const UserController=require("../controllers/users.js")

router.get("/signup", UserController.renderSignupForm);

router.post(
  "/signup",
  wrapAsync(UserController.signup)
);

router.get("/login",saveRedirectUrl,UserController.renderLoginForm );

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "true",
  }),
  wrapAsync(UserController.login)
);

router.get("/logout",UserController.logout);
module.exports = router;
