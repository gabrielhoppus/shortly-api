import { stripHtml } from "string-strip-html";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { insertSession, insertUser, uniqueUser } from "../repositories/auth.repository.js";

export async function createUser(req, res) {
    let { name, email, password } = req.body;

    name = stripHtml(name).result.trim();
    email = stripHtml(email).result.trim();
    password = stripHtml(password).result.trim();
    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const unique = await uniqueUser(email);

        if (unique.rowCount) {
            return res.status(409).send("User already exists");
        }

        await insertUser(name, email, passwordHash);

        res.status(201).send("Usuário criado com sucesso!");
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function loginUser(req, res) {
    let { email, password } = req.body;

    email = stripHtml(email).result.trim();
    password = stripHtml(password).result.trim();

    const user = await uniqueUser(email);

    if (user.rowCount && bcrypt.compareSync(password, user.rows[0].password)) {
        const userId = user.rows[0].id;
        const token = uuid();
        await insertSession(userId, token);
        const body = { token };
        res.status(200).send(body);
    } else {
        res.status(401).send("Usuário não encontrado. Email ou senha incorretos");
    }
}