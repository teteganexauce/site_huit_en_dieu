<template>
  <BreadcombsComponent title="Nos formations" />
  <div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h3 class="fw-bold text-primary mb-0">Toutes nos formations</h3>
      <div class="d-flex gap-2">
        <button class="btn btn-sm" :class="filterType === '' ? 'btn-primary' : 'btn-outline-primary'" @click="filterType = ''">Toutes</button>
        <button class="btn btn-sm" :class="filterType === 'initiale' ? 'btn-primary' : 'btn-outline-primary'" @click="filterType = 'initiale'">Initiale</button>
        <button class="btn btn-sm" :class="filterType === 'specialisee' ? 'btn-primary' : 'btn-outline-primary'" @click="filterType = 'specialisee'">Spécialisée</button>
        <button class="btn btn-sm" :class="filterType === 'gratuite' ? 'btn-primary' : 'btn-outline-primary'" @click="filterType = 'gratuite'">Gratuite</button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="!filteredFormations.length" class="text-center py-5 text-muted">
      <i class="bi bi-mortarboard display-3"></i>
      <h5 class="mt-3">Aucune formation trouvée</h5>
    </div>

    <div v-else class="row g-4">
      <div v-for="f in filteredFormations" :key="f.id" class="col-lg-6">
        <router-link :to="`/formations/${f.id}`" class="text-decoration-none">
          <div class="card border-0 shadow-sm h-100">
            <div class="row g-0">
              <div class="col-md-4">
                <img :src="f.imageUrl || defaultImg" class="img-fluid rounded-start h-100" style="object-fit: cover; min-height: 200px;" :alt="f.titre">
              </div>
              <div class="col-md-8">
                <div class="card-body d-flex flex-column h-100">
                  <div class="d-flex justify-content-between align-items-start mb-1">
                    <h5 class="card-title fw-bold text-dark mb-0">{{ f.titre }}</h5>
                    <span class="badge" :class="badgeClass(f.type)">{{ badgeLabel(f.type) }}</span>
                  </div>
                  <p class="card-text text-muted small flex-grow-1">{{ f.description?.substring(0, 150) }}{{ f.description?.length > 150 ? '...' : '' }}</p>
                  <div class="mb-1">
                    <span v-for="s in 5" :key="s" class="small" :class="s <= Math.round(f.note_moyenne || 0) ? 'text-warning' : 'text-muted'">&#9733;</span>
                    <small class="text-muted ms-1">({{ f.notes_count || 0 }})</small>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-auto">
                    <div class="small text-muted">
                      <i class="bi bi-people me-1"></i>{{ f.inscrits_count || 0 }} inscrits
                      <span v-if="f.places_restantes !== null" class="ms-2">— {{ f.places_restantes }} places</span>
                    </div>
                    <div>
                      <span v-if="f.prix > 0" class="fw-bold text-primary">{{ formatPrice(f.prix) }}</span>
                      <span v-else class="badge bg-success">Gratuit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'
import defaultImg from '../assets/img/blog/blog-4.jpg'

const formations = ref([])
const loading = ref(true)
const filterType = ref('')

const filteredFormations = computed(() => {
  if (!filterType.value) return formations.value
  return formations.value.filter(f => f.type === filterType.value)
})

const formatPrice = (price) => {
  const num = parseFloat(price)
  if (num <= 0) return 'Gratuit'
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

const badgeLabel = (type) => {
  const labels = { initiale: 'Initiale', specialisee: 'Spécialisée', gratuite: 'Gratuite' }
  return labels[type] || type
}

const badgeClass = (type) => {
  const classes = { initiale: 'bg-primary', specialisee: 'bg-warning text-dark', gratuite: 'bg-success' }
  return classes[type] || 'bg-secondary'
}

onMounted(async () => {
  try {
    const res = await publicService.getFormations()
    formations.value = res.data || res
  } catch (e) {
    console.error('Erreur chargement formations:', e)
  } finally {
    loading.value = false
  }
})
</script>
