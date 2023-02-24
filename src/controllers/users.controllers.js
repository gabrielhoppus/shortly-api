import { db } from "../config/database.connection.js";

export async function getUser(req, res){
    const session = res.locals.sessions
    const user_id = session.rows[0].user_id
}
