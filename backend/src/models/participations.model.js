import db from "../config/db.js";

// Participations──

export const getParticipationsByEvenement = async (evenementId) => {
  const [rows] = await db.query(
    `SELECT p.*, u.email,
       JSON_ARRAYAGG(
         JSON_OBJECT(
           'date_jour',   d.date_jour,
           'heure_debut', d.heure_debut,
           'heure_fin',   d.heure_fin
         )
       ) AS disponibilites
     FROM participations p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN disponibilites d ON d.participation_id = p.id
     WHERE p.evenement_id = ?
     GROUP BY p.id`,
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

export const getMyDisposByEvenement = async (userId, evenementId) => {
  const [rows] = await db.query(
    `SELECT d.* FROM disponibilites d
     JOIN participations p ON p.id = d.participation_id
     WHERE p.user_id = ? AND p.evenement_id = ?
     ORDER BY d.date_jour ASC`,
    [userId, evenementId]
  );
  return rows;
};

export const upsertParticipationAvecDispos = async (userId, evenementId, dispos) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    
    await conn.query(
      `INSERT INTO participations (user_id, evenement_id, statut)
       VALUES (?, ?, 'oui')
       ON DUPLICATE KEY UPDATE statut = 'oui', updated_at = NOW()`,
      [userId, evenementId]
    );

    // Récupérer l'id de la participation
    const [[part]] = await conn.query(
      "SELECT id FROM participations WHERE user_id = ? AND evenement_id = ?",
      [userId, evenementId]
    );

    // Supprimer les anciennes dispos
    await conn.query(
      "DELETE FROM disponibilites WHERE participation_id = ?",
      [part.id]
    );

    // Insérer les nouvelles dispos
    if (dispos.length > 0) {
      const values = dispos.map((d) => [part.id, d.date_jour, d.heure_debut || null, d.heure_fin || null]);
      await conn.query(
        "INSERT INTO disponibilites (participation_id, date_jour, heure_debut, heure_fin) VALUES ?",
        [values]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const deleteParticipation = async (userId, evenementId) => {
  const [result] = await db.query(
    "DELETE FROM participations WHERE user_id = ? AND evenement_id = ?",
    [userId, evenementId]
  );
  return result.affectedRows > 0;
};