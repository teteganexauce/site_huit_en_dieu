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
const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

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

    if (paiement.value.statut === 'reussi') {
      success.value = true
      return
    }

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
  const callbackUrl = `${window.location.origin}/paiement/kkiapay?paiement_id=${paiementId}`

  window.addSuccessListener(async function() {
    paying.value = false
    success.value = true
    try {
      await api.post('/paiements/confirmer/' + paiementId)
    } catch (e) {
      console.error('Confirmation failed:', e)
    }
  })

  window.addFailedListener(function() {
    paying.value = false
    error.value = "Le paiement a échoué. Veuillez réessayer."
  })

  window.openKkiapayWidget({
    amount: Number(paiement.value.montant),
    key: kkiapayConfig.value.public_key,
    sandbox: kkiapayConfig.value.sandbox,
    data: String(paiementId),
    callback: callbackUrl,
    theme: "#0d6efd"
  })
}

async function simulerPaiement() {
  paying.value = true
  try {
    await api.post('/paiements/confirmer/' + paiementId)
    paying.value = false
    success.value = true
  } catch (e) {
    paying.value = false
    error.value = "La simulation a échoué."
  }
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
            <p class="text-muted mb-3" v-if="paiement?.don_id">Merci pour votre don de <strong>{{ Number(paiement.montant || 0).toLocaleString('fr-FR') }} FCFA</strong>.</p>
            <p class="text-muted mb-3" v-else>Votre paiement de <strong>{{ Number(paiement?.montant || 0).toLocaleString('fr-FR') }} FCFA</strong> a été confirmé.</p>
            <p class="text-muted mb-4">Un reçu vous sera envoyé par email.</p>
            <router-link v-if="paiement?.commande_id" to="/profil/mes-commandes" class="btn btn-primary">Voir mes commandes</router-link>
            <router-link v-else-if="paiement?.inscription_id" to="/profil/mes-formations" class="btn btn-primary">Voir mes formations</router-link>
            <router-link v-else to="/" class="btn btn-primary">Retour à l'accueil</router-link>
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
              <button v-if="isLocalDev" class="btn btn-warning btn-lg w-100" :disabled="paying" @click="simulerPaiement">
                <i class="bi bi-flask me-2"></i>
                {{ paying ? 'Simulation en cours...' : 'Simuler le paiement (test local)' }}
              </button>
              <router-link to="/dons" class="btn btn-outline-secondary">Annuler</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
