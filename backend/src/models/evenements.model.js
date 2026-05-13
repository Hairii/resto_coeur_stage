import db from "../config/db.js";

export const getEvenements = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM evenements ORDER BY date_debut ASC");
    return rows;
  } catch (error) {
    console.error("erreur server (getEvenements)", error.message);
    throw error;
  }
};

export const createEvenements = async ({ titre, description, lieu, date_debut, date_fin, heure_debut, heure_fin }) => {
  try {
    await db.query(
      "INSERT INTO evenements (titre, description, lieu, date_debut, date_fin, heure_debut, heure_fin) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [titre, description || null, lieu || null, date_debut, date_fin || null, heure_debut || null, heure_fin || null]
    );
  } catch (error) {
    console.error("erreur server (createEvenements)", error.message);
    throw error;
  }
};

export const updateEvenement = async (id, { titre, description, lieu, date_debut, date_fin, heure_debut, heure_fin }) => {
  try {
    const { rowCount } = await db.query(
      "UPDATE evenements SET titre = $1, description = $2, lieu = $3, date_debut = $4, date_fin = $5, heure_debut = $6, heure_fin = $7 WHERE id = $8",
      [titre, description || null, lieu || null, date_debut, date_fin || null, heure_debut || null, heure_fin || null, id]
    );
    return rowCount > 0;
  } catch (error) {
    console.error("erreur server (updateEvenement)", error.message);
    throw error;
  }
};

export const deleteEvenements = async (id) => {
  try {
    const { rowCount } = await db.query("DELETE FROM evenements WHERE id = $1", [id]);
    return rowCount > 0;
  } catch (error) {
    console.error("erreur server (deleteEvenements)", error.message);
    throw error;
  }
};