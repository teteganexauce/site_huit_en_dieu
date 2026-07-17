<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import publicService from '../services/publicService'
import BreadcombsComponent from '../includes/breadcombs.vue'

const route = useRoute()
const page = ref(null)
const isLoading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const data = await publicService.getPage(route.params.slug);
    page.value = data.data || data;
  } catch (err) {
    console.error('Erreur chargement page:', err);
    error.value = "Page non trouvée.";
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <BreadcombsComponent :title="page?.titre || 'Page'" />
  <div class="container py-5">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <h1 class="text-primary mb-4">{{ page.titre }}</h1>
      <div v-html="page.contenu"></div>
    </div>
  </div>
</template>
