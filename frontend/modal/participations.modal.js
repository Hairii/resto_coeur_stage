import {
  initAuth,
  currentUser,
  mesParticipations,
  loadMesParticipations,
  saveParticipation,
  deleteParticipation,
} from "../api/participations.api.js";

const formatHeure = (h) => (h ? h.slice(0, 5) : "");


const toastEl = document.createElement("div");
toastEl.className = [
  "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]",
  "px-5 py-3 rounded shadow-lg text-white text-sm font-bold",
  "transition-all duration-300 opacity-0 translate-y-8 pointer-events-none",
].join(" ");
document.body.appendChild(toastEl);

const showToast = (msg, type = "success") => {
  toastEl.textContent = (type === "success" ? "✅ " : "ℹ️ ") + msg;
  toastEl.style.backgroundColor = type === "success" ? "#2e8b57" : "#f5a800";
  toastEl.classList.remove("opacity-0", "translate-y-8");
  toastEl.classList.add("opacity-100", "translate-y-0");
  setTimeout(() => {
    toastEl.classList.add("opacity-0", "translate-y-8");
    toastEl.classList.remove("opacity-100", "translate-y-0");
  }, 3000);
};

// Modal

const modal = document.createElement("div");
modal.id = "modal-participation";
modal.className = "fixed inset-0 z-50 hidden items-center justify-center bg-black/60 p-4";
modal.innerHTML = `
  <div class="bg-white rounded-lg w-full max-w-md shadow-xl">
    <div class="flex items-center justify-between px-6 py-4 border-b">
      <h3 id="modal-part-titre" class="font-bold uppercase text-sm truncate"></h3>
      <button id="modal-part-close" class="text-gray-400 hover:text-rose text-xl leading-none">&times;</button>
    </div>
    <div class="px-6 py-5 space-y-4">
      <p class="text-xs text-gray-500">Indiquez votre participation et vos horaires :</p>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Heure début</label>
          <input id="part-heure-debut" type="time" class="w-full border-2 border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-rose" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Heure fin</label>
          <input id="part-heure-fin" type="time" class="w-full border-2 border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-rose" />
        </div>
      </div>
      <div class="flex gap-3">
        <button id="part-oui" class="flex-1 py-2 rounded font-bold text-xs uppercase border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-colors">✅ Je participe</button>
        <button id="part-non" class="flex-1 py-2 rounded font-bold text-xs uppercase border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">❌ Je ne participe pas</button>
      </div>
      <p id="part-statut-actuel" class="text-xs text-gray-400 italic"></p>
      <p id="part-error" class="hidden text-xs text-rose"></p>
    </div>
    <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t rounded-b-lg">
      <button id="part-annuler-participation" class="border border-red-200 text-red-500 font-bold text-xs uppercase px-4 py-2 rounded hover:bg-red-50 hidden">Annuler ma participation</button>
      <button id="modal-part-close2" class="border border-gray-300 text-gray-700 font-bold text-xs uppercase px-4 py-2 rounded hover:bg-gray-100">Fermer</button>
    </div>
  </div>
`;
document.body.appendChild(modal);


let currentEvenementId = null;

const openModal = () => {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

const closeModal = () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

document.getElementById("modal-part-close").addEventListener("click", closeModal);
document.getElementById("modal-part-close2").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });


document.addEventListener("open-participation", (e) => {
  // Guard : non connecté → toast discret, pas de modal
  if (!currentUser) {
    showToast("Connectez-vous pour indiquer votre disponibilité", "info");
    return;
  }

  currentEvenementId = e.detail.id;
  document.getElementById("modal-part-titre").textContent = e.detail.titre;

  // Reset
  document.getElementById("part-oui").classList.remove("border-green-500", "bg-green-50", "text-green-700");
  document.getElementById("part-non").classList.remove("border-red-400", "bg-red-50", "text-red-600");
  document.getElementById("part-error").classList.add("hidden");

  const existing = mesParticipations.find((p) => p.evenement_id === +currentEvenementId);

  if (existing) {
    document.getElementById("part-statut-actuel").textContent =
      `Statut actuel : ${existing.statut === "oui" ? "✅ Participant" : "❌ Absent"} — ${formatHeure(existing.heure_debut) || "—"} → ${formatHeure(existing.heure_fin) || "—"}`;
    document.getElementById("part-heure-debut").value = existing.heure_debut ?? "";
    document.getElementById("part-heure-fin").value   = existing.heure_fin ?? "";
    document.getElementById("part-annuler-participation").classList.remove("hidden");

    if (existing.statut === "oui")
      document.getElementById("part-oui").classList.add("border-green-500", "bg-green-50", "text-green-700");
    else
      document.getElementById("part-non").classList.add("border-red-400", "bg-red-50", "text-red-600");
  } else {
    document.getElementById("part-statut-actuel").textContent = "Aucune participation enregistrée.";
    document.getElementById("part-heure-debut").value = "";
    document.getElementById("part-heure-fin").value   = "";
    document.getElementById("part-annuler-participation").classList.add("hidden");
  }

  openModal();
});

// Enregistrer 

const sauvegarder = async (statut) => {
  const heure_debut = document.getElementById("part-heure-debut").value || null;
  const heure_fin   = document.getElementById("part-heure-fin").value || null;
  const errEl       = document.getElementById("part-error");

  const res = await saveParticipation(currentEvenementId, statut, heure_debut, heure_fin);

  if (res.ok) {
    await loadMesParticipations();
    closeModal();
    showToast("Participation enregistrée !");
  } else {
    errEl.textContent = "Erreur lors de l'enregistrement.";
    errEl.classList.remove("hidden");
  }
};

document.getElementById("part-oui").addEventListener("click", () => sauvegarder("oui"));
document.getElementById("part-non").addEventListener("click", () => sauvegarder("non"));

// Annuler participation 

document.getElementById("part-annuler-participation").addEventListener("click", async () => {
  const res = await deleteParticipation(currentEvenementId);
  if (res.ok) {
    await loadMesParticipations();
    closeModal();
    showToast("Participation annulée.");
  }
});


await initAuth();
if (currentUser) await loadMesParticipations();