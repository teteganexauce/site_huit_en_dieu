<template>
  <BreadcombsComponent :title="formation?.titre || 'Détail de la formation'" />

  <!-- Bannière progression -->
  <div v-if="inscriptionInfo" class="bg-success bg-opacity-10 border-bottom border-success border-opacity-25 py-2">
    <div class="container container-xxl d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-play-circle-fill text-success fs-5"></i>
        <span class="fw-semibold small">
          <template v-if="inscriptionInfo.progression > 0 && inscriptionInfo.progression < 100">
            Continuez votre formation — {{ Math.round(inscriptionInfo.progression) }}% complété
          </template>
          <template v-else-if="inscriptionInfo.progression >= 100 && inscriptionInfo.a_evaluation">
            Félicitations ! Terminez l'évaluation pour obtenir votre certificat
          </template>
          <template v-else-if="inscriptionInfo.progression >= 100">
            Formation terminée ! Téléchargez votre certificat
          </template>
          <template v-else-if="inscriptionInfo.statut === 'en_attente' && formation?.type !== 'gratuite'">
            Inscription enregistrée — Veuillez finaliser votre paiement pour commencer
          </template>
          <template v-else>
            Vous êtes inscrit à cette formation — Bonne formation !
          </template>
        </span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="progress" style="width: 100px; height: 8px;">
          <div class="progress-bar bg-success" :style="{ width: Math.round(inscriptionInfo.progression) + '%' }"></div>
        </div>
        <template v-if="inscriptionInfo.statut === 'en_attente' && formation?.type !== 'gratuite'">
          <button class="btn btn-sm btn-warning" @click="openPaymentModal">
            <i class="bi bi-credit-card me-1"></i>Finaliser le paiement
          </button>
        </template>
        <router-link v-else-if="inscriptionId" :to="'/apprentissage/' + inscriptionId" class="btn btn-sm btn-success">
          <i class="bi bi-play-circle me-1"></i>
          {{ inscriptionInfo.progression >= 100 ? 'Voir mon certificat' : 'Continuer' }}
        </router-link>
      </div>
    </div>
  </div>

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
                          <div v-for="c in mod.cours" :key="c.id" class="d-flex justify-content-between align-items-center border-bottom py-2" style="cursor:pointer;" @click="openCours(c)">
                            <div class="d-flex align-items-center gap-2">
                              <i class="bi bi-play-circle-fill text-primary"></i>
                              <span class="text-primary-hover">{{ c.titre }}</span>
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
                <template v-else-if="inscriptionId">
                  <button v-if="inscriptionInfo && inscriptionInfo.statut === 'en_attente' && formation.type !== 'gratuite'" class="btn btn-warning w-100 btn-lg mb-2" @click="openPaymentModal">
                    <i class="bi bi-credit-card me-1"></i>Finaliser le paiement
                  </button>
                  <button v-else class="btn btn-success w-100 btn-lg mb-2" @click="goToLearning">
                    <i class="bi bi-play-circle me-1"></i>Continuer la formation
                  </button>
                </template>
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
            <div class="card border-0 shadow-sm mt-3">
              <div class="card-body">
                <h6 class="fw-bold mb-3"><i class="bi bi-star me-1"></i>Noter cette formation</h6>
                <div class="text-center mb-2">
                  <span v-for="s in 5" :key="s"
                    class="star-rating fs-3"
                    :class="(noteUtilisateur || noteHover) >= s ? 'text-warning' : 'text-muted'"
                    @mouseover="noteHover = s"
                    @mouseleave="noteHover = 0"
                    @click="submitNote(s)"
                    style="cursor: pointer;">&#9733;</span>
                </div>
                <p v-if="noteMessage" class="small text-center mb-0" :class="noteMessageType === 'success' ? 'text-success' : 'text-danger'">{{ noteMessage }}</p>
                <p v-else class="small text-center text-muted mb-0">Cliquez pour noter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

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
        <div class="d-flex justify-content-center gap-2 flex-wrap">
          <router-link v-if="inscriptionId" :to="'/apprentissage/' + inscriptionId" class="btn btn-success">
            <i class="bi bi-play-circle me-1"></i>Commencer la formation
          </router-link>
          <router-link to="/profil/mes-formations" class="btn btn-primary"><i class="bi bi-person me-1"></i>Voir mes formations</router-link>
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
import shopService from '../services/shopService'
import api from '../services/api'
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
const inscriptionId = ref(null)
const inscriptionInfo = ref(null)
const showCompletionBanner = ref(false)
const showInscriptionModal = ref(false)
const showSuccessModal = ref(false)

