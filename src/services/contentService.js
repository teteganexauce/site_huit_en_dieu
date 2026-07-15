import api from './api';

const contentService = {
  async getSlides() {
    const response = await api.get('/slides');
    return response.data;
  },

  async getEvenements() {
    const response = await api.get('/evenements');
    return response.data;
  },

  async getEvenement(id) {
    const response = await api.get(`/evenements/${id}`);
    return response.data;
  },

  async getTemoignages() {
    const response = await api.get('/temoignages');
    return response.data;
  },

  async getPartenaires() {
    const response = await api.get('/partenaires');
    return response.data;
  },

  async getEquipe() {
    const response = await api.get('/equipe');
    return response.data;
  },

  async getGalerie() {
    const response = await api.get('/galerie');
    return response.data;
  },

  async getPages() {
    const response = await api.get('/pages');
    return response.data;
  },

  async getPageBySlug(slug) {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
  },

  async getSettings() {
    const response = await api.get('/settings');
    return response.data;
  },

  async getMenu() {
    const response = await api.get('/menu');
    return response.data;
  },

  async getRubriquesCulture() {
    const response = await api.get('/rubriques-culture');
    return response.data;
  },

  async getCatalogue(params = {}) {
    const response = await api.get('/catalogue', { params });
    return response.data;
  },

  async addTemoignage(data) {
    const response = await api.post('/temoignages', data);
    return response.data;
  },

  async getEvenementsPublics() {
    const response = await api.get('/evenements');
    return response.data;
  }
};

export default contentService;
