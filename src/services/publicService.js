import api from './api';

const publicService = {
  async getSlides() {
    const response = await api.get('/slides');
    return response.data;
  },

  async getTeam() {
    const response = await api.get('/equipe');
    return response.data;
  },

  async getPartners() {
    const response = await api.get('/partenaires');
    return response.data;
  },

  async getTestimonials(params = {}) {
    const response = await api.get('/temoignages', { params });
    return response.data;
  },

  async getEvents(params = {}) {
    const response = await api.get('/evenements', { params });
    return response.data;
  },

  async getEvent(id) {
    const response = await api.get(`/evenements/${id}`);
    return response.data;
  },

  async getGallery(params = {}) {
    const response = await api.get('/galerie', { params });
    return response.data;
  },

  async getRubriquesCulture() {
    const response = await api.get('/rubriques-culture');
    return response.data;
  },

  async getPage(slug) {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
  },

  async getMenu() {
    const response = await api.get('/menu');
    return response.data;
  },

  async getSettings() {
    const response = await api.get('/settings');
    return response.data;
  },

  async submitTestimonial(data) {
    const response = await api.post('/temoignages', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getFormations(params = {}) {
    const response = await api.get('/formations', { params });
    return response.data;
  },

  async getFormation(id) {
    const response = await api.get(`/formations/${id}`);
    return response.data;
  },

  async getFormationModules(formationId) {
    const response = await api.get(`/formations/${formationId}/modules`);
    return response.data;
  },

  async getCours(id) {
    const response = await api.get(`/cours/${id}`);
    return response.data;
  },

  async enrollInFormation(formationId, paymentData = {}) {
    const response = await api.post(`/formations/${formationId}/inscription`, paymentData);
    return response.data;
  },

  async confirmPayment(paymentId) {
    const response = await api.post(`/paiements/confirmer/${paymentId}`);
    return response.data;
  },

  async getMyInscriptions() {
    const response = await api.get('/user/inscriptions');
    return response.data;
  },

  async getPublications(params = {}) {
    const response = await api.get('/publications', { params });
    return response.data;
  },
};

export default publicService;
