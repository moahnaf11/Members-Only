const { getAllMessages } = require("../db/queries")


const getMessages = async (req, res) => {
    const rows = await getAllMessages();
    res.render("home", {messages: rows});

}

module.exports = {
    getMessages
}