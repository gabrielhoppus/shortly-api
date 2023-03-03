import { db } from "../config/database.connection.js";

export async function insertUrl(id, url, short){
    return db.query(
        `INSERT INTO urls (user_id , url, short_url) VALUES ($1, $2, $3) RETURNING *`,
            [id, url, short]);
}

export async function checkUrl(id){
    return db.query("SELECT * FROM urls WHERE id = $1;", [id]);
}

export async function checkShort(short){
    return db.query(`SELECT * FROM urls WHERE short_url = $1;`, [short]);
}

export async function updateVisits(visits, short){
    return db.query("UPDATE urls SET visits = $1 WHERE short_url = $2", [visits, short]);
}

export async function deleteLink(id){
    return db.query("DELETE FROM urls WHERE id = $1;", [id]);
}