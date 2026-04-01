import API_URL from "./config.js";

const container = document.getElementById("gazettes-container");
const loading = document.getElementById("loading");


//modal pour voir le pdf
const modal = document.createElement("div");
modal.id = "pdf-modal";
modal.className = "fixed inset-0 z-50 hidden items-center justify-center bg-black/70";
modal.innerHTML = `
  <div class="bg-white rounded shadow-lg w-full max-w-4xl mx-4 flex flex-col" style="height: 90vh">
    <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200">
      <h3 id="modal-titre" class="font-bold uppercase text-sm truncate"></h3>
      <div class="flex gap-3 items-center">
        <a id="modal-download" href="#" download class="bg-rose text-white text-xs font-bold uppercase px-4 py-2 rounded hover:opacity-85 transition-opacity">
          Télécharger
        </a>
        <button id="modal-close" class="text-gray-500 hover:text-black text-xl font-bold leading-none">&times;</button>
      </div>
    </div>
    <iframe id="modal-iframe" src="" class="flex-1 w-full rounded-b" frameborder="0"></iframe>
  </div>
`;
document.body.appendChild(modal);

const openModal = (titre, pdfUrl) => {
  document.getElementById("modal-titre").textContent = titre;
  document.getElementById("modal-iframe").src = pdfUrl;
  document.getElementById("modal-download").href = pdfUrl;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

const closeModal = () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.getElementById("modal-iframe").src = "";
};


document.getElementById("modal-close").addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

const fetchGazettes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/gazettes`);
    const gazettes = await response.json();

    loading.remove();

    if (gazettes.length === 0) {
      container.innerHTML =
        '<p class="text-gray-400 text-sm col-span-3">Aucune gazette disponible.</p>';
      return;
    }

    // voir si plusieur evenements changer de couleur pour mieux les differencier
   gazettes.forEach((gazette) => {
  const pdfUrl = `${API_URL}/uploads/gazettes/${gazette.fichier_pdf}`;

  const card = document.createElement("div");
  card.className = "bg-white rounded shadow p-6 flex flex-col gap-3";
  card.innerHTML = `
    <div class="bg-rose w-12 h-12 flex items-center justify-center rounded">
      <span class="text-white text-xl">📄</span>
    </div>
    <h3 class="font-bold uppercase text-sm">${gazette.titre}</h3>
    <p class="text-gray-500 text-xs">${gazette.description ?? ""}</p>
    <span class="text-xs text-gray-400">${new Date(gazette.created_at).toLocaleDateString("fr-FR")}</span>
    <div class="mt-auto flex gap-2">
      <button
        class="voir-btn flex-1 bg-rose text-white text-xs font-bold uppercase px-4 py-2 rounded hover:opacity-85 transition-opacity"
        data-titre="${gazette.titre}"
        data-url="${pdfUrl}"
      >
        Voir
      </button>
      
        <a href="${pdfUrl}"
        download
        class="flex-1 border border-rose text-rose text-xs font-bold uppercase px-4 py-2 rounded hover:bg-rose hover:text-white transition-colors text-center"
      >
        Télécharger
      </a>
    </div>
  `;

  card.querySelector(".voir-btn").addEventListener("click", (e) => {
    openModal(e.target.dataset.titre, e.target.dataset.url);
  });

  container.appendChild(card);
});
  } catch (error) {
    console.error(error);
    loading.textContent = "Erreur lors du chargement des gazettes.";
  }
};

fetchGazettes();
