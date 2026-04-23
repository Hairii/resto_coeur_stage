import { closeModal, showToast, openConfirm } from "./dashboard.modal.js";
import { loadBenevoles } from "../api/dashboard.api.js";

// ── CREATION ──
document.getElementById("bv-submit").addEventListener("click", async () => {
  const email = document.getElementById("bv-email").value.trim();
  const password = document.getElementById("bv-password").value;
  const errEl = document.getElementById("bv-error");

  if (!email || !password) {
    errEl.textContent = "L'email et le mot de passe sont obligatoires.";
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");

  const res = await fetch(`/api/benevoles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    closeModal("modal-benevole");
    document.getElementById("bv-email").value = "";
    document.getElementById("bv-password").value = "";
    showToast("Compte bénévole créé !");
    loadBenevoles();
  } else {
    const err = await res.json();
    errEl.textContent = err.errors?.join(", ") ?? err.message ?? "Erreur";
    errEl.classList.remove("hidden");
  }
});

// ── SUPPRIMER  ──
export const confirmDeleteBenevole = (id) => {
  openConfirm(async () => {
    const res = await fetch(`/api/benevoles/${id}`, {
      method: "DELETE", credentials: "include",
    });
    if (res.ok) { showToast("Compte supprimé"); loadBenevoles(); }
    else showToast("Erreur lors de la suppression", "error");
  });
};