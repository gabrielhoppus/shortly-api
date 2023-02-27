import { db } from "../config/database.connection.js";
import { customAlphabet } from "nanoid";

export async function shortenURL(req, res) {
    const { url } = req.body;
    const session = res.locals.session
    const user_id = session.rows[0].user_id;

    const nanoid = customAlphabet("1234567890abcdef", 8);
    const short_url = nanoid();

    try {
        const shorten = await db.query(
            `
        	INSERT INTO urls (user_id , url, short_url) VALUES ($1, $2, $3) RETURNING *
        `,
            [user_id, url, short_url]
        );
        const response = shorten.rows[0];

        return res.status(201).json({ id: response.id, shortUrl: response.short_url });
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function getURL(req, res) {
    const { id } = req.params;

    try {
        const url = await db.query("SELECT * FROM urls WHERE id = $1;", [id])

        if (url.rowCount) {
            res.status(200).json({ id: url.rows[0].id, url: url.rows[0].url, shortUrl : url.rows[0].short_url })
        } else {
            return res.status(404).send("Url não encontrada");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function openURL(req, res) {
    const { shortUrl  } = req.params;

    try {
        const target = await db.query(`SELECT * FROM urls WHERE short_url = $1;`, [shortUrl])

        if (!target.rowCount){
            return res.status(404).send("Url não encontrada");
        }

        res.redirect(target.rows[0].url)

        const visits = target.rows[0].visits + 1;

        await db.query("UPDATE urls SET visits = $1 WHERE short_url = $2", [visits, shortUrl]);

    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function deleteURL(req, res) {
    const { id } = req.params;
    const session = res.locals.session
    const userId = session.rows[0].user_id;

    try{

        const auth = await db.query("SELECT * FROM urls WHERE id = $1;", [id])

        if (!auth.rowCount){
            return res.status(404).send("URL não encontrada")
        } 

        if (auth.rows[0].user_id !== userId){
            return res.status(401).send("Você não tem autorização para essa ação")
        }

        await db.query("DELETE FROM urls WHERE id = $1;", [id])

        res.sendStatus(204)
    }catch{
        return res.status(500).send(error);
    }
}