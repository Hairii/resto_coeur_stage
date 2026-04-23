import API_URL from "../api/config.api.js";

// ── AUTH ──
export const checkAuth = async () => {
  try {
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
const views = ["dashboard", "evenements", "gazettes", "benevoles"];
const titles = {
  dashboard: "Tableau de bord",
  evenements: "Événements",
  gazettes: "Gazettes",
  benevoles: "Bénévoles",
};

export const switchView = (name) => {
  views.forEach((v) => {
    document.getElementById(`view-${v}`).classList.toggle("hidden", v !== name);
  });
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
  document.getElementById("page-title").textContent = titles[name];
  document.dispatchEvent(new CustomEvent("view:change", { detail: name }));
};

// ── MODALS ──
export const openModal = (id) =>
  document.getElementById(id).classList.remove("hidden");

export const closeModal = (id) =>
  document.getElementById(id).classList.add("hidden");


export const showToast = (msg, type = "success") => {
  const toast = document.getElementById("toast");
  toast.textContent = (type === "success" ? "✅ " : "❌ ") + msg;
  toast.classList.remove("opacity-0", "translate-y-8");
  toast.classList.add("opacity-100", "translate-y-0");
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-8");
    toast.classList.remove("opacity-100", "translate-y-0");
  }, 3000);
};

// ── CONFIRM ──
let confirmCallback = null;

export const openConfirm = (callback) => {
  confirmCallback = callback;
  openModal("modal-confirm");
};


document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => openModal(btn.dataset.open));
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
});

document.querySelectorAll("[id^='modal-']").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});

document.getElementById("confirm-ok").addEventListener("click", () => {
  if (confirmCallback) confirmCallback();
  closeModal("modal-confirm");
  confirmCallback = null;
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
  window.location.href = "/pages/login.html";
});

await checkAuth();