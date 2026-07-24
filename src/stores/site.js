import { defineStore } from 'pinia'
import publicService from '../services/publicService'

export const useSiteStore = defineStore('site', {
  state: () => ({
    settings: {},
  }),
  getters: {
    siteName: (state) => state.settings.SITE_NAME || 'École HED',
    siteMark: (state) => {
      const name = state.settings.SITE_NAME || 'École HED'
      const words = name.split(' ')
      if (words.length >= 2) {
        return words.map(w => w[0]).join('').toUpperCase().slice(0, 4)
      }
      return name.slice(0, 3).toUpperCase()
    },
    siteSlogan: (state) => state.settings.SITE_SLOGAN || 'Éducation · Formation · Engagement',
    siteLogo: (state) => {
      if (!state.settings.SITE_LOGO) return null
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
      const storageBase = base.replace('/api/v1', '/storage')
      return `${storageBase}/${state.settings.SITE_LOGO}`
    },
    siteVideo: (state) => {
      if (!state.settings.HERO_VIDEO) return null
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
      const storageBase = base.replace('/api/v1', '/storage')
      return `${storageBase}/${state.settings.HERO_VIDEO}`
    },
  },
  actions: {
    async fetchSettings() {
      try {
        const data = await publicService.getSettings()
        this.settings = data
      } catch (e) {
        console.warn('Impossible de charger les paramètres du site', e)
      }
    },
  },
})
