import db from "../config/db.js";

export const getParticipationsByEvenement = async (evenementId) => {
  const { rows } = await db.query(
    `SELECT p.*, u.email,
       json_agg(
         json_build_object(
           'date_jour',   d.date_jour,
           'heure_debut', d.heure_debut,
           'heure_fin',   d.heure_fin
         )
       ) AS disponibilites
     FROM participations p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN disponibilites d ON d.participation_id = p.id
     WHERE p.evenement_id = $1
     GROUP BY p.id, u.email`,
    [evenementId]
  );
  return rows;
};

export const getMyParticipations = async (userId) => {
  const { rows } = await db.query(
    "SELECT * FROM participations WHERE user_id = $1",
    [userId]
  );
  return rows;
};

export const getMyDisposByEvenement = async (userId, evenementId) => {
  const { rows } = await db.query(
    `SELECT d.* FROM disponibilites d
     JOIN participations p ON p.id = d.participation_id
     WHERE p.user_id = $1 AND p.evenement_id = $2
     ORDER BY d.date_jour ASC`,
    [userId, evenementId]
  );
  return rows;
};

export const upsertParticipationAvecDispos = async (userId, evenementId, dispos) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO participations (user_id, evenement_id, statut)
       VALUES ($1, $2, 'oui')
       ON CONFLICT (user_id, evenement_id) DO UPDATE SET statut = 'oui', updated_at = NOW()`,
      [userId, evenementId]
    );

    const { rows } = await client.query(
      "SELECT id FROM participations WHERE user_id = $1 AND evenement_id = $2",
      [userId, evenementId]
    );
    const partId = rows[0].id;

    await client.query("DELETE FROM disponibilites WHERE participation_id = $1", [partId]);

    if (dispos.length > 0) {
      for (const d of dispos) {
        await client.query(
          "INSERT INTO disponibilites (participation_id, date_jour, heure_debut, heure_fin) VALUES ($1, $2, $3, $4)",
          [partId, d.date_jour, d.heure_debut || null, d.heure_fin || null]
        );
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const deleteParticipation = async (userId, evenementId) => {
  const { rowCount } = await db.query(
    "DELETE FROM participations WHERE user_id = $1 AND evenement_id = $2",
    [userId, evenementId]
  );
  return rowCount > 0;
};