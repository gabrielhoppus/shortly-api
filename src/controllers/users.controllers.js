import { userInfo, userUrls } from "../repositories/user.repository.js";

export async function getUser(_, res) {
    const session = res.locals.session;
    const userId = session.rows[0].user_id;

    try {
        const urls = await userUrls(userId);

        const info = await userInfo(userId);

        const ObjectResponse = {
            id: info.rows[0].id,
			name: info.rows[0].name,
			visitCount: info.rows[0].visitcount !== null ? info.rows[0].visitcount : 0,
			shortenedUrls: urls.rows,
        };

        return res.status(200).send(ObjectResponse);

    } catch (error) {
        return res.status(500).send(error);
    }
}
