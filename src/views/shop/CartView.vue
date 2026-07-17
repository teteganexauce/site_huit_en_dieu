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

        <!-- Mode de paiement -->
        <div v-if="showPayment" class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <h5 class="fw-bold mb-3"><i class="bi bi-credit-card me-2"></i>Choisissez votre mode de paiement</h5>
            <div class="row g-2 mb-4">
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

            <!-- Mobile Money -->
            <div v-if="selectedPayment === 'mobile_money'" class="border rounded-3 p-3 bg-light">
              <h6 class="fw-bold mb-3"><i class="bi bi-phone me-2"></i>Paiement Mobile Money</h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Opérateur</label>
                  <select class="form-select" v-model="paymentForm.operateur">
                    <option value="">Sélectionnez un opérateur</option>
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="moov">Moov Money</option>
                    <option value="moor2">Moov Moov</option>
                    <option value="celpaid">Celpaid</option>
                    <option value="afri">AfriCash</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Numéro de téléphone</label>
                  <input type="tel" class="form-control" v-model="paymentForm.telephone" placeholder="Ex: 22996000001">
                </div>
              </div>
            </div>

            <!-- Carte bancaire -->
            <div v-if="selectedPayment === 'carte_bancaire'" class="border rounded-3 p-3 bg-light">
              <h6 class="fw-bold mb-3"><i class="bi bi-credit-card me-2"></i>Paiement par Carte</h6>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label small fw-bold">Titulaire de la carte</label>
                  <input type="text" class="form-control" v-model="paymentForm.titulaire_carte" placeholder="Nom du titulaire">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Numéro de carte</label>
                  <input type="text" class="form-control" v-model="paymentForm.numero_carte" placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-bold">Date d'expiration</label>
                  <input type="text" class="form-control" v-model="paymentForm.date_expiration" placeholder="MM/AA" maxlength="7">
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-bold">CVV</label>
                  <input type="text" class="form-control" v-model="paymentForm.cvv" placeholder="123" maxlength="4">
                </div>
              </div>
            </div>

            <!-- PayPal -->
            <div v-if="selectedPayment === 'paypal'" class="border rounded-3 p-3 bg-light text-center">
              <i class="bi bi-paypal fs-1 d-block mb-2"></i>
              <p class="text-muted mb-0">Vous serez redirigé vers PayPal pour finaliser votre paiement.</p>
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
              <button class="btn btn-success btn-lg" @click="checkout" :disabled="checking || !canPay">
                <span v-if="checking" class="spinner-border spinner-border-sm me-1"></span>
                <span v-if="!checking"><i class="bi bi-lock me-1"></i></span>
                Payer {{ formatPrice(cartStore.total) }}
              </button>
            </template>
          </div>
        </div>

        <div v-if="cartMessage" class="mt-3 alert" :class="cartSuccess ? 'alert-success' : 'alert-danger'">{{ cartMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const paymentForm = ref({
  operateur: '',
  telephone: '',
  titulaire_carte: '',
  numero_carte: '',
  date_expiration: '',
  cvv: ''
})

const canPay = computed(() => {
  if (selectedPayment.value === 'mobile_money') {
    return paymentForm.value.operateur && paymentForm.value.telephone
  }
  if (selectedPayment.value === 'carte_bancaire') {
    return paymentForm.value.titulaire_carte && paymentForm.value.numero_carte &&
           paymentForm.value.date_expiration && paymentForm.value.cvv
  }
  return true
})

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

    const paymentPayload = {
      commande_id: orderId,
      montant: cartStore.total,
      mode: selectedPayment.value
    }

    if (selectedPayment.value === 'mobile_money') {
      paymentPayload.telephone = paymentForm.value.telephone
      paymentPayload.operateur = paymentForm.value.operateur
    } else if (selectedPayment.value === 'carte_bancaire') {
      paymentPayload.numero_carte = paymentForm.value.numero_carte
      paymentPayload.date_expiration = paymentForm.value.date_expiration
      paymentPayload.cvv = paymentForm.value.cvv
      paymentPayload.titulaire_carte = paymentForm.value.titulaire_carte
    }

    const paymentRes = await shopService.initPayment(paymentPayload)
    const paymentData = paymentRes.data || paymentRes

    if (paymentData.redirect_url) {
      window.location.href = paymentData.redirect_url
      return
    }
    cartMessage.value = 'Erreur lors de l\'initialisation du paiement'
    cartSuccess.value = false
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
