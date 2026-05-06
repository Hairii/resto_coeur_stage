import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/user.model.js";


const setAccessToken = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });
  return token;
};

const setRefreshToken = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });
  return token;
};


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

    const payload = { id: user.id, email: user.email, role: user.role };

    setAccessToken(res, payload);
    setRefreshToken(res, payload);

    res.json({ message: "Connexion réussie", role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (login)" });
  }
};

export const refresh = (req, res) => {
  const token = req.cookies.refresh_token;

  if (!token) {
    return res.status(401).json({ message: "Refresh token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const payload = { id: decoded.id, email: decoded.email, role: decoded.role };

    // recréer uniquement l'access token
    setAccessToken(res, payload);

    res.json({ message: "Token rafraîchi" });
  } catch (error) {
    // refresh token expiré ou invalide = déconnexion 
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(401).json({ message: "Session expirée, veuillez vous reconnecter" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ message: "Déconnexion réussie" });
};

export const me = (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
};