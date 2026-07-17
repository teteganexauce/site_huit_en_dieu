<template>
  <BreadcombsComponent title="Certificat" />

  <div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
  </div>

  <div v-else-if="error" class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center p-5">
            <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <i class="bi bi-x-circle text-danger display-5"></i>
            </div>
            <h4 class="fw-bold mb-3">{{ error.title }}</h4>
            <p class="text-muted mb-4">{{ error.message }}</p>

            <div v-if="error.evaluations?.length" class="text-start border rounded-3 p-3 bg-light mb-4">
              <h6 class="fw-bold mb-2"><i class="bi bi-pencil me-1"></i>Évaluations à compléter</h6>
              <div v-for="ev in error.evaluations" :key="ev.evaluation_id" class="d-flex align-items-center gap-2 py-1">
                <i class="bi bi-dash-circle text-warning"></i>
                <small>{{ ev.evaluation_titre }} (module {{ ev.module_titre }})</small>
              </div>
            </div>

            <div class="d-flex justify-content-center gap-2">
              <router-link :to="'/apprentissage/' + inscriptionId" class="btn btn-primary">
                <i class="bi bi-play-circle me-1"></i>Retour à la formation
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center p-5">
            <div class="mb-4">
              <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px;">
                <i class="bi bi-award-fill text-success display-4"></i>
              </div>
            </div>

            <h3 class="fw-bold mb-1">Félicitations !</h3>
            <p class="text-muted mb-4">{{ certificat.nom }}</p>

            <div class="border rounded-3 p-4 bg-light mb-4">
              <h5 class="fw-bold mb-1">{{ certificat.formation }}</h5>
              <p class="text-muted mb-0">Complétée avec succès à 100%</p>
              <p class="text-muted mb-0" v-if="certificat.dateCertificat">
                <i class="bi bi-calendar me-1"></i>{{ formatDate(certificat.dateCertificat) }}
              </p>
            </div>

            <div class="d-flex justify-content-center gap-3 flex-wrap">
              <a v-if="certificat.url" :href="certificat.url" target="_blank" class="btn btn-success btn-lg" @click="downloadCert">
                <i class="bi bi-download me-2"></i>Télécharger le certificat (PDF)
              </a>
              <router-link :to="'/apprentissage/' + inscriptionId" class="btn btn-outline-primary btn-lg">
                <i class="bi bi-arrow-left me-1"></i>Retour à la formation
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BreadcombsComponent from '../includes/breadcombs.vue'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const inscriptionId = route.params.id
const loading = ref(true)
const error = ref(null)
const certificat = ref(null)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function downloadCert() {
  // L'URL signée s'ouvre dans un nouvel onglet via le href target="_blank"
}

onMounted(async () => {
  try {
    const res = await api.get(`/inscriptions/${inscriptionId}/certificat/verifier`)
    const data = res.data || res
    if (!data.accessible) {
      error.value = {
        title: 'Certificat non disponible',
        message: data.message || 'Vous devez d\'abord remplir toutes les conditions.',
        evaluations: data.evaluationsEnAttente || [],
      }
    } else {
      if (!data.url || !data.certificatExiste) {
        const genRes = await api.get(`/inscriptions/${inscriptionId}/certificat`)
        const genData = genRes.data || genRes
        data.url = genData.url
      }
      certificat.value = data
    }
  } catch (e) {
    const msg = e.response?.data?.message || 'Erreur lors du chargement du certificat.'
    if (e.response?.data?.evaluation_module) {
      error.value = {
        title: 'Évaluations requises',
        message: msg,
        evaluations: [{ evaluation_titre: e.response.data.evaluation_module }],
      }
    } else {
      error.value = { title: 'Erreur', message: msg, evaluations: [] }
    }
  } finally {
    loading.value = false
  }
})
</script>
