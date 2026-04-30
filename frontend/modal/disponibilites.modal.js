import {
  API_URL,
  initAuth,
  currentUser,
  evenement,
  disposExistantes,
  fetchEvenement,
  fetchMesDispos,
  saveDispos,
  deleteParticipation,
} from "../api/disponibilites.api.js";

const container = document.getElementById("dispos-container");
const loading   = document.getElementById("loading");


const toLocal = (s) => {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatDate = (date) =>
  date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

const formatDateISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getJours = (debut, fin) => {
  const jours = [];
  const current = new Date(debut);
  while (current <= fin) {
    jours.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return jours;
};



const toastEl = document.createElement("div");
toastEl.className = [
  "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]",
  "px-5 py-3 rounded shadow-lg text-white text-sm font-bold",
  "transition-all duration-300 opacity-0 translate-y-8 pointer-events-none",
].join(" ");
document.body.appendChild(toastEl);

const showToast = (msg, type = "success") => {
  toastEl.textContent = (type === "success" ? "✅ " : "❌ ") + msg;
  toastEl.style.backgroundColor = type === "success" ? "#2e8b57" : "#e5007d";
  toastEl.classList.remove("opacity-0", "translate-y-8");
  toastEl.classList.add("opacity-100", "translate-y-0");
  setTimeout(() => {
    toastEl.classList.add("opacity-0", "translate-y-8");
    toastEl.classList.remove("opacity-100", "translate-y-0");
  }, 3000);
};



const render = () => {
  const debut = toLocal(evenement.date_debut);
  const fin   = toLocal(evenement.date_fin ?? evenement.date_debut);
  const jours = getJours(debut, fin);

  // date_jour (YYYY-MM-DD)
  const dispoMap = {};
  disposExistantes.forEach((d) => {
    dispoMap[d.date_jour.slice(0, 10)] = d;
  });

  const lignesJours = jours.map((jour) => {
    const iso    = formatDateISO(jour);
    const dispo  = dispoMap[iso];
    const coche  = !!dispo;
    const hDebut = dispo?.heure_debut?.slice(0, 5) ?? "";
    const hFin   = dispo?.heure_fin?.slice(0, 5) ?? "";

    return `
      <div class="jour-row flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-gray-200 last:border-0" data-jour="${iso}">

        <!-- Checkbox + label jour -->
        <label class="flex items-center gap-3 flex-1 cursor-pointer select-none">
          <input
            type="checkbox"
            class="jour-checkbox w-5 h-5 accent-rose cursor-pointer"
            ${coche ? "checked" : ""}
          />
          <span class="font-semibold text-sm capitalize">${formatDate(jour)}</span>
        </label>

        <!-- Horaires -->
        <div class="flex items-center gap-2 ml-8 sm:ml-0 horaires-wrapper" style="${coche ? "" : "opacity:0.4; pointer-events:none"}">
          <input
            type="time"
            class="heure-debut border-2 border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-rose w-32"
            value="${hDebut}"
          />
          <span class="text-gray-400 font-bold">→</span>
          <input
            type="time"
            class="heure-fin border-2 border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-rose w-32"
            value="${hFin}"
          />
        </div>

      </div>
    `;
  }).join("");

  const heureLieu = [
    evenement.lieu,
    evenement.heure_debut ? evenement.heure_debut.slice(0, 5) : null,
    evenement.heure_fin   ? "→ " + evenement.heure_fin.slice(0, 5) : null,
  ].filter(Boolean).join(" • ");

  container.innerHTML = `
    <!-- Info événement -->
    <div class="bg-white rounded shadow p-6 mb-6">
      <h3 class="font-extrabold uppercase text-lg text-rose mb-1">${evenement.titre}</h3>
      <p class="text-sm text-gray-500">
        ${debut.toLocaleDateString("fr-FR")} → ${fin.toLocaleDateString("fr-FR")}
        ${heureLieu ? " • " + heureLieu : ""}
      </p>
      ${evenement.description ? `<p class="text-sm text-gray-600 mt-2">${evenement.description}</p>` : ""}
    </div>

    <!-- Saisie jours -->
    <div class="bg-white rounded shadow p-6 mb-6">
      <h4 class="font-bold uppercase text-xs text-gray-500 mb-4 tracking-wide">
        Cochez les jours où vous êtes disponible
      </h4>
      <div id="jours-list">
        ${lignesJours}
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-3 justify-end">
      <button id="btn-annuler" class="border border-red-200 text-red-500 font-bold text-xs uppercase px-6 py-3 rounded hover:bg-red-50 transition-colors ${disposExistantes.length === 0 ? "hidden" : ""}">
        Annuler ma participation
      </button>
      <a href="/pages/evenements.html" class="border border-gray-300 text-gray-700 font-bold text-xs uppercase px-6 py-3 rounded hover:bg-gray-100 transition-colors text-center">
        Retour
      </a>
      <button id="btn-valider" class="bg-rose text-white font-bold text-xs uppercase px-6 py-3 rounded hover:opacity-85 transition-opacity">
        ✅ Valider mes disponibilités
      </button>
    </div>
  `;


  document.querySelectorAll(".jour-checkbox").forEach((cb) => {
    cb.addEventListener("change", () => {
      const row     = cb.closest(".jour-row");
      const wrapper = row.querySelector(".horaires-wrapper");
      const actif   = cb.checked;
      wrapper.style.opacity       = actif ? "1" : "0.4";
      wrapper.style.pointerEvents = actif ? "" : "none";
      if (!actif) {
        row.querySelector(".heure-debut").value = "";
        row.querySelector(".heure-fin").value   = "";
      }
    });
  });

  document.getElementById("btn-valider").addEventListener("click", async () => {
    const dispos = [];

    document.querySelectorAll(".jour-checkbox:checked").forEach((cb) => {
      const row  = cb.closest(".jour-row");
      const jour = row.dataset.jour;
      dispos.push({
        date_jour:   jour,
        heure_debut: row.querySelector(".heure-debut").value || null,
        heure_fin:   row.querySelector(".heure-fin").value   || null,
      });
    });

    if (dispos.length === 0) {
      showToast("Cochez au moins un jour", "error");
      return;
    }

    const res = await saveDispos(evenement.id, dispos);
    if (res.ok) {
      showToast("Disponibilités enregistrées !");
      setTimeout(() => { window.location.href = "/pages/evenements.html"; }, 1500);
    } else {
      showToast("Erreur lors de l'enregistrement", "error");
    }
  });

  document.getElementById("btn-annuler")?.addEventListener("click", async () => {
    const res = await deleteParticipation(evenement.id);
    if (res.ok) {
      showToast("Participation annulée");
      setTimeout(() => { window.location.href = "/pages/evenements.html"; }, 1500);
    } else {
      showToast("Erreur lors de l'annulation", "error");
    }
  });
};


(async () => {
  try {
    await initAuth();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      loading.textContent = "Aucun événement spécifié.";
      return;
    }

    await Promise.all([fetchEvenement(id), fetchMesDispos(id)]);

    loading.remove();
    render();
  } catch (err) {
    console.error(err);
    loading.textContent = "Erreur lors du chargement.";
  }
})();