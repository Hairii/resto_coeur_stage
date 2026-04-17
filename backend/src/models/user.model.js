import db from "../config/db.js";

export const findUserByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

export const createUser = async (email, password) => {
    await db.query('INSERT INTO users (email, password) VALUES(?, ?)', [email, password]);
};

export const getAllUsers = async () => {
    const [rows] = await db.query(
        "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
};

export const deleteUser = async (id) => {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
};