import api from './api'

const avisService = {
  // Public
  async getFormationAvis(formationId, params = {}) {
    const r = await api.get(`/avis/formations/${formationId}`, { params })
    return r.data
  },

  async getProduitAvis(produitId, params = {}) {
    const r = await api.get(`/avis/produits/${produitId}`, { params })
    return r.data
  },

  // Authentifié
  async submitAvis(data) {
    const r = await api.post('/avis', data)
    return r.data
  },

  async getStatut(params = {}) {
    const r = await api.get('/avis/statut', { params })
    return r.data
  },

  async getMesAvis(params = {}) {
    const r = await api.get('/user/avis', { params })
    return r.data
  },

  async deleteAvis(id) {
    const r = await api.delete(`/avis/${id}`)
    return r.data
  },
}

export default avisService
