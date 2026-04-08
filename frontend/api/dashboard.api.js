import API_URL from './config.api.js';
 
let editingEvenementId = null;
let editingGazetteId = null;
let confirmCallback = null;
let cachedEvenements = [];
 
 
//verifie si admin 
const checkAuth  = async () => {
    try{
         const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
            if (!res.ok) throw new Error();
            const user = await res.json();
            if (user.role !== "admin") throw new Error();
            document.getElementById("user-email").textContent = user.email;
          } catch {
            window.location.href = "/pages/login.html";
          }
        };
        
        // ── NAVIGATION ──
        const views = ["dashboard", "evenements", "gazettes"];
        const titles = { dashboard: "Tableau de bord", evenements: "Événements", gazettes: "Gazettes" };
        
        const switchView = (name) => {
          // Affiche/cache les vues
          views.forEach((v) => {
            document.getElementById(`view-${v}`).classList.toggle("hidden", v !== name);
          });
        
          // Met à jour la sidebar 
          document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
            const isActive = btn.dataset.view === name;
            btn.classList.toggle("text-white", isActive);
            btn.classList.toggle("bg-gray-900", isActive);
            btn.classList.toggle("border-l-2", isActive);
            btn.classList.toggle("border-pink-600", isActive);
            btn.classList.toggle("rounded-r", isActive);
            btn.classList.toggle("text-gray-400", !isActive);
            btn.classList.toggle("rounded", !isActive);
          });
        
          // Met à jour le titre de la topbar
          document.getElementById("page-title").textContent = titles[name];
        };
        
        // ── MODALS ──
        const openModal = (id) => document.getElementById(id).classList.remove("hidden");
        const closeModal = (id) => document.getElementById(id).classList.add("hidden");
        
        // ── notification ──
        const showToast = (msg, type = "success") => {
          const toast = document.getElementById("toast");
          toast.textContent = (type === "success" ? "✅ " : "❌ ") + msg;
          toast.classList.remove("opacity-0", "translate-y-8");
          toast.classList.add("opacity-100", "translate-y-0");
          setTimeout(() => {
            toast.classList.add("opacity-0", "translate-y-8");
            toast.classList.remove("opacity-100", "translate-y-0");
          }, 3000);
        };
        
        // ── confirmer suppresion ──
        const openConfirm = (callback) => {
          confirmCallback = callback;
          openModal("modal-confirm");
        };
        
        // ── EVENT LISTENERS ──
        
        // Sidebar navigation
        document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
          btn.addEventListener("click", () => switchView(btn.dataset.view));
        });
        
        // ouvre le modal correspondant
        document.querySelectorAll("[data-open]").forEach((btn) => {
          btn.addEventListener("click", () => openModal(btn.dataset.open));
        });
        
        //ferme le modal correspondant
        document.querySelectorAll("[data-close]").forEach((btn) => {
          btn.addEventListener("click", () => closeModal(btn.dataset.close));
        });
        
        // Clic en dehors d'un modal ferme
        document.querySelectorAll("[id^='modal-']").forEach((modal) => {
          modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal(modal.id);
          });
        });
        
        // confirmer suppression
        document.getElementById("confirm-ok").addEventListener("click", () => {
          if (confirmCallback) confirmCallback();
          closeModal("modal-confirm");
          confirmCallback = null;
        });
        
        // deconnexion
        document.getElementById("logout-btn").addEventListener("click", async () => {
          await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
          window.location.href = "/admin/login.html";
        });
        
        // Fichier PDF gazette = affiche le nom du fichier choisi
        document.getElementById("gz-fichier").addEventListener("change", (e) => {
          document.getElementById("gz-file-name").textContent =
            e.target.files[0]?.name ?? "Choisir un fichier PDF";
        });
        
        await checkAuth();
 
 
const fmtDate = (str) => {
  if (!str) return '—';
  const [y, m, d] = str.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR');
};
 
