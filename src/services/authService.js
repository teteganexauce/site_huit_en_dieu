import api from './api';

const authService = {
  /**
   * Connecter un utilisateur
   */
  async login(credentials) {
    const response = await api.post('/login', credentials);
    const resData = response.data;
    if (resData && resData.data && resData.data.token) {
        localStorage.setItem('token', resData.data.token);
        localStorage.setItem('user', JSON.stringify(resData.data.user));
    }
    return resData;
  },

  /**
   * Inscrire un nouvel utilisateur
   */
  async register(userData) {
    const response = await api.post('/register', userData);
    const resData = response.data;
    if (resData && resData.data && resData.data.token) {
        localStorage.setItem('token', resData.data.token);
        localStorage.setItem('user', JSON.stringify(resData.data.user));
    }
    return resData;
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
  },

  /**
   * Demander un lien de réinitialisation de mot de passe
   */
  async forgotPassword(email) {
    const response = await api.post('/password/forgot', { email });
    return response.data;
  },

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(data) {
    const response = await api.post('/password/reset', data);
    return response.data;
  }
};

export default authService;
