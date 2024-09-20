const pool = require("./pool");


async function getUser (email) {
    const {rows} = await pool.query("SELECT * FROM people WHERE email LIKE $1", [email]);
    console.log(rows);
    return rows;
}

async function getAllMessages () {
    const {rows} = await pool.query("SELECT * FROM people INNER JOIN messages ON people.id = messages.user_id ")
    console.log(rows);
    return rows;
}


module.exports = {
    getUser,
    getAllMessages
}