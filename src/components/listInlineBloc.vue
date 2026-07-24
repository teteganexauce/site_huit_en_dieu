<script setup>
import { ref, onMounted, computed } from 'vue'
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

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

const clientLogos = [client1, client2, client3, client4, client5, client6, client7, client8]

const formationsPopulaires = ref([])
const boutiqueProduits = ref([])
const publicationsRecentes = ref([])
const isLoadingFormations = ref(true)

const temoignages = ref([])
const partenaires = ref([])
const publications = ref([])
const boutiqueItems = ref([])
const isLoadingBoutique = ref(true)
const isLoadingPublications = ref(true)
const isLoadingTemoignages = ref(true)
const isLoadingPartenaires = ref(true)

// On duplique la liste des partenaires pour garantir assez de slides
// à Swiper afin que le loop soit fluide et ne s'arrête jamais,
// quel que soit le nombre réel de partenaires en base.
const partenairesSlider = computed(() => {
  const list = partenaires.value
  if (!list.length) return []
  const minSlides = 21 // 7 (slidesPerView max) x 3, marge confortable pour un loop fluide
  let result = [...list]
  while (result.length < minSlides) {
    result = result.concat(list)
  }
  return result
})

onMounted(async () => {
  try {
    const pubData = await publicService.getPublications({ per_page: 3 });
    publications.value = pubData.data || pubData;
  } catch (error) {
    console.error('Erreur chargement publications:', error);
  } finally {
    isLoadingPublications.value = false;
  }

  try {
    const bData = await publicService.getCatalogue({ per_page: 4, sort_by: 'ventes' });
    boutiqueItems.value = bData.data || bData;
  } catch (error) {
    console.error('Erreur chargement boutique:', error);
  } finally {
    isLoadingBoutique.value = false;
  }

  try {
    const fData = await publicService.getFormations({ popular: true });
    formationsPopulaires.value = fData.data || fData;
  } catch (error) {
    console.error('Erreur chargement formations populaires:', error);
  } finally {
    isLoadingFormations.value = false;
  }

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

  try {
    const pData = await publicService.getCatalogue({ sort_by: 'ventes', per_page: 4, has_image: 1 });
    boutiqueProduits.value = pData.data || pData;
  } catch (error) {
    console.error('Erreur chargement boutique:', error);
  }

  try {
    const pubData = await publicService.getPublications({ per_page: 3 });
    publicationsRecentes.value = pubData.data || pubData;
  } catch (error) {
    console.error('Erreur chargement publications:', error);
  }
})

const getImageUrl = (url) => {
    if (!url) return faqImg
    if (url.includes('placeholder')) return faqImg
    return url.startsWith('http') ? url : `http://localhost:8000${url}`
}
</script>

