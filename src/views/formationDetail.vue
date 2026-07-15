<template>
  <BreadcombsComponent :title="formation?.titre || 'Détail de la formation'" />

  <div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
  </div>

  <div v-else-if="!formation" class="text-center py-5 text-muted">
    <h5>Formation introuvable</h5>
    <router-link to="/formations" class="btn btn-primary mt-3">Voir toutes les formations</router-link>
  </div>

  <section v-else id="blog" class="blog">
    <div class="container container-xxl py-4">
      <div class="row g-5">
        <div class="col-lg-8">
          <article class="blog-details shadow-none p-0">
            <div class="d-flex justify-content-between flex-wrap align-items-start gap-3">
              <div>
                <h2 class="fw-bold text-primary mb-2">{{ formation.titre }}</h2>
                <p class="text-muted" v-if="formation.sousTitre">{{ formation.sousTitre }}</p>
                <div class="d-flex flex-wrap gap-3 mb-2">
                  <small class="text-muted"><i class="bi bi-clock me-1"></i>{{ formation.dateDebut ? new Date(formation.dateDebut).toLocaleDateString('fr-FR') : 'À définir' }} — {{ formation.dateFin ? new Date(formation.dateFin).toLocaleDateString('fr-FR') : 'À définir' }}</small>
                  <small class="text-muted"><i class="bi bi-people me-1"></i>{{ formation.inscrits_count || 0 }} inscrits</small>
                  <small v-if="formation.places_restantes !== null" class="text-muted"><i class="bi bi-person-plus me-1"></i>{{ formation.places_restantes }} places</small>
                </div>
              </div>
              <div class="text-end">
                <span class="badge fs-6 mb-2 d-block" :class="badgeClass(formation.type)">{{ badgeLabel(formation.type) }}</span>
                <h3 class="fw-bold text-primary mb-0">{{ formatPrice(formation.prix) }}</h3>
              </div>
            </div>

            <div class="content mt-4">
              <h5 class="fw-bold">Description</h5>
              <p>{{ formation.description }}</p>
              <div v-if="formation.objectifs" class="mt-4">
                <h5 class="fw-bold">Objectifs</h5>
                <p style="white-space: pre-line;">{{ formation.objectifs }}</p>
              </div>
              <div v-if="formation.publicCible" class="mt-4">
                <h5 class="fw-bold">Public cible</h5>
                <p>{{ formation.publicCible }}</p>
              </div>
              <div class="mt-4">
                <h5 class="fw-bold mb-3">Programme</h5>
                <div v-if="modulesLoading" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
                <div v-else-if="!modules.length" class="text-muted small">Aucun module pour le moment.</div>
                <div v-else class="accordion" id="modulesAccordion">
                  <div v-for="(mod, i) in modules" :key="mod.id" class="accordion-item border-0 mb-2">
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed shadow-none rounded-3" type="button" data-bs-toggle="collapse" :data-bs-target="'#mod' + mod.id">
                        <span class="d-flex align-items-center gap-3">
                          <span class="fw-bold text-primary">{{ String(i + 1).padStart(2, '0') }}</span>
                          <span><strong>{{ mod.titre }}</strong><br><small class="text-muted">{{ mod.description }}</small></span>
                        </span>
                      </button>
                    </h2>
                    <div :id="'mod' + mod.id" class="accordion-collapse collapse" data-bs-parent="#modulesAccordion">
                      <div class="accordion-body">
                        <div v-if="mod.cours?.length">
                          <div v-for="c in mod.cours" :key="c.id" class="d-flex justify-content-between align-items-center border-bottom py-2">
                            <div class="d-flex align-items-center gap-2">
                              <i class="bi bi-play-circle-fill text-primary"></i>
                              <span>{{ c.titre }}</span>
                              <span v-if="c.estGratuit" class="badge bg-success bg-opacity-10 text-success small">Gratuit</span>
                            </div>
                            <small class="text-muted" v-if="c.dureeMinutes">{{ c.dureeMinutes }} min</small>
                          </div>
                        </div>
                        <div v-else class="text-muted small">Aucun cours.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <div class="position-sticky" style="top: 100px;">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body text-center">
                <img :src="formation.imageUrl || defaultImg" class="img-fluid rounded-3 mb-3" :alt="formation.titre">
                <h4 class="fw-bold">{{ formatPrice(formation.prix) }}</h4>
                <p class="text-muted small">{{ formation.type === 'gratuite' ? 'Formation 100% gratuite' : 'Paiement sécurisé' }}</p>
                <button v-if="!isEnrolled && !enrollSuccess" class="btn btn-primary w-100 btn-lg" @click="openInscriptionModal">
                  <i class="bi bi-mortarboard me-1"></i>{{ formation.type === 'gratuite' ? "S'inscrire gratuitement" : "S'inscrire" }}
                </button>
                <button v-else class="btn btn-success w-100 btn-lg" disabled>
                  <i class="bi bi-check-circle me-1"></i>{{ enrollSuccess ? 'Inscrit avec succès' : 'Déjà inscrit' }}
                </button>
                <div v-if="enrollMessage && !showInscriptionModal" class="mt-2 small" :class="enrollSuccess ? 'text-success' : 'text-danger'">{{ enrollMessage }}</div>
              </div>
            </div>
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h6 class="fw-bold mb-3"><i class="bi bi-info-circle me-1"></i>Informations</h6>
                <div class="d-flex justify-content-between mb-2"><small class="text-muted">Type</small><small><span class="badge" :class="badgeClass(formation.type)">{{ badgeLabel(formation.type) }}</span></small></div>
                <div class="d-flex justify-content-between mb-2"><small class="text-muted">Inscrits</small><small>{{ formation.inscrits_count || 0 }}</small></div>
                <div class="d-flex justify-content-between" v-if="formation.capaciteMax"><small class="text-muted">Capacité</small><small>{{ formation.capaciteMax }}</small></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal 1 : Formulaire d'inscription -->
  <div v-if="showInscriptionModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title fw-bold">Confirmer votre inscription</h5>
          <button type="button" class="btn-close" @click="showInscriptionModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="text-center mb-3">
            <h6 class="fw-bold">{{ formation.titre }}</h6>
            <span class="badge fs-6" :class="badgeClass(formation.type)">{{ badgeLabel(formation.type) }}</span>
            <h4 class="fw-bold text-primary mt-2">{{ formatPrice(formation.prix) }}</h4>
          </div>
          <hr>
          <div class="mb-3">
            <label class="form-label small fw-bold">Nom complet</label>
            <input type="text" class="form-control" :value="authStore.user?.name || (authStore.user?.prenom + ' ' + authStore.user?.nom)" disabled>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Email</label>
            <input type="email" class="form-control" :value="authStore.user?.email" disabled>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Téléphone</label>
            <input type="text" class="form-control" :value="authStore.user?.telephone || 'Non renseigné'" disabled>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button class="btn btn-outline-secondary" @click="showInscriptionModal = false">Annuler</button>
          <button v-if="formation.type === 'gratuite'" class="btn btn-success" @click="confirmFreeEnrollment" :disabled="enrolling">
            <span v-if="enrolling" class="spinner-border spinner-border-sm me-1"></span>
            Confirmer l'inscription
          </button>
          <button v-else class="btn btn-primary" @click="openPaymentModal">
            Continuer vers le paiement <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 2 : Paiement -->
  <div v-if="showPaymentModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title fw-bold"><i class="bi bi-credit-card me-2"></i>Paiement</h5>
          <button type="button" class="btn-close" @click="showPaymentModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="text-center mb-3">
            <h6 class="fw-bold">{{ formation.titre }}</h6>
            <h4 class="fw-bold text-primary">{{ formatPrice(formation.prix) }}</h4>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-4">
              <button class="btn w-100 border p-2 text-center" :class="paymentMode === 'mobile_money' ? 'border-primary bg-primary bg-opacity-10' : ''" @click="paymentMode = 'mobile_money'">
                <i class="bi bi-phone fs-4 d-block"></i><small>Mobile</small>
              </button>
            </div>
            <div class="col-4">
              <button class="btn w-100 border p-2 text-center" :class="paymentMode === 'carte_bancaire' ? 'border-primary bg-primary bg-opacity-10' : ''" @click="paymentMode = 'carte_bancaire'">
                <i class="bi bi-credit-card fs-4 d-block"></i><small>Carte</small>
              </button>
            </div>
            <div class="col-4">
              <button class="btn w-100 border p-2 text-center" :class="paymentMode === 'paypal' ? 'border-primary bg-primary bg-opacity-10' : ''" @click="paymentMode = 'paypal'">
                <i class="bi bi-paypal fs-4 d-block"></i><small>PayPal</small>
              </button>
            </div>
          </div>

          <!-- Mobile Money -->
          <div v-if="paymentMode === 'mobile_money'" class="border rounded-3 p-3 bg-light">
            <div class="mb-3">
              <label class="form-label small fw-bold">Opérateur</label>
              <select class="form-select" v-model="paymentForm.operateur">
                <option value="">Sélectionner</option>
                <option value="mtn">MTN Mobile Money</option>
                <option value="moov">Moov Money</option>
                <option value="celpaid">Celpaid</option>
                <option value="afri">AfriCash</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold">Numéro de téléphone</label>
              <input type="tel" class="form-control" v-model="paymentForm.telephone" placeholder="22996000001">
            </div>
          </div>

          <!-- Carte bancaire -->
          <div v-if="paymentMode === 'carte_bancaire'" class="border rounded-3 p-3 bg-light">
            <div class="mb-3">
              <label class="form-label small fw-bold">Titulaire</label>
              <input type="text" class="form-control" v-model="paymentForm.titulaire_carte" placeholder="Nom du titulaire">
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold">Numéro de carte</label>
              <input type="text" class="form-control" v-model="paymentForm.numero_carte" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            <div class="row">
              <div class="col-6">
                <label class="form-label small fw-bold">Expiration</label>
                <input type="text" class="form-control" v-model="paymentForm.date_expiration" placeholder="MM/AA" maxlength="7">
              </div>
              <div class="col-6">
                <label class="form-label small fw-bold">CVV</label>
                <input type="text" class="form-control" v-model="paymentForm.cvv" placeholder="123" maxlength="4">
              </div>
            </div>
          </div>

          <!-- PayPal -->
          <div v-if="paymentMode === 'paypal'" class="text-center py-3">
            <i class="bi bi-paypal fs-1 d-block mb-2"></i>
            <p class="text-muted mb-0">Redirection vers PayPal.</p>
          </div>

          <div v-if="enrollMessage" class="mt-2 small" :class="enrollSuccess ? 'text-success' : 'text-danger'">{{ enrollMessage }}</div>
        </div>
        <div class="modal-footer border-0">
          <button class="btn btn-outline-secondary" @click="showPaymentModal = false; showInscriptionModal = true">Retour</button>
          <button class="btn btn-success" @click="payAndEnroll" :disabled="enrolling || !canPay">
            <span v-if="enrolling" class="spinner-border spinner-border-sm me-1"></span>
            <span v-else><i class="bi bi-lock me-1"></i></span>
            Payer {{ formatPrice(formation.prix) }} et s'inscrire
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Succès -->
  <div v-if="showSuccessModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center p-4">
        <div class="mb-3">
          <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3">
            <i class="bi bi-check-circle-fill text-success display-4"></i>
          </div>
        </div>
        <h4 class="fw-bold mb-2">{{ formation.type === 'gratuite' ? 'Inscription réussie !' : 'Paiement réussi !' }}</h4>
        <p class="text-muted mb-1">Vous êtes maintenant inscrit à <strong>{{ formation.titre }}</strong>.</p>
        <p class="text-muted mb-3" v-if="formation.type !== 'gratuite'">Un email de confirmation vous a été envoyé.</p>
        <div class="d-flex justify-content-center gap-2">
          <router-link to="/profile-inscrit" class="btn btn-primary"><i class="bi bi-person me-1"></i>Voir mes formations</router-link>
          <router-link to="/formations" class="btn btn-outline-primary">Autres formations</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'
