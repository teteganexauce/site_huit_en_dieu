import { defineStore } from 'pinia';
import contentService from '../services/contentService';
import publicService from '../services/publicService';

export const useContentStore = defineStore('content', {
  state: () => ({
    slides: [],
    evenements: [],
    pensees: [],
    temoignages: [],
    partenaires: [],
    equipe: [],
    galerie: [],
    rubriques: [],
    settings: {},
    homeData: null,
    loading: false,
  }),
  actions: {
    async fetchHomeData() {
      try {
        const response = await publicService.getHomeData();
        this.homeData = response;
        this.pensees = response.pensees || [];
      } catch (error) {
        console.error('Erreur chargement donnees accueil:', error);
      }
    },

    async fetchSlides() {
      try {
        const response = await contentService.getSlides();
        this.slides = response.data || response;
      } catch (error) {
        console.error('Erreur chargement slides:', error);
      }
    },

    async fetchEvenements() {
      try {
        const response = await contentService.getEvenements();
        this.evenements = response.data || response;
      } catch (error) {
        console.error('Erreur chargement événements:', error);
      }
    },

    async fetchPensees() {
      try {
        const response = await contentService.getPensees();
        this.pensees = response.data || response;
      } catch (error) {
        console.error('Erreur chargement pensées:', error);
      }
    },

    async fetchTemoignages() {
      try {
        const response = await contentService.getTemoignages();
        this.temoignages = response.data || response;
      } catch (error) {
        console.error('Erreur chargement temoignages:', error);
      }
    },

    async fetchPartenaires() {
      try {
        const response = await contentService.getPartenaires();
        this.partenaires = response.data || response;
      } catch (error) {
        console.error('Erreur chargement partenaires:', error);
      }
    },

    async fetchEquipe() {
      try {
        const response = await contentService.getEquipe();
        this.equipe = response.data || response;
      } catch (error) {
        console.error('Erreur chargement equipe:', error);
      }
    },

    async fetchGalerie() {
      try {
        const response = await contentService.getGalerie();
        this.galerie = response.data || response;
      } catch (error) {
        console.error('Erreur chargement galerie:', error);
      }
    },

    async fetchRubriquesCulture() {
      try {
        const response = await contentService.getRubriquesCulture();
        this.rubriques = response.data || response;
      } catch (error) {
        console.error('Erreur chargement rubriques culture:', error);
      }
    },

    async fetchSettings() {
      try {
        const response = await contentService.getSettings();
        this.settings = response.data || response;
      } catch (error) {
        console.error('Erreur chargement settings:', error);
      }
    },

    async fetchAll() {
      this.loading = true;
      await Promise.all([
        this.fetchSlides(),
        this.fetchEvenements(),
        this.fetchTemoignages(),
        this.fetchPartenaires(),
        this.fetchEquipe(),
        this.fetchGalerie(),
        this.fetchSettings(),
      ]);
      this.loading = false;
    }
  }
});
