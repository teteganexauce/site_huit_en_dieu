import api from './api';

export const accompagnementService = {
  /**
   * Soumettre une nouvelle demande d'accompagnement
   * @param {Object} formData { type, titre, description }
   * @returns {Promise<Object>}
   */
  async soumettreDemande(formData) {
    try {
      const response = await api.post('/accompagnement', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Récupérer l'historique des demandes de l'utilisateur
   * @returns {Promise<Object>}
   */
  async getHistorique() {
    try {
      const response = await api.get('/accompagnement');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default accompagnementService;
