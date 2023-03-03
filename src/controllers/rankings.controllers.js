import { getRanking } from "../repositories/ranking.repository.js";


export async function getRankings(_, res){
    try{

        const info = await getRanking();

        res.status(200).send(info.rows);

    } catch (error) {
        return res.status(500).send(error);
    }
}
