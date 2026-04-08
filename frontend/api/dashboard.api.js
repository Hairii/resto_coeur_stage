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