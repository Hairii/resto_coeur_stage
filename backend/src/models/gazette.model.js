import db from "../config/db.js";

export const getGazettes = async () => {
  try {
    const [gazettes] = await db.query(
      "SELECT * FROM gazettes ORDER BY created_at DESC",
    );
    return gazettes;
  } catch (error) {
    console.error("erreur server (getGazettes)", error.message);
    throw error;
  }
};

export const createGazette = async ({ titre, description, fichier_pdf }) => {
  try {
    await db.query(
      "INSERT INTO gazettes (titre, description, fichier_pdf) VALUES (?, ?, ?)",
      [titre, description || null, fichier_pdf],
    );
  } catch (error) {
    console.error("erreur server (createGazette)", error.message);
    throw error;
  }
};

export const getGazetteById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM gazettes WHERE id = ?", [id]);
    return rows[0];
  } catch (error) {
    console.error("erreur server (getGazetteById)", error.message);
    throw error;
  }
};

export const updateGazette = async (id, { titre, description }) => {
  try {
    const [result] = await db.query(
      "UPDATE gazettes SET titre = ?, description = ? WHERE id = ?",
      [titre, description || null, id],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("erreur server (updateGazette)", error.message);
    throw error;
  }
};

export const deleteGazette = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM gazettes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("erreur server (deleteGazette)", error.message);
    throw error;
  }
};
