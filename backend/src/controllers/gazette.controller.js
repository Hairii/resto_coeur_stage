import {
  getGazettes,
  getGazetteById,
  createGazette,
  deleteGazette,
} from "../models/gazette.model.js";

export const getAllGazettes = async (req, res) => {
  try {
    const gazettes = await getGazettes();
    res.json(gazettes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "erreur server (getAllGazettes)" });
  }
};

export const addGazettes = async (req, res) => {
  try {
    const { titre, description, fichier_pdf } = req.body;
    await createGazette({ titre, description, fichier_pdf });
    res.status(201).json({ message: "Gazette ajoutée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "erreur server (addGazettes)" });
  }
};

export const getOneGazette = async (req, res) => {
  try {
    const gazette = await getGazetteById(req.params.id);
    res.json(gazette);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "erreur server (getOneGazette)" });
  }
};

export const removeGazette = async (req, res) => {
  try {
    const { id } = req.params;
    const removeGazette = await deleteGazette(id);
    if (!removeGazette) {
      res.status(404).json({ message: "Gazette introuvable" });
    } else {
      res.json({ message: "Gazette supprimée" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "erruer server (removeGazette)" });
  }
};
