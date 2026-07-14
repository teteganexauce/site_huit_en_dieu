<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import publicService from '../services/publicService'
import defaultImg from '../assets/img/blog/blog-2.jpg'
import client1 from '../assets/img/clients/client-1.png'
import client2 from '../assets/img/clients/client-2.png'
import client3 from '../assets/img/clients/client-3.png'
import client4 from '../assets/img/clients/client-4.png'
import client5 from '../assets/img/clients/client-5.png'
import client6 from '../assets/img/clients/client-6.png'
import client7 from '../assets/img/clients/client-7.png'
import client8 from '../assets/img/clients/client-8.png'

const clientLogos = [client1, client2, client3, client4, client5, client6, client7, client8]

const temoignages = ref([])
const partenaires = ref([])
const isLoadingTemoignages = ref(true)
const isLoadingPartenaires = ref(true)

onMounted(async () => {
  try {
    const tData = await publicService.getTestimonials();
    temoignages.value = tData.data || tData;
  } catch (error) {
    console.error('Erreur chargement temoignages:', error);
  } finally {
    isLoadingTemoignages.value = false;
  }

  try {
    const pData = await publicService.getPartners();
    partenaires.value = pData.data || pData;
  } catch (error) {
    console.error('Erreur chargement partenaires:', error);
  } finally {
    isLoadingPartenaires.value = false;
  }
})
</script>

