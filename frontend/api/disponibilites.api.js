import API_URL from "./config.api.js";

export { API_URL };

export let currentUser = null;
export let evenement   = null;
export let disposExistantes = [];


export const initAuth = async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
    if (res.ok) {
      const user = await res.json();
      if (user.role !== "admin") currentUser = user;
      else currentUser = user; // admin peut aussi saisir
    }
  } catch {}

  if (!currentUser) {
    window.location.href = `/pages/login.html?redirect=${encodeURIComponent(window.location.href)}`;
  }
  return currentUser;
};

export const fetchEvenement = async (id) => {
  const res = await fetch(`${API_URL}/api/evenements`);
  if (!res.ok) throw new Error("Erreur chargement événements");
  const all = await res.json();
  evenement = all.find((e) => e.id === +id) ?? null;
  if (!evenement) throw new Error("Événement introuvable");
  return evenement;
};

// Chargement dispos existantes 
export const fetchMesDispos = async (evenementId) => {
  const res = await fetch(`${API_URL}/api/participations/${evenementId}/dispos`, {
    credentials: "include",
  });
  if (res.ok) disposExistantes = await res.json();
  return disposExistantes;
};


export const saveDispos = async (evenementId, dispos) => {
  return await fetch(`${API_URL}/api/participations/${evenementId}/dispos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ dispos }),
  });
};

//Annuler toute la participation 
export const deleteParticipation = async (evenementId) => {
  return await fetch(`${API_URL}/api/participations/${evenementId}`, {
    method: "DELETE",
    credentials: "include",
  });
};