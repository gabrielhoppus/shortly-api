import { db } from "../config/database.connection.js";

export async function getUser(_, res) {
    const session = res.locals.session
    const userId = session.rows[0].user_id


    try {

        const urls = await db.query(
            `
            SELECT 
            id,
            short_url AS "shortUrl",
            url,
            visits as "visitCount"
            FROM urls WHERE user_id = $1`,
                [userId]
        )

        const info = await db.query(`
            SELECT id, name,
            (SELECT SUM(visits) FROM urls WHERE user_id = $1) as visitCount
            FROM users
            WHERE id = $1;
        `, [userId])


        const ObjectResponse = {
            id: info.rows[0].id,
			name: info.rows[0].name,
			visitCount: info.rows[0].visitcount,
			shortenedUrls: urls.rows,
        }
        return res.status(200).send(ObjectResponse);

    } catch (error) {
        return res.status(500).send(error);
    }



}
