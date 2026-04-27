(async () => {
  const API_URL =
    window.location.hostname === "localhost" ? "http://localhost:3000" : "";

  // Auth
  let currentUser = null;
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    });
    if (res.ok) currentUser = await res.json();
  } catch {}

  const role = currentUser?.role ?? null;
  const peutVoirRestreint = role === "bénévole" || role === "admin";

  // nav
  const navLinks = [
    { label: "🏠", href: "/index.html", key: "index" },
    {
      label: "L'association",
      href: "/pages/association.html",
      key: "association",
    },
    { label: "Nos actions", href: "/pages/actions.html", key: "actions" },
    {
      label: "Comment bénéficier des Restos ?",
      href: "/pages/beneficier.html",
      key: "beneficier",
    },
    { label: "Agir avec nous", href: "/pages/agir.html", key: "agir" },
    {
      label: "Partenaires",
      href: "/pages/partenaires.html",
      key: "partenaires",
    },
    {
      label: "Gazettes",
      href: "/pages/gazettes.html",
      key: "gazettes",
      restricted: true,
    },
    { label: "Événements", href: "/pages/evenements.html", key: "evenements" },
    { label: "Contact", href: "/pages/contact.html", key: "contact" },
  ];

  // Ajouter lien auth selon état connexion
  if (!currentUser) {
    navLinks.push({ label: "Login", href: "/pages/login.html", key: "login" });
  } else if (role === "admin") {
    navLinks.push({
      label: "Dashboard",
      href: "/pages/dashboard.html",
      key: "dashboard",
    });
  }

  // Filtrer les liens restreints
  const linksToShow = navLinks.filter(
    (l) => !l.restricted || peutVoirRestreint,
  );

  const currentPath = window.location.pathname;
  const activePage =
    linksToShow.find((l) => currentPath.includes(l.key))?.key ?? "index";

  const desktopLinks = linksToShow
    .map(({ label, href, key }) => {
      const active =
        key === activePage
          ? "text-rose border-b-2 border-rose"
          : "hover:text-rose transition-colors";
      return `<li><a href="${href}" class="block px-4 py-5 font-semibold text-xs uppercase tracking-wide ${active}">${label}</a></li>`;
    })
    .join("");

  const mobileLinks = linksToShow
    .map(({ label, href, key }) => {
      const active =
        key === activePage
          ? "text-rose"
          : "hover:bg-gris hover:text-rose transition-colors";
      return `<a href="${href}" class="px-6 py-4 font-semibold text-sm uppercase border-b border-gris ${active}">${label}</a>`;
    })
    .join("");

  // btn déconnexion
  const logoutBtn = currentUser
    ? `<button id="logout-btn" class="flex items-center gap-1 hover:text-rose transition-colors">👤 Déconnexion</button>`
    : "";

  const html = `
    <div class="border-b border-gray-200 px-10 py-2 flex justify-end gap-6 text-xs">
      <a href="#" class="flex items-center gap-1 hover:text-rose transition-colors">👤 Mon espace bénévole</a>
      <a href="#" class="flex items-center gap-1 hover:text-rose transition-colors">👤 Mon espace donateur</a>
      ${logoutBtn}
    </div>

    <header class="px-10 py-4 flex items-center justify-between bg-white">
      <a href="/index.html" class="flex items-center gap-4">
        <img src="https://ad16.restosducoeur.org/wp-content/themes/associations-dep/img/logo.svg" alt="Logo Les Restos du Cœur" class="w-24" />
        <div>
          <p class="text-xl font-extrabold uppercase tracking-wide text-black">Les Restos du Cœur</p>
          <span class="text-rose font-bold uppercase text-base">Charente</span>
        </div>
      </a>
      <div class="hidden md:flex gap-4 items-center">
        <a href="/pages/devenir-benevole.html" class="bg-jaune text-white px-5 py-3 rounded-full font-bold uppercase text-xs text-center leading-tight hover:opacity-85 transition-opacity">Devenir<br />bénévole</a>
        <a href="/pages/faire-un-don.html" class="bg-rose text-white px-5 py-3 rounded-full font-bold uppercase text-xs text-center leading-tight hover:opacity-85 transition-opacity">Faire un<br />don</a>
      </div>
    </header>

    <div class="h-1.5 bg-jaune w-full"></div>

    <nav class="bg-white border-b-2 border-gris px-10 flex items-center justify-center relative">
      <ul class="hidden md:flex list-none">${desktopLinks}</ul>
      <button class="hidden md:flex absolute right-10 bg-rose text-white w-11 h-11 items-center justify-center text-lg">🔍</button>
      <button id="burger" class="md:hidden absolute right-5 flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer">
        <span id="b1" class="block w-6 h-0.5 bg-rose rounded transition-all duration-300"></span>
        <span id="b2" class="block w-6 h-0.5 bg-rose rounded transition-all duration-300"></span>
        <span id="b3" class="block w-6 h-0.5 bg-rose rounded transition-all duration-300"></span>
      </button>
      <div id="mobileMenu" class="hidden flex-col bg-white border-t-4 border-rose absolute top-full left-0 right-0 z-50 shadow-lg">
        ${mobileLinks}
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML("afterbegin", html);

  // menu burger
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const b1 = document.getElementById("b1");
  const b2 = document.getElementById("b2");
  const b3 = document.getElementById("b3");

  burger?.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", isOpen);
    mobileMenu.classList.toggle("flex", !isOpen);
    b1.style.transform = isOpen ? "" : "rotate(45deg) translate(5px, 6px)";
    b2.style.opacity = isOpen ? "1" : "0";
    b3.style.transform = isOpen ? "" : "rotate(-45deg) translate(5px, -6px)";
  });

  // déconnexion
  document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/pages/login.html";
  });
})();