<template>
   <section id="featured-services" class="featured-services">
      <div class="container">
         <h3 class="w-100 text-primary fw-bold text-center mb-5">Nos Formations</h3>
         <div class="row gy-4">

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate">
               <div class="service-item position-relative">
                  <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                  <h4><a href="" class="stretched-link">Lorem Ipsum</a></h4>
                  <p>Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                  <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>
               </div>
            </div><!-- End Service Item -->

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate" data-aos-delay="200">
               <div class="service-item position-relative">
                  <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                  <h4><a href="" class="stretched-link">Sed ut perspici</a></h4>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                  <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>

               </div>
            </div><!-- End Service Item -->

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate" data-aos-delay="400">
               <div class="service-item position-relative">
                  <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                  <h4><a href="" class="stretched-link">Magni Dolores</a></h4>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia</p>
                  <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>

               </div>
            </div><!-- End Service Item -->

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate" data-aos-delay="600">
               <div class="service-item position-relative">
                  <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                  <h4><a href="" class="stretched-link">Nemo Enim</a></h4>
                  <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis</p>
                  <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>

               </div>
            </div><!-- End Service Item -->
         </div>
      </div>
   </section>

   <section id="espace-vente" class="espace-vente bg-light mb-5">
      <div class="container">
         <div class="row espace vente">
            <div class="col-md-6 d-flex align-items-center mb-4 mb-md-0">
               <div class="title">
                  <h1>Espace de vente d'article, de document et d'artéfact</h1>
                  <p class="w-75 mt-4">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores nulla quaerat
                     labore debitis, harum quae impedit atque commodi sunt quasi cum adipisci sapiente? Consequuntur rem
                     corrupti architecto, iusto quisquam quo.</p>
                  <a href="" class="btn btn-warning rounded-1 mt-4">En savoir plus <i class="bi bi-arrow-right"></i></a>
               </div>
            </div>
            <div class="col-md-6 d-flex align-items-center">
               <div class="row p-0">
                  <div class="col-6 grid-img" v-for="n in 4">
                     <img src="../assets/img/blog/blog-2.jpg" alt="">
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>

   <section id="blog" class="blog mt-4 pt-4">
      <div class="container aos-init aos-animate">
         <div class="row g-5">
            <div class="col-lg-12">
               <div class="row gy-4 posts-list">

                  <div class="col-lg-4" v-for="n in 3">
                     <article class="d-flex flex-column">

                        <div class="post-img">
                           <img src="../assets/img/blog/blog-3.jpg" width="100m" class="img-fluid">
                        </div>

                        <h5 class="title mt-3">
                           <router-link to="/publications/detail" class="pub-title fs-5">Possimus soluta ut id
                              suscipit ea ut.
                              In quo quia et soluta libero sit sint.</router-link>
                        </h5>

                        <div class="meta-top">
                           <ul>
                              <li class="d-flex align-items-center"><i class="bi bi-person"></i> <a
                                    href="blog-details.html">John Doe</a></li>
                              <li class="d-flex align-items-center"><i class="bi bi-clock"></i> <a
                                    href="blog-details.html"><time datetime="2022-01-01">Jan 1, 2022</time></a>
                              </li>
                           </ul>
                        </div>

                        <div class="content mb-3">
                           <p>
                              Aut iste neque ut illum qui perspiciatis similique recusandae non. Fugit autem
                              dolorem labore omnis et. Eum temporibus fugiat voluptate enim tenetur sunt omnis.
                           </p>
                        </div>

                        <div class="read-more mt-auto d-flex justify-content-between">
                           <li class="d-flex align-items-center small text-grey"><i class="bi bi-chat-dots"></i>&nbsp;
                              <span href="blog-detspanils.html">12
                                 Comments</span>
                           </li>
                           <a href="blog-details.html" class="d-block">Read More</a>
                        </div>

                     </article>
                  </div><!-- End post list item -->

               </div><!-- End blog posts list -->

               <div class="blog-pagination">
                  <ul class="justify-content-center">
                     <li><a href="#">1</a></li>
                     <li class="active"><a href="#">2</a></li>
                     <li><a href="#">3</a></li>
                  </ul>
               </div><!-- End blog pagination -->

            </div>

         </div>

      </div>
   </section>

   <section id="testimonials" class="testimonials pt-5">
      <div class="container mt-0">
         <h3 class="w-100 text-primary fw-bold text-center mb-5 head-temo">Témoignages</h3>
         <div v-if="isLoadingTemoignages" class="text-center py-3">
           <div class="spinner-border text-primary" role="status">
             <span class="visually-hidden">Chargement...</span>
           </div>
         </div>
         <div v-else class="testimonials-slider swiper">
            <div class="swiper-wrapper">
               <div v-for="item in temoignages" :key="item.id" class="swiper-slide">
                  <div class="testimonial-item">
                     <img :src="item.photoUrl || defaultImg" class="testimonial-img" alt="">
                     <h3>{{ item.auteur }}</h3>
                     <p>
                        <i class="bi bi-quote quote-icon-left"></i>
                        {{ item.contenu }}
                        <i class="bi bi-quote quote-icon-right"></i>
                     </p>
                  </div>
               </div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
         </div>
      </div>
   </section>

   <section id="clients" class="clients mt-5">
      <h3 class="w-100 text-primary fw-bold text-center mb-5">Partenaires</h3>
      <div class="container">
         <div v-if="isLoadingPartenaires" class="text-center py-3">
           <div class="spinner-border text-primary" role="status">
             <span class="visually-hidden">Chargement...</span>
           </div>
         </div>
          <div v-else class="clients-slider swiper">
             <swiper
                :slides-per-view="7"
                :space-between="16"
                loop
                :modules="[Navigation, Pagination, A11y, Autoplay]"
                :breakpoints="{
                  320: { slidesPerView: 2, spaceBetween: 12 },
                  576: { slidesPerView: 3, spaceBetween: 12 },
                  768: { slidesPerView: 4, spaceBetween: 16 },
                  992: { slidesPerView: 5, spaceBetween: 16 },
                  1200: { slidesPerView: 7, spaceBetween: 16 }
                }"
                :autoplay="{ delay: 2000, disableOnInteraction: false }"
             >
                 <swiper-slide v-for="(item, index) in partenaires" :key="item.id">
                   <div class="partner-card">
                     <a :href="item.siteWeb || '#'" target="_blank" v-if="item.siteWeb">
                       <img :src="item.logoUrl || clientLogos[index % clientLogos.length]" class="partner-logo" :alt="item.nom">
                     </a>
                     <img v-else :src="item.logoUrl || clientLogos[index % clientLogos.length]" class="partner-logo" :alt="item.nom">
                   </div>
                 </swiper-slide>
             </swiper>
          </div>
      </div>
   </section>
</template>

<style scoped>
.head-temo {
   position: relative;
   z-index: 1;
}

.grid-img {
   height: 200px;
   border: 2px solid transparent;
   padding: 0;
}

.grid-img img {
   object-fit: cover;
   width: 100%;
   height: 100%;
}

.post-img img {
   max-height: 150px !important;
   object-fit: cover;
   transition: .5s;
   width: 100% !important;
}

.swiper-slide {
   display: flex;
   justify-content: center;
   align-items: center;
}

.partner-card {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   background: #fff;
   border-radius: 8px;
   padding: 12px 8px;
   min-height: 100px;
   transition: all 0.3s ease;
   width: 100%;
}

.partner-card:hover {
   transform: translateY(-2px);
}

.partner-logo {
   max-height: 90px;
   max-width: 160px;
   width: auto;
   height: auto;
   object-fit: contain;
   filter: grayscale(100%);
   opacity: 0.6;
   transition: all 0.4s ease;
}

.partner-card:hover .partner-logo {
   filter: grayscale(0%);
   opacity: 1;
}


</style>