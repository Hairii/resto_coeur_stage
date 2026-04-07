(function () {
  const html = `
    <footer class="bg-black text-white px-10 py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-rose mb-4">Découvrir</h4>
          <ul class="space-y-2">
            <li><a href="/pages/beneficier.html" class="text-gray-400 text-sm hover:text-white transition-colors">Comment bénéficier des Restos ?</a></li>
            <li><a href="/pages/actions.html" class="text-gray-400 text-sm hover:text-white transition-colors">Nos actions</a></li>
            <li><a href="/pages/gazettes.html" class="text-gray-400 text-sm hover:text-white transition-colors">Gazettes</a></li>
            <li><a href="/pages/evenements.html" class="text-gray-400 text-sm hover:text-white transition-colors">Événements</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-rose mb-4">S'engager</h4>
          <ul class="space-y-2">
            <li><a href="/pages/faire-un-don.html" class="text-gray-400 text-sm hover:text-white transition-colors">Faire un don financier</a></li>
            <li><a href="/pages/devenir-benevole.html" class="text-gray-400 text-sm hover:text-white transition-colors">Devenir bénévole</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-rose mb-4">Nous contacter</h4>
          <div class="text-gray-400 text-sm leading-loose">
            20 Impasse du Moulin de L'Escalier<br />
            16400 La Couronne<br />
            <a href="tel:0545674949" class="text-rose hover:underline">05 45 67 49 49</a>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-700 pt-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-600">
        <span>© ${new Date().getFullYear()} Les Restos du Cœur - Charente</span>
        <div class="flex gap-3">
          <a href="#" class="hover:text-white transition-colors">Mentions légales</a>
          <span>|</span>
          <a href="#" class="hover:text-white transition-colors">Confidentialité</a>
        </div>
      </div>
    </footer>
  `;
 
  document.body.insertAdjacentHTML("beforeend", html);
})();