const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/users.js");

//router.route of /signup router for get and post method
router.route("/signup").get(userController.renderSignupForm).post(wrapAsync(userController.signUp));


//router.route of /login router for get and post method
router.route("/login").get(userController.renderLoginForm).post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash: true}),userController.login);

//logout user 
router.get("/logout",userController.logoutUser);


// // render signup page
// router.get("/signup",userController.renderSignupForm);

// //post signup page
// router.post("/signup", wrapAsync(userController.signUp));

// //login router for user
// router.get("/login",userController.renderLoginForm);


// // post login router for user
// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash: true}),userController.login);


module.exports = router;