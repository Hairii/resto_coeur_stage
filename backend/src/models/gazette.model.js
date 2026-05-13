import db from "../config/db.js";

export const getGazettes = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM gazettes ORDER BY created_at DESC");
    return rows;
  } catch (error) {
    console.error("erreur server (getGazettes)", error.message);
    throw error;
  }
};

export const createGazette = async ({ titre, description, fichier_pdf }) => {
  try {
    await db.query(
      "INSERT INTO gazettes (titre, description, fichier_pdf) VALUES ($1, $2, $3)",
      [titre, description || null, fichier_pdf]
    );
  } catch (error) {
    console.error("erreur server (createGazette)", error.message);
    throw error;
  }
};

export const getGazetteById = async (id) => {
  try {
    const { rows } = await db.query("SELECT * FROM gazettes WHERE id = $1", [id]);
    return rows[0];
  } catch (error) {
    console.error("erreur server (getGazetteById)", error.message);
    throw error;
  }
};

export const updateGazette = async (id, { titre, description }) => {
  try {
    const { rowCount } = await db.query(
      "UPDATE gazettes SET titre = $1, description = $2 WHERE id = $3",
      [titre, description || null, id]
    );
    return rowCount > 0;
  } catch (error) {
    console.error("erreur server (updateGazette)", error.message);
    throw error;
  }
};

export const deleteGazette = async (id) => {
  try {
    const { rowCount } = await db.query("DELETE FROM gazettes WHERE id = $1", [id]);
    return rowCount > 0;
  } catch (error) {
    console.error("erreur server (deleteGazette)", error.message);
    throw error;
  }
};