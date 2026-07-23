import api from './api';

const forumService = {
  // Sujets
  async getSujets(params = {}) {
    const response = await api.get('/forum/sujets', { params });
    return response.data;
  },

  async getSujet(id) {
    const response = await api.get(`/forum/sujets/${id}`);
    return response.data;
  },

  async createSujet(data) {
    const response = await api.post('/forum/sujets', data);
    return response.data;
  },

  async updateSujet(id, data) {
    const response = await api.put(`/forum/sujets/${id}`, data);
    return response.data;
  },

  async deleteSujet(id) {
    const response = await api.delete(`/forum/sujets/${id}`);
    return response.data;
  },

  // Réponses
  async getReponses(sujetId, params = {}) {
    const response = await api.get(`/forum/sujets/${sujetId}/reponses`, { params });
    return response.data;
  },

  async createReponse(sujetId, data) {
    const response = await api.post(`/forum/sujets/${sujetId}/reponses`, data);
    return response.data;
  },

  async updateReponse(id, data) {
    const response = await api.put(`/forum/reponses/${id}`, data);
    return response.data;
  },

  async deleteReponse(id) {
    const response = await api.delete(`/forum/reponses/${id}`);
    return response.data;
  },

  // Modération et Solutions
  async signalerReponse(id, data) {
    const response = await api.post(`/forum/reponses/${id}/signaler`, data);
    return response.data;
  },

  async marquerSolution(id) {
    const response = await api.put(`/forum/reponses/${id}/solution`);
    return response.data;
  },

  async fermerSujet(id) {
    const response = await api.put(`/forum/sujets/${id}/fermer`);
    return response.data;
  },

  async epinglerSujet(id) {
    const response = await api.put(`/forum/sujets/${id}/epingler`);
    return response.data;
  },

  async banUser(userId) {
    const response = await api.post(`/forum/users/${userId}/ban`);
    return response.data;
  }
};

export default forumService;
