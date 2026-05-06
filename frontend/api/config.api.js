const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

export default API_URL;

export const fetchWithRefresh = async (url, options = {}) => {
  options.credentials = "include";

  let res = await fetch(url, options);

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await fetch(url, options);
    } else {
      window.location.href = `/pages/login.html?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }
  }

  return res;
};