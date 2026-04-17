import argon2 from "argon2";
import { findUserByEmail, createUser, getAllUsers, deleteUser } from "../models/user.model.js";

export const getBenevoles = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur (getBenevoles)" });
    }
};

export const createBenevole = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(409).json({ message: "Cet email est déjà utilisé" });
        }

        const hashedPassword = await argon2.hash(password);
        await createUser(email, hashedPassword);

        res.status(201).json({ message: "Compte bénévole créé" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur (createBenevole)" });
    }
};

export const removeBenevole = async (req, res) => {
    try {
        const { id } = req.params;

        // Empêcher l'admin de se supprimer lui-même
        if (+id === req.user.id) {
            return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
        }

        const deleted = await deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }
        res.json({ message: "Compte supprimé" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur (removeBenevole)" });
    }
};