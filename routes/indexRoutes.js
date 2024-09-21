const express = require("express");
const { getMessages, loginForm, registerForm, submitRegisterForm, submitLoginForm } = require("../controllers/indexController");
const router = express.Router();

router.get("/", getMessages);

router.route("/log-in").get(loginForm).post(submitLoginForm);

router.route("/register").get(registerForm).post(submitRegisterForm);


module.exports = router;