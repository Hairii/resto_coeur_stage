import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await argon2.hash(password);
    await createUser(email, hashedPassword);

    res.status(201).json({ message: "Compte créé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (register)" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

   res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 24h en millisecondes
});

res.json({ message: "Connexion réussie", role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (login)" });
  }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({message: "Déconnexion réussie"});
}

export const me = (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role })
};