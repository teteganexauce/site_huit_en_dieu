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
   <div class="position-relative">
      <div class="bg-white">
         <swiper :slides-per-view="1" :space-between="50" loop navigation :pagination="{ clickable: true }"
            @swiper="onSwiper" @slideChange="onSlideChange" :modules="[Navigation, Pagination, A11y]">
            <swiper-slide v-for="(item, index) in slides" :key="index">
               <div class="swiper-item position-relative">
                  <img :src="item.image" alt="">
                  <div class="banniere-overlay">
                     <section id="hero-static" class="h-100 hero-static d-flex align-items-center">
                        <div
                           class="container d-flex flex-column justify-content-center align-items-center text-center position-relative">
                           <h2 class="text-white fw-bold">INSTITUT NOUBOUDO <br> <span class="fw-bold text-primary">Mystères Révélés</span></h2>
                           <p class="text-white">Bienvenue sur la plateforme de vulgarisation et de valorisation des recherches scientifiques
                              du Centre de
                              Réveil Spirituel – Hwéton « <b>le Soleil intérieur s’est lévé</b> » dirigé par Monsieur
                              <i><b>Firmin
                                    AMADJI</b></i></p>
                           <div class="d-flex">
                              <a href="#about" class="btn-get-started scrollto">Découvrir l'école</a>
                           </div>
                        </div>
                     </section>
                  </div>
               </div>
            </swiper-slide>
         </swiper>
      </div>
   </div>
</template>
<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import EasyLMD from '../assets/img/blog/blog-1.jpg';
import Parent from '../assets/img/blog/blog-2.jpg';
import Student from '../assets/img/blog/blog-3.jpg';
import Teacher from '../assets/img/blog/blog-4.jpg';

const slides = ref(
   [{
      image: EasyLMD,
      nom: 'EasyLMD',
   },
   {
      image: Student,
      nom: 'Student',
   },
   {
      image: Parent,
      nom: 'Parent',
   },
   {
      image: Teacher,
      nom: 'Teacher',
   },]
)

</script>
<style scoped>

#hero-static{
   background: transparent;
}
.swiper-item {
   height: calc(100vh - 80px);
   width: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   margin-top: 80px;
}

.swiper-item img {
   width: 100%;
   height: 100%;
   object-fit: cover;
}

.banniere-overlay {
   position: absolute;
   contain: '';
   width: 100%;
   height: 100%;
   background-color: rgba(22, 22, 22, 0.356) !important;
   z-index: 9999;
}</style>