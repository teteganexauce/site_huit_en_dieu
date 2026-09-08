<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '../../stores/cart'
import { useAuthStore } from '../../stores/auth'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import shopService from '../../services/shopService'
import defaultImg from '../../assets/img/faq.jpg'

const cartStore = useCartStore()
const authStore = useAuthStore()

const checking = ref(false)
const cartMessage = ref('')
const cartSuccess = ref(false)

const itemCount = computed(() => cartStore.cart?.lignes?.length || 0)

const formatPrice = (price) => {
  const num = parseFloat(price)
  if (isNaN(num)) return '0 FCFA'
  return num.toLocaleString('fr-FR') + ' FCFA'
}

const updateQte = async (lineId, qte) => {
  if (qte < 1) return
  await cartStore.updateLine(lineId, parseInt(qte))
}

const removeLine = async (lineId) => {
  await cartStore.removeLine(lineId)
}

const checkout = async () => {
  checking.value = true
  cartMessage.value = ''
  const total = cartStore.total
  try {
    const result = await cartStore.validateOrder()
    if (!result.success) {
      cartMessage.value = result.error
      cartSuccess.value = false
      return
    }
    const orderId = result.order?.id
    if (!orderId) {
      cartMessage.value = 'Erreur: commande non identifiée'
      cartSuccess.value = false
      return
    }
    const paymentPayload = { commande_id: orderId, montant: total, mode: 'mobile_money' }
    const paymentRes = await shopService.initPayment(paymentPayload)
    const paymentData = paymentRes.data || paymentRes
    if (paymentData.redirect_url) {
      window.location.href = paymentData.redirect_url
      return
    }
    cartMessage.value = "Erreur lors de l'initialisation du paiement"
    cartSuccess.value = false
  } catch (error) {
    cartMessage.value = error.response?.data?.message || 'Erreur lors du paiement'
    cartSuccess.value = false
  } finally {
    checking.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) cartStore.fetchCart()
})
</script>

