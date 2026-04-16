import {
  getParticipationsByEvenement,
  getMyParticipations,
  upsertParticipation,
  deleteParticipation,
} from "../models/participations.model.js";

export const getParticipants = async (req, res) => {
  try {
    const rows = await getParticipationsByEvenement(req.params.id);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (getParticipants)" });
  }
};

export const myParticipations = async (req, res) => {
  try {
    const rows = await getMyParticipations(req.user.id);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (myParticipations)" });
  }
};

export const saveParticipation = async (req, res) => {
  try {
    const { statut, heure_debut, heure_fin } = req.body;
    if (!statut || !["oui", "non"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide (oui | non)" });
    }
    await upsertParticipation(req.user.id, req.params.evenementId, {
      statut,
      heure_debut: heure_debut || null,
      heure_fin: heure_fin || null,
    });
    res.json({ message: "Participation enregistrée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (saveParticipation)" });
  }
};

export const removeParticipation = async (req, res) => {
  try {
    const deleted = await deleteParticipation(req.user.id, req.params.evenementId);
    if (!deleted) {
      return res.status(404).json({ message: "Participation introuvable" });
    }
    res.json({ message: "Participation annulée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (removeParticipation)" });
  }
};