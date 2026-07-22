import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/chercheur';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor pour ajouter le token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default {
  // Récupérer tous les articles du chercheur connecté
  getMesArticles() {
    return apiClient.get('/articles');
  },

  // Récupérer un article spécifique
  getArticle(id) {
    return apiClient.get(`/articles/${id}`);
  },

  // Créer un nouvel article
  createArticle(formData) {
    // Note: formData est utilisé car il y a un upload de fichier
    return apiClient.post('/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Mettre à jour un article
  updateArticle(id, formData) {
    // Si FormData, on ajoute _method=PUT car Laravel gère mal FormData en PUT/PATCH direct
    formData.append('_method', 'PUT');
    return apiClient.post(`/articles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Supprimer un article
  deleteArticle(id) {
    return apiClient.delete(`/articles/${id}`);
  },

  // Soumettre un article pour validation
  soumettreArticle(id) {
    return apiClient.post(`/articles/${id}/soumettre`);
  },

  // Demander une action (modification ou suppression) sur un article publié
  demanderAction(id, action, motif) {
    return apiClient.post(`/articles/${id}/action`, { action, motif });
  }
};
