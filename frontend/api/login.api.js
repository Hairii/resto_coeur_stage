import API_URL from "./config.api.js";
 
      document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        const err = document.getElementById('error-msg');
        err.classList.add('hidden');
        btn.disabled = true;
        btn.textContent = 'Connexion...';
 
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              email: document.getElementById('email').value,
              password: document.getElementById('password').value,
            }),
          });
 
          const data = await res.json();
 
          if (res.ok) {
            if (data.role === 'admin') {
              window.location.href = '/pages/dashboard.html';
            } else {
              // Utilisateur valide mais sans droits admin → on déconnecte
              await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
              err.textContent = 'Accès refusé : droits administrateur requis.';
              err.classList.remove('hidden');
            }
          } else {
            err.textContent = data.message ?? 'Email ou mot de passe incorrect.';
            err.classList.remove('hidden');
          }
        } catch {
          err.textContent = 'Erreur de connexion au serveur.';
          err.classList.remove('hidden');
        }
 
        btn.disabled = false;
        btn.textContent = 'Se connecter';
      });