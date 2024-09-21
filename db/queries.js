const pool = require("./pool");
const bcrypt =require("bcryptjs");


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

async function insertUser (firstname, lastname, email, password) {
    try {
        const {rows} = await pool.query("SELECT * FROM people WHERE email = $1", [email]);
        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `
            INSERT INTO people 
            (firstname, lastname, email, password)
            VALUES 
                ($1, $2, $3, $4)
            RETURNING *;
            `;
            const {rows} = await pool.query(sql, [firstname, lastname, email, hashedPassword]);
            console.log(rows);
            return true;

        }   else {
            return false;
        }

    }   catch(err) {
        console.log(err)
    }
};

async function addMessage (id, title, text) {
    const sql = `
    INSERT INTO messages
    (user_id, title, text)
    VALUES 
        ($1, $2, $3)
    RETURNING *;
    `;

    const {rows} = await pool.query(sql, [id, title, text]);
    console.log(rows);
    return rows;

}


module.exports = {
    getUser,
    getAllMessages,
    insertUser,
    addMessage
}