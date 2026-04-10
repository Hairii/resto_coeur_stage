import db from "../config/db.js";

export const getParticipationsByEvenement = async (evenementId) => {
  const [rows] = await db.query(
    `SELECT p.*, u.email FROM participations p 
     JOIN users u ON u.id = p.user_id 
     WHERE p.evenement_id = ?`,
    [evenementId]
  );
  return rows;
};

export const getMyParticipations = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM participations WHERE user_id = ?",
    [userId]
  );
  return rows;
};

export const upsertParticipation = async (userId, evenementId, { statut, heure_debut, heure_fin }) => {
  await db.query(
    `INSERT INTO participations (user_id, evenement_id, statut, heure_debut, heure_fin)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE statut = ?, heure_debut = ?, heure_fin = ?, updated_at = NOW()`,
    [userId, evenementId, statut, heure_debut, heure_fin,
     statut, heure_debut, heure_fin]
  );
};

export const deleteParticipation = async (userId, evenementId) => {
  const [result] = await db.query(
    "DELETE FROM participations WHERE user_id = ? AND evenement_id = ?",
    [userId, evenementId]
  );
  return result.affectedRows > 0;
};