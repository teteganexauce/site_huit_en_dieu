<template>
  <BreadcombsComponent :title="formation?.titre || 'Détail de la formation'" />

  <!-- Bannière progression -->
  <div v-if="inscriptionInfo" class="fd-progress-banner">
    <div class="container container-xxl fd-progress-inner">
      <div class="fd-progress-left">
        <span class="fd-progress-icon"><i class="bi bi-play-circle-fill"></i></span>
        <span class="fd-progress-text">
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
      <div class="fd-progress-right">
        <div class="fd-progress-bar">
          <div class="fd-progress-fill" :style="{ width: Math.round(inscriptionInfo.progression) + '%' }"></div>
        </div>
        <button v-if="inscriptionInfo.statut === 'en_attente' && formation?.type !== 'gratuite'" class="fd-btn fd-btn-warning fd-btn-sm" @click="openPaymentModal">
          <i class="bi bi-credit-card me-1"></i>Finaliser le paiement
        </button>
        <router-link v-else-if="inscriptionId && inscriptionInfo.progression >= 100" :to="{ name: 'certificat', params: { id: inscriptionId } }" class="fd-btn fd-btn-success fd-btn-sm">
          <i class="bi bi-award me-1"></i>Voir mon certificat
        </router-link>
        <router-link v-else-if="inscriptionId" :to="'/apprentissage/' + inscriptionId" class="fd-btn fd-btn-success fd-btn-sm">
          <i class="bi bi-play-circle me-1"></i>Continuer
        </router-link>
      </div>
    </div>
  </div>

  <div v-if="loading" class="fd-loading">
    <div class="fd-spinner"></div>
  </div>

  <div v-else-if="!formation" class="fd-empty">
    <h5>Formation introuvable</h5>
    <router-link to="/formations" class="fd-btn fd-btn-primary mt-3">Voir toutes les formations</router-link>
  </div>

  <section v-else class="fd-page">
    <div class="container container-xxl py-5">
      <div class="row g-5">
        <div class="col-lg-8">
          <article class="fd-article">
            <div class="fd-head" data-aos="fade-up" data-aos-duration="1000">
              <div>
                <span class="fd-badge" :class="badgeClass(formation.type)">{{ badgeLabel(formation.type) }}</span>
                <h1 class="fd-title">{{ formation.titre }}</h1>
                <p v-if="formation.sousTitre" class="fd-subtitle">{{ formation.sousTitre }}</p>
                <div class="fd-meta-row">
                  <span class="fd-meta"><i class="bi bi-clock"></i>{{ formation.dateDebut ? new Date(formation.dateDebut).toLocaleDateString('fr-FR') : 'À définir' }} — {{ formation.dateFin ? new Date(formation.dateFin).toLocaleDateString('fr-FR') : 'À définir' }}</span>
                  <span class="fd-meta"><i class="bi bi-people"></i>{{ formation.inscrits_count || 0 }} inscrits</span>
                  <span v-if="formation.places_restantes !== null" class="fd-meta"><i class="bi bi-person-plus"></i>{{ formation.places_restantes }} places</span>
                </div>
              </div>
            </div>

            <div class="fd-content">
              <h5 class="fd-h5">Description</h5>
              <p class="fd-text">{{ formation.description }}</p>

              <div v-if="formation.objectifs" class="fd-block" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                <h5 class="fd-h5">Objectifs</h5>
                <p class="fd-text fd-pre">{{ formation.objectifs }}</p>
              </div>

              <div v-if="formation.publicCible" class="fd-block" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                <h5 class="fd-h5">Public cible</h5>
                <p class="fd-text">{{ formation.publicCible }}</p>
              </div>

              <div class="fd-block" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                <h5 class="fd-h5 fd-mb-3">Programme</h5>
                <div v-if="modulesLoading" class="fd-loading-inline"><div class="fd-spinner fd-spinner-sm"></div></div>
                <div v-else-if="!modules.length" class="fd-text-muted">Aucun module pour le moment.</div>

                <div v-else class="fd-program">
                  <details v-for="(mod, i) in modules" :key="mod.id" class="fd-module" :open="i === 0">
                    <summary class="fd-module-summary">
                      <span class="fd-module-index">{{ String(i + 1).padStart(2, '0') }}</span>
                      <span class="fd-module-info">
                        <strong>{{ mod.titre }}</strong>
                        <small>{{ mod.description }}</small>
                      </span>
                      <i class="bi bi-chevron-down fd-module-chevron"></i>
                    </summary>
                    <div class="fd-module-body">
                      <div v-if="mod.cours?.length">
                        <div v-for="c in mod.cours" :key="c.id" class="fd-lesson-row" @click="openCours(c)">
                          <span class="fd-lesson-left">
                            <i class="bi bi-play-circle-fill"></i>
                            <span>{{ c.titre }}</span>
                            <span v-if="c.estGratuit" class="fd-free-tag">Gratuit</span>
                          </span>
                          <small v-if="c.dureeMinutes">{{ c.dureeMinutes }} min</small>
                        </div>
                      </div>
                      <div v-else class="fd-text-muted fd-p-3">Aucun cours.</div>
                    </div>
                  </details>
                </div>
              </div>

              <div class="fd-block" id="avis" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                <h5 class="fd-h5 fd-mb-3"><i class="bi bi-chat-quote me-1"></i>Avis des participants
                  <span v-if="avisCount" class="fd-avis-count">({{ avisCount }})</span>
                </h5>

                <div v-if="noteMoyenne > 0" class="fd-avis-summary">
                  <div class="fd-avis-score">{{ noteMoyenne }}<span>/5</span></div>
                  <div class="fd-avis-stars">
                    <span v-for="s in 5" :key="s" class="fd-avis-star" :class="{ 'is-filled': noteMoyenne >= s - 0.25 }">&#9733;</span>
                    <small class="fd-avis-summary-count">{{ avisCount }} avis</small>
                  </div>
                </div>

                <div v-if="avisLoading" class="fd-loading-inline"><div class="fd-spinner fd-spinner-sm"></div></div>
                <div v-else-if="!avisList.length" class="fd-text-muted">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</div>
                <div v-else class="fd-avis-list">
                  <div v-for="(a, i) in avisList" :key="a.id" class="fd-avis-item" data-aos="fade-up" data-aos-duration="800" :data-aos-delay="Math.min(i * 80, 400)">
                    <div class="fd-avis-head">
                      <img :src="a.user?.photoUrl || defaultAvatar" class="fd-avis-avatar" alt="">
                      <div>
                        <strong class="fd-avis-author">{{ a.user?.name || 'Utilisateur' }}</strong>
                        <span v-if="a.user?.id === authStore.user?.id && !a.estApprouve" class="badge bg-warning text-dark ms-2 align-middle">En attente de validation</span>
                        <div class="fd-avis-stars-mini">
                          <span v-for="s in 5" :key="s" class="fd-star-mini" :class="{ 'is-filled': a.note >= s }">&#9733;</span>
                          <small class="ms-2">{{ formatDate(a.date) }}</small>
                        </div>
                      </div>
                    </div>
                    <p class="fd-avis-contenu">{{ a.contenu }}</p>
                  </div>
                </div>

                <div v-if="authStore.isAuthenticated" class="fd-avis-form">
                  <h6 class="fd-info-title"><i class="bi bi-pencil-square me-1"></i>Laisser un avis</h6>
                  <template v-if="peutCommenter">
                    <div class="fd-stars fd-stars-left">
                      <span
                        v-for="s in 5" :key="s"
                        class="fd-star"
                        :class="{ 'is-filled': (avisNote || avisHover) >= s }"
                        @mouseover="avisHover = s"
                        @mouseleave="avisHover = 0"
                        @click="avisNote = s"
                      >&#9733;</span>
                    </div>
                    <textarea v-model="avisContenu" class="fd-textarea" rows="3" maxlength="2000" placeholder="Partagez votre expérience avec cette formation..."></textarea>
                    <button class="fd-btn fd-btn-primary fd-btn-sm mt-2" @click="submitAvis" :disabled="avisEnvoi">
                      <span v-if="avisEnvoi" class="fd-spinner fd-spinner-sm"></span>
                      <template v-else><i class="bi bi-send me-1"></i>Envoyer mon avis</template>
                    </button>
                    <p v-if="avisMessage" class="fd-note-message fd-text-start" :class="avisMessageType === 'success' ? 'is-success' : avisMessageType === 'info' ? 'is-info' : 'is-danger'">{{ avisMessage }}</p>
                  </template>
                  <p v-else class="fd-note-hint fd-m-0">Seuls les participants ayant suivi cette formation peuvent laisser un avis.</p>
                </div>
                <p v-else class="fd-note-hint fd-m-0">
                  <router-link :to="{ name: 'login', query: { redirect: route.fullPath } }" class="fd-login-link">Connectez-vous</router-link> pour laisser un avis.
                </p>
              </div>
            </div>
          </article>
        </div>

        <div class="col-lg-4">
          <div class="fd-sticky">
            <div class="fd-buy-card" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="150">
              <img :src="formation.imageUrl || defaultImg" class="fd-buy-img" :alt="formation.titre">
              <div class="fd-buy-body">
                <div class="fd-price">{{ formatPrice(formation.prix) }}</div>
                <p class="fd-price-sub">{{ formation.type === 'gratuite' ? 'Formation 100% gratuite' : 'Paiement sécurisé' }}</p>

                <button v-if="!isEnrolled && !enrollSuccess" class="fd-btn fd-btn-primary fd-btn-block fd-btn-lg" @click="openInscriptionModal">
                  <i class="bi bi-mortarboard me-1"></i>{{ formation.type === 'gratuite' ? "S'inscrire gratuitement" : "S'inscrire" }}
                </button>
                <template v-else-if="inscriptionId">
                  <button v-if="inscriptionInfo && inscriptionInfo.statut === 'en_attente' && formation.type !== 'gratuite'" class="fd-btn fd-btn-warning fd-btn-block fd-btn-lg fd-mb-2" @click="openPaymentModal">
                    <i class="bi bi-credit-card me-1"></i>Finaliser le paiement
                  </button>
                  <button v-else class="fd-btn fd-btn-success fd-btn-block fd-btn-lg fd-mb-2" @click="goToLearning">
                    <i class="bi bi-play-circle me-1"></i>Continuer la formation
                  </button>
                </template>
                <button v-else class="fd-btn fd-btn-success fd-btn-block fd-btn-lg" disabled>
                  <i class="bi bi-check-circle me-1"></i>{{ enrollSuccess ? 'Inscrit avec succès' : 'Déjà inscrit' }}
                </button>

                <div v-if="enrollMessage && !showInscriptionModal" class="fd-message" :class="enrollSuccess ? 'is-success' : 'is-danger'">{{ enrollMessage }}</div>
              </div>
            </div>

            <div class="fd-info-card">
              <h6 class="fd-info-title"><i class="bi bi-info-circle me-1"></i>Informations</h6>
              <div class="fd-info-row"><span>Type</span><span class="fd-badge fd-badge-sm" :class="badgeClass(formation.type)">{{ badgeLabel(formation.type) }}</span></div>
              <div class="fd-info-row"><span>Inscrits</span><span>{{ formation.inscrits_count || 0 }}</span></div>
              <div v-if="formation.capaciteMax" class="fd-info-row"><span>Capacité</span><span>{{ formation.capaciteMax }}</span></div>
            </div>

            <div class="fd-rate-card">
              <h6 class="fd-info-title"><i class="bi bi-star me-1"></i>Noter cette formation</h6>
              <div class="fd-stars">
                <span
                  v-for="s in 5" :key="s"
                  class="fd-star"
                  :class="{ 'is-filled': (noteUtilisateur || noteHover) >= s }"
                  @mouseover="noteHover = s"
                  @mouseleave="noteHover = 0"
                  @click="submitNote(s)"
                >&#9733;</span>
              </div>
              <p v-if="noteMessage" class="fd-note-message" :class="noteMessageType === 'success' ? 'is-success' : 'is-danger'">{{ noteMessage }}</p>
              <p v-else class="fd-note-hint">Cliquez pour noter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div v-if="showInscriptionModal" class="fd-modal-overlay">
    <div class="fd-modal">
      <div class="fd-modal-head">
        <h5>Confirmer votre inscription</h5>
        <button type="button" class="fd-modal-close" @click="showInscriptionModal = false"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="fd-modal-body">
        <div class="fd-modal-summary">
          <h6>{{ formation.titre }}</h6>
          <span class="fd-badge" :class="badgeClass(formation.type)">{{ badgeLabel(formation.type) }}</span>
          <div class="fd-modal-price">{{ formatPrice(formation.prix) }}</div>
        </div>
        <hr class="fd-hr">
        <div class="fd-field">
          <label>Nom complet</label>
          <input type="text" :value="authStore.user?.name || (authStore.user?.prenom + ' ' + authStore.user?.nom)" disabled>
        </div>
        <div class="fd-field">
          <label>Email</label>
          <input type="email" :value="authStore.user?.email" disabled>
        </div>
        <div class="fd-field">
          <label>Téléphone</label>
          <input type="text" :value="authStore.user?.telephone || 'Non renseigné'" disabled>
        </div>
      </div>
      <div class="fd-modal-foot">
        <button class="fd-btn fd-btn-ghost" @click="showInscriptionModal = false">Annuler</button>
        <button v-if="formation.type === 'gratuite'" class="fd-btn fd-btn-success" @click="confirmFreeEnrollment" :disabled="enrolling">
          <span v-if="enrolling" class="fd-spinner fd-spinner-sm"></span>
          Confirmer l'inscription
        </button>
        <button v-else class="fd-btn fd-btn-primary" @click="openPaymentModal">
          Continuer vers le paiement <i class="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  </div>

  <div v-if="showSuccessModal" class="fd-modal-overlay">
    <div class="fd-modal fd-modal-center">
      <div class="fd-success-icon"><i class="bi bi-check-lg"></i></div>
      <h4>{{ formation.type === 'gratuite' ? 'Inscription réussie !' : 'Paiement réussi !' }}</h4>
      <p class="fd-text-muted">Vous êtes maintenant inscrit à <strong>{{ formation.titre }}</strong>.</p>
      <p v-if="formation.type !== 'gratuite'" class="fd-text-muted">Un email de confirmation vous a été envoyé.</p>
      <div class="fd-modal-actions">
        <router-link v-if="inscriptionId" :to="'/apprentissage/' + inscriptionId" class="fd-btn fd-btn-success">
          <i class="bi bi-play-circle me-1"></i>Commencer la formation
        </router-link>
        <router-link to="/profil/mes-formations" class="fd-btn fd-btn-primary"><i class="bi bi-person me-1"></i>Mes formations</router-link>
        <router-link to="/formations" class="fd-btn fd-btn-ghost">Autres formations</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AOS from 'aos'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'
