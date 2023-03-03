import { customAlphabet } from "nanoid";
import { checkShort, checkUrl, deleteLink, insertUrl, updateVisits } from "../repositories/url.repository.js";

export async function shortenURL(req, res) {
    const { url } = req.body;
    const session = res.locals.session;
    const user_id = session.rows[0].user_id;

    const nanoid = customAlphabet("1234567890abcdef", 8);
    const short_url = nanoid();

    try {
        const shorten = await insertUrl(user_id, url, short_url);
        const response = shorten.rows[0];

        return res.status(201).json({ id: response.id, shortUrl: response.short_url });
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function getURL(req, res) {
    const { id } = req.params;

    try {
        const url = await checkUrl(id);

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
        const target = await checkShort(shortUrl);

        if (!target.rowCount) return res.status(404).send("Url não encontrada");

        res.redirect(target.rows[0].url);

        const visits = target.rows[0].visits + 1;

        await updateVisits(visits, shortUrl);

    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function deleteURL(req, res) {
    const { id } = req.params;
    const session = res.locals.session;
    const userId = session.rows[0].user_id;

    try{
        const auth = await checkUrl(id);

        if (!auth.rowCount){
            return res.status(404).send("URL não encontrada");
        }

        if (auth.rows[0].user_id !== userId){
            return res.status(401).send("Você não tem autorização para essa ação");
        }

        await deleteLink(id);

        res.sendStatus(204);
    }catch{
        return res.status(500).send(error);
    }
}