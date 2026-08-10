<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'

const services = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const data = await publicService.getServices();
    // L'API renvoie { data: [...] } si paginé ou { ... }
    services.value = data.data || data;
  } catch (err) {
    console.error('Erreur lors du chargement des services:', err);
    error.value = 'Impossible de charger les services pour le moment.';
  } finally {
    loading.value = false;
  }
})
</script>

<template>
  <BreadcombsComponent title="Nos services" />

  <!-- Section d'introduction -->
  <section class="services-hero py-5">
    <div class="container">
      <div class="text-center mb-5" data-aos="fade-up">
        <span class="section-tag">Ce que nous offrons</span>
        <h1 class="display-5 fw-bold mb-3">Nos <span class="text-primary">Services</span></h1>
        <p class="lead text-muted mx-auto" style="max-width: 700px;">
          Plongez au cœur de la spiritualité, de la tradition et de la sagesse ancestrale.
          Nous vous accompagnons sur le chemin de la connaissance et de l'éveil intérieur.
        </p>
      </div>
    </div>
  </section>

  <!-- Grille des services -->
  <section class="services-grid pb-5">
    <div class="container">
      <div class="row g-4">
        <div
          v-for="(service, index) in services"
          :key="index"
          class="col-xl-4 col-md-6 d-flex"
          data-aos="fade-up"
          :data-aos-delay="50 * index"
        >
          <div class="service-card card border-0 shadow-sm w-100 overflow-hidden">
            <!-- Image d'illustration -->
            <div class="card-img-wrapper position-relative">
              <img
                :src="service.imageUrl"
                :alt="service.titre"
                class="card-img-top"
              />
              <div class="card-img-overlay d-flex align-items-center justify-content-center">
                <div class="icon-circle">
                  <i :class="service.icon"></i>
                </div>
              </div>
            </div>

            <!-- Corps de la carte -->
            <div class="card-body d-flex flex-column p-4">
              <h3 class="card-title fw-bold mb-3">{{ service.titre }}</h3>
              <p class="card-text text-muted flex-grow-1">{{ service.description }}</p>
              <router-link
                :to="service.link"
                class="btn rounded-pill mt-3 align-self-start px-4"
                :style="{ background: service.accent, color: '#fff', border: 'none' }"
              >
                {{ service.cta }}
                <i class="bi bi-arrow-right ms-2"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section d'appel à l'action -->
  <section class="services-cta py-5 bg-primary text-white">
    <div class="container text-center py-4">
      <h2 class="fw-bold mb-3">Vous ne trouvez pas ce que vous cherchez ?</h2>
      <p class="lead mb-4 text-white-50" style="max-width: 600px; margin-left: auto; margin-right: auto;">
        Chaque cheminement est unique. Contactez-nous pour un service personnalisé adapté à vos besoins spirituels.
      </p>
      <router-link to="/contact" class="btn btn-light btn-lg px-5 rounded-pill fw-bold">
        <i class="bi bi-chat-dots me-2"></i>Parlons-en
      </router-link>
    </div>
  </section>
</template>

<style scoped>
/* ===== SECTION TAG ===== */
.section-tag {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #2c3e91;
  margin-bottom: 8px;
}

/* ===== HERO ===== */
.services-hero {
  background: #f8f9fc;
  border-bottom: 1px solid #edeef3;
}

.services-hero h1 {
  color: #1a1a2e;
}

/* ===== SERVICE CARD ===== */
.service-card {
  border-radius: 14px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12) !important;
}

/* Image wrapper */
.card-img-wrapper {
  height: 220px;
  overflow: hidden;
  position: relative;
}

.card-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.service-card:hover .card-img-wrapper img {
  transform: scale(1.08);
}

/* Overlay avec icône */
.card-img-overlay {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-card:hover .card-img-overlay {
  opacity: 1;
}

.icon-circle {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #2c3e91;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.service-card:hover .icon-circle {
  transform: scale(1);
}

/* Titre */
.card-title {
  font-size: 1.25rem;
  color: #1a1a2e;
  position: relative;
  padding-bottom: 12px;
}

.card-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: #2c3e91;
  border-radius: 2px;
}

/* Texte */
.card-text {
  font-size: 0.92rem;
  line-height: 1.7;
}

/* Bouton CTA */
.service-card .btn {
  font-weight: 600;
  font-size: 0.85rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service-card .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

/* ===== CTA SECTION ===== */
.services-cta {
  background: linear-gradient(135deg, #1a1a2e 0%, #2c3e91 100%) !important;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .card-img-wrapper {
    height: 180px;
  }

  .services-hero h1 {
    font-size: 1.8rem;
  }

  .card-title {
    font-size: 1.1rem;
  }
}
</style>
