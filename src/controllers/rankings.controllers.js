import { db } from "../config/database.connection.js";

export async function getRankings(_, res){
    try{

        const info = await db.query(`SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", SUM(urls.visits) AS "visitCount"
        FROM users LEFT JOIN urls ON users.id = urls.user_id GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10;;`)

        res.status(200).send(info.rows)

    } catch (error) {
        return res.status(500).send(error);
    }
}
