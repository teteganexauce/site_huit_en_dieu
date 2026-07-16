<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import api from '../../services/api'

const route = useRoute()
const paiementId = route.query.paiement_id
const isLoading = ref(true)
const paiement = ref(null)
const error = ref('')
const kkiapayConfig = ref(null)
const widgetLoaded = ref(false)
const paying = ref(false)
const success = ref(false)

async function loadPaiement() {
  if (!paiementId) {
    error.value = "Aucun paiement spécifié."
    isLoading.value = false
    return
  }
  try {
    const [paiementRes, configRes] = await Promise.all([
      api.get(`/paiements/${paiementId}`),
      api.get('/config/kkiapay')
    ])
    paiement.value = paiementRes.data || paiementRes
    kkiapayConfig.value = configRes.data || configRes
    await loadKkiapayScript()
  } catch (e) {
    error.value = "Impossible de charger les informations du paiement."
  } finally {
    isLoading.value = false
  }
}

function loadKkiapayScript() {
  return new Promise((resolve) => {
    if (window.kkiapay) {
      widgetLoaded.value = true
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.kkiapay.me/k.js'
    script.onload = () => {
      widgetLoaded.value = true
      resolve()
    }
    document.head.appendChild(script)
  })
}

function openKkiapay() {
  if (!widgetLoaded.value || !kkiapayConfig.value || !paiement.value) return
  paying.value = true
  const callbackUrl = `${window.location.protocol}//${window.location.hostname}:8000/api/v1/webhooks/paiement`
  window.kkiapay({
    amount: Number(paiement.value.montant),
    key: kkiapayConfig.value.public_key,
    sandbox: kkiapayConfig.value.sandbox,
    data: String(paiementId),
    callback: callbackUrl,
    success: function(response) {
      paying.value = false
      success.value = true
    },
    error: function(error) {
      paying.value = false
      error.value = "Le paiement a échoué. Veuillez réessayer."
    }
  })
}

onMounted(loadPaiement)
</script>

<template>
  <BreadcombsComponent title="Paiement" />
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="error && !paiement" class="alert alert-danger text-center">{{ error }}</div>

        <div v-else-if="success" class="card border-0 shadow-sm">
          <div class="card-body text-center p-5">
            <div class="mb-4">
              <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 90px; height: 90px;">
                <i class="bi bi-check-circle fs-1 text-success"></i>
              </div>
            </div>
            <h4 class="fw-bold mb-2">Paiement réussi !</h4>
            <p class="text-muted mb-3">Merci pour votre don de <strong>{{ Number(paiement?.montant || 0).toLocaleString('fr-FR') }} FCFA</strong>.</p>
            <p class="text-muted mb-4">Un reçu vous sera envoyé par email.</p>
            <router-link to="/" class="btn btn-primary">Retour à l'accueil</router-link>
          </div>
        </div>

        <div v-else class="card border-0 shadow-sm">
          <div class="card-body text-center p-5">
            <div class="mb-4">
              <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 90px; height: 90px;">
                <i class="bi bi-credit-card fs-1 text-primary"></i>
              </div>
            </div>
            <h4 class="fw-bold mb-2">Paiement sécurisé</h4>
            <p class="text-muted mb-1">Montant : <strong class="text-primary">{{ Number(paiement?.montant || 0).toLocaleString('fr-FR') }} FCFA</strong></p>
            <p class="text-muted mb-4">Référence : <code>{{ paiement?.referenceTransaction || '—' }}</code></p>

            <hr class="my-4">

            <div class="alert alert-info text-start">
              <i class="bi bi-info-circle me-1"></i>
              <small>
                Vous allez payer via <strong>KKiaPay</strong>. Une fenêtre s'ouvrira pour saisir votre numéro de téléphone
                et confirmer le paiement. Une fois le paiement effectué, votre don sera automatiquement confirmé.
              </small>
            </div>

            <div class="d-flex flex-column gap-2">
              <button class="btn btn-primary btn-lg w-100" :disabled="!widgetLoaded || paying" @click="openKkiapay">
                <span v-if="paying" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-wallet2 me-2"></i>
                {{ paying ? 'Paiement en cours...' : 'Payer avec KKiaPay' }}
              </button>
              <router-link to="/dons" class="btn btn-outline-secondary">Annuler</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