import { useAuthStore } from '../stores/auth'
import defaultImg from '../assets/img/blog/blog-4.jpg'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const formation = ref(null)
const modules = ref([])
const loading = ref(true)
const modulesLoading = ref(false)
const enrolling = ref(false)
const enrollMessage = ref('')
const enrollSuccess = ref(false)
const isEnrolled = ref(false)
const showInscriptionModal = ref(false)
const showPaymentModal = ref(false)
const showSuccessModal = ref(false)
const paymentMode = ref('mobile_money')
const paymentForm = ref({ operateur: '', telephone: '', titulaire_carte: '', numero_carte: '', date_expiration: '', cvv: '' })

const canPay = computed(() => {
  if (paymentMode.value === 'mobile_money') return paymentForm.value.operateur && paymentForm.value.telephone
  if (paymentMode.value === 'carte_bancaire') return paymentForm.value.titulaire_carte && paymentForm.value.numero_carte && paymentForm.value.date_expiration && paymentForm.value.cvv
  return true
})

const formatPrice = (price) => {
  const num = parseFloat(price)
  if (num <= 0) return 'Gratuit'
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

const badgeLabel = (type) => ({ initiale: 'Initiale', specialisee: 'Spécialisée', gratuite: 'Gratuite' }[type] || type)
const badgeClass = (type) => ({ initiale: 'bg-primary', specialisee: 'bg-warning text-dark', gratuite: 'bg-success' }[type] || 'bg-secondary')

const openInscriptionModal = () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  showInscriptionModal.value = true
}

