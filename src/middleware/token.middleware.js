import { db } from "../config/database.connection.js";

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) return res.status(401).send("Credenciais de autenticação inválidas");

    try {
        const session = await db.query(
            "SELECT * FROM sessions WHERE token = $1",
            [token]
        );

        if (session.rows.length === 1) {
            res.locals.session = session;
            next();
        } else {
            return res.status(401).send("Token inválido!");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}
