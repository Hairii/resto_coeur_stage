import {API_URL, fetchWithRefresh } from "./config.api.js";
import { openEditEvenement, confirmDeleteEvenement, openParticipants } from "../modal/evenements.modal.js";
import { openEditGazette, confirmDeleteGazette } from "../modal/gazettes.modal.js";
import { confirmDeleteBenevole } from "../modal/benevoles.modal.js";

const fmtDate = (str) => {
  if (!str) return "—";
  const [y, m, d] = str.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "—";
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
};

// ── ÉVÉNEMENTS ──

export async function loadEvenements() {
  try {
    const res = await fetch(`${API_URL}/api/evenements`, { credentials: "include" });
    const evenements = await res.json();

    document.getElementById("stat-evenements").textContent = evenements.length;

    const tbody = document.getElementById("evenements-tbody");
    if (!evenements.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-400 py-4">Aucun événement pour le moment.</td></tr>`;
      return;
    }

    tbody.innerHTML = evenements.map((e) => `
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
        const ev = evenements.find((e) => e.id === +btn.dataset.id);
        openEditEvenement(ev);
      });
    });

    document.querySelectorAll(".ev-delete").forEach((btn) => {
      btn.addEventListener("click", () => confirmDeleteEvenement(btn.dataset.id));
    });

    document.querySelectorAll(".ev-participants").forEach((btn) => {
      btn.addEventListener("click", () => openParticipants(btn.dataset.id));
    });
  } catch {
    console.error("Erreur chargement événements");
  }
}

// ── GAZETTES ──

export async function loadGazettes() {
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
      btn.addEventListener("click", () =>
        openEditGazette(+btn.dataset.id, btn.dataset.titre, btn.dataset.description)
      );
    });

    document.querySelectorAll(".gz-delete").forEach((btn) => {
      btn.addEventListener("click", () => confirmDeleteGazette(btn.dataset.id));
    });
  } catch {
    console.error("Erreur chargement gazettes");
  }
}

// ── BÉNÉVOLES ──

export async function loadBenevoles() {
  try {
    const res = await fetchWithRefresh(`${API_URL}/api/benevoles`, { credentials: "include" });
    const benevoles = await res.json();

    document.getElementById("stat-benevoles").textContent = benevoles.length;

    const tbody = document.getElementById("benevoles-tbody");
    if (!benevoles.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-gray-400 py-4">Aucun bénévole enregistré.</td></tr>`;
      return;
    }

    tbody.innerHTML = benevoles.map((u) => {
      const isAdmin = u.role === "admin";
      const badgeClass = isAdmin ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-700";
      const badgeLabel = isAdmin ? "Admin" : "Bénévole";
      const actions = isAdmin
        ? '<span class="text-gray-300 text-xs">—</span>'
        : `<button data-id="${u.id}" class="bv-delete bg-red-100 text-red-600 border border-red-200 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-red-200">🗑 Suppr.</button>`;
      return `
        <tr class="border-b last:border-0 hover:bg-gray-50">
          <td class="px-4 py-3 font-medium">${u.email}</td>
          <td class="px-4 py-3"><span class="${badgeClass} text-xs font-bold uppercase px-2 py-0.5 rounded-full">${badgeLabel}</span></td>
          <td class="px-4 py-3 text-gray-500">${new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
          <td class="px-4 py-3">${actions}</td>
        </tr>
      `;
    }).join("");

    document.querySelectorAll(".bv-delete").forEach((btn) => {
      btn.addEventListener("click", () => confirmDeleteBenevole(btn.dataset.id));
    });
  } catch {
    console.error("Erreur chargement bénévoles");
  }
}

// ── NAVIGATION ──
document.addEventListener("view:change", (e) => {
  if (e.detail === "evenements") loadEvenements();
  if (e.detail === "gazettes") loadGazettes();
  if (e.detail === "benevoles") loadBenevoles();
});


loadEvenements();
loadGazettes();
loadBenevoles();