const goToLearning = () => {
  if (inscriptionId.value) {
    router.push({ name: 'coursPlayer', params: { inscriptionId: inscriptionId.value } })
  }
}

const openCours = (c) => {
  if (c.estGratuit) {
    router.push({ name: 'login', query: { redirect: route.fullPath, coursId: c.id } })
    return
  }
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (!isEnrolled.value) {
    openInscriptionModal()
    return
  }
  if (inscriptionInfo.value?.statut === 'en_attente' && formation.value?.type !== 'gratuite') {
    openPaymentModal()
    return
  }
  router.push({
    name: 'coursPlayerCours',
    params: { inscriptionId: inscriptionId.value, coursId: c.id }
  })
}

const noteUtilisateur = ref(0)
const noteHover = ref(0)
const noteMessage = ref('')
const noteMessageType = ref('')

const submitNote = async (noteValue) => {
  if (!authStore.isAuthenticated) {
    noteMessage.value = 'Connectez-vous pour noter cette formation.'
    noteMessageType.value = 'danger'
    return
  }
  noteUtilisateur.value = noteValue
  noteMessage.value = ''
  try {
    const res = await api.post(`/formations/${route.params.id}/notes`, { note: noteValue })
    noteMessage.value = 'Note enregistrée !'
    noteMessageType.value = 'success'
    if (formation.value) formation.value.note_moyenne = res.data?.note_moyenne || formation.value.note_moyenne
  } catch (e) {
    noteMessage.value = e.response?.data?.message || 'Erreur lors de l\'envoi de la note'
    noteMessageType.value = 'danger'
    noteUtilisateur.value = 0
  }
}

const loadUserNote = async () => {
  if (!authStore.isAuthenticated) return
  try {
    const res = await api.get(`/formations/${route.params.id}/notes`)
    const notes = res.data?.notes || []
    const maNote = notes.find(n => n.user_id === authStore.user?.id)
    if (maNote) noteUtilisateur.value = maNote.note
  } catch (e) { /* pas de note existante */ }
}

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
    const data = res.data || res
    if (data?.id) inscriptionId.value = data.id
    if (data?.inscription?.id) inscriptionId.value = data.inscription.id
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
  redirectToKkiapay()
}

const redirectToKkiapay = async () => {
  enrolling.value = true
  enrollMessage.value = ''
  try {
    const payload = { mode_paiement: 'mobile_money' }
    const res = await publicService.enrollInFormation(route.params.id, payload)
    const inscription = res.data || res
    if (inscription?.id) inscriptionId.value = inscription.id
    const paiementUrl = inscription.paiement_url
    if (paiementUrl) {
      window.location.href = paiementUrl
      return
    }
    enrollSuccess.value = true
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
    if (res.inscription) {
      inscriptionInfo.value = res.inscription
      inscriptionId.value = res.inscription.id
      isEnrolled.value = true
    }
    modulesLoading.value = true
    try {
      const modRes = await publicService.getFormationModules(id)
      modules.value = modRes.data || modRes
    } catch (e) {
      console.error(e)
    } finally {
      modulesLoading.value = false
    }
    if (!res.inscription && authStore.isAuthenticated) {
      try {
        const insRes = await publicService.getMyInscriptions()
        const items = insRes.data || insRes
        if (Array.isArray(items)) {
          const monInscription = items.find(i => i.formation_id == id)
          isEnrolled.value = !!monInscription
          if (monInscription) {
            inscriptionId.value = monInscription.id
            inscriptionInfo.value = monInscription
          }
        }
      } catch (e) { /* ignore */ }
    }
    await loadUserNote()
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
