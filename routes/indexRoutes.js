const express = require("express");
const { getMessages, loginForm, registerForm, submitRegisterForm } = require("../controllers/indexController");
const router = express.Router();

router.get("/", getMessages);

router.get("/log-in", loginForm);

router.route("/register").get(registerForm).post(submitRegisterForm);


module.exports = router;