<script setup>
import { ref, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { useContentStore } from '@/stores/content';

const contentStore = useContentStore();
import defaultImg from '../assets/img/blog/blog-2.jpg'
import client1 from '../assets/img/clients/client-1.png'
import client2 from '../assets/img/clients/client-2.png'
import client3 from '../assets/img/clients/client-3.png'
import client4 from '../assets/img/clients/client-4.png'
import client5 from '../assets/img/clients/client-5.png'
import client6 from '../assets/img/clients/client-6.png'
import client7 from '../assets/img/clients/client-7.png'
import client8 from '../assets/img/clients/client-8.png'

// Avatar de secours (silhouette neutre en SVG inline) : evite l'icone
// d'image cassee quand photoUrl est invalide ou que defaultImg ne charge pas.
const fallbackAvatar = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">' +
  '<rect width="90" height="90" fill="#2a2a38"/>' +
  '<circle cx="45" cy="34" r="16" fill="#4a4a5c"/>' +
  '<path d="M14 82c4-18 18-28 31-28s27 10 31 28" fill="#4a4a5c"/>' +
  '</svg>'
)

function onAvatarError(event) {
  event.target.src = fallbackAvatar
}

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
  if (contentStore.homeData) {
    publications.value = contentStore.homeData.publications || [];
    boutiqueItems.value = contentStore.homeData.boutique || [];
    formationsPopulaires.value = contentStore.homeData.formations || [];
    temoignages.value = contentStore.homeData.temoignages || [];
    partenaires.value = contentStore.homeData.partenaires || [];
    boutiqueProduits.value = contentStore.homeData.boutique_images || [];
    publicationsRecentes.value = contentStore.homeData.publications || [];
    
    isLoadingPublications.value = false;
    isLoadingBoutique.value = false;
    isLoadingFormations.value = false;
    isLoadingTemoignages.value = false;
    isLoadingPartenaires.value = false;
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
        <h3 class="w-100 text-primary fw-bold text-center mb-5" data-aos="fade-up" data-aos-duration="1000">Nos Formations</h3>
        <div v-if="isLoadingFormations" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <div v-else class="row gy-4">
          <div v-for="(f, index) in formationsPopulaires" :key="f.id" class="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-duration="1000" :data-aos-delay="120 * index">
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
            <div class="col-md-6 d-flex align-items-center mb-4 mb-md-0" data-aos="fade-right" data-aos-duration="1100">
               <div class="title">
                  <h1>Espace de vente d'article, de document et d'artéfact</h1>
                  <p class="w-75 mt-4 text-muted">Découvrez notre boutique en ligne regroupant une sélection exclusive d'articles de recherche, d'e-books spécialisés, et d'artéfacts traditionnels. Parcourez notre collection pour approfondir vos connaissances et soutenir notre mission.</p>
                    <router-link to="/boutique" class="btn btn-warning rounded-1 mt-4 text-white">Visiter la boutique <i class="bi bi-arrow-right"></i></router-link>
               </div>
            </div>
            <div class="col-md-6 d-flex align-items-center" data-aos="fade-left" data-aos-duration="1100" data-aos-delay="150">
               <div class="row p-0">
                  <div class="col-6 grid-img" v-for="(item, index) in boutiqueItems.slice(0, 4)" :key="index" data-aos="zoom-in" data-aos-delay="100 * (index % 4) + 300">
                       <img v-if="item.imageUrl && !item.imageUrl.includes('placeholder.jpg')" :src="item.imageUrl" :alt="item.nom || 'Article'" style="object-fit: cover; width: 100%; height: 100%;">
                       <img v-else src="../assets/img/faq.jpg" alt="Article boutique" style="object-fit: cover; width: 100%; height: 100%;">
                    </div>
               </div>
            </div>
         </div>
      </div>
   </section>

   <section id="blog" class="blog mt-4 pt-4">
      <div class="container">
         <div class="row g-5">
            <div class="col-lg-12">
               <div class="blog-section-header text-center mb-5" data-aos="fade-up" data-aos-duration="1000">
                   <h2>Nos dernières publications</h2>
                   <p>Découvrez les travaux de recherche, thèses, livres et artéfacts récents.</p>
                </div>
                <div class="row gy-4 posts-list">

                   <div class="col-lg-4" v-for="(pub, index) in publications.slice(0, 3)" :key="pub.id" data-aos="fade-up" data-aos-duration="1000" :data-aos-delay="150 * index">
                      <article class="d-flex flex-column h-100">

                        <div class="post-img">
                           <router-link :to="{ name: 'pub-detail', params: { id: pub.id } }">
                              <img v-if="pub.image_url" :src="pub.image_url" class="img-fluid" style="object-fit: cover; height: 150px; width: 100%;">
                              <img v-else src="../assets/img/blog/blog-3.jpg" class="img-fluid" style="object-fit: cover; height: 150px; width: 100%;">
                           </router-link>
                        </div>

                        <h5 class="title mt-3">
                           <router-link :to="{ name: 'pub-detail', params: { id: pub.id } }" class="pub-title fs-5">{{ pub.titre }}</router-link>
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

                        <div class="read-more mt-auto align-self-end">
                           <router-link :to="{ name: 'pub-detail', params: { id: pub.id } }">Consulter les détails</router-link>
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

   <section id="testimonials" class="testimonials-premium">
      <div class="testimonials-bg-overlay"></div>
      <div class="testimonials-pattern"></div>
      
      <div class="container position-relative mt-0">
         <div class="section-header-premium text-center mb-3" data-aos="fade-up" data-aos-duration="1000">
            <span class="section-subtitle">Ce qu'ils disent de nous</span>
            <h3 class="section-title">Témoignages</h3>
            <div class="section-divider">
               <span class="divider-line"></span>
               <span class="divider-diamond">◆</span>
               <span class="divider-line"></span>
            </div>
         </div>
         
         <div v-if="isLoadingTemoignages" class="text-center py-5">
            <div class="spinner-grow text-secondary" role="status">
             <span class="visually-hidden">Chargement...</span>
           </div>
         </div>
         
         <div v-else class="testimonials-slider swiper" data-aos="fade-up" data-aos-duration="1100" data-aos-delay="200">
            <swiper
               :slides-per-view="1"
               :space-between="30"
               :loop="true"
               :modules="[Navigation, Pagination, A11y, Autoplay]"
               :pagination="{ clickable: true }"
               :autoplay="{ delay: 5000, disableOnInteraction: false }"
               :speed="1000"
               :grab-cursor="true"
               :centered-slides="true"
               class="testimonials-swiper"
            >
               <swiper-slide v-for="item in temoignages" :key="item.id">
                  <div class="testimonial-card">
                     <div class="testimonial-card-inner">
                        <div class="testimonial-avatar-wrapper">
                           <div class="testimonial-avatar-ring"></div>
                           <img :src="item.photoUrl || defaultImg" @error="onAvatarError" class="testimonial-avatar" alt="">
                        </div>
                        <div class="testimonial-content">
                           <div class="quote-icon-top">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M3 21C3 21 4 12 5 10C6 8 9 7 9 7C9 7 7 9 7 11C7 13 9 14 11 14C13 14 14 13 14 11C14 9 13 6 11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                 <path d="M15 21C15 21 16 12 17 10C18 8 21 7 21 7C21 7 19 9 19 11C19 13 21 14 23 14C25 14 26 13 26 11C26 9 25 6 23 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                           </div>
                           <p class="testimonial-text">
                              "{{ item.contenu }}"
                           </p>
                           <div class="testimonial-author">
                              <h4 class="author-name">{{ item.auteur }}</h4>
                              <span class="author-role" v-if="item.fonction">{{ item.fonction }}</span>
                           </div>
                           <div class="testimonial-stars" v-if="item.note">
                              <span v-for="s in 5" :key="s" class="star" :class="s <= item.note ? 'active' : ''">★</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </swiper-slide>
            </swiper>
         </div>
         
          <div v-if="!isLoadingTemoignages && !temoignages.length" class="text-center pt-3">
            <p class="mb-0 opacity-75">Aucun témoignage disponible pour le moment.</p>
         </div>
      </div>
   </section>

   <section id="clients" class="clients mt-5">
      <h3 class="w-100 text-primary fw-bold text-center mb-5" data-aos="fade-up" data-aos-duration="1000">Partenaires</h3>
      <div class="container">
         <div v-if="isLoadingPartenaires" class="text-center py-3">
           <div class="spinner-border text-primary" role="status">
             <span class="visually-hidden">Chargement...</span>
           </div>
         </div>
            <div v-else class="clients-slider swiper" data-aos="fade-up" data-aos-duration="1100" data-aos-delay="150">
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
/* ============================================
   HEAD-TEMO (legacy)
   ============================================ */
.head-temo {
   position: relative;
   z-index: 1;
}

/* ============================================
   GRID IMAGES (espace vente)
   ============================================ */
.grid-img {
   height: 200px;
   border: 2px solid transparent;
   padding: 0;
   overflow: hidden;
}

.grid-img img {
   object-fit: cover;
   width: 100%;
   height: 100%;
   transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.grid-img:hover img {
   transform: scale(1.12);
}

.post-img {
   overflow: hidden;
   border-radius: 10px;
}

.post-img:hover img {
   transform: scale(1.08);
}

/* ============================================
   POST IMAGES (blog)
   ============================================ */
.post-img img {
   max-height: 150px !important;
   object-fit: cover;
   transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), max-height 0.3s;
   width: 100% !important;
}

/* En-tete de la section blog : classe dediee (blog-section-header) pour
   ne plus entrer en collision avec .section-title de la section
   Temoignages, qui la passait en blanc sur fond blanc (texte invisible). */
.blog-section-header h2 {
   font-weight: 700;
   color: #1f2937;
}

.blog-section-header p {
   color: #6c757d;
}

/* ============================================
   SWIPER GLOBAL
   ============================================ */
.swiper-slide {
   display: flex;
   justify-content: center;
   align-items: center;
}

/* ============================================
   PARTENAIRES
   ============================================ */
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

/* ============================================
   TESTIMONIALS PREMIUM SECTION
   ============================================ */

/* --- Section Background ---
   Fond eclairci (moins noir, plus bleu nuit premium) et hauteur
   resserree encore : padding et marges divises par ~2 par rapport
   a la version precedente. */
.testimonials-premium {
   position: relative;
   padding: 30px 0 28px;
   background: #e5e7eb;
   overflow: hidden;
}

.testimonials-bg-overlay {
   position: absolute;
   inset: 0;
   background:
      radial-gradient(ellipse at 20% 50%, rgba(100, 116, 139, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(100, 116, 139, 0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(100, 116, 139, 0.06) 0%, transparent 50%);
   pointer-events: none;
}

.testimonials-pattern {
   position: absolute;
   inset: 0;
   background-image:
      radial-gradient(rgba(100, 116, 139, 0.10) 1px, transparent 1px);
   background-size: 40px 40px;
   pointer-events: none;
   opacity: 0.5;
}

/* --- Section Header : desormais scope a .section-header-premium
   pour ne jamais deteindre sur une autre section qui utiliserait
   par coincidence une classe "section-title" --- */
.section-header-premium {
   position: relative;
   z-index: 2;
}

.section-header-premium .section-subtitle {
   display: inline-block;
   font-family: 'Poppins', sans-serif;
   font-size: 0.8rem;
   font-weight: 500;
   letter-spacing: 4px;
   text-transform: uppercase;
   color: rgba(51, 65, 85, 0.6);
   margin-bottom: 6px;
   position: relative;
}

.section-header-premium .section-title {
   font-family: 'Playfair Display', 'Georgia', serif;
   font-size: 2.1rem;
   font-weight: 700;
   color: #1f2937;
   margin-bottom: 8px;
   letter-spacing: -0.5px;
}

@media (max-width: 768px) {
   .section-header-premium .section-title {
      font-size: 1.7rem;
   }
}

.section-divider {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 12px;
   margin-top: 2px;
}

.divider-line {
   display: inline-block;
   width: 60px;
   height: 1.5px;
   background: linear-gradient(90deg, transparent, rgba(180, 140, 255, 0.6), transparent);
   border-radius: 2px;
}

.divider-diamond {
   color: rgba(180, 140, 255, 0.8);
   font-size: 0.7rem;
   animation: diamondPulse 2s ease-in-out infinite;
}

@keyframes diamondPulse {
   0%, 100% { opacity: 0.6; transform: scale(1); }
   50% { opacity: 1; transform: scale(1.3); }
}

/* --- Testimonial Card --- */
.testimonial-card {
   max-width: 680px;
   margin: 0 auto;
   padding: 3px;
}

.testimonial-card-inner {
   background: #ffffff;
   backdrop-filter: blur(20px);
   -webkit-backdrop-filter: blur(20px);
   border: 1px solid rgba(148, 163, 184, 0.35);
   border-radius: 18px;
   padding: 20px 28px 18px;
   position: relative;
   transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
   box-shadow:
      0 8px 32px rgba(15, 23, 42, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.testimonial-card-inner:hover {
   transform: translateY(-3px);
   border-color: rgba(148, 163, 184, 0.6);
   box-shadow:
      0 14px 40px rgba(15, 23, 42, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* --- Avatar --- */
.testimonial-avatar-wrapper {
   position: relative;
   width: 58px;
   height: 58px;
   margin: 0 auto 10px;
}

.testimonial-avatar-ring {
   position: absolute;
   inset: -3px;
   border-radius: 50%;
   background: conic-gradient(from 0deg, rgba(148, 163, 184, 0.6), rgba(100, 116, 139, 0.25), rgba(148, 163, 184, 0.6));
   animation: ringRotate 4s linear infinite;
   mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 1px));
   -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 1px));
}

@keyframes ringRotate {
   0% { transform: rotate(0deg); }
   100% { transform: rotate(360deg); }
}

.testimonial-avatar {
   width: 58px;
   height: 58px;
   border-radius: 50%;
   object-fit: cover;
   border: 2px solid rgba(100, 116, 139, 0.2);
   position: relative;
   z-index: 1;
   transition: all 0.4s ease;
   box-shadow: 0 4px 16px rgba(15, 23, 42, 0.15);
   background: #d1d5db;
}

.testimonial-card-inner:hover .testimonial-avatar {
   border-color: rgba(100, 116, 139, 0.5);
   transform: scale(1.05);
}

/* --- Content --- */
.testimonial-content {
   text-align: center;
   position: relative;
}

.quote-icon-top {
   color: rgba(100, 116, 139, 0.35);
   margin-bottom: 6px;
   display: flex;
   justify-content: center;
}

.quote-icon-top svg {
   width: 24px;
   height: 24px;
}

.testimonial-text {
   font-family: 'Georgia', 'Times New Roman', serif;
   font-size: 1rem;
   line-height: 1.55;
   color: #374151;
   font-style: italic;
   margin-bottom: 14px;
   max-width: 560px;
   margin-left: auto;
   margin-right: auto;
   letter-spacing: 0.2px;
}

@media (max-width: 576px) {
   .testimonial-text {
      font-size: 0.92rem;
      line-height: 1.5;
   }
}

/* --- Author --- */
.testimonial-author {
   margin-bottom: 6px;
}

.author-name {
   font-family: 'Poppins', sans-serif;
   font-size: 0.98rem;
   font-weight: 600;
   color: #1f2937;
   margin-bottom: 2px;
   letter-spacing: 0.5px;
}

.author-role {
   font-family: 'Poppins', sans-serif;
   font-size: 0.75rem;
   color: #64748b;
   letter-spacing: 1px;
   text-transform: uppercase;
   font-weight: 400;
}

/* --- Stars --- */
.testimonial-stars {
   display: flex;
   justify-content: center;
   gap: 4px;
   margin-top: 4px;
}

.testimonial-stars .star {
   font-size: 1rem;
   color: #d1d5db;
   transition: all 0.3s ease;
}

.testimonial-stars .star.active {
   color: #f0c040;
   text-shadow: 0 0 10px rgba(240, 192, 64, 0.4);
}

/* --- Swiper Pagination --- */
.testimonials-premium :deep(.swiper-pagination) {
   position: relative;
   margin-top: 14px;
   display: flex;
   justify-content: center;
   gap: 10px;
}

.testimonials-premium :deep(.swiper-pagination-bullet) {
   width: 8px;
   height: 8px;
   background: rgba(100, 116, 139, 0.3);
   opacity: 1;
   border-radius: 50%;
   transition: all 0.4s ease;
   position: relative;
}

.testimonials-premium :deep(.swiper-pagination-bullet-active) {
   width: 26px;
   border-radius: 5px;
   background: #64748b;
   box-shadow: 0 0 14px rgba(100, 116, 139, 0.4);
}

/* --- Spinner --- */
.spinner-grow.text-secondary {
   width: 3rem;
   height: 3rem;
}

/* --- Responsive --- */
@media (max-width: 768px) {
   .testimonials-premium {
      padding: 22px 0 20px;
   }

   .testimonial-card-inner {
      padding: 18px 20px 16px;
      border-radius: 14px;
   }

   .testimonial-avatar-wrapper,
   .testimonial-avatar {
      width: 50px;
      height: 50px;
   }

   .testimonial-avatar-ring {
      inset: -2px;
   }
}

@media (max-width: 576px) {
   .testimonials-premium {
      padding: 16px 0 15px;
   }

   .testimonial-card-inner {
      padding: 16px 14px 14px;
      border-radius: 12px;
   }

   .testimonial-avatar-wrapper,
   .testimonial-avatar {
      width: 44px;
      height: 44px;
   }

   .testimonial-avatar-ring {
      inset: -2px;
   }

   .divider-line {
      width: 32px;
   }
}
</style>