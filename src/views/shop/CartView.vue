<template>
  <div>
    <BreadcombsComponent title="Mon Panier" />
    <div class="container my-5">
      <div v-if="!authStore.isAuthenticated" class="text-center py-5">
        <h5 class="text-muted">Veuillez vous connecter pour voir votre panier</h5>
        <router-link to="/login" class="btn btn-primary mt-3">Connexion</router-link>
      </div>

      <div v-else-if="cartStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="!cartStore.cart || !cartStore.cart.lignes?.length" class="text-center py-5">
        <h5 class="text-muted">Votre panier est vide</h5>
        <router-link to="/boutique" class="btn btn-primary mt-3">Découvrir la boutique</router-link>
      </div>

      <div v-else>
        <div class="table-responsive">
          <table class="table align-middle">
            <thead class="table-light">
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ligne in cartStore.cart.lignes" :key="ligne.id">
                <td>
                  <div class="d-flex align-items-center">
                    <img :src="ligne.produit?.imageUrl || defaultImg" class="me-3 rounded" style="width: 60px; height: 60px; object-fit: cover;">
                    <div>
                      <h6 class="mb-0">{{ ligne.produit?.nom || 'Produit' }}</h6>
                      <small class="text-muted text-capitalize">{{ ligne.produit?.type?.replace('_', ' ') }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ formatPrice(ligne.prixUnitaire) }}</td>
                <td>
                  <div class="input-group" style="width: 120px;">
                    <button class="btn btn-outline-secondary btn-sm" @click="updateQte(ligne.id, ligne.quantite - 1)" :disabled="ligne.quantite <= 1">-</button>
                    <input type="number" class="form-control form-control-sm text-center" :value="ligne.quantite" min="1" @change="updateQte(ligne.id, $event.target.value)">
                    <button class="btn btn-outline-secondary btn-sm" @click="updateQte(ligne.id, ligne.quantite + 1)">+</button>
                  </div>
                </td>
                <td><strong>{{ formatPrice(ligne.prixUnitaire * ligne.quantite) }}</strong></td>
                <td>
                  <button class="btn btn-sm btn-outline-danger" @click="removeLine(ligne.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-light">
                <td colspan="3" class="text-end fw-bold">Total :</td>
                <td class="fw-bold fs-5 text-ps-primary">{{ formatPrice(cartStore.total) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Paiement -->
        <div v-if="showPayment" class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <h5 class="fw-bold mb-3"><i class="bi bi-credit-card me-2"></i>Choisissez votre mode de paiement</h5>
            <div class="row g-2">
              <div class="col-md-4">
                <button class="btn w-100 border p-3 text-center" :class="selectedPayment === 'mobile_money' ? 'border-primary bg-primary bg-opacity-10' : ''" @click="selectedPayment = 'mobile_money'">
                  <i class="bi bi-phone fs-3 d-block mb-1"></i>
                  <small class="fw-bold">Mobile Money</small>
                </button>
              </div>
              <div class="col-md-4">
                <button class="btn w-100 border p-3 text-center" :class="selectedPayment === 'carte_bancaire' ? 'border-primary bg-primary bg-opacity-10' : ''" @click="selectedPayment = 'carte_bancaire'">
                  <i class="bi bi-credit-card fs-3 d-block mb-1"></i>
                  <small class="fw-bold">Carte bancaire</small>
                </button>
              </div>
              <div class="col-md-4">
                <button class="btn w-100 border p-3 text-center" :class="selectedPayment === 'paypal' ? 'border-primary bg-primary bg-opacity-10' : ''" @click="selectedPayment = 'paypal'">
                  <i class="bi bi-paypal fs-3 d-block mb-1"></i>
                  <small class="fw-bold">PayPal</small>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4 flex-wrap gap-2">
          <router-link to="/boutique" class="btn btn-outline-primary">Continuer mes achats</router-link>
          <div class="d-flex gap-2">
            <button v-if="!showPayment" class="btn btn-success btn-lg" @click="showPayment = true" :disabled="checking">
              Procéder au paiement <i class="bi bi-arrow-right ms-1"></i>
            </button>
            <template v-if="showPayment">
              <button class="btn btn-outline-secondary" @click="showPayment = false">Retour</button>
              <button class="btn btn-success btn-lg" @click="checkout" :disabled="checking || !selectedPayment">
                <span v-if="checking" class="spinner-border spinner-border-sm me-1"></span>
                Payer {{ formatPrice(cartStore.total) }}
              </button>
            </template>
          </div>
        </div>

        <div v-if="cartMessage" class="mt-3" :class="cartSuccess ? 'text-success' : 'text-danger'">{{ cartMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../../stores/cart'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import shopService from '../../services/shopService'
import defaultImg from '../../assets/img/faq.jpg'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const checking = ref(false)
const cartMessage = ref('')
const cartSuccess = ref(false)
const showPayment = ref(false)
const selectedPayment = ref('mobile_money')

const formatPrice = (price) => {
  const num = parseFloat(price)
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
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
    const paymentRes = await shopService.initPayment({
      commande_id: orderId,
      montant: cartStore.total,
      mode: selectedPayment.value
    })
    const paymentData = paymentRes.data || paymentRes
    if (paymentData.redirect_url) {
      window.location.href = paymentData.redirect_url
    } else {
      cartMessage.value = 'Paiement initié avec succès !'
      cartSuccess.value = true
      setTimeout(() => router.push({ name: 'orderSuccess', query: { orderId } }), 1000)
    }
  } catch (error) {
    cartMessage.value = error.response?.data?.message || 'Erreur lors du paiement'
    cartSuccess.value = false
  } finally {
    checking.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    cartStore.fetchCart()
  }
})
</script>
