<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'
import defaultImg from '../assets/img/blog/blog-4.jpg'

const rubriques = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await publicService.getRubriquesCulture();
    rubriques.value = data.data || data;
  } catch (error) {
    console.error('Erreur chargement rubriques:', error);
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <BreadcombsComponent title="Rubriques Culturelles" />
  <div class="container py-5">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    <div v-else-if="rubriques.length === 0" class="text-center py-5 text-muted">
      Aucune rubrique culturelle pour le moment.
    </div>
    <div v-else class="row g-4">
      <div v-for="item in rubriques" :key="item.id" class="col-lg-4 col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <img :src="item.imageUrl || defaultImg" class="card-img-top" :alt="item.nom" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title text-primary">{{ item.nom }}</h5>
            <p class="card-text text-muted">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
