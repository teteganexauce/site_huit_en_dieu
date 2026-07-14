<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'
import defaultImg from '../assets/img/blog/blog-4.jpg'

const rubriques = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await publicService.getRubriquesCulture();
    rubriques.value = data.data || data;
  } catch (error) {
    console.error('Erreur chargement rubriques:', error);
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <BreadcombsComponent title="Rubriques Culturelles" />

  <section class="rubriques-section py-5">
    <div class="container">
      <div class="section-header text-center mb-5" data-aos="fade-up">
        <h2 class="fw-bold">Découvrez nos <span class="text-primary">Rubriques Culturelles</span></h2>
        <p class="text-muted mx-auto" style="max-width: 600px;">
          Plongez au cœur des traditions, des cultes et des savoirs ancestraux à travers nos différentes rubriques.
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3 text-muted">Chargement des rubriques...</p>
      </div>

      <div v-else-if="rubriques.length === 0" class="text-center py-5">
        <i class="bi bi-journal-text display-1 text-muted"></i>
        <p class="mt-3 text-muted fs-5">Aucune rubrique culturelle disponible pour le moment.</p>
      </div>

      <div v-else class="row g-4">
        <div
          v-for="(item, index) in rubriques"
          :key="item.id"
          class="col-lg-4 col-md-6"
          data-aos="fade-up"
          :data-aos-delay="50 * index"
        >
          <div class="rubrique-card card border-0 shadow-sm h-100 overflow-hidden">
            <div class="card-img-wrapper position-relative">
              <img
                :src="item.imageUrl || defaultImg"
                class="card-img-top"
                :alt="item.nom"
              />
              <div class="card-overlay d-flex align-items-center justify-content-center">
                <i class="bi bi-arrow-right-circle fs-1 text-white"></i>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold">{{ item.nom }}</h5>
              <p class="card-text text-muted flex-grow-1">{{ item.description }}</p>
              <a href="#" class="btn btn-outline-primary rounded-pill mt-3 align-self-start">
                Explorer <i class="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rubriques-section {
  background: #f8f9fa;
  min-height: 60vh;
}

.section-header h2 {
  font-size: 2rem;
  color: #173b6c;
}

.rubrique-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.rubrique-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12) !important;
}

.card-img-wrapper {
  height: 220px;
  overflow: hidden;
}

.card-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.rubrique-card:hover .card-img-wrapper img {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(20, 157, 221, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rubrique-card:hover .card-overlay {
  opacity: 1;
}

.card-title {
  color: #173b6c;
  font-size: 1.2rem;
}

.card-text {
  font-size: 0.95rem;
  line-height: 1.6;
}

.btn-outline-primary {
  border-color: #149ddd;
  color: #149ddd;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: #149ddd;
  border-color: #149ddd;
  color: #fff;
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 1.5rem;
  }
  .card-img-wrapper {
    height: 180px;
  }
}
</style>
