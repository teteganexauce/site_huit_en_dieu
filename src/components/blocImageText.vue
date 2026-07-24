<template>
   <section id="onfocus" class="onfocus">
      <div class="container-fluid p-0 aos-init aos-animate" data-aos="fade-up">
         <div class="row g-0">
            <div class="col-lg-6 video-play position-relative d-flex align-items-center justify-content-center" :class="{ 'video-empty': !videoUrl }">
               <video v-if="videoUrl" :src="videoUrl" class="w-100 h-100" style="object-fit: cover;" controls playsinline></video>
               <div v-else class="text-center text-white">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor" opacity="0.8"/></svg>
                  <p class="mt-2">Vidéo de présentation</p>
               </div>
            </div>
            <div class="col-lg-6">
               <div class="content d-flex flex-column justify-content-center h-100">
                 <h1><b>L'Ecole du Réveil Spirituel</b> </h1>
                 <p class="fst-italic">
                   Dénommée La Grande Ecole Universelle des Huit en Dieu est dirigée par Monsieur Firmin AMADJI, chercheur béninois sur la question des cultures, traditions et religions
                 </p>
                 <ul>
                   <li><i class="bi bi-check-circle"></i> Renseigne l'homme sur l'art d'approcher Dieu à partir des dispositions de la vie contemplative active</li>
                   <li><i class="bi bi-check-circle"></i> Ecole de référence au Bénin,dans la sous-région et le monde entier pour tout chercheur qui veut acquérir des connaissances approfondies et scientifques dans le domaine des religions, spiritualité et des cultures</li>
                 </ul>
                 <a href="#" class="read-more align-self-start"><span>Lire plus</span><i class="bi bi-arrow-right"></i></a>
               </div>
            </div>
         </div>
      </div>
   </section>
</template>
<script setup>
import { computed } from 'vue'
import { useSiteStore } from '../stores/site'

const siteStore = useSiteStore()
const videoUrl = computed(() => siteStore.siteVideo)
</script>
<style scoped>
.bg-ps-primary {
   background-color: #0d6dfd98 !important;
}
.video-play.video-empty {
   background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}
</style>