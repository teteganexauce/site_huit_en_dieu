<script setup>
import { ref, onMounted } from 'vue'
import BanniereComponent from '../components/banniere.vue'
import ActualiteComponent from '../components/actualites.vue'
import BlocImageTextComponent from '../components/blocImageText.vue'
import ListInlineBlocComponnent from '@/components/listInlineBloc.vue'
import donService from '../services/donService'

const totalDons = ref(0)
const totalDonateurs = ref(0)

onMounted(async () => {
  try {
    const res = await donService.getTotal()
    totalDons.value = res.total || 0
    totalDonateurs.value = res.donateurs || 0
  } catch (e) {
    console.error('Erreur chargement dons:', e)
  }
})
</script>

<template>
   <BanniereComponent />
   <ActualiteComponent />
   <BlocImageTextComponent />
   <ListInlineBlocComponnent />

   <section class="py-5" style="background: linear-gradient(135deg, #6f42c1 0%, #5533a0 100%);">
     <div class="container text-center text-white">
       <h3 class="fw-bold mb-2">Soutenez notre mission</h3>
       <p class="opacity-75 mb-4">Ensemble, faisons la différence. Chaque don compte.</p>
       <div class="row justify-content-center g-3 mb-4">
         <div class="col-md-3">
           <div class="bg-white bg-opacity-10 rounded-3 p-3">
             <div class="fs-2 fw-bold">{{ Number(totalDons).toLocaleString('fr-FR') }} FCFA</div>
             <small class="opacity-75">Collectés</small>
           </div>
         </div>
         <div class="col-md-3">
           <div class="bg-white bg-opacity-10 rounded-3 p-3">
             <div class="fs-2 fw-bold">{{ totalDonateurs }}</div>
             <small class="opacity-75">Donateurs</small>
           </div>
         </div>
       </div>
       <router-link to="/dons" class="btn btn-light btn-lg px-5">
         <i class="bi bi-heart-fill me-2 text-danger"></i>Faire un don
       </router-link>
     </div>
   </section>
</template>