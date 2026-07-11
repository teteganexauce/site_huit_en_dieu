import axios from 'axios';
import router from '../router';

// Création de l'instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Pour gérer les cookies Sanctum (si sessions/cookies)
});

// Interceptor de requête
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erreur réseau (API hors ligne)
    if (!error.response) {
      console.error("Erreur réseau: Impossible de contacter le serveur API.");
      alert("Une erreur de réseau est survenue. L'API est injoignable.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Unauthorized : token invalide ou expiré
        console.warn('Erreur 401 - Non autorisé. Déconnexion...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Dynamiquement importer le store pour éviter les dépendances circulaires
        import('../stores/auth').then(({ useAuthStore }) => {
           const authStore = useAuthStore();
           authStore.token = null;
           authStore.user = null;
        });
        
        // Redirection vers le login si on est pas déjà dessus
        if (router.currentRoute.value.name !== 'login') {
          router.push({ name: 'login' });
        }
        break;

      case 403:
        // Forbidden : accès refusé
        console.warn('Erreur 403 - Accès refusé.');
        alert("Vous n'avez pas l'autorisation d'accéder à cette ressource.");
        break;

      case 422:
        // Unprocessable Entity : Erreurs de validation
        // Les composants front-end capteront cette erreur pour afficher les messages
        console.warn('Erreur 422 - Erreur de validation des données.', data.errors);
        break;

      case 500:
        // Internal Server Error
        console.error('Erreur 500 - Erreur serveur côté API.', data.message || '');
        alert("Une erreur critique s'est produite sur le serveur.");
        break;
        
      default:
        console.error(`Erreur ${status}`, data);
    }

    return Promise.reject(error);
  }
);

export default api;
