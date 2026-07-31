<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import defaultImg from '@/assets/img/faq.jpg'

const props = defineProps({
  product: { type: Object, required: true }
})

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const addingToCart = ref(false)
const justAdded = ref(false)
const errorMsg = ref('')

const hasBadges = computed(() =>
  props.product.estNouveaute || props.product.estCoupDeCoeur || props.product.estGratuit
)

const formatPrice = (price) => {
  const num = parseFloat(price)
  if (isNaN(num)) return '0 FCFA'
  return num.toLocaleString('fr-FR') + ' FCFA'
}

const discount = computed(() => {
  if (!props.product.prixPromotion || !props.product.prix) return null
  const pct = Math.round((1 - props.product.prixPromotion / props.product.prix) * 100)
  return pct > 0 ? pct : null
})

const typeLabel = computed(() => {
  const labels = {
    livre_physique: 'Livre',
    ebook: 'E-book',
    objet_sacre: 'Objet sacré',
    tableau: 'Tableau'
  }
  return labels[props.product.type] || props.product.type?.replace('_', ' ')
})

const typeIcon = computed(() => {
  const icons = {
    livre_physique: 'bi-book',
    ebook: 'bi-file-earmark-text',
    objet_sacre: 'bi-gem',
    tableau: 'bi-image'
  }
  return icons[props.product.type] || 'bi-box'
})

const handleAddToCart = async () => {
  errorMsg.value = ''
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' })
    return
  }
  addingToCart.value = true
  try {
    const result = await cartStore.addToCart(props.product.id, 1)
    if (result?.success === false) {
      errorMsg.value = result.error || 'Erreur'
      setTimeout(() => { errorMsg.value = '' }, 3000)
    } else {
      justAdded.value = true
      setTimeout(() => { justAdded.value = false }, 2500)
    }
  } catch (e) {
    console.error(e)
    errorMsg.value = 'Erreur réseau'
    setTimeout(() => { errorMsg.value = '' }, 3000)
  } finally {
    addingToCart.value = false
  }
}
</script>

<template>
  <div class="product-card" data-aos="fade-up">
    <!-- Image Zone -->
    <router-link :to="`/boutique/${product.id}`" class="card-img-link">
      <div class="card-img-wrapper">
        <img :src="product.imageUrl || defaultImg" :alt="product.nom" class="card-img" />

        <!-- Overlay on hover -->
        <div class="card-overlay">
          <span class="overlay-hint"><i class="bi bi-eye me-1"></i> Voir les détails</span>
        </div>

        <!-- Badges -->
        <div class="badges-zone" v-if="hasBadges">
          <span v-if="product.estNouveaute" class="tag tag-new">Nouveau</span>
          <span v-if="product.estCoupDeCoeur" class="tag tag-fav">❤️ Coup de cœur</span>
          <span v-if="product.estGratuit" class="tag tag-free">Gratuit</span>
        </div>

        <!-- Discount badge -->
        <div class="discount-badge" v-if="discount">-{{ discount }}%</div>
      </div>
    </router-link>

    <!-- Card Body -->
    <div class="card-body-section">
      <!-- Type chip -->
      <div class="type-chip">
        <i :class="`bi ${typeIcon}`"></i>
        {{ typeLabel }}
      </div>

      <!-- Rating -->
      <div class="card-rating" v-if="product.note_moyenne > 0">
        <span class="rating-stars">
          <span v-for="s in 5" :key="s" class="rating-star" :class="{ 'is-filled': product.note_moyenne >= s - 0.25 }">&#9733;</span>
        </span>
        <span class="rating-num">{{ Number(product.note_moyenne).toFixed(1) }}</span>
        <span class="rating-count">({{ product.avis_count || 0 }})</span>
      </div>

      <!-- Title -->
      <router-link :to="`/boutique/${product.id}`" class="product-title-link">
        <h6 class="product-title">{{ product.nom }}</h6>
      </router-link>

      <!-- Description -->
      <p class="product-desc">{{ product.description }}</p>

      <!-- Footer: Price + Cart Button -->
      <div class="card-footer-section">
        <div class="price-block">
          <span v-if="product.prixPromotion" class="price-old">{{ formatPrice(product.prix) }}</span>
          <span class="price-current">
            {{ product.estGratuit ? 'Gratuit' : formatPrice(product.prixPromotion || product.prix) }}
          </span>
        </div>

        <button
          class="btn-add-cart"
          :class="{ 'btn-added': justAdded, 'btn-loading': addingToCart }"
          @click.prevent="handleAddToCart"
          :disabled="addingToCart"
          :title="justAdded ? 'Ajouté !' : 'Ajouter au panier'"
        >
          <span v-if="addingToCart" class="spinner-border spinner-border-sm"></span>
          <i v-else-if="justAdded" class="bi bi-check-lg"></i>
          <i v-else class="bi bi-cart-plus"></i>
          <span class="btn-label">{{ justAdded ? 'Ajouté' : addingToCart ? '' : 'Panier' }}</span>
        </button>
      </div>

      <!-- Inline error -->
      <p v-if="errorMsg" class="cart-error-msg">
        <i class="bi bi-exclamation-circle me-1"></i>{{ errorMsg }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ── Card Container ── */
.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  transition: transform 0.28s ease, box-shadow 0.28s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-bottom: 1.5rem;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.13);
}