const confirmFreeEnrollment = async () => {
  enrolling.value = true
  enrollMessage.value = ''
  try {
    const res = await publicService.enrollInFormation(route.params.id)
    enrollSuccess.value = true
    showInscriptionModal.value = false
    showSuccessModal.value = true
  } catch (e) {
    enrollMessage.value = e.response?.data?.message || 'Erreur'
  } finally {
    enrolling.value = false
  }
}

const openPaymentModal = () => {
  showInscriptionModal.value = false
  showPaymentModal.value = true
}

const payAndEnroll = async () => {
  enrolling.value = true
  enrollMessage.value = ''
  try {
    const payload = { mode_paiement: paymentMode.value }
    if (paymentMode.value === 'mobile_money') {
      payload.telephone = paymentForm.value.telephone
      payload.operateur = paymentForm.value.operateur
    } else if (paymentMode.value === 'carte_bancaire') {
      payload.numero_carte = paymentForm.value.numero_carte
      payload.date_expiration = paymentForm.value.date_expiration
      payload.cvv = paymentForm.value.cvv
      payload.titulaire_carte = paymentForm.value.titulaire_carte
    }
    const res = await publicService.enrollInFormation(route.params.id, payload)
    const inscription = res.data || res
    const paymentId = inscription.paiement_id
    if (paymentId) {
      await publicService.confirmPayment(paymentId)
    }
    enrollSuccess.value = true
    showPaymentModal.value = false
    showSuccessModal.value = true
  } catch (e) {
    enrollMessage.value = e.response?.data?.message || 'Erreur lors du paiement'
  } finally {
    enrolling.value = false
  }
}

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await publicService.getFormation(id)
    formation.value = res.data || res
    modulesLoading.value = true
    try {
      const modRes = await publicService.getFormationModules(id)
      modules.value = modRes.data || modRes
    } catch (e) {
      console.error(e)
    } finally {
      modulesLoading.value = false
    }
    if (authStore.isAuthenticated) {
      try {
        const insRes = await publicService.getMyInscriptions()
        const items = insRes.data || insRes
        isEnrolled.value = Array.isArray(items) && items.some(i => i.formation_id == id)
      } catch (e) { /* ignore */ }
    }
  } catch (e) {
    console.error(e)
    formation.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.accordion-button:not(.collapsed) { background-color: rgba(13, 110, 253, 0.05); color: inherit; }
.accordion-button::after { background-size: 1rem; }
</style>