import shopService from '../services/shopService'
import avisService from '../services/avisService'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import defaultImg from '../assets/img/blog/blog-4.jpg'
import defaultAvatar from '../assets/default.jpg'

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

/* ─────────── Avis (note + commentaire) ─────────── */
const avisList = ref([])
const avisLoading = ref(false)
const noteMoyenne = ref(0)
const avisCount = ref(0)
const avisNote = ref(0)
const avisHover = ref(0)
const avisContenu = ref('')
const avisEnvoi = ref(false)
const avisMessage = ref('')
const avisMessageType = ref('')
const peutCommenter = ref(false)

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

const loadAvis = async () => {
  avisLoading.value = true
  try {
    const res = await avisService.getFormationAvis(route.params.id)
    const data = res.data || res
    avisList.value = data.avis?.data || data.avis || []
    noteMoyenne.value = parseFloat(data.note_moyenne || 0)
    avisCount.value = parseInt(data.avis_count ?? avisList.value.length)
  } catch (e) {
    console.error(e)
  } finally {
    avisLoading.value = false
  }
}

const loadStatutAvis = async () => {
  if (!authStore.isAuthenticated) return
  try {
    const res = await avisService.getStatut({ formation_id: route.params.id })
    const data = res.data || res
    peutCommenter.value = !!data.peut_commenter_formation
    const monAvis = data.mon_avis_formation
    if (monAvis) {
      avisNote.value = monAvis.note
      avisContenu.value = monAvis.contenu
      avisMessage.value = monAvis.estApprouve
        ? 'Votre avis est publié. Merci !'
        : 'Votre avis est en attente de validation par un administrateur.'
      avisMessageType.value = monAvis.estApprouve ? 'success' : 'info'
    }
  } catch (e) {
    console.error(e)
  }
}

