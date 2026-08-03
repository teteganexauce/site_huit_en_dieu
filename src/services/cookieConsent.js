import { reactive } from 'vue';

const CONSENT_KEY = 'huit_en_dieu_cookie_consent';
const VISITOR_KEY = 'huit_en_dieu_visiteur';

const CATEGORIES = {
  necessary: {
    label: 'Nécessaires',
    description: 'Connexion, panier et sécurité du site. Toujours actifs.',
    alwaysOn: true,
  },
  preferences: {
    label: 'Préférences',
    description: 'Mémorisation de votre adresse email pour la prochaine connexion.',
    alwaysOn: false,
  },
  statistics: {
    label: 'Statistiques',
    description: 'Compréhension de la fréquentation du site (visites, pages consultées).',
    alwaysOn: false,
  },
};

const defaults = { necessary: true, preferences: false, statistics: false };

const state = reactive({
  open: false,
  customizing: false,
  draft: { ...defaults },
  consent: loadConsent(),
});

function loadConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (e) {
    return null;
  }
}

export function hasChosen() {
  return state.consent !== null;
}

export function hasConsent(category) {
  return state.consent ? state.consent[category] === true : false;
}

export function consentState() {
  return state;
}

export function categories() {
  return CATEGORIES;
}

export function openBanner(force = false) {
  if (state.open) return;
  if (!force && hasChosen()) return;
  state.customizing = false;
  state.draft = { ...(state.consent || defaults) };
  state.open = true;
}

export function closeBanner() {
  state.open = false;
}

export function acceptAll() {
  const consent = { ...defaults, preferences: true, statistics: true };
  save(consent);
  state.open = false;
  state.customizing = false;
}

export function refuseAll() {
  save({ ...defaults });
  state.open = false;
  state.customizing = false;
}

export function saveDraft() {
  save({ ...defaults, ...state.draft });
  state.open = false;
  state.customizing = false;
}

function save(consent) {
  consent.necessary = true;
  state.consent = { ...consent };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state.consent));
  } catch (e) {
    /* stockage indisponible */
  }
  if (!state.consent.statistics) {
    try {
      localStorage.removeItem(VISITOR_KEY);
    } catch (e) {
      /* stockage indisponible */
    }
  }
}