// ── ÉVÉNEMENTS ──
const loadEvenements = async () => {
  try {
    
    const res = await fetch(`${API_URL}/api/evenements`, { credentials: 'include' });
    cachedEvenements = await res.json();
console.log('dates reçues:', cachedEvenements.map(e => ({ debut: e.date_debut, fin: e.date_fin })));

    document.getElementById('stat-evenements').textContent = cachedEvenements.length;
 
    const tbody = document.getElementById('evenements-tbody');
    if (!cachedEvenements.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-400 py-4">Aucun événement pour le moment.</td></tr>`;
      return;
    }

    
 
    tbody.innerHTML = cachedEvenements.map(e => `
      <tr class="border-b last:border-0 hover:bg-gray-50">
        <td class="px-4 py-3 font-medium">${e.titre}</td>
        <td class="px-4 py-3 text-gray-500">${e.lieu ?? '—'}</td>
        <td class="px-4 py-3 text-gray-500">${fmtDate(e.date_debut)}</td>
        <td class="px-4 py-3 text-gray-500">${fmtDate(e.date_fin)}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button data-id="${e.id}" class="ev-edit border border-gray-300 text-gray-700 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-gray-100">✏️ Modifier</button>
            <button data-id="${e.id}" class="ev-delete bg-red-100 text-red-600 border border-red-200 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-red-200">🗑 Suppr.</button>
          </div>
        </td>
      </tr>
    `).join('');
 
    // Boutons modifier
    document.querySelectorAll('.ev-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const ev = cachedEvenements.find(e => e.id === +btn.dataset.id);
        editingEvenementId = ev.id;
        document.getElementById('modal-ev-title').textContent = "Modifier l'événement";
        document.getElementById('ev-titre').value = ev.titre;
        document.getElementById('ev-description').value = ev.description ?? '';
        document.getElementById('ev-lieu').value = ev.lieu ?? '';
        document.getElementById('ev-date-debut').value = ev.date_debut?.slice(0, 10) ?? '';
        document.getElementById('ev-date-fin').value = ev.date_fin?.slice(0, 10) ?? '';
        openModal('modal-evenement');
      });
    });
 
    // Boutons supprimer
    document.querySelectorAll('.ev-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        openConfirm(async () => {
          const res = await fetch(`${API_URL}/api/evenements/delete/${btn.dataset.id}`, {
            method: 'DELETE', credentials: 'include'
          });
          if (res.ok) { showToast('Événement supprimé'); loadEvenements(); }
          else showToast('Erreur lors de la suppression', 'error');
        });
      });
    });
 
  } catch { showToast('Erreur chargement événements', 'error'); }
  
};
 
// Soumettre ajout/modification
document.getElementById('ev-submit').addEventListener('click', async () => {
  const titre = document.getElementById('ev-titre').value.trim();
  const description = document.getElementById('ev-description').value.trim();
  const lieu = document.getElementById('ev-lieu').value.trim();
  const date_debut = document.getElementById('ev-date-debut').value;
  const date_fin = document.getElementById('ev-date-fin').value;
  const errEl = document.getElementById('ev-error');
 
  if (!titre || !date_debut) {
    errEl.textContent = 'Le titre et la date de début sont obligatoires.';
    errEl.classList.remove('hidden');
    return;
  }
  errEl.classList.add('hidden');
 
  const url = editingEvenementId
    ? `${API_URL}/api/evenements/update/${editingEvenementId}`
    : `${API_URL}/api/evenements/add`;
 
  const res = await fetch(url, {
    method: editingEvenementId ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ titre, description, lieu, date_debut, date_fin: date_fin || null }),
  });
 
  if (res.ok) {
    closeModal('modal-evenement');
    // reset
    editingEvenementId = null;
    document.getElementById('modal-ev-title').textContent = 'Ajouter un événement';
    document.getElementById('ev-titre').value = '';
    document.getElementById('ev-description').value = '';
    document.getElementById('ev-lieu').value = '';
    document.getElementById('ev-date-debut').value = '';
    document.getElementById('ev-date-fin').value = '';
    showToast(editingEvenementId ? 'Événement modifié !' : 'Événement ajouté !');
    loadEvenements();
  } else {
    const err = await res.json();
    errEl.textContent = err.errors?.join(', ') ?? err.message ?? 'Erreur';
    errEl.classList.remove('hidden');
  }
});
 
loadEvenements();
 
 
 
