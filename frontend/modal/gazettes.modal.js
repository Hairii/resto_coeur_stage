import { openModal, closeModal, showToast, openConfirm } from "./dashboard.modal.js";
import { loadGazettes } from "../api/dashboard.api.js";

let editingGazetteId = null;

// ── AFFICHAGE nom fichier PDF ──
document.getElementById("gz-fichier").addEventListener("change", (e) => {
  document.getElementById("gz-file-name").textContent =
    e.target.files[0]?.name ?? "Choisir un fichier PDF";
});

// ── RESET formulaire ──
document.querySelectorAll("[data-open='modal-gazette']").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!btn.closest("td")) {
      editingGazetteId = null;
      document.getElementById("modal-gz-title").textContent = "Ajouter une gazette";
      document.getElementById("gz-titre").value = "";
      document.getElementById("gz-description").value = "";
      document.getElementById("gz-fichier").value = "";
      document.getElementById("gz-file-name").textContent = "Choisir un fichier PDF";
      document.getElementById("gz-file-group").classList.remove("hidden");
      document.getElementById("gz-error").classList.add("hidden");
    }
  });
});

// ── MODIFIER ──
document.getElementById("gz-submit").addEventListener("click", async () => {
  const titre = document.getElementById("gz-titre").value.trim();
  const description = document.getElementById("gz-description").value.trim();
  const fichier = document.getElementById("gz-fichier").files[0];
  const errEl = document.getElementById("gz-error");

  if (!titre) {
    errEl.textContent = "Le titre est obligatoire.";
    errEl.classList.remove("hidden");
    return;
  }
  if (!editingGazetteId && !fichier) {
    errEl.textContent = "Le fichier PDF est obligatoire.";
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");

  let res;
  if (editingGazetteId) {
    res = await fetch(`/api/gazettes/update/${editingGazetteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ titre, description }),
    });
  } else {
    const form = new FormData();
    form.append("titre", titre);
    form.append("description", description);
    form.append("fichier_pdf", fichier);
    res = await fetch(`/api/gazettes/add`, { method: "POST", credentials: "include", body: form });
  }

  if (res.ok) {
    const wasEditing = editingGazetteId;
    editingGazetteId = null;
    closeModal("modal-gazette");
    showToast(wasEditing ? "Gazette modifiée !" : "Gazette ajoutée !");
    loadGazettes();
  } else {
    const err = await res.json();
    errEl.textContent = err.errors?.join(", ") ?? err.message ?? "Erreur";
    errEl.classList.remove("hidden");
  }
});

// ── PRÉ-REMPLISSAGE ──
export const openEditGazette = (id, titre, description) => {
  editingGazetteId = id;
  document.getElementById("modal-gz-title").textContent = "Modifier la gazette";
  document.getElementById("gz-titre").value = titre;
  document.getElementById("gz-description").value = description;
  document.getElementById("gz-file-group").classList.add("hidden");
  openModal("modal-gazette");
};

// ── SUPPRIMER ──
export const confirmDeleteGazette = (id) => {
  openConfirm(async () => {
    const res = await fetch(`/api/gazettes/delete/${id}`, {
      method: "DELETE", credentials: "include",
    });
    if (res.ok) { showToast("Gazette supprimée"); loadGazettes(); }
    else showToast("Erreur lors de la suppression", "error");
  });
};