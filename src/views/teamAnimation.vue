<template>
  <main class="about-page">
    
    <!-- 1. HERO BANNER -->
    <section class="about-hero d-flex align-items-center justify-content-center text-center">
      <div class="container position-relative z-index-1" data-aos="fade-up" data-aos-duration="1000">
        <h1 class="display-3 fw-bold text-white mb-4">À propos de Huit en Dieu</h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 700px;">
          Découvrez notre histoire, notre mission et notre engagement à promouvoir l'éveil spirituel, la prière et la croissance personnelle au quotidien.
        </p>
      </div>
      <div class="hero-overlay"></div>
    </section>

    <!-- 2. NOTRE HISTOIRE -->
    <section class="about-story py-5 my-5">
      <div class="container">
        <div class="row align-items-center gy-5">
          <div class="col-lg-6 pe-lg-5" data-aos="fade-right">
            <h6 class="text-primary text-uppercase fw-bold mb-2">Nos Racines</h6>
            <h2 class="display-5 fw-bold mb-4">Notre Histoire</h2>
            <p class="text-muted mb-4" style="line-height: 1.8; font-size: 1.05rem;">
              Né d'une profonde conviction spirituelle et de la volonté de rassembler les âmes en quête de vérité, <strong>Huit en Dieu</strong> a vu le jour pour offrir un espace de ressourcement, de formation et d'accompagnement.
            </p>
            <p class="text-muted mb-4" style="line-height: 1.8; font-size: 1.05rem;">
              Au fil du temps, notre communauté a grandi. De simples partages de prières et de pensées quotidiennes, nous sommes devenus une plateforme complète offrant des retraites, des formations thologiques et des objets sacrés pour nourrir votre foi. Nous croyons que chaque cheminement spirituel est unique, mais qu'il s'épanouit pleinement lorsqu'il est partagé.
            </p>
            <router-link to="/contact" class="btn btn-primary px-4 py-2 mt-3 rounded-pill">Rejoignez notre aventure</router-link>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <div class="position-relative">
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" alt="Notre histoire" class="img-fluid rounded-4 shadow-lg w-100" style="object-fit: cover; height: 500px;">
              <div class="experience-badge bg-white p-4 rounded-4 shadow position-absolute bottom-0 start-0 ms-4 mb-4 d-none d-md-block text-center border-start border-4 border-primary">
                <h3 class="fw-bold text-dark mb-0">+5 Ans</h3>
                <p class="text-muted mb-0 small text-uppercase">D'engagement<br>spirituel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. MISSION | VISION -->
    <section class="about-mission bg-light py-5">
      <div class="container py-4">
        <div class="row gy-4">
          <!-- Mission -->
          <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="mission-card h-100 bg-white p-5 rounded-4 shadow-sm text-center border-top border-4 border-primary">
              <div class="icon-wrapper bg-primary-subtle text-primary mb-4 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 80px; height: 80px; font-size: 2rem;">
                <i class="bi bi-bullseye"></i>
              </div>
              <h3 class="fw-bold mb-3">Notre Mission</h3>
              <p class="text-muted mb-0" style="line-height: 1.7;">
                Accompagner chaque individu dans son cheminement spirituel en offrant des ressources accessibles, des formations enrichissantes et un soutien fraternel au quotidien, afin de bâtir une foi solide et éclairée.
              </p>
            </div>
          </div>
          <!-- Vision -->
          <div class="col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div class="mission-card h-100 bg-white p-5 rounded-4 shadow-sm text-center border-top border-4 border-secondary">
              <div class="icon-wrapper bg-secondary-subtle text-secondary mb-4 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 80px; height: 80px; font-size: 2rem;">
                <i class="bi bi-eye"></i>
              </div>
              <h3 class="fw-bold mb-3">Notre Vision</h3>
              <p class="text-muted mb-0" style="line-height: 1.7;">
                Devenir la communauté spirituelle de référence où chacun peut trouver la lumière, la guérison intérieure et les outils nécessaires pour vivre pleinement sa vocation divine dans le monde d'aujourd'hui.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. NOS VALEURS -->
    <section class="about-values py-5 my-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h6 class="text-primary text-uppercase fw-bold mb-2">Principes Fondamentaux</h6>
          <h2 class="display-5 fw-bold">Nos Valeurs</h2>
        </div>
        
        <div class="row gy-4">
          <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="100">
            <div class="value-card p-4 text-center rounded-4 h-100">
              <div class="value-icon mb-3 text-primary"><i class="bi bi-heart-fill"></i></div>
              <h4 class="fw-bold h5">Foi & Charité</h4>
              <p class="text-muted small mb-0">L'amour du divin et du prochain est au cœur de toutes nos actions et enseignements.</p>
            </div>
          </div>
          
          <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="200">
            <div class="value-card p-4 text-center rounded-4 h-100">
              <div class="value-icon mb-3 text-info"><i class="bi bi-people-fill"></i></div>
              <h4 class="fw-bold h5">Fraternité</h4>
              <p class="text-muted small mb-0">Créer un environnement de soutien où chacun se sent écouté, compris et membre de la famille.</p>
            </div>
          </div>
          
          <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="300">
            <div class="value-card p-4 text-center rounded-4 h-100">
              <div class="value-icon mb-3 text-success"><i class="bi bi-shield-check"></i></div>
              <h4 class="fw-bold h5">Intégrité</h4>
              <p class="text-muted small mb-0">Transmettre les enseignements avec authenticité, fidélité et transparence totale.</p>
            </div>
          </div>
          
          <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="400">
            <div class="value-card p-4 text-center rounded-4 h-100">
              <div class="value-icon mb-3 text-warning"><i class="bi bi-brightness-high-fill"></i></div>
              <h4 class="fw-bold h5">Éveil</h4>
              <p class="text-muted small mb-0">Guider vers une compréhension profonde de soi et de sa relation avec le Créateur.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. POURQUOI NOUS CHOISIR -->
    <section class="about-why bg-primary text-white py-5">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-5 mb-5 mb-lg-0" data-aos="fade-right">
            <h6 class="text-uppercase fw-bold text-white-50 mb-2">L'expérience Huit en Dieu</h6>
            <h2 class="display-5 fw-bold mb-4">Pourquoi nous rejoindre ?</h2>
            <p class="text-white-50 mb-4" style="line-height: 1.8;">
              Nous offrons bien plus qu'une simple plateforme. Nous sommes une main tendue, un guide et une ressource intarissable pour votre développement personnel et spirituel.
            </p>
          </div>
          <div class="col-lg-6 offset-lg-1">
            <div class="row gy-4">
              <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div class="d-flex align-items-start">
                  <div class="flex-shrink-0 bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; font-size: 1.25rem;">
                    <i class="bi bi-book"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="fw-bold text-white mb-1">Ressources Riches</h5>
                    <p class="text-white-50 small mb-0">Pensées, e-books et articles pour nourrir votre quotidien.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div class="d-flex align-items-start">
                  <div class="flex-shrink-0 bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; font-size: 1.25rem;">
                    <i class="bi bi-person-hearts"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="fw-bold text-white mb-1">Accompagnement</h5>
                    <p class="text-white-50 small mb-0">Des conseils personnalisés et une écoute bienveillante.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div class="d-flex align-items-start">
                  <div class="flex-shrink-0 bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; font-size: 1.25rem;">
                    <i class="bi bi-award"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="fw-bold text-white mb-1">Formations Qualité</h5>
                    <p class="text-white-50 small mb-0">Des cours certifiés par des experts en théologie et spiritualité.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div class="d-flex align-items-start">
                  <div class="flex-shrink-0 bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; font-size: 1.25rem;">
                    <i class="bi bi-shop"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="fw-bold text-white mb-1">Objets Sacrés</h5>
                    <p class="text-white-50 small mb-0">Une boutique soigneusement sélectionnée pour votre prière.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. NOS CHIFFRES -->
    <section class="about-stats bg-white py-5 border-bottom">
      <div class="container py-4">
        <div class="row text-center gy-4">
          <div class="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="100">
            <h2 class="display-4 fw-bold text-primary mb-0">15K+</h2>
            <p class="text-muted fw-medium text-uppercase mb-0">Membres Actifs</p>
          </div>
          <div class="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="200">
            <h2 class="display-4 fw-bold text-primary mb-0">500+</h2>
            <p class="text-muted fw-medium text-uppercase mb-0">Pensées Partagées</p>
          </div>
          <div class="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="300">
            <h2 class="display-4 fw-bold text-primary mb-0">20+</h2>
            <p class="text-muted fw-medium text-uppercase mb-0">Formations</p>
          </div>
          <div class="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="400">
            <h2 class="display-4 fw-bold text-primary mb-0">98%</h2>
            <p class="text-muted fw-medium text-uppercase mb-0">Avis Positifs</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. NOTRE ÉQUIPE -->
    <section id="team" class="team py-5 my-5">
      <div class="container" data-aos="fade-up">
        <div class="text-center mb-5">
          <h6 class="text-primary text-uppercase fw-bold mb-2">Les Porteurs du Projet</h6>
          <h2 class="display-5 fw-bold">Notre Équipe d'Animation</h2>
          <p class="text-muted mx-auto mt-3" style="max-width: 600px;">
            Des hommes et des femmes dévoués, au service de votre épanouissement spirituel.
          </p>
        </div>

        <div class="row gy-5 justify-content-center">
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          
          <div v-for="(member, index) in members" :key="member.id" class="col-xl-3 col-lg-4 col-md-6 d-flex" data-aos="zoom-in" :data-aos-delay="100 * (index % 4)">
            <div class="team-member card border-0 shadow-sm rounded-4 w-100 overflow-hidden text-center hover-lift">
              <div class="member-img position-relative overflow-hidden bg-light" style="height: 280px;">
                <img 
                  :src="getImageUrl(member.photoUrl)" 
                  @error="onImageError"
                  class="img-fluid w-100 h-100 object-fit-cover" 
                  :alt="member.prenom + ' ' + member.nom"
                >
              </div>
              <div class="member-info card-body p-4 bg-white">
                <h5 class="fw-bold mb-1 text-dark">{{ member.prenom }} {{ member.nom }}</h5>
                <span class="text-primary fw-medium small">{{ member.fonction }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import publicService from '../services/publicService'
import defaultAvatar from '../assets/img/team/team-1.jpg'

const members = ref([])
const isLoading = ref(true)

const baseUrl = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') 
  : 'http://localhost:8000';

const getImageUrl = (path) => {
  if (!path) return defaultAvatar;
  if (path.startsWith('http')) return path;
  return `${baseUrl}/storage/${path}`;
};

const onImageError = (e) => {
  e.target.src = defaultAvatar;
};

onMounted(async () => {
  try {
    const data = await publicService.getTeam();
    members.value = data.data || data;
  } catch (error) {
    console.error('Erreur chargement equipe:', error);
  } finally {
    isLoading.value = false;
  }
})
</script>

<style scoped>
/* 1. Hero Banner */
.about-hero {
  position: relative;
  min-height: 500px;
  background-image: url('https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?q=80&w=1920&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  margin-top: -80px; /* Compense le header pour passer en dessous si besoin, à ajuster */
  padding-top: 100px;
}
.hero-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* Sombre pour lisibilité */
  z-index: 0;
}
.z-index-1 {
  z-index: 1;
}

/* 4. Valeurs */
.value-card {
  background: #f8f9fa;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}
.value-card:hover {
  background: #fff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.value-icon {
  font-size: 2.5rem;
}

/* 7. Équipe */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
}
.hover-lift .member-img img {
  transition: transform 0.5s ease;
}
.hover-lift:hover .member-img img {
  transform: scale(1.08);
}
</style>