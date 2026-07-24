<script setup>
import { ref, onMounted } from 'vue'
import BanniereComponent from '../components/banniere.vue'
import ActualiteComponent from '../components/actualites.vue'
import BlocImageTextComponent from '../components/blocImageText.vue'
import ListInlineBlocComponnent from '@/components/listInlineBloc.vue'
import donService from '../services/donService'

const compteurAffiche = ref(0)
const totalDonateurs = ref(0)

onMounted(async () => {
  try {
    const res = await donService.getTotal()
    totalDonateurs.value = res.donateurs || 0
    animerCompteur()
  } catch (e) {
    console.error('Erreur chargement dons:', e)
  }
})

function animerCompteur() {
  const duree = 2000
  const debut = performance.now()
  const valeurFinale = totalDonateurs.value

  function step(timestamp) {
    const ecoule = timestamp - debut
    const progression = Math.min(ecoule / duree, 1)
    const ease = 1 - Math.pow(1 - progression, 3)
    compteurAffiche.value = Math.floor(ease * valeurFinale)
    if (progression < 1) {
      requestAnimationFrame(step)
    } else {
      compteurAffiche.value = valeurFinale
    }
  }
  requestAnimationFrame(step)
}
</script>

<template>
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
       </div>
       <router-link to="/dons" class="btn btn-primary btn-lg px-5">
         <i class="bi bi-heart-fill me-2"></i>Faire un don
       </router-link>
     </div>
   </section>
</template>