<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'

const partenaires = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const pData = await publicService.getPartners()
    partenaires.value = pData.data || pData
  } catch (error) {
    console.error('Erreur chargement partenaires:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <BreadcombsComponent title="Nos partenaires" />
  <section class="partenaires py-5">
    <div class="container">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
      <div v-else class="row g-4">
        <div v-for="item in partenaires" :key="item.id" class="col-lg-3 col-md-4 col-sm-6">
          <div class="partner-card border rounded p-3 text-center h-100 d-flex flex-column align-items-center justify-content-center">
            <a :href="item.siteWeb || '#'" target="_blank" v-if="item.siteWeb" class="d-block mb-3">
              <img :src="item.logoUrl" class="partner-logo img-fluid" :alt="item.nom">
            </a>
            <img v-else :src="item.logoUrl" class="partner-logo img-fluid mb-3" :alt="item.nom">
            <h5 class="fw-bold">{{ item.nom }}</h5>
            <p v-if="item.description" class="text-muted small">{{ item.description }}</p>
            <a v-if="item.siteWeb" :href="item.siteWeb" target="_blank" class="btn btn-outline-primary btn-sm mt-2">
              Visiter le site <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.partner-logo {
  max-height: 100px;
  max-width: 180px;
  object-fit: contain;
}
</style>
