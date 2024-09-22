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

async function insertUser (firstname, lastname, mail, pass, admin) {
    try {
        const isAdmin = admin === "on" ? true : false;
        const {rows} = await pool.query("SELECT * FROM people WHERE email = $1", [mail]);
        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash(pass, 10);

            const sql = `
            INSERT INTO people 
            (firstname, lastname, email, password, admin)
            VALUES 
                ($1, $2, $3, $4, $5)
            RETURNING *;
            `;
            const {rows} = await pool.query(sql, [firstname, lastname, mail, hashedPassword, isAdmin]);
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

async function updateMembershipStatus(id) {
    const sql = `
    UPDATE people
    SET membership_status = true
    WHERE id = $1
    RETURNING *;
    `;

    const {rows} = await pool.query(sql, [id]);
    console.log(rows);
    return rows;
}

async function resetMembershipStatus(id) {
    const sql = `
    UPDATE people
    SET membership_status = false
    WHERE id = $1
    RETURNING *;
    `;

    const {rows} = await pool.query(sql, [id]);
    console.log(rows);
    return rows;
}

async function deleteUserMessage (id) {
    const sql = `
    DELETE FROM messages
    WHERE message_id = $1
    RETURNING *;
    `;
    const {rows} = await pool.query(sql, [id]);
    console.log(rows);
    return rows;

}


module.exports = {
    getUser,
    getAllMessages,
    insertUser,
    addMessage,
    updateMembershipStatus,
    resetMembershipStatus,
    deleteUserMessage
}