<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import shopService from '../services/shopService'
import defaultAvatar from '../assets/img/faq.jpg'

const inscriptions = ref([])
const isLoading = ref(true)

const statusLabel = (statut) => {
  const labels = {
    confirmee: 'Confirmée', en_attente: 'En attente', annulee: 'Annulée',
    REUSSI: 'Réussi', EN_ATTENTE: 'En attente', ECHOUE: 'Échoué'
  }
  return labels[statut] || statut
}

const statusClass = (statut) => {
  const classes = {
    confirmee: 'success', en_attente: 'warning', annulee: 'danger',
    REUSSI: 'success', EN_ATTENTE: 'warning', ECHOUE: 'danger'
  }
  return classes[statut] || 'secondary'
}

async function loadFormations() {
  try {
    const res = await shopService.getMyInscriptions()
    const data = res.data || res
    inscriptions.value = data.data || data
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadFormations)
</script>

<template>
  <BreadcombsComponent title="Mes formations" />
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold mb-0">Mes formations</h5>
      <span class="text-muted small">{{ inscriptions.length }} formation(s)</span>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="!inscriptions.length" class="text-center py-5 text-muted">
      <i class="bi bi-mortarboard display-3"></i>
      <h5 class="mt-3">Vous n'êtes inscrit à aucune formation</h5>
      <router-link to="/formations" class="btn btn-primary mt-3">Voir les formations</router-link>
    </div>

    <div v-else class="row g-3">
      <div v-for="ins in inscriptions" :key="ins.id" class="col-md-6">
        <div class="border rounded-3 p-3 h-100 d-flex">
          <img :src="ins.formation?.imageUrl || defaultAvatar" class="rounded me-3" width="80" height="80" style="object-fit: cover;">
          <div class="flex-grow-1 d-flex flex-column">
            <h6 class="fw-bold mb-1">{{ ins.formation?.titre || 'Formation' }}</h6>
            <div class="mb-1">
              <span class="badge" :class="'bg-' + statusClass(ins.statut)">{{ statusLabel(ins.statut) }}</span>
            </div>
            <div class="mt-auto">
              <div class="d-flex justify-content-between small mb-1">
                <span class="text-muted">Progression</span>
                <span class="fw-bold">{{ Math.round(ins.progression || 0) }}%</span>
              </div>
              <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-success" :style="{ width: (ins.progression || 0) + '%' }"></div>
              </div>
              <div class="mt-2">
                <router-link :to="'/formations/' + ins.formation_id" class="btn btn-sm btn-outline-primary me-1">
                  <i class="bi bi-eye me-1"></i>Voir
                </router-link>
                <router-link v-if="ins.progression === 100" :to="'/inscriptions/' + ins.id + '/certificat'" class="btn btn-sm btn-outline-warning">
                  <i class="bi bi-award me-1"></i>Certificat
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
