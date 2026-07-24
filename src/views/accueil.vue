<script setup>
import { ref, onMounted, computed } from 'vue'
import BanniereComponent from '../components/banniere.vue'
import ActualiteComponent from '../components/actualites.vue'
import BlocImageTextComponent from '../components/blocImageText.vue'
import ListInlineBlocComponnent from '@/components/listInlineBloc.vue'
import { useContentStore } from '@/stores/content'

const contentStore = useContentStore()

const totalDons = computed(() => contentStore.homeData?.dons?.total || 0)
const totalDonateurs = computed(() => contentStore.homeData?.dons?.donateurs || 0)
const compteurAffiche = ref(0)
const compteurDonsAffiche = ref(0)

onMounted(async () => {
  await contentStore.fetchHomeData()
  animerCompteurs()
})

function animerCompteurs() {
  animerUnCompteur(totalDonateurs.value, compteurAffiche)
  animerUnCompteur(totalDons.value, compteurDonsAffiche)
}

function animerUnCompteur(valeurFinale, cible) {
  const duree = 2000
  const debut = performance.now()

  function step(timestamp) {
    const ecoule = timestamp - debut
    const progression = Math.min(ecoule / duree, 1)
    const ease = 1 - Math.pow(1 - progression, 3)
    cible.value = Math.floor(ease * valeurFinale)
    if (progression < 1) {
      requestAnimationFrame(step)
    } else {
      cible.value = valeurFinale
    }
  }
  requestAnimationFrame(step)
}
</script>

<template>
   <!-- Global page loader -->
   <div v-if="!contentStore.homeData" class="vh-100 w-100 d-flex flex-column justify-content-center align-items-center bg-white position-fixed top-0 start-0" style="z-index: 9999;">
     <div class="spinner-grow text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
       <span class="visually-hidden">Chargement...</span>
     </div>
     <h5 class="text-primary fw-bold" style="animation: pulse 1.5s infinite;">Chargement de Huit en Dieu...</h5>
   </div>

   <!-- Page content (visually hidden until everything is ready) -->
   <div v-else class="overflow-hidden">
     <BanniereComponent />
     <ActualiteComponent />
     <BlocImageTextComponent />
     <ListInlineBlocComponnent />

   <section class="py-5 bg-white border-top border-bottom">
     <div class="container text-center text-dark">
       <h3 class="fw-bold mb-2">Soutenez notre mission</h3>
       <p class="text-muted mb-4">Ensemble, faisons la différence. Chaque don compte.</p>
        <div class="row justify-content-center g-3 mb-4">
          <div class="col-md-3">
            <div class="bg-light shadow-sm border rounded-3 p-3">
              <div class="fs-2 fw-bold">{{ compteurAffiche }}</div>
              <small class="text-muted">Donateurs</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="bg-light shadow-sm border rounded-3 p-3">
              <div class="fs-2 fw-bold">{{ compteurDonsAffiche.toLocaleString() }} FCFA</div>
              <small class="text-muted">Collectés</small>
            </div>
          </div>
        </div>
       <router-link to="/dons" class="btn btn-primary btn-lg px-5">
         <i class="bi bi-heart-fill me-2"></i>Faire un don
       </router-link>
     </div>
   </section>
  </div>
</template>

<style>
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>