import API_URL from "./config.api.js";
import { openModal, closeModal, showToast, openConfirm } from "../modal/dashboard.modal.js";

let editingEvenementId = null;
let editingGazetteId = null;
let cachedEvenements = [];

const formatHeure = (h) => {
  if (!h) return "";
  return h.slice(0, 5);
};

const fmtDate = (str) => {
  if (!str) return "—";
  const [y, m, d] = str.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "—";
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
};



const loadEvenements = async () => {
  try {
    const res = await fetch(`${API_URL}/api/evenements`, { credentials: "include" });
    cachedEvenements = await res.json();

    document.getElementById("stat-evenements").textContent = cachedEvenements.length;

    const tbody = document.getElementById("evenements-tbody");
    if (!cachedEvenements.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-400 py-4">Aucun événement pour le moment.</td></tr>`;
      return;
    }

    tbody.innerHTML = cachedEvenements.map((e) => `
      <tr class="border-b last:border-0 hover:bg-gray-50">
        <td class="px-4 py-3 font-medium">${e.titre}</td>
        <td class="px-4 py-3 text-gray-500">${e.lieu ?? "—"}</td>
        <td class="px-4 py-3 text-gray-500">${fmtDate(e.date_debut)}</td>
        <td class="px-4 py-3 text-gray-500">${fmtDate(e.date_fin)}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button data-id="${e.id}" class="ev-participants border border-blue-200 text-blue-600 bg-blue-50 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-blue-100">👥 Participants</button>
            <button data-id="${e.id}" class="ev-edit border border-gray-300 text-gray-700 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-gray-100">✏️ Modifier</button>
            <button data-id="${e.id}" class="ev-delete bg-red-100 text-red-600 border border-red-200 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-red-200">🗑 Suppr.</button>
          </div>
        </td>
      </tr>
    `).join("");

  
    document.querySelectorAll(".ev-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ev = cachedEvenements.find((e) => e.id === +btn.dataset.id);
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
      });
    });


    document.querySelectorAll(".ev-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        openConfirm(async () => {
          const res = await fetch(`${API_URL}/api/evenements/delete/${btn.dataset.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) { showToast("Événement supprimé"); loadEvenements(); }
          else showToast("Erreur lors de la suppression", "error");
        });
      });
    });

   
    document.querySelectorAll(".ev-participants").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const res = await fetch(`${API_URL}/api/participations/evenement/${btn.dataset.id}`, {
          credentials: "include",
        });
        const participants = await res.json();
        const list = document.getElementById("participants-list");
        if (!participants.length) {
          list.innerHTML = '<p class="text-gray-400 text-sm">Aucun participant enregistré.</p>';
        } else {
          list.innerHTML = participants.map((p) => `
            <div class="flex items-center justify-between border rounded px-3 py-2 text-sm">
              <span class="font-medium">${p.email}</span>
              <span class="${p.statut === "oui" ? "text-green-600" : "text-red-500"} font-bold text-xs">
                ${p.statut === "oui" ? "✅ Participant" : "❌ Absent"}
              </span>
              <span class="text-gray-400 text-xs">${formatHeure(p.heure_debut ?? "—")} → ${formatHeure(p.heure_fin ?? "—")}</span>
            </div>
          `).join("");
        }
        openModal("modal-participants");
      });
    });
  } catch {
    showToast("Erreur chargement événements", "error");
  }
};


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
    ? `${API_URL}/api/evenements/update/${editingEvenementId}`
    : `${API_URL}/api/evenements/add`;

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


document.addEventListener("ev:reset", () => {
  editingEvenementId = null;
  document.getElementById("modal-ev-title").textContent = "Ajouter un événement";
  ["ev-titre", "ev-description", "ev-lieu", "ev-date-debut", "ev-date-fin", "ev-heure-debut", "ev-heure-fin"]
    .forEach((id) => (document.getElementById(id).value = ""));
  document.getElementById("ev-error").classList.add("hidden");
});

loadEvenements();



const loadGazettes = async () => {
  try {
    const res = await fetch(`${API_URL}/api/gazettes`, { credentials: "include" });
    const gazettes = await res.json();

    document.getElementById("stat-gazettes").textContent = gazettes.length;

    const tbody = document.getElementById("gazettes-tbody");
    if (!gazettes.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-400 py-4">Aucune gazette pour le moment.</td></tr>`;
      return;
    }

    tbody.innerHTML = gazettes.map((g) => `
      <tr class="border-b last:border-0 hover:bg-gray-50">
        <td class="px-4 py-3 font-medium">${g.titre}</td>
        <td class="px-4 py-3 text-gray-500 max-w-xs truncate">${g.description ?? "—"}</td>
        <td class="px-4 py-3">
          <a href="${API_URL}/uploads/gazettes/${g.fichier_pdf}" target="_blank"
            class="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded">📄 Voir</a>
        </td>
        <td class="px-4 py-3 text-gray-500">${new Date(g.created_at).toLocaleDateString("fr-FR")}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button data-id="${g.id}" data-titre="${g.titre}" data-description="${g.description ?? ""}"
              class="gz-edit border border-gray-300 text-gray-700 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-gray-100">✏️ Modifier</button>
            <button data-id="${g.id}"
              class="gz-delete bg-red-100 text-red-600 border border-red-200 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-red-200">🗑 Suppr.</button>
          </div>
        </td>
      </tr>
    `).join("");


    document.querySelectorAll(".gz-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingGazetteId = +btn.dataset.id;
        document.getElementById("modal-gz-title").textContent = "Modifier la gazette";
        document.getElementById("gz-titre").value = btn.dataset.titre;
        document.getElementById("gz-description").value = btn.dataset.description;
        document.getElementById("gz-file-group").classList.add("hidden");
        openModal("modal-gazette");
      });
    });

  
    document.querySelectorAll(".gz-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        openConfirm(async () => {
          const res = await fetch(`${API_URL}/api/gazettes/delete/${btn.dataset.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) { showToast("Gazette supprimée"); loadGazettes(); }
          else showToast("Erreur lors de la suppression", "error");
        });
      });
    });
  } catch {
    showToast("Erreur chargement gazettes", "error");
  }
};


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
    res = await fetch(`${API_URL}/api/gazettes/update/${editingGazetteId}`, {
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
    res = await fetch(`${API_URL}/api/gazettes/add`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
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

document.addEventListener("gz:reset", () => {
  editingGazetteId = null;
  document.getElementById("modal-gz-title").textContent = "Ajouter une gazette";
  document.getElementById("gz-titre").value = "";
  document.getElementById("gz-description").value = "";
  document.getElementById("gz-fichier").value = "";
  document.getElementById("gz-file-name").textContent = "Choisir un fichier PDF";
  document.getElementById("gz-file-group").classList.remove("hidden");
  document.getElementById("gz-error").classList.add("hidden");
});

loadGazettes();



const loadBenevoles = async () => {
  try {
    const res = await fetch(`${API_URL}/api/benevoles`, { credentials: "include" });
    const benevoles = await res.json();

    document.getElementById("stat-benevoles").textContent = benevoles.length;

    const tbody = document.getElementById("benevoles-tbody");
    if (!benevoles.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-gray-400 py-4">Aucun bénévole enregistré.</td></tr>`;
      return;
    }

    tbody.innerHTML = benevoles.map((u) => `
      <tr class="border-b last:border-0 hover:bg-gray-50">
        <td class="px-4 py-3 font-medium">${u.email}</td>
        <td class="px-4 py-3">
          <span class="${u.role === "admin" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-700"} text-xs font-bold uppercase px-2 py-0.5 rounded-full">
            ${u.role === "admin" ? "Admin" : "Bénévole"}
          </span>
        </td>
        <td class="px-4 py-3 text-gray-500">${new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
        <td class="px-4 py-3">
          ${u.role !== "admin"
            ? `<button data-id="${u.id}" class="bv-delete bg-red-100 text-red-600 border border-red-200 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-red-200">🗑 Suppr.</button>`
            : '<span class="text-gray-300 text-xs">—</span>'
          }
        </td>
      </tr>
    `).join("");

    document.querySelectorAll(".bv-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        openConfirm(async () => {
          const res = await fetch(`${API_URL}/api/benevoles/${btn.dataset.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) { showToast("Compte supprimé"); loadBenevoles(); }
          else showToast("Erreur lors de la suppression", "error");
        });
      });
    });
  } catch {
    showToast("Erreur chargement bénévoles", "error");
  }
};


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

  const res = await fetch(`${API_URL}/api/benevoles`, {
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

loadBenevoles();