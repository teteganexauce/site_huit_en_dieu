<template>
  <div class="mb-4 book" data-aos="zoom-in" data-aos-delay="300">
    <router-link :to="`/boutique/${product.id}`" class="shadow">
      <div class="book-image">
        <img :src="product.imageUrl || defaultImg" :alt="product.nom">
        <div class="badges" v-if="hasBadges">
          <span v-if="product.estNouveaute" class="badge bg-danger ms-1">Nouveau</span>
          <span v-if="product.estCoupDeCoeur" class="badge bg-warning text-dark ms-1">Coup de coeur</span>
          <span v-if="product.estGratuit" class="badge bg-success ms-1">Gratuit</span>
        </div>
      </div>
      <div class="book-content mb-2">
        <div class="book-title d-flex align-items-center py-2 px-3">
          <div class="book-icon d-flex justify-content-center align-items-center rounded-circle">
            <i class="bi bi-book text-ps-primary"></i>
          </div>
          <h6 class="m-0 text-secondary"><b>{{ product.nom }}</b></h6>
        </div>
        <div class="px-3 book-paragraph">
          <small>{{ product.description }}</small>
        </div>
      </div>
      <div class="book-footer d-flex justify-content-between px-3 py-2 border-top text-grey">
        <div class="book-price">
          <span v-if="product.prixPromotion" class="text-decoration-line-through text-muted me-1">{{ formatPrice(product.prix) }}</span>
          <b class="text-ps-primary">{{ formatPrice(product.prixPromotion || product.prix) }}</b>
        </div>
        <div class="book-type">
          <small class="text-capitalize">{{ product.type?.replace('_', ' ') }}</small>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import defaultImg from '../../assets/img/faq.jpg'

const props = defineProps({
  product: { type: Object, required: true }
})

const hasBadges = computed(() => {
  return props.product.estNouveaute || props.product.estCoupDeCoeur || props.product.estGratuit
})

const formatPrice = (price) => {
  const num = parseFloat(price)
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

import { computed } from 'vue'
</script>

<style scoped>
.book-image {
  height: 180px;
  overflow: hidden;
  position: relative;
}
.book:hover { cursor: pointer; }
.book-image:hover img { transform: scale(1.05); transition: .5s; }
.book-image img { width: 100%; height: 100%; object-fit: cover; transition: .5s; }
.badges { position: absolute; top: 8px; right: 8px; }
.book-icon { margin-right: 10px; min-width: 40px; min-height: 40px; color: var(--color-primary); border-color: var(--color-primary); border: 2px solid var(--color-primary); }
.book-paragraph { -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; word-wrap: break-word; }
.book-footer small { font-size: 13px; }
.book > a { color: black; display: block; }
</style>
