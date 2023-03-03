import { db } from "../config/database.connection.js";

export async function userUrls(id){
    return db.query(
        `SELECT
            id,
            short_url AS "shortUrl",
            url,
            visits AS "visitCount"
        FROM urls
        WHERE user_id = $1`,
            [id]
    );
}

export async function userInfo(id){
    return db.query(`
    SELECT
        id,
        name,
        (SELECT SUM(visits) FROM urls WHERE user_id = $1) as visitCount
    FROM users
    WHERE id = $1;
`, [id]);
}