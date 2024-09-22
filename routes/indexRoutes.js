const express = require("express");
const { getMessages, loginForm, registerForm, submitRegisterForm, submitLoginForm, logOut, newMessageForm, createNewMessage, secretMemberForm, submitSecretMemberForm, deleteMessage } = require("../controllers/indexController");
const router = express.Router();

router.get("/", getMessages);

router.route("/log-in").get(loginForm).post(submitLoginForm);

router.get("/log-out", logOut);
router.route("/new-message").get(newMessageForm).post(createNewMessage);
router.route("/club-member").get(secretMemberForm).post(submitSecretMemberForm)
router.route("/register").get(registerForm).post(submitRegisterForm);

router.post("/deletemsg", deleteMessage);


module.exports = router;