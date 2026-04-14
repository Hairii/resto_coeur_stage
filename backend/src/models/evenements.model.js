import db from "../config/db.js";

export const getEvenements = async () => {
  try {
    const [evenement] = await db.query("SELECT * FROM evenements");
    return evenement;
  } catch (error) {
    console.error("erreur server (getEvenements)", error.message);
    throw error;
  }
};

export const createEvenements = async ({
  titre,
  description,
  lieu,
  date_debut,
  date_fin,
  heure_debut,
  heure_fin,
}) => {
  try {
    await db.query(
      "INSERT INTO evenements (titre, description, lieu, date_debut, date_fin, heure_debut, heure_fin) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        titre,
        description,
        lieu,
        date_debut,
        date_fin,
        heure_debut || null,
        heure_fin || null,
      ],
    );
  } catch (error) {
    console.error("erreur server (createEvenements )", error.message);
    throw error;
  }
};

export const updateEvenement = async (id, { titre, description, lieu, date_debut, date_fin, heure_debut, heure_fin }) => {
  try {
    const [result] = await db.query(
      "UPDATE evenements SET titre = ?, description = ?, lieu = ?, date_debut = ?, date_fin = ?, heure_debut = ?, heure_fin = ? WHERE id = ?",
      [titre, description, lieu, date_debut, date_fin, heure_debut || null, heure_fin || null, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("erreur server (updateEvenement)", error.message);
    throw error;
  }
};

export const deleteEvenements = async (id) => {
  try {
    const [evenement] = await db.query("DELETE FROM evenements  WHERE id = ?", [
      id,
    ]);
    return evenement.affectedRows > 0;
  } catch (error) {
    console.error("erreur server (removeEvenements)", error.message);
    throw error;
  }
};