/* ── Image Zone ── */
.card-img-link { display: block; text-decoration: none; }
.card-img-wrapper {
  position: relative;
  height: 210px;
  overflow: hidden;
  background: #f0f4f8;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.product-card:hover .card-img { transform: scale(1.06); }

/* Overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(14, 162, 189, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}
.product-card:hover .card-overlay { opacity: 1; }
.overlay-hint {
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.4);
  padding: 8px 18px;
  border-radius: 50px;
}

/* Badges */
.badges-zone {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}
.tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 50px;
  letter-spacing: 0.04em;
}
.tag-new { background: #e74c3c; color: #fff; }
.tag-fav { background: #fff3cd; color: #856404; }
.tag-free { background: #198754; color: #fff; }

/* Discount badge */
.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 9px;
  border-radius: 50px;
  z-index: 2;
}

/* ── Card Body ── */
.card-body-section {
  padding: 1.1rem 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #eaf7fb;
  color: #0ea2bd;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 3px 10px;
  border-radius: 50px;
  margin-bottom: 0.55rem;
  width: fit-content;
}

.product-title-link { text-decoration: none; }
.product-title {
  font-weight: 700;
  font-size: 0.97rem;
  color: #1a2a3a;
  margin: 0 0 0.45rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}
.product-title-link:hover .product-title { color: #0ea2bd; }

/* Rating */
.card-rating { display: flex; align-items: center; gap: 5px; margin-bottom: 0.35rem; }
.rating-stars { display: inline-flex; gap: 1px; }
.rating-star { font-size: 0.78rem; color: #d9dce6; }
.rating-star.is-filled { color: #f5a623; }
.rating-num { font-size: 0.8rem; font-weight: 800; color: #1a2a3a; }
.rating-count { font-size: 0.75rem; color: #adb5bd; }

.product-desc {
  font-size: 0.82rem;
  color: #6c757d;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  margin-bottom: 0.9rem;
}

/* ── Footer ── */
.card-footer-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f2f5;
}

.price-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.price-old {
  font-size: 0.75rem;
  text-decoration: line-through;
  color: #adb5bd;
  line-height: 1;
}
.price-current {
  font-size: 1rem;
  font-weight: 800;
  color: #0ea2bd;
  line-height: 1.2;
}

/* Add to cart button */
.btn-add-cart {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #0ea2bd, #0189a1);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.45rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  box-shadow: 0 3px 10px rgba(14, 162, 189, 0.28);
  flex-shrink: 0;
}
.btn-add-cart:hover:not(:disabled) {
  background: linear-gradient(135deg, #0189a1, #0ea2bd);
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(14, 162, 189, 0.4);
}
.btn-add-cart:disabled { opacity: 0.75; cursor: not-allowed; }
.btn-add-cart.btn-added {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  box-shadow: 0 3px 10px rgba(39, 174, 96, 0.3);
}
.btn-label { font-size: 0.8rem; }

/* Error message */
.cart-error-msg {
  font-size: 0.75rem;
  color: #e74c3c;
  margin: 0.4rem 0 0;
  display: flex;
  align-items: center;
}
</style>
