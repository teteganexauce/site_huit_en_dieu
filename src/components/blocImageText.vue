<template>
   <section id="onfocus" class="onfocus">
      <div class="container-fluid p-0">
         <div class="row g-0">
            <div class="col-lg-6 video-play position-relative d-flex align-items-center justify-content-center overflow-hidden" :class="{ 'video-empty': !videoUrl }" data-aos="fade-right" data-aos-duration="1100">
               <video v-if="videoUrl" ref="videoRef" :src="videoUrl" class="w-100" style="object-fit: cover; max-height: 500px;" :controls="isPlaying" playsinline @click="togglePlay"></video>
               <div v-if="videoUrl && !isPlaying" class="play-overlay" @click="togglePlay">
                  <div class="play-btn-pulse"></div>
                  <div class="play-btn-pulse delay-1"></div>
                  <div class="play-btn-pulse delay-2"></div>
                  <div class="play-icon">
                     <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="6,3 20,12 6,21" fill="white"/>
                     </svg>
                  </div>
               </div>
               <div v-if="!videoUrl" class="text-center text-white">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor" opacity="0.8"/></svg>
                  <p class="mt-2">Vidéo de présentation</p>
               </div>
            </div>
            <div class="col-lg-6">
               <div class="content d-flex flex-column justify-content-center h-100" data-aos="fade-left" data-aos-duration="1100" data-aos-delay="150">
                 <h1><b>L'Ecole du Réveil Spirituel</b> </h1>
                 <p class="fst-italic">
                   Dénommée La Grande Ecole Universelle des Huit en Dieu est dirigée par Monsieur Firmin AMADJI, chercheur béninois sur la question des cultures, traditions et religions
                 </p>
                 <ul>
                   <li><i class="bi bi-check-circle"></i> Renseigne l'homme sur l'art d'approcher Dieu à partir des dispositions de la vie contemplative active</li>
                   <li><i class="bi bi-check-circle"></i> Ecole de référence au Bénin,dans la sous-région et le monde entier pour tout chercheur qui veut acquérir des connaissances approfondies et scientifques dans le domaine des religions, spiritualité et des cultures</li>
                 </ul>
                 <router-link to="/equipe-animation" class="read-more align-self-start"><span>Lire plus</span><i class="bi bi-arrow-right"></i></router-link>
               </div>
            </div>
         </div>
      </div>
   </section>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useSiteStore } from '../stores/site'

const siteStore = useSiteStore()
const videoRef = ref(null)
const isPlaying = ref(false)

const videoUrl = computed(() => siteStore.siteVideo)

const togglePlay = () => {
  const video = videoRef.value
  if (!video) return
  if (video.paused) {
    video.play()
    isPlaying.value = true
  } else {
    video.pause()
    isPlaying.value = false
  }
}
</script>
<style scoped>
.bg-ps-primary {
   background-color: #0d6dfd98 !important;
}
.video-play {
   min-height: 500px;
}
.video-play.video-empty {
   background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.play-overlay {
   position: absolute;
   inset: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   z-index: 2;
}

.play-icon {
   width: 72px;
   height: 72px;
   border-radius: 50%;
   background: rgba(59, 130, 246, 0.9);
   display: flex;
   align-items: center;
   justify-content: center;
   position: relative;
   z-index: 3;
   transition: transform 0.3s ease, background 0.3s ease;
   box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
}

.play-overlay:hover .play-icon {
   transform: scale(1.1);
   background: rgba(37, 99, 235, 0.95);
   box-shadow: 0 0 50px rgba(59, 130, 246, 0.7);
}

@keyframes pulse-ring {
   0% { transform: scale(1); opacity: 0.6; }
   50% { transform: scale(1.5); opacity: 0.2; }
   100% { transform: scale(1.8); opacity: 0; }
}

.play-btn-pulse {
   position: absolute;
   width: 72px;
   height: 72px;
   border-radius: 50%;
   border: 3px solid #3b82f6;
   animation: pulse-ring 2s ease-out infinite;
   z-index: 1;
}

.play-btn-pulse.delay-1 {
   animation-delay: 0.6s;
}

.play-btn-pulse.delay-2 {
   animation-delay: 1.2s;
}
</style>