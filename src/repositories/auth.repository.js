import { db } from "../config/database.connection.js";

export async function uniqueUser(email){
    return db.query("SELECT * FROM users WHERE email = $1",
        [email]);
}

export async function insertUser(name, email, password){
    return db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
        [name, email, password]);
}

export async function insertSession(id, token){
    return db.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2);",
        [id, token]);
}