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