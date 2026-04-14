import {
  getEvenements,
  createEvenements,
  deleteEvenements,
  updateEvenement,
} from "../models/evenements.model.js";

export const getAllEvenements = async (req, res) => {
  try {
    const evenements = await getEvenements();
    res.json(evenements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "erreur server (getAllEvenements)" });
  }
};

export const addEvenements = async (req, res) => {
  try {
    const {
      titre,
      description,
      lieu,
      date_debut,
      date_fin,
      heure_debut,
      heure_fin,
    } = req.body;
    await createEvenements({
      titre,
      description,
      lieu,
      date_debut,
      date_fin,
      heure_debut,
      heure_fin,
    });
    res.status(201).json({ message: "Evenement ajouté" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "erreur server (addEvenements)" });
  }
};

export const editEvenement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titre,
      description,
      lieu,
      date_debut,
      date_fin,
      heure_debut,
      heure_fin,
    } = req.body;
    const updated = await updateEvenement(id, {
      titre,
      description,
      lieu,
      date_debut,
      date_fin,
      heure_debut,
      heure_fin,
    });
    if (!updated) {
      return res.status(404).json({ message: "Événement introuvable" });
    }
    res.json({ message: "Événement modifié" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (editEvenement)" });
  }
};

export const removeEvenements = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteEvenements(id);
    if (!deleted) {
      res.status(404).json({ message: "Evenement introuvable" });
    } else {
      res.json({ message: "Evenement supprimé" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "erreur serveur (removeEvenements)" });
  }
};
