const container = document.getElementById('evenements-container');
const loading = document.getElementById('loading');


let evenements = [];
let currentDate = new Date();
const fetchEvenements = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/evenements');
    evenements = await response.json();
    loading.remove();
    renderCalendar(currentDate);
  } catch (error) {
    console.error(error);
    loading.textContent = 'Erreur lors du chargement des événements.';
  }
};

const renderCalendar = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // commencer avec la bonne date sinon commence tjr au 1er (lundi 1)
    let start = firstDay.getDay()
    start = start === 0 ? 6 : start -1;

    const evenementsInMonth = evenements.filter (evenment => {
        const beginning = new Date(evenements.date_debut);
        return beginning.getMonth() === month && beginning.getFullYear() === year;
    });

    container.innerHTML =`
    <div class ="bg-white rounded shadow overflow-hidden w-full col-span-3">
    
    <!-- naviguer mois-->
    <div class="flex items-center justify-between bg-rose px-6 py-4">
        <button id="prev" class="text-white font-bold text-lg hover:opacity-70">&#8249;</button>
        <h3 class="text-white font-extrabold uppercase tracking-wide">${monthNames[month]} ${year}</h3>
        <button id="next" class="text-white font-bold text-lg hover:opacity-70">&#8250;</button>
    </div>
    
    <div class ="grid grid-col-7 bg-gray-100">
    ${dayNames.map(day => `<div class="text-center text-xs font-bold uppercase py-2 text-gray-500">${day}</div>`).join('')}
        </div>

`


 document.getElementById('prev').addEventListener('click', () => {
    currentDate = new Date(year, month - 1, 1);
    renderCalendar(currentDate);
  });

  document.getElementById('next').addEventListener('click', () => {
    currentDate = new Date(year, month + 1, 1);
    renderCalendar(currentDate);
  });
};

fetchEvenements();