<template>
  <BreadcombsComponent title="Mon Panier" />

  <div class="cart-page">

    <!-- ══ Non authentifié ══ -->
    <div v-if="!authStore.isAuthenticated" class="state-screen">
      <div class="state-card">
        <div class="state-icon" style="background: linear-gradient(135deg,#0ea2bd,#0189a1)">
          <i class="bi bi-lock-fill"></i>
        </div>
        <h4>Accès réservé aux membres</h4>
        <p class="text-muted">Connectez-vous pour voir et gérer votre panier.</p>
        <router-link to="/login" class="btn-primary-action">
          <i class="bi bi-box-arrow-in-right me-2"></i> Se connecter
        </router-link>
        <router-link to="/boutique" class="btn-secondary-action mt-2">
          <i class="bi bi-shop me-2"></i> Explorer la boutique
        </router-link>
      </div>
    </div>

    <!-- ══ Chargement ══ -->
    <div v-else-if="cartStore.loading" class="state-screen">
      <div class="state-card">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="text-muted">Chargement de votre panier…</p>
      </div>
    </div>

    <!-- ══ Panier vide ══ -->
    <div v-else-if="!cartStore.cart || !cartStore.cart.lignes?.length" class="state-screen">
      <div class="state-card">
        <div class="state-icon" style="background: linear-gradient(135deg,#6c757d,#adb5bd)">
          <i class="bi bi-cart-x"></i>
        </div>
        <h4>Votre panier est vide</h4>
        <p class="text-muted">Découvrez notre boutique et ajoutez des articles à votre panier.</p>
        <router-link to="/boutique" class="btn-primary-action">
          <i class="bi bi-shop me-2"></i> Explorer la boutique
        </router-link>
      </div>
    </div>

    <!-- ══ Contenu panier ══ -->
    <div v-else class="container cart-layout">
      <div class="row g-4 align-items-start">

        <!-- Colonne articles -->
        <div class="col-lg-8">

          <!-- Header -->
          <div class="cart-header">
            <div class="cart-header-left">
              <div class="cart-count-badge">{{ itemCount }}</div>
              <h2 class="cart-title">Mon panier</h2>
            </div>
            <router-link to="/boutique" class="continue-link">
              <i class="bi bi-arrow-left me-1"></i> Continuer mes achats
            </router-link>
          </div>

          <!-- Liste articles -->
          <div class="cart-items">
            <div
              v-for="(ligne, index) in cartStore.cart.lignes"
              :key="ligne.id"
              class="cart-item"
              :style="`animation-delay: ${index * 0.06}s`"
            >
              <!-- Image -->
              <div class="item-img-wrap">
                <img :src="ligne.produit?.imageUrl || defaultImg" :alt="ligne.produit?.nom" class="item-img" />
              </div>

              <!-- Info -->
              <div class="item-info">
                <span class="item-type">{{ ligne.produit?.type?.replace('_', ' ') }}</span>
                <h6 class="item-name">{{ ligne.produit?.nom || 'Produit' }}</h6>
                <p class="item-unit-price">{{ formatPrice(ligne.prixUnitaire) }} / unité</p>
              </div>

              <!-- Quantité -->
              <div class="item-qty-container d-flex flex-column align-items-center">
                <div class="item-qty">
                  <button class="qty-btn" @click="updateQte(ligne.id, ligne.quantite - 1)" :disabled="ligne.quantite <= 1">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="qty-value">{{ ligne.quantite }}</span>
                  <button class="qty-btn" @click="updateQte(ligne.id, ligne.quantite + 1)" :disabled="ligne.produit?.type === 'ebook' || (ligne.produit?.type !== 'ebook' && ligne.quantite >= ligne.produit?.stock)">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <small v-if="ligne.produit?.type !== 'ebook'" class="text-muted mt-1" style="font-size: 0.7rem;">
                  Max: {{ ligne.produit?.stock }}
                </small>
              </div>

              <!-- Sous-total -->
              <div class="item-subtotal">
                <span class="subtotal-value">{{ formatPrice(ligne.prixUnitaire * ligne.quantite) }}</span>
              </div>

              <!-- Supprimer -->
              <button class="item-remove" @click="removeLine(ligne.id)" title="Retirer du panier">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- Colonne récapitulatif -->
        <div class="col-lg-4">
          <div class="order-summary">

            <div class="summary-header">
              <i class="bi bi-receipt me-2"></i> Récapitulatif
            </div>

            <div class="summary-body">
              <!-- Lignes -->
              <div class="summary-lines">
                <div v-for="ligne in cartStore.cart.lignes" :key="ligne.id" class="summary-line">
                  <span class="summary-line-name">{{ ligne.produit?.nom }}</span>
                  <span class="summary-line-price">{{ formatPrice(ligne.prixUnitaire * ligne.quantite) }}</span>
                </div>
              </div>

              <hr class="summary-divider" />

              <!-- Total -->
              <div class="summary-total-row">
                <span>Total à payer</span>
                <span class="summary-total-price">{{ formatPrice(cartStore.total) }}</span>
              </div>

              <!-- Alerte message -->
              <div v-if="cartMessage" class="summary-alert" :class="cartSuccess ? 'alert-ok' : 'alert-err'">
                <i :class="cartSuccess ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'" class="me-2"></i>
                {{ cartMessage }}
              </div>

              <!-- Bouton paiement -->
              <button class="btn-checkout" @click="checkout" :disabled="checking">
                <span v-if="checking" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-shield-lock-fill me-2"></i>
                {{ checking ? 'Traitement…' : 'Procéder au paiement' }}
              </button>

              <p class="summary-security">
                <i class="bi bi-lock-fill me-1"></i> Paiement 100% sécurisé
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════
   Page
═══════════════════════════════════════ */
.cart-page {
  background: #f5f7fa;
  min-height: 75vh;
  padding-bottom: 5rem;
}

