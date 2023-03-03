import { db } from "../config/database.connection.js";

export async function getRanking(){
    return db.query(
        `SELECT
            users.id,
            users.name,
            COUNT(urls.id) AS "linksCount",
            SUM(urls.visits) AS "visitCount"
        FROM users
        LEFT JOIN urls ON users.id = urls.user_id
        GROUP BY users.id
        ORDER BY "visitCount" DESC
        LIMIT 10;`);
}