const submitAvis = async () => {
  avisMessage.value = ''
  if (!avisNote.value) {
    avisMessage.value = 'Choisissez une note (1 à 5 étoiles).'
    avisMessageType.value = 'danger'
    return
  }
  if (avisContenu.value.trim().length < 5) {
    avisMessage.value = 'Votre avis doit contenir au moins 5 caractères.'
    avisMessageType.value = 'danger'
    return
  }
  avisEnvoi.value = true
  try {
    const res = await avisService.submitAvis({
      formation_id: route.params.id,
      note: avisNote.value,
      contenu: avisContenu.value,
    })
    avisMessage.value = res.message || 'Avis soumis avec succès !'
    avisMessageType.value = 'success'
    await Promise.all([loadAvis(), loadStatutAvis()])
  } catch (e) {
    avisMessage.value = e.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis'
    avisMessageType.value = 'danger'
  } finally {
    avisEnvoi.value = false
  }
}

const formatPrice = (price) => {
  const num = parseFloat(price)
  if (num <= 0) return 'Gratuit'
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

const badgeLabel = (type) => ({ initiale: 'Initiale', specialisee: 'Spécialisée', gratuite: 'Gratuite' }[type] || type)
const badgeClass = (type) => ({ initiale: 'is-primary', specialisee: 'is-warning', gratuite: 'is-success' }[type] || 'is-secondary')

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
    await Promise.all([loadAvis(), loadStatutAvis()])
  } catch (e) {
    console.error(e)
    formation.value = null
  } finally {
    loading.value = false
    await nextTick()
    setTimeout(() => AOS.refresh(), 150)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

.fd-page, .fd-progress-banner, .fd-modal-overlay {
  --fd-primary: #2952E3;
  --fd-primary-dark: #1B3AAE;
  --fd-ink: #14182B;
  --fd-muted: #6B7280;
  --fd-bg: #F7F8FC;
  --fd-border: #E6E9F2;
  --fd-success: #17A672;
  --fd-danger: #E5484D;
  --fd-warning: #F5A623;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--fd-ink);
}
.fd-page h1, .fd-page h4, .fd-page h5, .fd-page h6 { font-family: 'Manrope', sans-serif; }

.fd-page { background: var(--fd-bg); }

/* ---- bannière progression ---- */
.fd-progress-banner {
  background: #EAF7F1; border-bottom: 1px solid #CFEEE0; padding: 12px 0;
}
.fd-progress-inner { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
.fd-progress-left { display: flex; align-items: center; gap: 10px; }
.fd-progress-icon { color: var(--fd-success); font-size: 1.2rem; }
.fd-progress-text { font-weight: 600; font-size: 0.88rem; }
.fd-progress-right { display: flex; align-items: center; gap: 12px; }
.fd-progress-bar { width: 110px; height: 7px; background: #D3EFE1; border-radius: 999px; overflow: hidden; }
.fd-progress-fill { height: 100%; background: var(--fd-success); border-radius: 999px; transition: width .4s; }

/* ---- header / titre ---- */
.fd-article { max-width: 780px; }
.fd-badge {
  display: inline-block; font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 999px;
  color: #fff; margin-bottom: 12px;
}
.fd-badge.is-primary { background: var(--fd-primary); }
.fd-badge.is-warning { background: var(--fd-warning); }
.fd-badge.is-success { background: var(--fd-success); }
.fd-badge.is-secondary { background: #9AA1B4; }
.fd-badge-sm { padding: 3px 10px; font-size: 0.68rem; }

.fd-title { font-size: clamp(1.6rem, 3vw, 2.3rem); font-weight: 800; line-height: 1.15; margin-bottom: 8px; }
.fd-subtitle { color: var(--fd-muted); font-size: 1rem; margin-bottom: 14px; }
.fd-meta-row { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 8px; }
.fd-meta { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--fd-muted); }

/* ---- contenu ---- */
.fd-content { margin-top: 26px; }
.fd-h5 { font-weight: 700; font-size: 1.05rem; margin-bottom: 10px; }
.fd-mb-3 { margin-bottom: 16px; }
.fd-block { margin-top: 28px; }
.fd-text { color: #3C4257; line-height: 1.65; }
.fd-pre { white-space: pre-line; }
.fd-text-muted { color: var(--fd-muted); font-size: 0.88rem; }

/* ---- programme (accordéon natif) ---- */
.fd-program { border: 1px solid var(--fd-border); border-radius: 16px; overflow: hidden; background: #fff; }
.fd-module { border-bottom: 1px solid var(--fd-border); }
.fd-module:last-child { border-bottom: none; }
.fd-module-summary {
  list-style: none; cursor: pointer; padding: 16px 18px;
  display: flex; align-items: center; gap: 14px; user-select: none;
}
.fd-module-summary::-webkit-details-marker { display: none; }
.fd-module-summary:hover { background: #F7F9FF; }
.fd-module-index { font-weight: 800; color: var(--fd-primary); font-size: 0.85rem; flex-shrink: 0; }
.fd-module-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.fd-module-info strong { font-size: 0.92rem; }
.fd-module-info small { color: var(--fd-muted); font-size: 0.78rem; }
.fd-module-chevron { color: var(--fd-muted); transition: transform .2s; flex-shrink: 0; }
.fd-module[open] .fd-module-chevron { transform: rotate(180deg); }
.fd-module-body { padding: 0 18px 14px 50px; }
.fd-lesson-row {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 10px 0; border-top: 1px solid #F1F2F7; cursor: pointer;
}
.fd-module-body > div > .fd-lesson-row:first-child { border-top: none; }
.fd-lesson-row:hover { color: var(--fd-primary); }
.fd-lesson-left { display: flex; align-items: center; gap: 8px; font-size: 0.86rem; }
.fd-lesson-left i { color: var(--fd-primary); }
.fd-free-tag {
  background: #E6F7EF; color: var(--fd-success); font-size: 0.68rem; font-weight: 700;
  padding: 2px 8px; border-radius: 999px;
}
.fd-p-3 { padding: 12px 0; }

/* ---- colonne latérale ---- */
.fd-sticky { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 16px; }
.fd-buy-card {
  background: #fff; border: 1px solid var(--fd-border); border-radius: 18px; overflow: hidden;
  box-shadow: 0 12px 30px -14px rgba(20,24,43,.15);
}
.fd-buy-img { width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block; }
.fd-buy-body { padding: 20px 22px 22px; text-align: center; }
.fd-price { font-size: 1.7rem; font-weight: 800; color: var(--fd-primary); }
.fd-price-sub { color: var(--fd-muted); font-size: 0.82rem; margin-bottom: 16px; }

.fd-message { margin-top: 10px; font-size: 0.82rem; }
.fd-message.is-success { color: var(--fd-success); }
.fd-message.is-danger { color: var(--fd-danger); }

.fd-info-card, .fd-rate-card {
  background: #fff; border: 1px solid var(--fd-border); border-radius: 16px; padding: 18px 20px;
}
.fd-info-title { font-weight: 700; font-size: 0.9rem; margin-bottom: 12px; }
.fd-info-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 6px 0; color: var(--fd-muted); }
.fd-info-row span:last-child { color: var(--fd-ink); font-weight: 600; }

.fd-stars { text-align: center; margin-bottom: 8px; }
.fd-star { font-size: 1.6rem; color: #D9DCE6; cursor: pointer; transition: color .1s; margin: 0 2px; }
.fd-star.is-filled { color: var(--fd-warning); }
.fd-note-message { text-align: center; font-size: 0.82rem; margin: 0; }
.fd-note-message.is-success { color: var(--fd-success); }
.fd-note-message.is-danger { color: var(--fd-danger); }
.fd-note-message.is-info { color: var(--fd-primary); }
.fd-note-hint { text-align: center; font-size: 0.82rem; color: var(--fd-muted); margin: 0; }
.fd-text-start { text-align: left; }
.fd-m-0 { margin: 0; }
.fd-mt-2 { margin-top: 8px; }
.fd-login-link { color: var(--fd-primary); font-weight: 600; text-decoration: none; }
.fd-login-link:hover { text-decoration: underline; }
.fd-avis-count { color: var(--fd-muted); font-weight: 600; font-size: 0.85rem; }

/* ---- section avis ---- */
.fd-avis-summary {
  display: flex; align-items: center; gap: 18px; padding: 16px 20px;
  background: #fff; border: 1px solid var(--fd-border); border-radius: 14px; margin-bottom: 14px;
}
.fd-avis-score { font-size: 2.2rem; font-weight: 800; color: var(--fd-ink); line-height: 1; }
.fd-avis-score span { font-size: 1rem; color: var(--fd-muted); font-weight: 600; }
.fd-avis-stars { display: flex; flex-direction: column; gap: 2px; }
.fd-avis-star { color: #D9DCE6; font-size: 1.15rem; letter-spacing: 2px; }
.fd-avis-star.is-filled { color: var(--fd-warning); }
.fd-avis-summary-count { color: var(--fd-muted); font-size: 0.8rem; }

.fd-avis-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px; }
.fd-avis-item {
  background: #fff; border: 1px solid var(--fd-border); border-radius: 14px; padding: 16px 18px;
}
.fd-avis-head { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.fd-avis-avatar {
  width: 42px; height: 42px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
  border: 2px solid #E6E9F2;
}
.fd-avis-author { font-size: 0.9rem; }
.fd-avis-stars-mini { display: flex; align-items: center; }
.fd-star-mini { color: #D9DCE6; font-size: 0.85rem; }
.fd-star-mini.is-filled { color: var(--fd-warning); }
.fd-avis-stars-mini small { color: var(--fd-muted); }
.fd-avis-contenu { margin: 0; color: #3C4257; font-size: 0.88rem; line-height: 1.6; }

.fd-avis-form {
  background: #fff; border: 1px solid var(--fd-border); border-radius: 14px; padding: 16px 18px;
}
.fd-stars-left { text-align: left; }
.fd-textarea {
  width: 100%; padding: 10px 12px; border-radius: 9px; border: 1px solid var(--fd-border);
  background: #F7F8FC; font-size: 0.88rem; color: var(--fd-ink); resize: vertical;
  font-family: inherit; outline: none; transition: border-color .15s, box-shadow .15s;
}
.fd-textarea:focus { border-color: var(--fd-primary); box-shadow: 0 0 0 3px rgba(41,82,227,.12); background: #fff; }

/* ---- boutons ---- */
.fd-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.88rem;
  padding: 11px 20px; border-radius: 11px; border: 1px solid transparent;
  cursor: pointer; text-decoration: none; transition: background .15s, border-color .15s, transform .1s;
}
.fd-btn:disabled { opacity: .5; cursor: not-allowed; }
.fd-btn:active:not(:disabled) { transform: translateY(1px); }
.fd-btn-primary { background: var(--fd-primary); color: #fff; }
.fd-btn-primary:hover:not(:disabled) { background: var(--fd-primary-dark); }
.fd-btn-success { background: var(--fd-success); color: #fff; }
.fd-btn-success:hover:not(:disabled) { background: #128A5D; }
.fd-btn-warning { background: var(--fd-warning); color: #fff; }
.fd-btn-warning:hover:not(:disabled) { background: #DB9515; }
.fd-btn-ghost { background: #fff; color: var(--fd-ink); border-color: var(--fd-border); }
.fd-btn-ghost:hover:not(:disabled) { border-color: var(--fd-primary); color: var(--fd-primary); }
.fd-btn-block { width: 100%; }
.fd-btn-lg { padding: 13px 22px; font-size: 0.95rem; }
.fd-btn-sm { padding: 7px 14px; font-size: 0.8rem; }
.fd-mb-2 { margin-bottom: 8px; }

/* ---- modales ---- */
.fd-modal-overlay {
  position: fixed; inset: 0; background: rgba(15,17,32,.55); z-index: 1050;
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.fd-modal {
  background: #fff; border-radius: 18px; width: 100%; max-width: 440px; max-height: 90vh;
  overflow-y: auto; box-shadow: 0 25px 60px -15px rgba(0,0,0,.35);
}
.fd-modal-center { text-align: center; padding: 36px 30px; }
.fd-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
.fd-modal-head h5 { font-weight: 700; margin: 0; }
.fd-modal-close {
  border: none; background: #F1F2F7; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: var(--fd-muted);
}
.fd-modal-body { padding: 18px 24px 4px; }
.fd-modal-summary { text-align: center; margin-bottom: 12px; }
.fd-modal-summary h6 { font-weight: 700; margin-bottom: 8px; }
.fd-modal-price { font-weight: 800; font-size: 1.3rem; color: var(--fd-primary); margin-top: 6px; }
.fd-hr { border: none; border-top: 1px solid var(--fd-border); margin: 16px 0; }
.fd-field { margin-bottom: 14px; }
.fd-field label { display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 5px; color: var(--fd-muted); }
.fd-field input {
  width: 100%; padding: 10px 12px; border-radius: 9px; border: 1px solid var(--fd-border);
  background: #F7F8FC; font-size: 0.88rem; color: var(--fd-ink);
}
.fd-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px 22px; }

.fd-success-icon {
  width: 68px; height: 68px; border-radius: 50%; background: #E6F7EF; color: var(--fd-success);
  display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px;
}
.fd-modal-center h4 { font-weight: 800; margin-bottom: 8px; }
.fd-modal-actions { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 18px; }

/* ---- états ---- */
.fd-loading, .fd-empty { min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; }
.fd-loading-inline { padding: 16px 0; }
.fd-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid #E6E9F2; border-top-color: #2952E3; animation: fd-spin .8s linear infinite; }
.fd-spinner-sm { width: 15px; height: 15px; border-width: 2px; }
@keyframes fd-spin { to { transform: rotate(360deg); } }

/* ---- responsive ---- */
@media (max-width: 991px) {
  .fd-sticky { position: static; margin-top: 30px; }
}
@media (max-width: 575px) {
  .fd-progress-inner { flex-direction: column; align-items: flex-start; }
  .fd-progress-right { width: 100%; justify-content: space-between; }
  .fd-modal-foot { flex-direction: column-reverse; }
  .fd-modal-foot .fd-btn { width: 100%; }
}
</style>