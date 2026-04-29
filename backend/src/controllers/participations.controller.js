import {
  getParticipationsByEvenement,
  getMyParticipations,
  getMyDisposByEvenement,
  upsertParticipationAvecDispos,
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

// GET pour un evenement
export const getMesDispos = async (req, res) => {
  try {
    const rows = await getMyDisposByEvenement(req.user.id, req.params.evenementId);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (getMesDispos)" });
  }
};

export const saveDispos = async (req, res) => {
  try {
    const { dispos } = req.body;

    if (!Array.isArray(dispos)) {
      return res.status(400).json({ message: "dispos doit être un tableau" });
    }
    for (const d of dispos) {
      if (!d.date_jour || !/^\d{4}-\d{2}-\d{2}$/.test(d.date_jour)) {
        return res.status(400).json({ message: `date_jour invalide : ${d.date_jour}` });
      }
    }

    await upsertParticipationAvecDispos(req.user.id, req.params.evenementId, dispos);
    res.json({ message: "Disponibilités enregistrées" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (saveDispos)" });
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