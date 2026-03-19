import {
getEvenements,
createEvenements,
deleteEvenements
} from '../models/evenements.model.js';

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
    try{
        const {titre , description, lieu, date_debut, date_fin} =req.body;
        await createEvenements({titre, description, lieu, date_debut, date_fin});
        res.status(201).json({message: 'Evenement ajouté'});
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'erreur server (addEvenements)'});
    }
};

export const removeEvenements = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteEvenements(id);
        if (!deleted) {
            res.status(404).json({ message: 'Evenement introuvable' });
        } else {
            res.json({ message: 'Evenement supprimé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'erreur serveur (removeEvenements)' });
    }
};