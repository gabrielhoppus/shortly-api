import { db } from "../config/database.connection.js";
import { stripHtml } from "string-strip-html";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function createUser(req, res) {
    let { name, email, password, confirmPassword} = req.body;

    name = stripHtml(name).result.trim();
    email = stripHtml(email).result.trim();
    password = stripHtml(password).result.trim();
    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const unique = await db.query("SELECT * FROM users WHERE email = $1", [email])

        if (unique.rowCount) {
            return res.status(409).send("User already exists");
        }

        await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;", [name, email, passwordHash]);

        res.status(201).send("Usuário criado com sucesso!")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function loginUser(req, res) {
    let { email, password } = req.body;

    email = stripHtml(email).result.trim();
    password = stripHtml(password).result.trim();

    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    

    if (user.rowCount && bcrypt.compareSync(password, user.rows[0].password)) {
        const user_id = user.rows[0].id
        const token = uuid();
        await db.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2);", [user_id, token])
        const body = { token };
        res.status(200).send(body);
    } else {
        res.status(401).send("Usuário não encontrado. Email ou senha incorretos");
    }
}