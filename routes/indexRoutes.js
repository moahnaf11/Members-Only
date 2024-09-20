const express = require("express");
const { getMessages } = require("../controllers/indexController");
const router = express.Router();

router.get("/", getMessages);


module.exports = router;