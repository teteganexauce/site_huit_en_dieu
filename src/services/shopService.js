import api from './api';

const shopService = {
  async getCatalogue(params = {}) {
    const response = await api.get('/catalogue', { params });
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/catalogue/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getCart() {
    const response = await api.get('/panier');
    return response.data;
  },

  async addToCart(productId, quantite = 1) {
    const response = await api.post('/panier/ajouter', { produit_id: productId, quantite });
    return response.data;
  },

  async updateCartLine(lineId, quantite) {
    const response = await api.put(`/panier/lignes/${lineId}`, { quantite });
    return response.data;
  },

  async removeCartLine(lineId) {
    const response = await api.delete(`/panier/lignes/${lineId}`);
    return response.data;
  },

  async validateOrder() {
    const response = await api.post('/commandes/valider');
    return response.data;
  },

  async getOrders() {
    const response = await api.get('/commandes');
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/commandes/${id}`);
    return response.data;
  },

  async initPayment(paymentData) {
    const response = await api.post('/paiements/initier', paymentData);
    return response.data;
  }
};

export default shopService;
