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
  getters: {
    filteredProducts: (state) => state.products,
    isFiltered: (state) => {
      return state.filters.categorie || state.filters.type || state.filters.recherche
        || state.filters.nouveaute || state.filters.coup_de_coeur || state.filters.gratuit;
    }
  },
  actions: {
    async fetchCatalogue() {
      this.loading = true;
      try {
        const f = this.filters;
        const params = {
          page: this.pagination.currentPage,
          per_page: this.pagination.perPage,
        };

        if (f.categorie) params.categorie_id = f.categorie;
        if (f.type) params.type = f.type;
        if (f.prix_min) params.prix_min = f.prix_min;
        if (f.prix_max) params.prix_max = f.prix_max;
        if (f.recherche) params.search = f.recherche;
        if (f.nouveaute) params.estNouveaute = 1;
        if (f.coup_de_coeur) params.estCoupDeCoeur = 1;
        if (f.gratuit) params.estGratuit = 1;

        if (f.tri) {
          const sortMap = {
            date: { sort_by: 'dateAjout', sort_order: 'desc' },
            prix_asc: { sort_by: 'prix', sort_order: 'asc' },
            prix_desc: { sort_by: 'prix', sort_order: 'desc' },
            nom: { sort_by: 'nom', sort_order: 'asc' },
          };
          Object.assign(params, sortMap[f.tri] || sortMap.date);
        }
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
