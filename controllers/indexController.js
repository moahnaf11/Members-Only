const { getAllMessages, insertUser, addMessage } = require("../db/queries")
const {body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");


const validation = [
    body("firstname").trim()
    .notEmpty().withMessage("first name field cannot be empty")
    .bail()
    .isAlpha().withMessage("first name field only accpets letters A-Z"),

    body("lastname").trim()
    .notEmpty().withMessage("last name field cannot be empty")
    .bail()
    .isAlpha().withMessage("last name field only accpets letters A-Z"),

    body("mail").trim()
    .notEmpty().withMessage("email field cannot be empty")
    .bail()
    .isEmail().withMessage("please input a valid email"),

    body("pass").trim()
    .notEmpty().withMessage("password field cannot be empty"),

    body("confirm-pass").trim()
    .notEmpty().withMessage("confirm password field cannot be empty")
    .bail()
    .custom(async (value, { req }) => {
        if (value !== req.body.pass) {
            throw new Error("passwords do not match");
        }
        return true;
    })
];

const loginValidation = [
    body("email").trim()
    .notEmpty().withMessage("email field cannot be empty")
    .bail()
    .isEmail().withMessage("please input a valid email"),

    body("password").trim()
    .notEmpty().withMessage("password field cannot be empty")
];

const newMessageValidation = [
    body("title").trim()
    .notEmpty().withMessage("title field cannot be empty"),

    body("text").trim()
    .notEmpty().withMessage("text field cannot be empty")

];


const getMessages = async (req, res) => {
    const rows = await getAllMessages();
    console.log("req.user", req.user);
    res.render("home", {messages: rows, user: req.user});

}

const logOut = async (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }   else {
            console.log("req.user", req.user);
            res.redirect("/");
        }
    })
}

const loginForm = async (req, res) => {
    res.render("log-in");
}

const registerForm = async (req, res) => {
    res.render("register");
}

const submitRegisterForm = [
    validation,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.render("register", {error: errors.array()});
        }   else {
            const {firstname, lastname, email, password} = req.body;
            const result = await insertUser(firstname, lastname, email, password);
            if (!result) {
                throw new Error("user already exists please enter unique email!");
            }   else {
                res.redirect("/log-in");
            }
        }
    })
];

const submitLoginForm = [
    loginValidation,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array);
            res.render("log-in", {error: errors.array()})
        }   else {
            return next();
        }
    },
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in"
    })
];

const newMessageForm = async (req, res) => {
    res.render("message", {user: req.user});
}


const createNewMessage = [
    newMessageValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.render("message", {error: errors.array()});
        }   else {
            const {title, text} = req.body;
            const id = req.user.id;
            const newMessage = await addMessage(id, title, text);
            res.redirect("/")

        }
    }
]





module.exports = {
    getMessages,
    loginForm,
    registerForm,
    submitRegisterForm,
    submitLoginForm,
    logOut,
    newMessageForm,
    createNewMessage
}