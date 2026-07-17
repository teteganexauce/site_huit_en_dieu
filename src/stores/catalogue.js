import { defineStore } from 'pinia';
import shopService from '../services/shopService';

export const useCatalogueStore = defineStore('catalogue', {
  state: () => ({
    products: [],
    product: null,
    categories: [],
    filters: {
      categorie: '',
      type: '',
      prix_min: '',
      prix_max: '',
      recherche: '',
      tri: 'date',
      nouveaute: false,
      coup_de_coeur: false,
      gratuit: false,
    },
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 12,
    },
    loading: false,
  }),
  actions: {
    async fetchCatalogue() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.currentPage,
          per_page: this.pagination.perPage,
          ...this.filters,
        };
        Object.keys(params).forEach(key => {
          if (!params[key] && params[key] !== false) delete params[key];
        });
        const response = await shopService.getCatalogue(params);
        const data = response.data || response;
        this.products = data.data || data;
        if (data.meta) {
          this.pagination.currentPage = data.meta.current_page || data.meta.currentPage || 1;
          this.pagination.lastPage = data.meta.last_page || data.meta.lastPage || 1;
          this.pagination.total = data.meta.total || 0;
          this.pagination.perPage = data.meta.per_page || data.meta.perPage || 12;
        }
      } catch (error) {
        console.error('Erreur chargement catalogue:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProduct(id) {
      this.loading = true;
      try {
        const response = await shopService.getProduct(id);
        this.product = response.data || response;
      } catch (error) {
        console.error('Erreur chargement produit:', error);
        this.product = null;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await shopService.getCategories();
        this.categories = response.data || response;
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
      }
    },

    setFilter(key, value) {
      this.filters[key] = value;
      this.pagination.currentPage = 1;
    },

    resetFilters() {
      this.filters = {
        categorie: '', type: '', prix_min: '', prix_max: '',
        recherche: '', tri: 'date',
        nouveaute: false, coup_de_coeur: false, gratuit: false,
      };
      this.pagination.currentPage = 1;
    },

    setPage(page) {
      this.pagination.currentPage = page;
      this.fetchCatalogue();
    }
  }
});
