import { openModal, closeModal, showToast, openConfirm } from "./dashboard.modal.js";
import { loadEvenements } from "../api/dashboard.api.js";

let editingEvenementId = null;

// ── RESET  
document.querySelectorAll("[data-open='modal-evenement']").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!btn.closest("td")) {
      editingEvenementId = null;
      document.getElementById("modal-ev-title").textContent = "Ajouter un événement";
      ["ev-titre", "ev-description", "ev-lieu", "ev-date-debut", "ev-date-fin", "ev-heure-debut", "ev-heure-fin"]
        .forEach((id) => (document.getElementById(id).value = ""));
      document.getElementById("ev-error").classList.add("hidden");
    }
  });
});

// ──  MODIFIER ──
document.getElementById("ev-submit").addEventListener("click", async () => {
  const titre = document.getElementById("ev-titre").value.trim();
  const description = document.getElementById("ev-description").value.trim();
  const lieu = document.getElementById("ev-lieu").value.trim();
  const date_debut = document.getElementById("ev-date-debut").value;
  const date_fin = document.getElementById("ev-date-fin").value;
  const heure_debut = document.getElementById("ev-heure-debut").value;
  const heure_fin = document.getElementById("ev-heure-fin").value;
  const errEl = document.getElementById("ev-error");

  if (!titre || !date_debut) {
    errEl.textContent = "Le titre et la date de début sont obligatoires.";
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");

  const url = editingEvenementId
    ? `/api/evenements/update/${editingEvenementId}`
    : `/api/evenements/add`;

  const res = await fetch(url, {
    method: editingEvenementId ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ titre, description, lieu, date_debut, date_fin: date_fin || null, heure_debut: heure_debut || null, heure_fin: heure_fin || null }),
  });

  if (res.ok) {
    const wasEditing = editingEvenementId;
    editingEvenementId = null;
    closeModal("modal-evenement");
    showToast(wasEditing ? "Événement modifié !" : "Événement ajouté !");
    loadEvenements();
  } else {
    const err = await res.json();
    errEl.textContent = err.errors?.join(", ") ?? err.message ?? "Erreur";
    errEl.classList.remove("hidden");
  }
});

// ── PRÉ-REMPLISSAGE ──
export const openEditEvenement = (ev) => {
  editingEvenementId = ev.id;
  document.getElementById("modal-ev-title").textContent = "Modifier l'événement";
  document.getElementById("ev-titre").value = ev.titre;
  document.getElementById("ev-description").value = ev.description ?? "";
  document.getElementById("ev-lieu").value = ev.lieu ?? "";
  document.getElementById("ev-date-debut").value = ev.date_debut?.slice(0, 10) ?? "";
  document.getElementById("ev-date-fin").value = ev.date_fin?.slice(0, 10) ?? "";
  document.getElementById("ev-heure-debut").value = ev.heure_debut?.slice(0, 5) ?? "";
  document.getElementById("ev-heure-fin").value = ev.heure_fin?.slice(0, 5) ?? "";
  openModal("modal-evenement");
};

// ── SUPPRIMER ──
export const confirmDeleteEvenement = (id) => {
  openConfirm(async () => {
    const res = await fetch(`/api/evenements/delete/${id}`, {
      method: "DELETE", credentials: "include",
    });
    if (res.ok) { showToast("Événement supprimé"); loadEvenements(); }
    else showToast("Erreur lors de la suppression", "error");
  });
};

// ── PARTICIPANTS  ──
export const openParticipants = async (id) => {
  const res = await fetch(`/api/participations/evenement/${id}`, { credentials: "include" });
  const participants = await res.json();
  const list = document.getElementById("participants-list");

  if (!participants.length) {
    list.innerHTML = '<p class="text-gray-400 text-sm">Aucun participant enregistré.</p>';
  } else {
    list.innerHTML = participants.map((p) => {
      const statut = p.statut === "oui" ? "✅ Participant" : "❌ Absent";
      const couleur = p.statut === "oui" ? "text-green-600" : "text-red-500";
      const hDebut = p.heure_debut ? p.heure_debut.slice(0, 5) : "—";
      const hFin = p.heure_fin ? p.heure_fin.slice(0, 5) : "—";
      return `
        <div class="flex items-center justify-between border rounded px-3 py-2 text-sm">
          <span class="font-medium">${p.email}</span>
          <span class="${couleur} font-bold text-xs">${statut}</span>
          <span class="text-gray-400 text-xs">${hDebut} → ${hFin}</span>
        </div>
      `;
    }).join("");
  }
  openModal("modal-participants");
};