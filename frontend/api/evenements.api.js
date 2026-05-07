import API_URL, { fetchWithRefresh } from "../api/config.api.js";

export const EVENEMENTS_COLORS = [
  { bg: "#e5007d", text: "#fff" }, // rose
  { bg: "#f5a800", text: "#fff" }, // jaune
  { bg: "#0095f8", text: "#fff" }, // bleu
  { bg: "#2e8b57", text: "#fff" }, // vert
  { bg: "#7c3aed", text: "#fff" }, // violet
  { bg: "#e05c2a", text: "#fff" }, // orange
  { bg: "#0d9488",  text: "#fff" }, // teal
  { bg: "#be123c", text: "#fff" }, // rouge foncé
];

export let evenements = [];

export const fetchEvenements = async () => {
  const response = await fetch(`${API_URL}/api/evenements`);
  if (!response.ok) throw new Error("Erreur chargement événements");
  const data = await response.json();

  // Couleur fixe par événement basée sur son id
  data.forEach((e) => {
    e._color = EVENEMENTS_COLORS[e.id % EVENEMENTS_COLORS.length];
  });

  evenements = data;
  return evenements;
};