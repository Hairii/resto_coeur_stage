const container = document.getElementById("evenements-container");
const loading = document.getElementById("loading");

let evenements = [];
let currentDate = new Date();

const fetchEvenements = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/evenements");
    evenements = await response.json();
    loading.remove();
    renderCalendar(currentDate);
  } catch (error) {
    console.error(error);
    loading.textContent = "Erreur lors du chargement des événements.";
  }
};

const renderCalendar = (date) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // commencer avec la bonne date sinon commence tjr au 1er (lundi 1)
  let start = firstDay.getDay();
  start = start === 0 ? 6 : start - 1;

  const evenementsInMonth = evenements.filter((e) => {
    const debut = new Date(e.date_debut);
    const fin = new Date(e.date_fin ?? e.date_debut);
     return (
    (debut.getMonth() === month && debut.getFullYear() === year) ||
    (fin.getMonth() === month && fin.getFullYear() === year)
  );
});

  container.innerHTML = `
    <div class ="bg-white rounded shadow overflow-hidden w-full col-span-3">
    
    <!-- naviguer mois-->
    <div class="flex items-center justify-between bg-rose px-6 py-4">
        <button id="prev" class="text-white font-bold text-lg hover:opacity-70">&#8249;</button>
        <h3 class="text-white font-extrabold uppercase tracking-wide">${monthNames[month]} ${year}</h3>
        <button id="next" class="text-white font-bold text-lg hover:opacity-70">&#8250;</button>
    </div>
    
    <div class="grid grid-cols-7 bg-gray-100">
    ${dayNames.map((day) => `<div class="text-center text-xs font-bold uppercase py-2 text-gray-500">${day}</div>`).join("")}
        </div>

      <!-- cases du calendrier -->
      <div class="grid grid-cols-7 border-t border-gray-200">
        ${Array(start).fill('<div class="border-b border-r border-gray-100 min-h-16 p-1 bg-gray-50"></div>').join("")}
        ${Array.from({ length: lastDay.getDate() }, (_, i) => {
          const day = i + 1;
          const dateDay = new Date(year, month, day);
          const eventsDay = evenementsInMonth.filter((e) => {
            const debut = new Date(e.date_debut);
            const fin = new Date(e.date_fin ?? e.date_debut);
            return dateDay >= debut && dateDay <= fin;
          });
          const today = new Date();
          const itsToday = dateDay.toDateString() === today.toDateString();

          return `
            <div class="border-b border-r border-gray-100 min-h-16 p-1 ${itsToday ? "bg-rose/10" : ""}">
              <span class="text-xs font-bold ${itsToday ? "text-rose" : "text-gray-400"}">${day}</span>
              ${eventsDay
                .map(
                  (e) => `
                <div class="bg-rose text-white text-xs rounded px-1 py-0.5 mt-1 truncate" title="${e.titre}">
                  ${e.titre}
                </div>
              `,
                )
                .join("")}
            </div>
          `;
        }).join("")}
      </div>

      <!-- légende événements du mois -->
      ${
        evenementsInMonth.length > 0
          ? `
        <div class="px-6 py-4 border-t border-gray-200">
          <h4 class="font-bold uppercase text-xs text-gray-500 mb-3">Événements ce mois</h4>
          <div class="flex flex-col gap-2">
            ${evenementsInMonth
              .map(
                (e) => `
              <div class="flex gap-3 items-start">
                <span class="bg-rose text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">
                ${new Date (e.date_debut).toLocaleDateString('fr-FR')} → ${new Date(e.date_fin ?? e.date_debut).toLocaleDateString('fr-FR')}
                </span>
                <div>
                  <p class="font-bold text-sm">${e.titre}</p>
                  <p class="text-xs text-gray-400">${e.lieu ?? ""} ${e.description ?? ""}</p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

    </div>
  `;

  document.getElementById("prev").addEventListener("click", () => {
    currentDate = new Date(year, month - 1, 1);
    renderCalendar(currentDate);
  });

  document.getElementById("next").addEventListener("click", () => {
    currentDate = new Date(year, month + 1, 1);
    renderCalendar(currentDate);
  });
};

fetchEvenements();
