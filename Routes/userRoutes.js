const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares.js");

const userController = require("../controllers/user.js");

//signup
router.get("/signup", userController.renderSignUpForm);
router.post("/signup", userController.signUp);

//login
router.get("/login", userController.renderLoginForm);

router.post("/login", userController.login);

//log-out
router.get("/logout", isLoggedIn, userController.logout);
module.exports = router;
