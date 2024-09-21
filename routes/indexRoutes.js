const express = require("express");
const { getMessages, loginForm, registerForm, submitRegisterForm, submitLoginForm, logOut, newMessageForm, createNewMessage } = require("../controllers/indexController");
const router = express.Router();

router.get("/", getMessages);

router.route("/log-in").get(loginForm).post(submitLoginForm);

router.get("/log-out", logOut);
router.route("/new-message").get(newMessageForm).post(createNewMessage);

router.route("/register").get(registerForm).post(submitRegisterForm);


module.exports = router;