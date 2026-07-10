import api from './api';

const shopService = {
  /**
   * Récupérer la liste des produits (avec filtres optionnels)
   */
  async getProducts(params = {}) {
    const response = await api.get('/boutique/produits', { params });
    return response.data;
  },

  /**
   * Récupérer les détails d'un produit spécifique
   */
  async getProduct(id) {
    const response = await api.get(`/boutique/produits/${id}`);
    return response.data;
  },

  /**
   * Récupérer la liste des catégories
   */
  async getCategories() {
    const response = await api.get('/boutique/categories');
    return response.data;
  },

  /**
   * Créer une nouvelle commande (Checkout)
   */
  async createOrder(orderData) {
    const response = await api.post('/commandes', orderData);
    return response.data;
  }
};

export default shopService;
