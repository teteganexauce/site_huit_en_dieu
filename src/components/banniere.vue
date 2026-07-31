<template>
   <div class="d-none">
      <section id="hero-static" class="hero-static d-flex align-items-center">
         <div class="container d-flex flex-column justify-content-center align-items-center text-center position-relative">
            <h2>INSTITUT NOUBOUDO <br> <span>Mystère Révélés</span></h2>
            <p>Bienvenue sur la plateforme de vulgarisation et de valorisation des recherches scientifiques du Centre de
               Réveil Spirituel – Hwéton « <b>le Soleil intérieur s’est lévé</b> » dirigé par Monsieur <i><b>Firmin
                     AMADJI</b></i></p>
            <div class="d-flex">
               <a href="#about" class="btn-get-started scrollto">Découvrir l'école</a>
            </div>
         </div>
      </section>
   </div>
   <div class="position-relative" data-aos="zoom-out" data-aos-duration="1200">
      <div class="bg-white" v-if="!isLoading && slides.length > 0">
          <swiper :slides-per-view="1" :space-between="50" loop navigation :pagination="{ clickable: true }" :autoplay="{ delay: 6000, disableOnInteraction: false }"
             @swiper="onSwiper" @slideChange="onSlideChange" :modules="[Navigation, Pagination, A11y, Autoplay]">
             <swiper-slide v-for="(item, index) in slides" :key="item.id || index">
                <div class="swiper-item position-relative">
                   <div class="kenburns-wrapper">
                      <img :src="item.imageUrl || defaultImg" :alt="item.titre">
                   </div>
                   <div class="banniere-overlay">
                      <section id="hero-static" class="h-100 hero-static d-flex align-items-center">
                         <div
                            class="container d-flex flex-column justify-content-center align-items-center text-center position-relative">
                            <h2 class="text-white fw-bold" v-if="item.titre">{{ item.titre }}</h2>
                            <p class="text-white" v-if="item.texte">{{ item.texte }}</p>
                            <div class="d-flex" v-if="item.lien">
                               <router-link :to="item.lien" class="btn-get-started scrollto">En savoir plus</router-link>
                            </div>
                         </div>
                      </section>
                   </div>
                </div>
             </swiper-slide>
         </swiper>
      </div>
      <div v-else-if="isLoading" class="d-flex justify-content-center align-items-center" style="height: 50vh;">
         <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
         </div>
      </div>
   </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import defaultImg from '../assets/img/blog/blog-1.jpg';
import { useContentStore } from '@/stores/content';

const slides = ref([])
const isLoading = ref(true)
const contentStore = useContentStore()

const onSwiper = (swiper) => {
  // swiper instance available here if needed
}

const onSlideChange = () => {
  // fired when slide changes
}

onMounted(async () => {
  try {
    let slidesList = [];
    let eventsList = [];

    if (contentStore.homeData) {
      slidesList = contentStore.homeData.slides || [];
      eventsList = contentStore.homeData.evenements || [];
    }

    // Garder les slides de la bdd, puis ajouter les 3 prochains événements à venir
    const now = new Date();
    const upcoming = eventsList
      .filter(e => new Date(e.dateDebut) > now)
      .slice(0, 3)
      .map(e => ({
        id: 'event-' + e.id,
        titre: e.titre,
        texte: e.description ? (e.description.length > 120 ? e.description.substring(0, 120) + '...' : e.description) : '',
        imageUrl: e.imageUrl,
        lien: '/galerie'
      }));

    slides.value = [...slidesList.map(s => ({ ...s, lien: null })), ...upcoming];
  } catch (error) {
    console.error('Erreur chargement slides:', error);
  } finally {
    isLoading.value = false;
  }
})
</script>
<style scoped>

#hero-static{
   background: transparent;
}

.swiper-item {
   /* --header-height est déjà géré par #main dans App.vue :
      plus besoin de soustraire 80px ni d'ajouter de margin-top ici */
   height: calc(85vh - var(--header-height, 92px));
   min-height: 480px;
   max-height: 650px;
   width: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   overflow: hidden;
}

.kenburns-wrapper {
   position: absolute;
   inset: 0;
   overflow: hidden;
}

.kenburns-wrapper img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   animation: kenburns 18s ease-in-out infinite alternate;
   will-change: transform;
}

@keyframes kenburns {
   0% {
      transform: scale(1) translate(0, 0);
   }
   50% {
      transform: scale(1.12) translate(-1.5%, 1%);
   }
   100% {
      transform: scale(1.06) translate(1%, -1%);
   }
}

.banniere-overlay {
   position: absolute;
   content: '';
   width: 100%;
   height: 100%;
   background-color: rgba(22, 22, 22, 0.356) !important;
   z-index: 9999;
}

/* Entrée en cascade du contenu quand le slide devient actif */
.swiper-slide-active .container h2 {
   animation: heroTextUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.15s both;
}

.swiper-slide-active .container p {
   animation: heroTextUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.35s both;
}

.swiper-slide-active .container .d-flex {
   animation: heroTextUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.55s both;
}

@keyframes heroTextUp {
   from {
      opacity: 0;
      transform: translateY(40px);
   }
   to {
      opacity: 1;
      transform: translateY(0);
   }
}
</style>