// ── GAZETTES ──
const loadGazettes = async () => {
  try {
    const res = await fetch(`${API_URL}/api/gazettes`, { credentials: 'include' });
    const gazettes = await res.json();
    document.getElementById('stat-gazettes').textContent = gazettes.length;
 
    const tbody = document.getElementById('gazettes-tbody');
    if (!gazettes.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-400 py-4">Aucune gazette pour le moment.</td></tr>`;
      return;
    }
 
    tbody.innerHTML = gazettes.map(g => `
      <tr class="border-b last:border-0 hover:bg-gray-50">
        <td class="px-4 py-3 font-medium">${g.titre}</td>
        <td class="px-4 py-3 text-gray-500 max-w-xs truncate">${g.description ?? '—'}</td>
        <td class="px-4 py-3">
          <a href="${API_URL}/uploads/gazettes/${g.fichier_pdf}" target="_blank"
            class="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded">📄 Voir</a>
        </td>
        <td class="px-4 py-3 text-gray-500">${new Date(g.created_at).toLocaleDateString('fr-FR')}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button data-id="${g.id}" data-titre="${g.titre}" data-description="${g.description ?? ''}"
              class="gz-edit border border-gray-300 text-gray-700 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-gray-100">✏️ Modifier</button>
            <button data-id="${g.id}"
              class="gz-delete bg-red-100 text-red-600 border border-red-200 font-syne font-bold text-xs uppercase px-3 py-1 rounded hover:bg-red-200">🗑 Suppr.</button>
          </div>
        </td>
      </tr>
    `).join('');
 
    // Boutons modifier
    document.querySelectorAll('.gz-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        editingGazetteId = +btn.dataset.id;
        document.getElementById('modal-gz-title').textContent = 'Modifier la gazette';
        document.getElementById('gz-titre').value = btn.dataset.titre;
        document.getElementById('gz-description').value = btn.dataset.description;
        document.getElementById('gz-file-group').classList.add('hidden'); // pas de remplacement PDF
        openModal('modal-gazette');
      });
    });
 
    // Boutons supprimer
    document.querySelectorAll('.gz-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        openConfirm(async () => {
          const res = await fetch(`${API_URL}/api/gazettes/delete/${btn.dataset.id}`, {
            method: 'DELETE', credentials: 'include'
          });
          if (res.ok) { showToast('Gazette supprimée'); loadGazettes(); }
          else showToast('Erreur lors de la suppression', 'error');
        });
      });
    });
 
  } catch { showToast('Erreur chargement gazettes', 'error'); }
};
 
// Soumettre ajout/modification gazette
document.getElementById('gz-submit').addEventListener('click', async () => {
  const titre = document.getElementById('gz-titre').value.trim();
  const description = document.getElementById('gz-description').value.trim();
  const fichier = document.getElementById('gz-fichier').files[0];
  const errEl = document.getElementById('gz-error');
 
  if (!titre) {
    errEl.textContent = 'Le titre est obligatoire.';
    errEl.classList.remove('hidden');
    return;
  }
  if (!editingGazetteId && !fichier) {
    errEl.textContent = 'Le fichier PDF est obligatoire.';
    errEl.classList.remove('hidden');
    return;
  }
  errEl.classList.add('hidden');
 
  let res;
  if (editingGazetteId) {
    res = await fetch(`${API_URL}/api/gazettes/update/${editingGazetteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ titre, description }),
    });
  } else {
    const form = new FormData();
    form.append('titre', titre);
    form.append('description', description);
    form.append('fichier_pdf', fichier);
    res = await fetch(`${API_URL}/api/gazettes/add`, {
      method: 'POST', credentials: 'include', body: form
    });
  }
 
  if (res.ok) {
    closeModal('modal-gazette');
    // reset
    editingGazetteId = null;
    document.getElementById('modal-gz-title').textContent = 'Ajouter une gazette';
    document.getElementById('gz-titre').value = '';
    document.getElementById('gz-description').value = '';
    document.getElementById('gz-fichier').value = '';
    document.getElementById('gz-file-name').textContent = 'Choisir un fichier PDF';
    document.getElementById('gz-file-group').classList.remove('hidden');
    showToast(editingGazetteId ? 'Gazette modifiée !' : 'Gazette ajoutée !');
    loadGazettes();
  } else {
    const err = await res.json();
    errEl.textContent = err.errors?.join(', ') ?? err.message ?? 'Erreur';
    errEl.classList.remove('hidden');
  }
});
 
loadGazettes();