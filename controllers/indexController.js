const { getAllMessages } = require("../db/queries")
const {body, validationResult} = require("express-validator");

const validation = [
    body("firstname").trim()
    .notEmpty().withMessage("first name field cannot be empty")
    .bail()
    .isAlpha().withMessage("first name field only accpets letters A-Z"),

    body("lastname").trim()
    .notEmpty().withMessage("last name field cannot be empty")
    .bail()
    .isAlpha().withMessage("last name field only accpets letters A-Z"),

    body("email").trim()
    .notEmpty().withMessage("email field cannot be empty")
    .bail()
    .isEmail().withMessage("please input a valid email"),

    body("pass").trim(),

    body("confirm-pass").trim()
    .custom(async (value, { req }) => {
        if (value !== req.body.pass) {
            throw new Error("passwords do not match");
        }
        return true;
    })
]


const getMessages = async (req, res) => {
    const rows = await getAllMessages();
    res.render("home", {messages: rows});

}

const loginForm = async (req, res) => {
    res.render("log-in");
}

const registerForm = async (req, res) => {
    res.render("register");
}

const submitRegisterForm = [
    validation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("register", {error: errors.array()});
        }   else {
            res.redirect("/log-in");
        }
    }
]




module.exports = {
    getMessages,
    loginForm,
    registerForm,
    submitRegisterForm
}