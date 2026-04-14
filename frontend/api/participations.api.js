import API_URL from "./config.api.js";

//verification si connecté
let currentUser = null;
try {
  const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
  if (res.ok) {
    const user = await res.json();
    if (user.role !== "admin") currentUser = user;
  }
} catch {}

if (!currentUser) return;

// participations
let mesParticipations = [];
const loadMesParticipations = async () => {
  const res = await fetch(`${API_URL}/api/participations/me`, { credentials: "include" });
  if (res.ok) mesParticipations = await res.json();
};
await loadMesParticipations();


//modal
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
      <div class="flex gap-3">
        <button id="part-oui" class="flex-1 py-2 rounded font-bold text-xs uppercase border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-colors">✅ Je participe</button>
        <button id="part-non" class="flex-1 py-2 rounded font-bold text-xs uppercase border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">❌ Je ne participe pas</button>
      </div>
      <div id="part-heures" class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Heure début</label>
          <input id="part-heure-debut" type="time" class="w-full border-2 border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-rose" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Heure fin</label>
          <input id="part-heure-fin" type="time" class="w-full border-2 border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-rose" />
        </div>
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