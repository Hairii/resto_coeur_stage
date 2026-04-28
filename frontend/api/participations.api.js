import API_URL from "./config.api.js";

export { API_URL };

export let currentUser = null;
export let mesParticipations = [];

export const initAuth = async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
    if (res.ok) {
      const user = await res.json();
      if (user.role !== "admin") currentUser = user;
    }
  } catch {}
  return currentUser;
};

export const loadMesParticipations = async () => {
  const res = await fetch(`${API_URL}/api/participations/me`, { credentials: "include" });
  if (res.ok) mesParticipations = await res.json();
  return mesParticipations;
};

export const saveParticipation = async (evenementId, statut, heure_debut, heure_fin) => {
  return await fetch(`${API_URL}/api/participations/${evenementId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ statut, heure_debut, heure_fin }),
  });
};

export const deleteParticipation = async (evenementId) => {
  return await fetch(`${API_URL}/api/participations/${evenementId}`, {
    method: "DELETE",
    credentials: "include",
  });
};