<template>
  <BreadcombsComponent title="Paiement" />
  <div class="container py-5">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Chargement du paiement...</p>
    </div>

    <div v-else-if="error" class="text-center py-5">
      <i class="bi bi-x-circle-fill text-danger display-3"></i>
      <h4 class="mt-3 text-danger">Erreur</h4>
      <p class="text-muted">{{ error }}</p>
      <router-link to="/" class="btn btn-primary mt-3">Retour à l'accueil</router-link>
    </div>

    <div v-else-if="success" class="text-center py-5">
      <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
        <i class="bi bi-check-circle-fill text-success display-4"></i>
      </div>
      <h3 class="fw-bold text-success">Paiement réussi !</h3>
      <p class="text-muted">{{ successMessage }}</p>
      <div class="d-flex justify-content-center gap-2 mt-3">
        <router-link :to="redirectPath" class="btn btn-primary">{{ redirectLabel }}</router-link>
        <router-link to="/" class="btn btn-outline-primary">Accueil</router-link>
      </div>
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center p-5">
            <i class="bi bi-phone fs-1 text-primary d-block mb-3"></i>
            <h4 class="fw-bold mb-2">Paiement Mobile Money</h4>
            <p class="text-muted mb-1" v-if="paiement">
              Montant : <strong>{{ formatPrice(paiement.montant) }}</strong>
            </p>
            <p class="text-muted mb-4">Cliquez sur le bouton ci-dessous pour ouvrir le widget KKiaPay et effectuer votre paiement.</p>

            <button v-if="!widgetOpened" class="btn btn-primary btn-lg w-100" @click="openKkiapay" :disabled="opening">
              <span v-if="opening" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-wallet2 me-1"></i>
              Payer avec KKiaPay
            </button>

            <div v-if="!sandbox && !widgetOpened" class="mt-3">
              <button class="btn btn-outline-success" @click="simulatePayment" :disabled="simulating">
                <span v-if="simulating" class="spinner-border spinner-border-sm me-1"></span>
                <span v-else><i class="bi bi-check-circle me-1"></i></span>
                Simuler le paiement
              </button>
            </div>

            <p v-if="errorMsg" class="text-danger mt-3 mb-0 small">{{ errorMsg }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const paiement = ref(null)
const publicKey = ref('')
const sandbox = ref(true)
const opening = ref(false)
const simulating = ref(false)
const widgetOpened = ref(false)
const success = ref(false)
const successMessage = ref('')
const redirectPath = ref('/')
const redirectLabel = ref('Accueil')
const errorMsg = ref('')

const formatPrice = (price) => {
  const num = parseFloat(price)
  if (isNaN(num)) return '0 FCFA'
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

async function loadPaiement() {
  const paiementId = route.query.paiement_id
  if (!paiementId) {
    error.value = 'Aucun paiement à traiter.'
    loading.value = false
    return
  }

  try {
    const [paiementRes, configRes] = await Promise.all([
      api.get(`/paiements/${paiementId}`),
      api.get('/config/kkiapay')
    ])
    paiement.value = paiementRes.data?.data || paiementRes.data || paiementRes
    publicKey.value = configRes.data?.public_key || configRes.public_key
    sandbox.value = configRes.data?.sandbox !== undefined ? configRes.data.sandbox : configRes.sandbox

    if (paiement.value.statut !== 'en_attente') {
      handleSuccess(paiement.value)
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Impossible de charger les informations de paiement.'
  } finally {
    loading.value = false
  }
}

function handleSuccess(pay) {
  success.value = true
  if (pay.commande_id) {
    successMessage.value = 'Votre commande a été payée avec succès.'
    redirectPath.value = `/commande/succes?orderId=${pay.commande_id}&method=kkiapay`
    redirectLabel.value = 'Voir ma commande'
  } else if (pay.inscription_id) {
    successMessage.value = 'Vous êtes maintenant inscrit à la formation.'
    redirectPath.value = '/profile-inscrit'
    redirectLabel.value = 'Voir mes formations'
  } else if (pay.don_id) {
    successMessage.value = 'Merci pour votre don !'
    redirectPath.value = '/profile-inscrit'
    redirectLabel.value = 'Voir mon profil'
  } else {
    successMessage.value = 'Paiement effectué avec succès.'
    redirectPath.value = '/'
    redirectLabel.value = 'Accueil'
  }
}

function openKkiapay() {
  if (!window.openKkiapayWidget) {
    errorMsg.value = 'Le widget KKiaPay n\'est pas encore chargé. Veuillez réessayer.'
    return
  }

  opening.value = true
  errorMsg.value = ''

  try {
    const amount = Math.round(parseFloat(paiement.value.montant))
    const key = publicKey.value
    const isSandbox = sandbox.value
    const paiementId = paiement.value.id

    window.openKkiapayWidget({
      amount,
      key,
      sandbox: isSandbox,
      data: String(paiementId),
      callback: (response) => {
        widgetOpened.value = true
        if (response && response.status === 'SUCCESS') {
          confirmPayment(paiementId)
        } else {
          errorMsg.value = 'Paiement annulé ou échoué.'
          opening.value = false
        }
      }
    })

    window.addSuccessListener((response) => {
      confirmPayment(paiementId)
    })

    window.addFailedListener((response) => {
      errorMsg.value = 'Le paiement a échoué. Veuillez réessayer.'
      opening.value = false
    })
  } catch (e) {
    errorMsg.value = 'Erreur lors de l\'ouverture du widget.'
    opening.value = false
  }
}

async function confirmPayment(paiementId) {
  try {
    const res = await api.post(`/paiements/confirmer/${paiementId}`)
    const pay = res.data?.data || paiement.value
    handleSuccess(pay)
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Erreur lors de la confirmation du paiement.'
    opening.value = false
  }
}

async function simulatePayment() {
  simulating.value = true
  errorMsg.value = ''
  try {
    await api.post(`/paiements/confirmer/${paiement.value.id}`)
    handleSuccess(paiement.value)
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Erreur lors de la simulation.'
  } finally {
    simulating.value = false
  }
}

onMounted(() => {
  loadPaiement()

  const script = document.createElement('script')
  script.src = 'https://cdn.kkiapay.me/k.js'
  script.async = true
  document.head.appendChild(script)
})
</script>
