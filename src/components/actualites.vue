<script setup>
import { computed, onMounted, ref } from "vue";

import { Autoplay, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";

import { useContentStore } from "../stores/content";
import { useRouter } from "vue-router";

const contentStore = useContentStore();
const router = useRouter();

const modules = [Autoplay, Pagination, A11y];

const pensees = computed(() => contentStore.pensees);
const hoveredId = ref(null);
const swiperInstance = ref(null);

const onSwiperReady = (swiper) => {
  swiperInstance.value = swiper;
};

const onCardEnter = (id) => {
  hoveredId.value = id;
  swiperInstance.value?.autoplay?.stop();
};

const onCardLeave = () => {
  hoveredId.value = null;
  swiperInstance.value?.autoplay?.start();
};

const goToPensees = () => {
  router.push('/pensees');
};
</script>

<template>
  <div class="pensees-section container-fluid mt-5 px-5">
    <div class="container px-0">
      <h4 class="border-bottom pb-3 border-4 border-primary text-secondary">
        <b>Les Pensées quotidiennes</b>
      </h4>
    </div>

    <div class="mb-2 mt-4" v-if="pensees.length > 0">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="20"
        :breakpoints="{
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }"
        :navigation="false"
        :pagination="{ clickable: true }"
        :autoplay="{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        :loop="true"
        class="pensees-swiper"
        @swiper="onSwiperReady"
      >
        <swiper-slide v-for="(pensee, index) in pensees" :key="pensee.id ?? index">
          <!-- Wrapper positionné pour que le tooltip puisse sortir de la carte -->
          <div
            class="pensee-wrapper"
            @mouseenter="onCardEnter(pensee.id)"
            @mouseleave="onCardLeave"
          >
            <!-- Tooltip plein texte (s'affiche au-dessus au survol) -->
            <transition name="tooltip-fade">
              <div v-if="hoveredId === pensee.id" class="pensee-tooltip">
                <p class="pensee-tooltip__auteur">{{ pensee.auteur }}</p>
                <p class="pensee-tooltip__text">{{ pensee.contenu }}</p>
              </div>
            </transition>

            <!-- Carte -->
            <div
              class="pensee-card d-flex flex-column"
              :class="index == 0 ? 'pensee-card--active' : ''"
              @click="goToPensees"
            >
              <!-- Header -->
              <div class="pensee-card__header d-flex justify-content-between align-items-center">
                <span class="pensee-label">Pensée du jour</span>
                <small class="pensee-date">{{ new Date(pensee.date_publication).toLocaleDateString('fr-FR') }}</small>
              </div>

              <!-- Body : texte tronqué -->
              <div class="pensee-card__body flex-grow-1">
                <h6 class="pensee-auteur">{{ pensee.auteur }}</h6>
                <p class="pensee-contenu">{{ pensee.contenu }}</p>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div v-else class="text-center py-5 text-muted">
      <p>Aucune pensée disponible pour aujourd'hui.</p>
    </div>

    <!-- Link to full page -->
    <div class="text-center mt-3 mb-3">
      <router-link to="/pensees" class="btn btn-outline-primary btn-sm">
        Voir toutes les pensées <i class="bi bi-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.pensees-section {
  background: transparent;
}

/* ── Swiper ─────────────────────────────── */
.pensees-swiper {
  padding: 10px 10px 48px 10px !important;
  /* Laisser déborder le tooltip vers le haut */
  overflow: visible !important;
}

.pensees-swiper :deep(.swiper-wrapper) {
  overflow: visible;
}

.pensees-swiper :deep(.swiper-pagination) {
  bottom: 0;
}

.pensees-swiper :deep(.swiper-pagination-bullet-active) {
  background: #35b9d3;
}

.pensees-swiper :deep(.swiper-slide) {
  height: auto;
  display: flex;
  overflow: visible;
}

/* ── Wrapper (pour positionner le tooltip) ─── */
.pensee-wrapper {
  position: relative;
  width: 100%;
}

/* ── Tooltip ─────────────────────────────── */
.pensee-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);   /* Au-dessus de la carte */
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #35b9d3;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 999;
  pointer-events: none;         /* Ne bloque pas les clics sur la carte */
}

.pensee-tooltip__auteur {
  font-size: 0.82rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 6px;
}

.pensee-tooltip__text {
  font-size: 0.85rem;
  color: #444;
  line-height: 1.6;
  margin: 0;
}

/* Animation d'apparition du tooltip */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* ── Card ────────────────────────────────── */
.pensee-card {
  height: 180px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.pensee-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.pensee-card--active {
  background-color: #e8f9fc;
  border-color: #35b9d3;
}

/* Header */
.pensee-card__header {
  padding: 10px 14px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.pensee-label {
  font-size: 0.70rem;
  font-weight: 700;
  color: #35b9d3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pensee-date {
  font-size: 0.75rem;
  color: #999;
}

/* Body */
.pensee-card__body {
  padding: 10px 14px 4px;
  overflow: hidden;
}

.pensee-auteur {
  font-size: 0.88rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pensee-contenu {
  font-size: 0.88rem;
  color: #555;
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
