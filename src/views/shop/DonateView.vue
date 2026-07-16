<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import donService from '../../services/donService'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  montant: '',
  message: '',
  estAnonyme: false,
  mode_paiement: 'mobile_money',
  email_contact: ''
})

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const paymentUrl = ref('')

const montantsSuggestions = [1000, 2500, 5000, 10000, 25000, 50000]

function selectMontant(montant) {
  form.value.montant = montant
}

async function handleSubmit() {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''
  paymentUrl.value = ''

  try {
    const res = await donService.createDon({
      montant: form.value.montant,
      message: form.value.message || null,
      estAnonyme: form.value.estAnonyme,
      mode_paiement: form.value.mode_paiement,
      email_contact: form.value.estAnonyme ? form.value.email_contact : null
    })
    successMessage.value = res.message || 'Don initié avec succès !'
    paymentUrl.value = res.paiement_url || ''
    if (res.paiement_url) {
      window.location.href = res.paiement_url
      return
    }
  } catch (e) {
    errorMessage.value = e.response?.data?.message || e.response?.data?.error || "Une erreur s'est produite."
  } finally {
    isLoading.value = false
  }
}

function proceedToPayment() {
  if (paymentUrl.value) {
    window.open(paymentUrl.value, '_blank')
  }
}
</script>

<template>
  <BreadcombsComponent title="Faire un don" />
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="text-center mb-5">
          <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
            <i class="bi bi-gift fs-1 text-primary"></i>
          </div>
          <h2 class="fw-bold">Soutenez notre mission</h2>
          <p class="text-muted">Votre don nous aide à continuer notre œuvre et à toucher plus de vies.</p>
        </div>

        <div v-if="successMessage && !paymentUrl" class="alert alert-success py-2">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger py-2">{{ errorMessage }}</div>

        <div v-if="paymentUrl" class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <div class="mb-3">
              <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                <i class="bi bi-check-circle fs-1 text-success"></i>
              </div>
            </div>
            <h4 class="fw-bold mb-2">Don initié avec succès !</h4>
            <p class="text-muted mb-3">Montant : <strong>{{ Number(form.montant).toLocaleString('fr-FR') }} FCFA</strong></p>
            <p class="text-muted mb-4">Cliquez ci-dessous pour procéder au paiement sécurisé.</p>
            <button class="btn btn-primary btn-lg px-5" @click="proceedToPayment">
              <i class="bi bi-credit-card me-2"></i>Procéder au paiement
            </button>
            <p class="text-muted small mt-3">Vous serez redirigé vers une plateforme de paiement sécurisée.</p>
          </div>
        </div>

        <div v-else class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <form @submit.prevent="handleSubmit">
              <h5 class="fw-bold mb-3">Choisissez votre montant</h5>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <button type="button" v-for="m in montantsSuggestions" :key="m"
                  class="btn" :class="form.montant == m ? 'btn-primary' : 'btn-outline-primary'"
                  @click="selectMontant(m)">
                  {{ m.toLocaleString('fr-FR') }} FCFA
                </button>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Ou saisissez un montant personnalisé</label>
                <div class="input-group">
                  <input type="number" class="form-control" v-model="form.montant" min="100" placeholder="Montant" required>
                  <span class="input-group-text">FCFA</span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Message (optionnel)</label>
                <textarea class="form-control" rows="3" v-model="form.message" placeholder="Votre message..."></textarea>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="anonyme" v-model="form.estAnonyme">
                  <label class="form-check-label small" for="anonyme">
                    Faire un don anonyme
                  </label>
                </div>
              </div>

              <div class="mb-3" v-if="form.estAnonyme">
                <label class="form-label small fw-bold">Email de contact <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="form.email_contact" placeholder="votre@email.com" required>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold">Mode de paiement</label>
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" value="mobile_money" id="mm" v-model="form.mode_paiement">
                    <label class="form-check-label" for="mm">Mobile Money</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" value="carte_bancaire" id="cb" v-model="form.mode_paiement">
                    <label class="form-check-label" for="cb">Carte bancaire</label>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2" :disabled="isLoading || !form.montant || form.montant < 100">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-heart me-1"></i>
                {{ isLoading ? 'Traitement...' : 'Faire un don de ' + (Number(form.montant).toLocaleString('fr-FR') || '0') + ' FCFA' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
