import api from './api';
import { hasConsent } from './cookieConsent';

const STORAGE_KEY = 'huit_en_dieu_visiteur';
const MIN_INTERVAL_MS = 10000;

function getVisitorId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id =
        (window.crypto && typeof window.crypto.randomUUID === 'function'
          ? window.crypto.randomUUID()
          : 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10));
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch (e) {
    return null;
  }
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch (e) {
    return null;
  }
}

let dernierChemin = null;
let dernierEnvoi = 0;

export function trackVisit(to) {
  if (!hasConsent('statistics')) return;

  const identifiant = getVisitorId();
  if (!identifiant) return;

  const chemin = (to && to.fullPath) || window.location.pathname;
  const maintenant = Date.now();

  if (chemin === dernierChemin && maintenant - dernierEnvoi < MIN_INTERVAL_MS) return;
  dernierChemin = chemin;
  dernierEnvoi = maintenant;

  const user = getUser();
  const payload = {
    identifiant,
    chemin: chemin.slice(0, 255),
    page: String((to && to.name) || window.location.pathname).slice(0, 120),
    referrer: (document.referrer || '').slice(0, 255) || null,
  };

  if (user) {
    if (user.email) payload.email = String(user.email).slice(0, 255);
    const uid = user.id || user.utilisateur_id;
    if (uid) payload.utilisateur_id = uid;
  }

  api.post('/visits', payload, { timeout: 4000 }).catch(() => {});
}