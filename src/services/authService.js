import api from './api';

const authService = {
  /**
   * Connecter un utilisateur
   */
  async login(credentials) {
    const response = await api.post('/login', credentials);
    if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Inscrire un nouvel utilisateur
   */
  async register(userData) {
    const response = await api.post('/register', userData);
    if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Déconnecter l'utilisateur
   */
  async logout() {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Récupérer les informations du profil utilisateur
   */
  async getProfile() {
    const response = await api.get('/user');
    return response.data;
  }
};

export default authService;
