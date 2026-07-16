<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import api from '../../services/api'

const route = useRoute()
const paiementId = route.query.paiement_id
const isLoading = ref(true)
const paiement = ref(null)
const error = ref('')

async function loadPaiement() {
  if (!paiementId) {
    error.value = "Aucun paiement spécifié."
    isLoading.value = false
    return
  }
  try {
    const res = await api.get(`/paiements/${paiementId}`)
    paiement.value = res.data || res
  } catch (e) {
    error.value = "Impossible de charger les informations du paiement."
  } finally {
    isLoading.value = false
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

        <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>

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
                Vous allez être redirigé vers la plateforme de paiement sécurisée KKiaPay.
                Une fois le paiement effectué, votre don sera automatiquement confirmé.
              </small>
            </div>

            <div class="d-flex flex-column gap-2">
              <button class="btn btn-primary btn-lg w-100" @click="$router.push('/dons')">
                <i class="bi bi-arrow-left me-2"></i>Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
