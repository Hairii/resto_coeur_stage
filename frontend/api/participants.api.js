import API_URL, { fetchWithRefresh } from "../api/config.api.js";

const container = document.getElementById("participants-container");
const loading   = document.getElementById("loading");

// auth admin 
const authRes = await fetchWithRefresh(`${API_URL}/api/auth/me`, { credentials: "include" });
if (!authRes.ok) { window.location.href = "/pages/login.html"; }
const me = await authRes.json();
if (me.role !== "admin") { window.location.href = "/pages/login.html"; }
document.getElementById("user-email").textContent = me.email;

// logout
document.getElementById("logout-btn").addEventListener("click", async () => {
  await fetchWithRefresh(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
  window.location.href = "/pages/login.html";
});



const toLocal = (s) => {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatDateCourt = (date) =>
  date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

const formatHeure = (h) => (h ? h.slice(0, 5) : "—");

const getJours = (debut, fin) => {
  const jours = [];
  const cur = new Date(debut);
  while (cur <= fin) {
    jours.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return jours;
};

const formatDateISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};


const params = new URLSearchParams(window.location.search);
const evenementId = params.get("id");

if (!evenementId) {
  loading.textContent = "Aucun événement spécifié.";
  throw new Error("Pas d'id");
}

// recuperer l'evenement
const evRes = await fetchWithRefresh(`${API_URL}/api/evenements`, { credentials: "include" });
const tousEvenements = await evRes.json();
const evenement = tousEvenements.find((e) => e.id === +evenementId);

if (!evenement) {
  loading.textContent = "Événement introuvable.";
  throw new Error("Événement introuvable");
}

// recuperer participants + dispos
const partRes = await fetchWithRefresh(`${API_URL}/api/participations/evenement/${evenementId}`, {
  credentials: "include",
});
const participants = await partRes.json();


loading.remove();

const debut = toLocal(evenement.date_debut);
const fin   = toLocal(evenement.date_fin ?? evenement.date_debut);
const jours = getJours(debut, fin);

document.getElementById("page-title").textContent = `👥 ${evenement.titre}`;

const participantsAvecDispos = participants.map((p) => {
  const dispoMap = {};
  let dispos = p.disponibilites;
  if (typeof dispos === "string") {
    try { dispos = JSON.parse(dispos); } catch { dispos = []; }
  }
  if (Array.isArray(dispos)) {
    dispos.forEach((d) => {
      if (d?.date_jour) dispoMap[d.date_jour.slice(0, 10)] = d;
    });
  }
  return { ...p, dispoMap };
});

const renderJour = (jourISO) => {
  const lignes = participantsAvecDispos.map((p) => {
    const d = p.dispoMap[jourISO];
    const horaires = d
      ? `<span class="inline-block bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">${formatHeure(d.heure_debut)} → ${formatHeure(d.heure_fin)}</span>`
      : `<span class="text-gray-300 text-xs">—</span>`;
    return `
      <tr class="border-b last:border-0 hover:bg-gray-50">
        <td class="px-4 py-3 font-medium text-sm">${p.email}</td>
        <td class="px-4 py-3 text-center">${horaires}</td>
      </tr>
    `;
  }).join("");

  document.getElementById("tableau-body").innerHTML = lignes;
};

const jourOptions = jours.map((j) => {
  const iso = formatDateISO(j);
  return `<option value="${iso}">${formatDateCourt(j)}</option>`;
}).join("");

container.innerHTML = `
  <!-- Info événement -->
  <div class="bg-white rounded shadow border px-5 py-4 mb-4 flex items-center justify-between">
    <div>
      <p class="font-syne font-extrabold text-base">${evenement.titre}</p>
      <p class="text-xs text-gray-500">
        ${debut.toLocaleDateString("fr-FR")} → ${fin.toLocaleDateString("fr-FR")}
        ${evenement.lieu ? " • " + evenement.lieu : ""}
      </p>
    </div>
    <span class="bg-pink-100 text-pink-700 font-bold text-xs px-3 py-1 rounded-full uppercase">
      ${participants.length} participant${participants.length > 1 ? "s" : ""}
    </span>
  </div>

  ${!participants.length ? `
    <div class="bg-white rounded shadow border p-8 text-center text-gray-400 text-sm">
      Aucun participant inscrit pour cet événement.
    </div>
  ` : `
    <!-- Sélecteur jour -->
    <div class="bg-white rounded shadow border px-5 py-4 mb-4 flex items-center gap-4">
      <label class="text-xs font-bold uppercase text-gray-500 whitespace-nowrap">Afficher le jour :</label>
      <select id="select-jour"
        class="border-2 border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-pink-600 w-full max-w-xs">
        ${jourOptions}
      </select>
    </div>

    <!-- Tableau -->
    <div class="bg-white rounded shadow border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 border-b text-gray-600">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-bold uppercase">Bénévole</th>
            <th class="px-4 py-2 text-center text-xs font-bold uppercase">Horaires</th>
          </tr>
        </thead>
        <tbody id="tableau-body"></tbody>
      </table>
    </div>
  `}
`;

if (participants.length) {
  const select = document.getElementById("select-jour");
  renderJour(select.value);
  select.addEventListener("change", () => renderJour(select.value));
}