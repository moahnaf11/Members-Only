const express = require("express");
const path = require("path");
const pool = require("./db/pool");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const indexRouter = require("./routes/indexRoutes");
const { getUser } = require("./db/queries");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const PORT = process.env.PORT || 8080;

// passport config

const customFields = {
    userNameField: "email"
};

const verify = async (email, password, done) => {
    try {
        const rows = await getUser(email);
        const user = rows[0];

        if (!user) {
            return done(null, false, {message: "user not found"});
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, {message: "incorrect password"});
        }

        return done(null, user);

    }   catch (err) {
        return done(err);
    }
}

passport.use(
    new LocalStrategy(customFields, verify)
)



const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ 
    secret: process.env.COOKIE_SECRET, 
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    resave: false, 
    saveUninitialized: false,
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000  // Session expiry (30 days in milliseconds)
    }
}));

app.use(passport.session());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);


app.use((err, req, res, next) => {
    res.status(500).json({error: err.message})
});
app.listen(PORT, () => console.log(`listening on port ${PORT}`));







