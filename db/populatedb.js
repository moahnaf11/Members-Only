#! /usr/bin/env node

const bcrypt = require("bcryptjs");

const { Client } = require("pg");
require("dotenv").config();


const createPeopleTable = `
    CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        membership_status BOOLEAN DEFAULT false
    );
`;

const insertPeople = `
    INSERT INTO people
    (firstName, lastName, email, password)
    VALUES 
        ('Mohammad', 'Ahnaf', 'mohammadahnaf123@gmail.com', $1)
    RETURNING *;
`;

const createMembersTable = `
    CREATE TABLE IF NOT EXISTS messages (
        user_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        text VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES people(id) ON DELETE CASCADE
    );
`;


const insertMessages = `
    INSERT INTO messages
    (user_id, title, text)
    VALUES
        ($1, 'Introductory', 'hello there');
`;






async function main() {
    console.log("seeding...");
    const client = new Client({
      host: process.env.DB_HOST, // or wherever the db is hosted
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432 // The default port
    });
    const hashed = await bcrypt.hash("Ahnaf135", 10);
    await client.connect();
    await client.query(createPeopleTable);
    const {rows} = await client.query(insertPeople, [hashed]);
    await client.query(createMembersTable);
    await client.query(insertMessages, [rows[0].id]);
    await client.end();
    console.log("done");
}
  
main();