import axios from 'axios';
import router from '../router';

// Création de l'instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor de requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Routes publiques qui ne doivent PAS déclencher une redirection 401
const PUBLIC_ROUTES = ['home', 'publications', 'publications-category', 'pub-detail', 'catalogue', 'product-detail', 'formations', 'formationDetail', 'forum', 'forum-topic', 'partenaires', 'galerie', 'temoignage', 'equipe', 'services', 'contact', 'donate', 'pensees', 'rubriquesCulture'];

// Interceptor de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erreur réseau (API hors ligne ou CORS)
    if (!error.response) {
      console.error("Erreur réseau: Impossible de contacter le serveur API.", error.message);
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401: {
        // Non autorisé : nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        import('../stores/auth').then(({ useAuthStore }) => {
          const authStore = useAuthStore();
          authStore.token = null;
          authStore.user = null;
        });

        // Ne rediriger vers login que si on est sur une route protégée
        const currentRoute = router.currentRoute.value;
        const isPublic = PUBLIC_ROUTES.includes(currentRoute.name);
        const isAlreadyOnLogin = currentRoute.name === 'login';

        if (!isPublic && !isAlreadyOnLogin) {
          router.push({ name: 'login', query: { redirect: currentRoute.fullPath } });
        }
        break;
      }

      case 403:
        console.warn('Erreur 403 - Accès refusé.', data?.message || '');
        break;

      case 422:
        console.warn('Erreur 422 - Erreur de validation.', data?.errors || data);
        break;

      case 500:
        console.error('Erreur 500 - Erreur serveur.', data?.message || '');
        break;

      default:
        console.error(`Erreur HTTP ${status}`, data);
    }

    return Promise.reject(error);
  }
);

export default api;
