import db from "../config/db.js";

export const findUserByEmail = async (email) => {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0];
};

export const createUser = async (email, password, role = "bénévole") => {
  await db.query("INSERT INTO users (email, password, role) VALUES ($1, $2, $3)", [email, password, role]);
};

export const getAllUsers = async () => {
  const { rows } = await db.query(
    "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC"
  );
  return rows;
};

export const deleteUser = async (id) => {
  const { rowCount } = await db.query("DELETE FROM users WHERE id = $1", [id]);
  return rowCount > 0;
};