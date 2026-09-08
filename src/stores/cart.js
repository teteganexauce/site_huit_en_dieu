import { defineStore } from 'pinia';
import shopService from '../services/shopService';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    loading: false,
  }),
  getters: {
    itemCount: (state) => {
      if (!state.cart || !state.cart.lignes) return 0;
      return state.cart.lignes.reduce((sum, l) => sum + l.quantite, 0);
    },
    total: (state) => {
      if (!state.cart || !state.cart.lignes) return 0;
      return state.cart.lignes.reduce((sum, l) => sum + (l.prixUnitaire * l.quantite), 0);
    }
  },
  actions: {
    async fetchCart() {
      this.loading = true;
      try {
        const response = await shopService.getCart();
        this.cart = response.data || response;
      } catch (error) {
        console.error('Erreur chargement panier:', error);
      } finally {
        this.loading = false;
      }
    },

    async addToCart(productId, quantite = 1) {
      try {
        const response = await shopService.addToCart(productId, quantite);
        this.cart = response.data || response;
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Erreur ajout panier' };
      }
    },

    async updateLine(lineId, quantite) {
      try {
        const response = await shopService.updateCartLine(lineId, quantite);
        this.cart = response.data || response;
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Erreur mise à jour' };
      }
    },

    async removeLine(lineId) {
      try {
        const response = await shopService.removeCartLine(lineId);
        this.cart = response.data || response;
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Erreur suppression' };
      }
    },

    async validateOrder() {
      try {
        const response = await shopService.validateOrder();
        // Le panier sera vidé par le système uniquement après succès du paiement
        return { success: true, order: response.data || response };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Erreur validation' };
      }
    }
  }
});
