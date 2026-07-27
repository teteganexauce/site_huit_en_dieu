<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'

const route = useRoute()
const publication = ref(null)
const isLoading = ref(true)

onMounted(async () => {
   try {
      const response = await publicService.getPublication(route.params.id)
      publication.value = response.data || response
   } catch (error) {
      console.error("Erreur lors de la récupération de la publication", error)
   } finally {
      isLoading.value = false
   }
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getMotsCles = (motsClesRaw) => {
   if (!motsClesRaw) return []
   try {
      if (typeof motsClesRaw === 'string') return JSON.parse(motsClesRaw)
      return motsClesRaw
   } catch (e) {
      return []
   }
}

const getFichierUrl = (url) => {
   if (!url) return null
   if (url.startsWith('http')) return url
   const baseUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')
      : 'http://localhost:8000'
   return `${baseUrl}/storage/${url}`
}

const getTypeLabel = (type) => {
   const labels = {
      article: 'Article scientifique',
      livre: 'Livre',
      these: 'Thèse / Mémoire',
      video: 'Vidéo',
      audio: 'Audio'
   }
   return labels[type] || type
}

const getTypeIcon = (type) => {
   const icons = {
      article: 'bi-journal-text',
      livre: 'bi-book',
      these: 'bi-mortarboard',
      video: 'bi-camera-video',
      audio: 'bi-music-note-beamed'
   }
   return icons[type] || 'bi-file-text'
}
</script>

<template>
   <BreadcombsComponent :title="publication?.titre || 'Détail de la Publication'" />

   <div class="pub-detail-page">

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-overlay">
         <div class="spinner-container">
            <div class="spinner-border text-primary" role="status">
               <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-3 text-muted">Chargement de la publication...</p>
         </div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!publication" class="not-found-section">
         <div class="container text-center py-5">
            <div class="not-found-icon mb-4">
               <i class="bi bi-file-earmark-x"></i>
            </div>
            <h3 class="fw-bold">Publication introuvable</h3>
            <p class="text-muted mb-4">Cette publication n'existe pas ou a été retirée.</p>
            <router-link to="/publications" class="btn btn-primary px-4 py-2">
               <i class="bi bi-arrow-left me-2"></i> Retour aux publications
            </router-link>
         </div>
      </div>

      <!-- Main Content -->
      <div v-else>

         <!-- Hero Banner -->
         <div class="pub-hero" :style="publication.image_url ? `background-image: url('${publication.image_url}')` : ''">
            <div class="pub-hero-overlay"></div>
            <div class="container pub-hero-content">
               <div class="type-badge mb-3">
                  <i :class="`bi ${getTypeIcon(publication.type)} me-2`"></i>
                  {{ getTypeLabel(publication.type) }}
               </div>
               <h1 class="pub-hero-title">{{ publication.titre }}</h1>
               <div class="pub-hero-meta">
                  <span class="meta-item">
                     <i class="bi bi-person-circle me-2"></i>
                     {{ publication.chercheur?.nom || 'Auteur inconnu' }}
                  </span>
                  <span class="meta-divider">|</span>
                  <span class="meta-item">
                     <i class="bi bi-calendar3 me-2"></i>
                     {{ formatDate(publication.datePublication || publication.created_at) }}
                  </span>
               </div>
            </div>
         </div>

         <div class="container pub-layout">
            <div class="row g-4">

               <!-- Main Article Column -->
               <div class="col-lg-8">
                  <div class="pub-card">

                     <!-- Abstract -->
                     <div class="pub-abstract" v-if="publication.resume">
                        <div class="abstract-label">
                           <i class="bi bi-blockquote-left me-2"></i>Résumé
                        </div>
                        <p class="abstract-text">{{ publication.resume }}</p>
                     </div>

                     <!-- Divider -->
                     <hr class="pub-divider" />

                     <!-- Full Content -->
                     <div class="pub-content">
                        <h3 class="section-title">
                           <span class="title-bar"></span>
                           Contenu complet
                        </h3>
                        <div class="content-body">
                           {{ publication.contenu || publication.resume || 'Contenu non disponible.' }}
                        </div>
                     </div>

                     <!-- Keywords -->
                     <div class="pub-keywords" v-if="getMotsCles(publication.motsCles).length > 0">
                        <hr class="pub-divider" />
                        <h5 class="keywords-title">
                           <i class="bi bi-tags-fill me-2 text-primary"></i> Mots-clés
                        </h5>
                        <div class="keywords-list">
                           <span
                              v-for="(tag, index) in getMotsCles(publication.motsCles)"
                              :key="index"
                              class="keyword-tag"
                           >
                              {{ tag }}
                           </span>
                        </div>
                     </div>

                  </div>

                  <!-- Back link -->
                  <div class="mt-4 mb-5">
                     <router-link to="/publications" class="back-link">
                        <i class="bi bi-arrow-left-circle me-2"></i> Retour à toutes les publications
                     </router-link>
                  </div>
               </div>

               <!-- Sidebar -->
               <div class="col-lg-4">

                  <!-- Document Download Card -->
                  <div class="sidebar-card download-card" v-if="publication.fichierUrl || publication.lien_externe">
                     <div class="download-icon">
                        <i v-if="publication.fichierUrl" class="bi bi-file-earmark-pdf-fill"></i>
                        <i v-else class="bi bi-link-45deg"></i>
                     </div>
                     <h5 class="download-title">Document associé</h5>
                     <p class="download-desc">Accédez à la version complète de ce document.</p>
                     <a
                        v-if="publication.fichierUrl"
                        :href="getFichierUrl(publication.fichierUrl)"
                        target="_blank"
                        class="btn btn-download w-100"
                     >
                        <i class="bi bi-download me-2"></i> Télécharger le PDF
                     </a>
                     <a
                        v-else-if="publication.lien_externe"
                        :href="publication.lien_externe"
                        target="_blank"
                        class="btn btn-download w-100"
                     >
                        <i class="bi bi-box-arrow-up-right me-2"></i> Voir le lien externe
                     </a>
                  </div>

                  <!-- Author Card -->
                  <div class="sidebar-card author-card" v-if="publication.chercheur">
                     <div class="author-avatar">
                        <i class="bi bi-person-fill"></i>
                     </div>
                     <h5 class="author-name">{{ publication.chercheur.nom }}</h5>
                     <p class="author-role text-muted small">Chercheur</p>
                     <div v-if="publication.chercheur.specialite" class="author-speciality">
                        <i class="bi bi-award-fill me-2 text-primary"></i>
                        {{ publication.chercheur.specialite }}
                     </div>
                     <div v-if="publication.chercheur.institution" class="author-institution">
                        <i class="bi bi-building me-2 text-muted"></i>
                        {{ publication.chercheur.institution }}
                     </div>
                  </div>

                  <!-- Publication Info Card -->
                  <div class="sidebar-card info-card">
                     <h5 class="info-card-title">Informations</h5>
                     <ul class="info-list">
                        <li>
                           <span class="info-label"><i class="bi bi-calendar3"></i> Date de publication</span>
                           <span class="info-value">{{ formatDate(publication.datePublication || publication.created_at) }}</span>
                        </li>
                        <li>
                           <span class="info-label"><i :class="`bi ${getTypeIcon(publication.type)}`"></i> Type</span>
                           <span class="info-value text-capitalize">{{ getTypeLabel(publication.type) }}</span>
                        </li>
                        <li v-if="publication.dateSoumission">
                           <span class="info-label"><i class="bi bi-send"></i> Soumis le</span>
                           <span class="info-value">{{ formatDate(publication.dateSoumission) }}</span>
                        </li>
                     </ul>
                  </div>

               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
/* ============================================
   Global Page
   ============================================ */
.pub-detail-page {
   background: #f5f7fa;
   min-height: 80vh;
}

/* ============================================
   Loading & Not Found
   ============================================ */
.loading-overlay {
   display: flex;
   justify-content: center;
   align-items: center;
   min-height: 50vh;
}
.spinner-container {
   text-align: center;
}
.not-found-section {
   min-height: 50vh;
   display: flex;
   align-items: center;
}
.not-found-icon {
   font-size: 5rem;
   color: #dee2e6;
}
.not-found-icon i {
   font-size: 5rem;
}

/* ============================================
   Hero Banner
   ============================================ */
.pub-hero {
   position: relative;
   min-height: 420px;
   background: linear-gradient(135deg, #1a2a3a 0%, #0ea2bd 100%);
   background-size: cover;
   background-position: center;
   display: flex;
   align-items: flex-end;
   padding-bottom: 3rem;
}
.pub-hero-overlay {
   position: absolute;
   inset: 0;
   background: linear-gradient(to bottom, rgba(10, 20, 40, 0.35) 0%, rgba(10, 20, 40, 0.82) 100%);
}
.pub-hero-content {
   position: relative;
   z-index: 2;
   color: #fff;
}
.type-badge {
   display: inline-flex;
   align-items: center;
   background: rgba(14, 162, 189, 0.85);
   color: #fff;
   font-size: 0.82rem;
   font-weight: 600;
   letter-spacing: 0.08em;
   text-transform: uppercase;
   padding: 5px 14px;
   border-radius: 50px;
   backdrop-filter: blur(4px);
}
.pub-hero-title {
   font-size: clamp(1.6rem, 4vw, 2.8rem);
   font-weight: 800;
   line-height: 1.2;
   text-shadow: 0 2px 10px rgba(0,0,0,0.4);
   max-width: 820px;
   margin-bottom: 1rem;
}
.pub-hero-meta {
   display: flex;
   flex-wrap: wrap;
   gap: 0.5rem 1rem;
   align-items: center;
   font-size: 0.95rem;
   color: rgba(255,255,255,0.85);
}
.meta-item { display: flex; align-items: center; }
.meta-divider { opacity: 0.4; font-size: 1.2rem; }

/* ============================================
   Layout
   ============================================ */
.pub-layout {
   padding-top: 2.5rem;
   padding-bottom: 3rem;
}

/* ============================================
   Main Card
   ============================================ */
.pub-card {
   background: #fff;
   border-radius: 16px;
   padding: 2.5rem;
   box-shadow: 0 4px 24px rgba(0,0,0,0.07);
}

/* Abstract */
.pub-abstract {
   background: linear-gradient(135deg, #eaf7fb 0%, #f0fbff 100%);
   border-left: 4px solid #0ea2bd;
   border-radius: 0 12px 12px 0;
   padding: 1.5rem 1.8rem;
}
.abstract-label {
   font-size: 0.8rem;
   font-weight: 700;
   text-transform: uppercase;
   letter-spacing: 0.1em;
   color: #0ea2bd;
   margin-bottom: 0.6rem;
}
.abstract-text {
   font-size: 1.05rem;
   color: #444;
   line-height: 1.8;
   margin: 0;
   font-style: italic;
}

/* Divider */
.pub-divider {
   border: none;
   border-top: 1px solid #e9ecef;
   margin: 2rem 0;
}

/* Content */
.section-title {
   display: flex;
   align-items: center;
   gap: 0.7rem;
   font-size: 1.2rem;
   font-weight: 700;
   color: #1a2a3a;
   margin-bottom: 1.2rem;
}
.title-bar {
   display: inline-block;
   width: 4px;
   height: 22px;
   background: linear-gradient(to bottom, #0ea2bd, #0189a1);
   border-radius: 4px;
   flex-shrink: 0;
}
.content-body {
   font-size: 1.05rem;
   color: #3a3a3a;
   line-height: 1.95;
   white-space: pre-wrap;
}

/* Keywords */
.keywords-title {
   font-size: 0.95rem;
   font-weight: 700;
   color: #343a40;
   margin-bottom: 0.8rem;
}
.keywords-list {
   display: flex;
   flex-wrap: wrap;
   gap: 0.5rem;
}
.keyword-tag {
   display: inline-block;
   background: #e8f5f8;
   color: #0ea2bd;
   border: 1px solid #b8e5ef;
   font-size: 0.82rem;
   font-weight: 600;
   padding: 4px 14px;
   border-radius: 50px;
   letter-spacing: 0.04em;
   transition: all 0.2s;
}
.keyword-tag:hover {
   background: #0ea2bd;
   color: #fff;
}

/* Back Link */
.back-link {
   display: inline-flex;
   align-items: center;
   color: #0ea2bd;
   font-weight: 600;
   text-decoration: none;
   transition: all 0.2s;
   font-size: 0.95rem;
}
.back-link:hover {
   color: #0189a1;
   transform: translateX(-4px);
}

/* ============================================
   Sidebar Cards
   ============================================ */
.sidebar-card {
   background: #fff;
   border-radius: 16px;
   padding: 1.8rem;
   box-shadow: 0 4px 24px rgba(0,0,0,0.07);
   margin-bottom: 1.5rem;
}

/* Download Card */
.download-card {
   text-align: center;
   border-top: 4px solid #0ea2bd;
}
.download-icon {
   width: 64px;
   height: 64px;
   background: linear-gradient(135deg, #0ea2bd, #0189a1);
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   margin: 0 auto 1rem;
   font-size: 1.7rem;
   color: #fff;
}
.download-title {
   font-weight: 700;
   color: #1a2a3a;
   margin-bottom: 0.3rem;
}
.download-desc {
   font-size: 0.87rem;
   color: #6c757d;
   margin-bottom: 1.2rem;
}
.btn-download {
   background: linear-gradient(135deg, #0ea2bd 0%, #0189a1 100%);
   color: #fff;
   font-weight: 700;
   border: none;
   border-radius: 10px;
   padding: 0.65rem 1.2rem;
   font-size: 0.95rem;
   transition: all 0.25s;
   box-shadow: 0 4px 15px rgba(14, 162, 189, 0.3);
}
.btn-download:hover {
   background: linear-gradient(135deg, #0189a1 0%, #0ea2bd 100%);
   color: #fff;
   transform: translateY(-2px);
   box-shadow: 0 6px 20px rgba(14, 162, 189, 0.45);
}

/* Author Card */
.author-card { text-align: center; }
.author-avatar {
   width: 72px;
   height: 72px;
   background: linear-gradient(135deg, #f0f4f8, #dce8ee);
   border: 3px solid #0ea2bd;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   margin: 0 auto 0.8rem;
   font-size: 2rem;
   color: #0ea2bd;
}
.author-name {
   font-size: 1.1rem;
   font-weight: 700;
   color: #1a2a3a;
   margin-bottom: 0.1rem;
}
.author-role { margin-bottom: 0.8rem; }
.author-speciality, .author-institution {
   font-size: 0.87rem;
   color: #444;
   display: flex;
   align-items: center;
   justify-content: center;
   margin-bottom: 0.4rem;
}

/* Info Card */
.info-card-title {
   font-weight: 700;
   color: #1a2a3a;
   margin-bottom: 1rem;
   font-size: 1rem;
   padding-bottom: 0.6rem;
   border-bottom: 2px solid #e9ecef;
}
.info-list {
   list-style: none;
   padding: 0;
   margin: 0;
}
.info-list li {
   display: flex;
   flex-direction: column;
   gap: 2px;
   padding: 0.65rem 0;
   border-bottom: 1px solid #f0f0f0;
}
.info-list li:last-child { border-bottom: none; }
.info-label {
   font-size: 0.78rem;
   font-weight: 700;
   text-transform: uppercase;
   letter-spacing: 0.07em;
   color: #adb5bd;
   display: flex;
   align-items: center;
   gap: 0.4rem;
}
.info-value {
   font-size: 0.9rem;
   color: #343a40;
   font-weight: 600;
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
   .pub-hero { min-height: 300px; padding-bottom: 2rem; }
   .pub-card { padding: 1.5rem; }
   .sidebar-card { padding: 1.4rem; }
}
</style>