import API_URL, { fetchWithRefresh } from "../api/config.api.js";

export { API_URL };

export const fetchGazettes = async () => {
  const response = await fetch(`${API_URL}/api/gazettes`);
  if (!response.ok) throw new Error("Erreur chargement gazettes");
  return await response.json();
};

export const getPdfUrl = (fichier_pdf) =>
  `${API_URL}/uploads/gazettes/${fichier_pdf}`;