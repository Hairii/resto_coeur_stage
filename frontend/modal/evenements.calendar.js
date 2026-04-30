import { fetchEvenements, evenements } from "../api/evenements.api.js";

const container = document.getElementById("evenements-container");
const loading   = document.getElementById("loading");

let currentDate = new Date();


const formatHeure = (h) => (h ? h.slice(0, 5) : "");

const toLocal = (s) => {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};



const renderCalendar = (date) => {
  const month = date.getMonth();
  const year  = date.getFullYear();

  const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
  ];
  const dayNames = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

  const firstDay  = new Date(year, month, 1);
  const lastDay   = new Date(year, month + 1, 0);
  const monthStart = new Date(year, month, 1);
  const monthEnd   = new Date(year, month + 1, 0);

  // Décalage lundi = 0
  let start = firstDay.getDay();
  start = start === 0 ? 6 : start - 1;

  // Événements sur plusieur mois
  const evenementsInMonth = evenements.filter((e) => {
    const debut = toLocal(e.date_debut);
    const fin   = toLocal(e.date_fin ?? e.date_debut);
    return debut <= monthEnd && fin >= monthStart;
  });

  const emptyCells = Array(start)
    .fill('<div class="border-b border-r border-gray-100 min-h-16 p-1 bg-gray-50"></div>')
    .join("");

  //  jours 
  const dayCells = Array.from({ length: lastDay.getDate() }, (_, i) => {
    const day      = i + 1;
    const dateDay  = new Date(year, month, day);
    const today    = new Date();
    const itsToday = dateDay.toDateString() === today.toDateString();

    const eventsDay = evenementsInMonth.filter((e) => {
      const debut = toLocal(e.date_debut);
      const fin   = toLocal(e.date_fin ?? e.date_debut);
      return dateDay >= debut && dateDay <= fin;
    });

    const badges = eventsDay.map((e) => `
      <div
        class="text-xs rounded px-1 py-0.5 mt-1 truncate cursor-pointer"
        style="background-color:${e._color.bg}; color:${e._color.text}"
        title="${e.titre}"
        data-ev-id="${e.id}"
        data-ev-titre="${e.titre}"
      >${e.titre}</div>
    `).join("");

    return `
      <div class="border-b border-r border-gray-100 min-h-16 p-1 ${itsToday ? "bg-rose/10" : ""}">
        <span class="text-xs font-bold ${itsToday ? "text-rose" : "text-gray-400"}">${day}</span>
        ${badges}
      </div>
    `;
  }).join("");

  const legende = evenementsInMonth.length > 0 ? `
    <div class="px-6 py-4 border-t border-gray-200">
      <h4 class="font-bold uppercase text-xs text-gray-500 mb-3">Événements du mois</h4>
      <div class="flex flex-col gap-2">
        ${evenementsInMonth.map((e) => `
          <div class="flex gap-3 items-start">
            <span
              class="text-xs px-2 py-1 rounded font-bold whitespace-nowrap"
              style="background-color:${e._color.bg}; color:${e._color.text}"
            >
              ${toLocal(e.date_debut).toLocaleDateString("fr-FR")}
              → ${toLocal(e.date_fin ?? e.date_debut).toLocaleDateString("fr-FR")}
            </span>
            <div>
              <p class="font-bold text-sm">${e.titre}</p>
              <p class="text-xs text-black">
                ${e.lieu ?? ""}
                ${formatHeure(e.heure_debut)}
                ${e.heure_fin ? "→ " + formatHeure(e.heure_fin) : ""}
              </p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  ` : "";

  container.innerHTML = `
    <div class="bg-white rounded shadow overflow-hidden w-full col-span-3">

      <!-- Navigation mois -->
      <div class="flex items-center justify-between bg-rose px-6 py-4">
        <button id="prev" class="text-white font-bold text-lg hover:opacity-70">&#8249;</button>
        <h3 class="text-white font-extrabold uppercase tracking-wide">${monthNames[month]} ${year}</h3>
        <button id="next" class="text-white font-bold text-lg hover:opacity-70">&#8250;</button>
      </div>

      <!-- En-têtes jours -->
      <div class="grid grid-cols-7 bg-gray-100">
        ${dayNames.map((d) => `
          <div class="text-center text-xs font-bold uppercase py-2 text-gray-500">${d}</div>
        `).join("")}
      </div>

      <!-- Cases calendrier -->
      <div class="grid grid-cols-7 border-t border-gray-200">
        ${emptyCells}
        ${dayCells}
      </div>

      ${legende}
    </div>
  `;

  // Navigation mois
  document.getElementById("prev").addEventListener("click", () => {
    currentDate = new Date(year, month - 1, 1);
    renderCalendar(currentDate);
  });
  document.getElementById("next").addEventListener("click", () => {
    currentDate = new Date(year, month + 1, 1);
    renderCalendar(currentDate);
  });
};

//  ouvre modal participation 

container.addEventListener("click", (e) => {
  const evDiv = e.target.closest("[data-ev-id]");
  if (!evDiv) return;
  window.location.href = `/pages/disponibilites.html?id=${evDiv.dataset.evId}`;
});



(async () => {
  try {
    await fetchEvenements();
    loading.remove();
    renderCalendar(currentDate);
  } catch (err) {
    console.error(err);
    loading.textContent = "Erreur lors du chargement des événements.";
  }
})();