/* ═══════════════════════════════════════
   State screens (vide / non connecté / loading)
═══════════════════════════════════════ */
.state-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 55vh;
  padding: 2rem;
}
.state-card {
  background: #fff;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}
.state-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}
.state-card h4 { font-weight: 800; color: #1a2a3a; margin: 0; }
.btn-primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: linear-gradient(135deg, #0ea2bd, #0189a1);
  color: #fff;
  font-weight: 700;
  border-radius: 12px;
  padding: 0.7rem 1.5rem;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: all 0.22s;
  box-shadow: 0 4px 14px rgba(14,162,189,0.3);
}
.btn-primary-action:hover { transform: translateY(-2px); color: #fff; box-shadow: 0 6px 20px rgba(14,162,189,0.4); }
.btn-secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #f0f4f8;
  color: #343a40;
  font-weight: 600;
  border-radius: 12px;
  padding: 0.65rem 1.5rem;
  text-decoration: none;
  transition: all 0.22s;
}
.btn-secondary-action:hover { background: #e2e8f0; color: #0ea2bd; }

/* ═══════════════════════════════════════
   Cart Layout
═══════════════════════════════════════ */
.cart-layout { padding-top: 2.5rem; }

/* ─── Header ─── */
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}
.cart-header-left { display: flex; align-items: center; gap: 0.75rem; }
.cart-count-badge {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #0ea2bd, #0189a1);
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a2a3a;
  margin: 0;
}
.continue-link {
  font-size: 0.88rem;
  color: #0ea2bd;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}
.continue-link:hover { color: #0189a1; transform: translateX(-3px); }

/* ─── Items list ─── */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cart-item {
  background: #fff;
  border-radius: 16px;
  padding: 1.1rem 1.3rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  animation: slideIn 0.35s ease both;
  transition: box-shadow 0.2s;
}
.cart-item:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Image */
.item-img-wrap {
  width: 74px;
  height: 74px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f4f8;
}
.item-img { width: 100%; height: 100%; object-fit: cover; }

/* Info */
.item-info { flex: 1; min-width: 0; }
.item-type {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0ea2bd;
  background: #eaf7fb;
  padding: 2px 8px;
  border-radius: 50px;
  display: inline-block;
  margin-bottom: 4px;
}
.item-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1a2a3a;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-unit-price { font-size: 0.8rem; color: #adb5bd; margin: 0; }

/* Qty controls */
.item-qty {
  display: flex;
  align-items: center;
  gap: 0;
  background: #f5f7fa;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #e9ecef;
  flex-shrink: 0;
}
.qty-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #343a40;
  font-size: 0.9rem;
  transition: background 0.18s, color 0.18s;
}
.qty-btn:hover:not(:disabled) { background: #0ea2bd; color: #fff; }
.qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.qty-value {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #1a2a3a;
  border-left: 1px solid #e9ecef;
  border-right: 1px solid #e9ecef;
  padding: 0 4px;
}

/* Subtotal */
.item-subtotal { min-width: 90px; text-align: right; flex-shrink: 0; }
.subtotal-value { font-weight: 800; font-size: 1rem; color: #0ea2bd; }

/* Remove */
.item-remove {
  background: none;
  border: none;
  color: #ced4da;
  font-size: 0.9rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.item-remove:hover { background: #fdecea; color: #e74c3c; }

/* ═══════════════════════════════════════
   Order Summary
═══════════════════════════════════════ */
.order-summary {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  overflow: hidden;
  position: sticky;
  top: 90px;
}
.summary-header {
  background: linear-gradient(135deg, #1a2a3a, #0ea2bd);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  padding: 1.1rem 1.5rem;
  display: flex;
  align-items: center;
}
.summary-body { padding: 1.5rem; }

.summary-lines { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem; }
.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.87rem;
  color: #6c757d;
  gap: 0.5rem;
}
.summary-line-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.summary-line-price { flex-shrink: 0; font-weight: 600; color: #343a40; }

.summary-divider { border: none; border-top: 2px dashed #e9ecef; margin: 1rem 0; }

.summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 1rem;
  color: #1a2a3a;
  margin-bottom: 1.3rem;
}
.summary-total-price {
  font-size: 1.4rem;
  font-weight: 900;
  color: #0ea2bd;
}

/* Alert */
.summary-alert {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}
.summary-alert.alert-ok { background: #eafaf1; color: #1a7a4a; }
.summary-alert.alert-err { background: #fdecea; color: #c0392b; }

/* Checkout button */
.btn-checkout {
  width: 100%;
  background: linear-gradient(135deg, #0ea2bd 0%, #0189a1 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 5px 18px rgba(14,162,189,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(14,162,189,0.45);
}
.btn-checkout:disabled { opacity: 0.65; cursor: not-allowed; }

.summary-security {
  text-align: center;
  font-size: 0.78rem;
  color: #adb5bd;
  margin: 0.8rem 0 0;
}

/* ═══════════════════════════════════════
   Responsive
═══════════════════════════════════════ */
@media (max-width: 576px) {
  .cart-item {
    flex-wrap: wrap;
  }
  .item-subtotal { margin-left: auto; }
}
</style>
