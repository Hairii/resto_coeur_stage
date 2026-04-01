import API_URL from './config.js';

const container = document.getElementById('gazettes-container');
const loading = document.getElementById('loading');

const fetchGazettes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/gazettes`);
    const gazettes = await response.json();

    loading.remove();

    if (gazettes.length === 0) {
      container.innerHTML = '<p class="text-gray-400 text-sm col-span-3">Aucune gazette disponible.</p>';
      return;
    }


    // voir si plusieur evenements changer de couleur pour mieux les differencier
    gazettes.forEach(gazette => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded shadow p-6 flex flex-col gap-3';
      card.innerHTML = `
        <div class="bg-rose w-12 h-12 flex items-center justify-center rounded">
          <span class="text-white text-xl">📄</span>
        </div>
        <h3 class="font-bold uppercase text-sm">${gazette.titre}</h3>
        <p class="text-gray-500 text-xs">${gazette.description ?? ''}</p>
        <span class="text-xs text-gray-400">${new Date(gazette.created_at).toLocaleDateString('fr-FR')}</span>
        <a href="/uploads/gazettes/${gazette.fichier_pdf}" target="_blank" class="mt-auto bg-rose text-white text-xs font-bold uppercase px-4 py-2 rounded hover:opacity-85 transition-opacity text-center">
          Télécharger
        </a>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    loading.textContent = 'Erreur lors du chargement des gazettes.';
  }
};

fetchGazettes();