<template>
   <section id="featured-services" class="featured-services">
      <div class="container">
        <h3 class="w-100 text-primary fw-bold text-center mb-5">Nos Formations</h3>
        <div v-if="isLoadingFormations" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <div v-else class="row gy-4">
          <div v-for="f in formationsPopulaires" :key="f.id" class="col-xl-3 col-md-6 d-flex">
            <div class="service-item position-relative">
              <div class="icon"><i class="bi bi-star-fill icon"></i></div>
              <h4><router-link :to="`/formations/${f.id}`" class="stretched-link">{{ f.titre }}</router-link></h4>
              <div class="mb-2">
                <span v-for="s in 5" :key="s" class="star" :class="s <= Math.round(f.note_moyenne || 0) ? 'text-warning' : 'text-muted'">&#9733;</span>
                <small class="text-muted ms-1">({{ f.notes_count || 0 }})</small>
              </div>
              <p>{{ f.description?.substring(0, 120) }}{{ f.description?.length > 120 ? '...' : '' }}</p>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <small class="text-muted"><i class="bi bi-people me-1"></i>{{ f.inscrits_count || 0 }} inscrits</small>
                <small v-if="f.prix > 0" class="fw-bold text-primary">{{ f.prix?.toLocaleString('fr-FR') }} FCFA</small>
                <small v-else class="badge bg-success">Gratuit</small>
              </div>
              <router-link :to="`/formations/${f.id}`" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i></router-link>
            </div>
          </div>
        </div>
        <div v-if="!isLoadingFormations && !formationsPopulaires.length" class="text-center text-muted py-3">
          <p>Aucune formation disponible pour le moment.</p>
        </div>
      </div>
   </section>

   <section id="espace-vente" class="espace-vente bg-light mb-5">
      <div class="container">
         <div class="row espace vente">
            <div class="col-md-6 d-flex align-items-center mb-4 mb-md-0">
               <div class="title">
                  <h1>Espace de vente d'article, de document et d'artéfact</h1>
                  <p class="w-75 mt-4 text-muted">Découvrez notre boutique en ligne regroupant une sélection exclusive d'articles de recherche, d'e-books spécialisés, et d'artéfacts traditionnels. Parcourez notre collection pour approfondir vos connaissances et soutenir notre mission.</p>
                    <router-link to="/boutique" class="btn btn-warning rounded-1 mt-4 text-white">Visiter la boutique <i class="bi bi-arrow-right"></i></router-link>
               </div>
            </div>
            <div class="col-md-6 d-flex align-items-center">
               <div class="row p-0">
                  <div class="col-6 grid-img" v-for="(item, index) in boutiqueItems.slice(0, 4)" :key="index">
                       <img v-if="item.imageUrl && !item.imageUrl.includes('placeholder.jpg')" :src="item.imageUrl" :alt="item.nom || 'Article'" style="object-fit: cover; width: 100%; height: 100%;">
                       <img v-else src="../assets/img/faq.jpg" alt="Article boutique" style="object-fit: cover; width: 100%; height: 100%;">
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
               <div class="section-title text-center mb-5">
                   <h2>Nos dernières publications</h2>
                   <p>Découvrez les travaux de recherche, thèses, livres et artéfacts récents.</p>
                </div>
                <div class="row gy-4 posts-list">

                   <div class="col-lg-4" v-for="pub in publications.slice(0, 3)" :key="pub.id">
                      <article class="d-flex flex-column h-100">

                        <div class="post-img">
                           <img v-if="pub.image_url" :src="pub.image_url" class="img-fluid" style="object-fit: cover; height: 150px; width: 100%;">
                           <img v-else src="../assets/img/blog/blog-3.jpg" class="img-fluid" style="object-fit: cover; height: 150px; width: 100%;">
                        </div>

                        <h5 class="title mt-3">
                           <a href="#" class="pub-title fs-5">{{ pub.titre }}</a>
                        </h5>

                        <div class="meta-top">
                           <ul>
                              <li class="d-flex align-items-center">
                                 <i class="bi bi-person"></i>
                                 <a href="#">{{ pub.chercheur?.nom || 'Auteur inconnu' }}</a>
                              </li>
                              <li class="d-flex align-items-center">
                                 <i class="bi bi-clock"></i>
                                 <a href="#"><time>{{ formatDate(pub.datePublication || pub.created_at) }}</time></a>
                              </li>
                           </ul>
                        </div>

                        <div class="content mb-3 flex-grow-1">
                           <p class="text-muted mb-1 line-clamp">
                              {{ pub.resume || 'Aucun résumé disponible' }}
                           </p>
                        </div>

                        <div class="read-more mt-auto align-self-end" v-if="pub.fichierUrl || pub.lien_externe">
                           <a v-if="pub.fichierUrl" :href="pub.fichierUrl" target="_blank">Consulter</a>
                           <a v-else-if="pub.lien_externe" :href="pub.lien_externe" target="_blank">Lien externe</a>
                        </div>
                     </article>
                  </div><!-- End post list item -->

               </div><!-- End blog posts list -->

               <div class="text-center mt-5">
                   <router-link to="/publications" class="btn btn-primary px-4 py-2">Voir toutes les publications</router-link>
                 </div>

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
            <swiper
               :slides-per-view="1"
               :space-between="30"
               :loop="true"
               :modules="[Navigation, Pagination, A11y, Autoplay]"
               :pagination="{ clickable: true }"
               :autoplay="{ delay: 4000, disableOnInteraction: false }"
               :speed="800"
               :grab-cursor="true"
               :centered-slides="true"
               class="testimonials-swiper"
            >
               <swiper-slide v-for="item in temoignages" :key="item.id">
                  <div class="testimonial-item text-center">
                     <img :src="item.photoUrl || defaultImg" class="testimonial-img" alt="">
                     <h3>{{ item.auteur }}</h3>
                     <p class="mx-auto" style="max-width: 700px;">
                        <i class="bi bi-quote quote-icon-left"></i>
                        {{ item.contenu }}
                        <i class="bi bi-quote quote-icon-right"></i>
                     </p>
                  </div>
               </swiper-slide>
            </swiper>
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
                  :loop="true"
                  :modules="[Autoplay]"
                  :breakpoints="{
                    320: { slidesPerView: 2, spaceBetween: 12 },
                    576: { slidesPerView: 3, spaceBetween: 12 },
                    768: { slidesPerView: 4, spaceBetween: 16 },
                    992: { slidesPerView: 5, spaceBetween: 16 },
                    1200: { slidesPerView: 7, spaceBetween: 16 }
                  }"
                  :speed="5000"
                  :allow-touch-move="false"
                  :autoplay="{ delay: 1, disableOnInteraction: false, pauseOnMouseEnter: false, stopOnLastSlide: false }"
               >
                <swiper-slide v-for="(item, index) in partenairesSlider" :key="`${item.id}-${index}`">
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
   box-shadow: none;
}

.partner-card:hover {
   transform: translateY(-2px);
}

.clients-slider {
   overflow: hidden;
}

.partner-card img {
   box-shadow: none !important;
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