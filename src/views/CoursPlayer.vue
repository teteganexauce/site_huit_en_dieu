<template>
  <div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
  </div>

  <div v-else-if="accessError" class="text-center py-5">
    <div class="container" style="max-width: 500px;">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-5">
          <div class="mb-4">
            <div v-if="accessError.action === 'payer'" class="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <i class="bi bi-credit-card text-warning display-5"></i>
            </div>
            <div v-else class="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <i class="bi bi-lock-fill text-danger display-5"></i>
            </div>
          </div>
          <h4 class="fw-bold mb-2">{{ accessError.title }}</h4>
          <p class="text-muted mb-4">{{ accessError.message }}</p>
          <div class="d-flex justify-content-center gap-2">
            <router-link to="/formations" class="btn btn-outline-primary">
              <i class="bi bi-arrow-left me-1"></i>Voir les formations
            </router-link>
            <router-link v-if="accessError.action === 'payer'" :to="'/formations/' + (formationData?.id || route.params.inscriptionId)" class="btn btn-warning">
              <i class="bi bi-credit-card me-1"></i>Finaliser le paiement
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="!formationData" class="text-center py-5 text-muted">
    <h5>Formation introuvable</h5>
    <router-link to="/formations" class="btn btn-primary mt-3">Voir les formations</router-link>
  </div>

  <div v-else class="player-container">
    <header class="player-header border-bottom bg-white px-3 py-2 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-3">
        <router-link :to="'/formations/' + formationData.id" class="btn btn-sm btn-light border">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div>
          <h6 class="fw-bold mb-0 text-truncate" style="max-width: 400px;">{{ formationData.titre }}</h6>
          <small class="text-muted">{{ progression }}% complété</small>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="progress" style="width: 120px; height: 8px;">
          <div class="progress-bar bg-success" :style="{ width: progression + '%' }"></div>
        </div>
        <span class="badge bg-success bg-opacity-10 text-success fw-bold">{{ Math.round(progression) }}%</span>
      </div>
    </header>

    <div class="player-body d-flex">
      <aside class="player-sidebar border-end bg-light flex-shrink-0 overflow-auto" style="width: 320px; height: calc(100vh - 56px);">
        <div class="p-2">
          <div v-for="mod in modules" :key="mod.id" class="mb-2">
            <div class="px-2 py-1 fw-bold small text-muted text-uppercase">{{ mod.titre }}</div>

            <div v-for="c in mod.cours" :key="c.id"
              class="cours-item d-flex align-items-center gap-2 px-3 py-2 rounded cursor-pointer"
              :class="{
                'active': mode === 'cours' && currentCours?.id === c.id,
                'text-muted': !estDebloque(c.id) && !(mode === 'cours' && currentCours?.id === c.id),
              }"
              @click="ouvrirCours(c.id)"
              :style="{ cursor: estDebloque(c.id) || (mode === 'cours' && currentCours?.id === c.id) ? 'pointer' : 'not-allowed' }"
            >
              <span class="flex-shrink-0">
                <i v-if="estComplete(c.id)" class="bi bi-check-circle-fill text-success"></i>
                <i v-else-if="mode === 'cours' && currentCours?.id === c.id" class="bi bi-play-circle-fill text-primary"></i>
                <i v-else-if="estDebloque(c.id)" class="bi bi-circle text-muted"></i>
                <i v-else class="bi bi-lock-fill text-muted"></i>
              </span>
              <span class="small flex-grow-1">{{ c.titre }}</span>
              <small class="text-muted flex-shrink-0">{{ formaterDuree(dureesReelles[c.id] || c.dureeMinutes) }}</small>
            </div>

            <div v-if="mod.evaluation"
              class="cours-item d-flex align-items-center gap-2 px-3 py-2 rounded cursor-pointer"
              :class="{
                'active': mode === 'evaluation' && moduleEvaluationId === mod.evaluation.id,
                'text-muted': !tousCoursModuleCompletes(mod),
              }"
              @click="ouvrirEvaluation(mod)"
              :style="{ cursor: tousCoursModuleCompletes(mod) ? 'pointer' : 'not-allowed' }"
            >
              <span class="flex-shrink-0">
                <i v-if="evaluationResultats[mod.evaluation.id]?.reussite" class="bi bi-check-circle-fill text-success"></i>
                <i v-else-if="evaluationResultats[mod.evaluation.id]" class="bi bi-x-circle-fill text-danger"></i>
                <i v-else-if="mode === 'evaluation' && moduleEvaluationId === mod.evaluation.id" class="bi bi-pencil-fill text-primary"></i>
                <i v-else class="bi bi-pencil text-muted"></i>
              </span>
              <span class="small flex-grow-1">Évaluation : {{ mod.evaluation.titre }}</span>
            </div>
          </div>
        </div>
        <div v-if="modules.length === 0" class="text-center py-4 text-muted small">
          Aucun contenu disponible.
        </div>
      </aside>

      <main class="player-main flex-grow-1 d-flex flex-column" style="height: calc(100vh - 56px);">
        <div v-if="!currentCours && mode !== 'evaluation' && !showCompletion" class="text-center py-5 text-muted">
          <i class="bi bi-play-circle display-3"></i>
          <h5 class="mt-3">Sélectionnez un cours</h5>
        </div>

        <!-- Mode Évaluation -->
        <template v-if="mode === 'evaluation' && evaluationData">
          <div class="p-4 overflow-auto flex-grow-1">
            <div class="mb-4">
              <h4 class="fw-bold">{{ evaluationData.evaluation.titre }}</h4>
              <p v-if="evaluationData.evaluation.instructions" class="text-muted">{{ evaluationData.evaluation.instructions }}</p>
              <p class="text-muted small">{{ evaluationData.evaluation.questions.length }} question(s) · {{ evaluationData.evaluation.total_points }} point(s)</p>
            </div>

            <div v-if="evaluationData.resultat" class="mb-4">
              <div class="alert" :class="evaluationData.resultat.reussite ? 'alert-success' : 'alert-danger'">
                <h5 class="fw-bold mb-1">
                  <i :class="evaluationData.resultat.reussite ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'" class="me-1"></i>
                  {{ evaluationData.resultat.reussite ? 'Réussi !' : 'Non réussi' }}
                </h5>
                <p class="mb-0">Score : {{ evaluationData.resultat.score }}% · Terminé le {{ formatDate(evaluationData.resultat.termine_le) }}</p>
              </div>
              <button class="btn btn-outline-primary" @click="resetEvaluation">Recommencer l'évaluation</button>
            </div>

            <div v-else>
              <div v-for="(q, qi) in evaluationData.evaluation.questions" :key="q.id" class="card border-0 shadow-sm mb-3">
                <div class="card-body">
                  <h6 class="fw-bold mb-3">{{ qi + 1 }}. {{ q.texte }}</h6>
                  <div class="d-flex flex-column gap-2">
                    <label v-for="opt in q.options" :key="opt.value"
                      class="d-flex align-items-center gap-2 p-2 border rounded cursor-pointer"
                      :class="{ 'border-primary bg-primary bg-opacity-10': evaluationReponses[q.id] === opt.value }"
                    >
                      <input type="radio" :name="'q_' + q.id" :value="opt.value"
                        v-model="evaluationReponses[q.id]"
                        class="form-check-input m-0"
                      >
                      <span>{{ opt.label }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <button class="btn btn-success btn-lg w-100 mb-4" @click="soumettreEvaluation"
                :disabled="soumettant || Object.keys(evaluationReponses).length < evaluationData.evaluation.questions.length">
                <span v-if="soumettant" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-send-check me-1"></i>
                {{ soumettant ? 'Correction en cours...' : 'Soumettre mes réponses' }}
              </button>
            </div>
          </div>
        </template>

        <!-- Mode Cours -->
        <template v-else-if="currentCours">
          <div class="video-wrapper bg-black">
            <div v-if="currentCours.video" class="w-100 mx-auto" style="max-width: 1000px;">
              <div class="position-relative">
                <video
                  v-if="isVideoLocale(currentCours.video)"
                  ref="videoEl"
                  :src="currentCours.video"
                  controls
                  autoplay
                  class="w-100 d-block"
                  style="max-height: 60vh; outline: none;"
                  @loadedmetadata="onVideoMetaLoaded"
                  @ended="onVideoEnded"
                  @timeupdate="onTimeUpdate"
                ></video>
                <div v-else class="ratio ratio-16x9">
                  <iframe
                    :src="embedUrl(currentCours.video)"
                    class="w-100 h-100"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5 text-white-50">
              <i class="bi bi-camera-video-off display-4"></i>
              <p class="mt-2">Aucune vidéo pour ce cours</p>
            </div>
          </div>

          <!-- Compteur prochain cours -->
          <div v-if="nextCountdown > 0" class="bg-dark text-white text-center py-2 small">
            Prochain cours dans {{ nextCountdown }}s...
          </div>

          <div class="px-4 py-3 border-bottom bg-white">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5 class="fw-bold mb-1">{{ currentCours.titre }}</h5>
                <small class="text-muted">
                  <i class="bi bi-clock me-1"></i>{{ formaterDuree(dureeActuelle || currentCours.dureeMinutes) }}
                </small>
              </div>
              <span v-if="currentCours.est_complete" class="badge bg-success">
                <i class="bi bi-check-circle me-1"></i>Terminé
              </span>
            </div>
            <div v-if="currentCours.contenu" class="mt-2 text-muted small" style="white-space: pre-line;">
              {{ currentCours.contenu }}
            </div>
          </div>

          <div class="px-4 py-3 bg-white d-flex justify-content-between align-items-center" v-if="!currentCours.est_complete">
            <button class="btn btn-outline-primary" :disabled="!precedent" @click="ouvrirCours(precedent)">
              <i class="bi bi-chevron-left me-1"></i> Précédent
            </button>
            <div class="text-center text-muted small">
              <i class="bi bi-play-circle me-1"></i>Lisez la vidéo jusqu'à la fin
            </div>
            <button class="btn btn-primary" :disabled="!suivant" @click="ouvrirCours(suivant)">
              Suivant <i class="bi bi-chevron-right ms-1"></i>
            </button>
          </div>
        </template>

        <!-- Fin de formation -->
        <div v-if="showCompletion" class="px-4 py-4 text-center bg-light flex-grow-1 d-flex flex-column align-items-center justify-content-center">
          <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
            <i class="bi bi-trophy-fill text-success display-5"></i>
          </div>
          <h4 class="fw-bold">Félicitations !</h4>
          <p class="text-muted mb-1">Vous avez terminé tous les cours de cette formation.</p>
          <p class="text-muted mb-3">Votre progression est de 100%. Vous pouvez télécharger votre certificat.</p>
          <router-link :to="'/inscriptions/' + inscriptionId + '/certificat'" class="btn btn-warning btn-lg">
            <i class="bi bi-award me-1"></i> Obtenir mon certificat
          </router-link>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import formationService from '../services/formationService'

const route = useRoute()
const router = useRouter()

const inscriptionId = computed(() => parseInt(route.params.inscriptionId))
const coursInitialId = computed(() => route.params.coursId ? parseInt(route.params.coursId) : null)

const loading = ref(true)
const formationData = ref(null)
const modules = ref([])
const currentCours = ref(null)
const precedent = ref(null)
const suivant = ref(null)
const coursCompletesIds = ref([])
const completing = ref(false)
const showCompletion = ref(false)

const mode = ref('cours')
const evaluationData = ref(null)
const evaluationReponses = ref({})
const evaluationResultats = ref({})
const moduleEvaluationId = ref(null)
const soumettant = ref(false)

const videoEl = ref(null)
const dureesReelles = ref({})
const dureeActuelle = ref(null)
const nextCountdown = ref(0)
let countdownInterval = null

const progression = computed(() => formationData.value?.progression || 0)

function formaterDuree(minutes) {
  if (!minutes && minutes !== 0) return ''
  const m = Math.floor(minutes)
  if (m < 1) return Math.round(minutes * 60) + 's'
  return m + ' min'
}

function onVideoMetaLoaded() {
  if (!videoEl.value) return
  const dureeSecondes = videoEl.value.duration
  if (dureeSecondes && isFinite(dureeSecondes)) {
    const minutes = dureeSecondes / 60
    dureeActuelle.value = minutes
    if (currentCours.value) {
      dureesReelles.value[currentCours.value.id] = minutes
    }
  }
}

function onTimeUpdate() {
  if (!videoEl.value || nextCountdown.value > 0) return
}

function estComplete(coursId) {
  return coursCompletesIds.value.includes(coursId)
}

function estDebloque(coursId) {
  if (!modules.value.length) return false
  const tous = mesCoursOrdonnes()
  const index = tous.indexOf(coursId)
  if (index <= 0) return true
  return coursCompletesIds.value.includes(tous[index - 1])
}

function tousCoursModuleCompletes(mod) {
  return mod.cours.every(c => coursCompletesIds.value.includes(c.id))
}

function mesCoursOrdonnes() {
  const ids = []
  modules.value.forEach(m => m.cours.forEach(c => ids.push(c.id)))
  return ids
}

function isVideoLocale(url) {
  if (!url) return false
  const localExts = ['.mp4', '.webm', '.ogg', '.avi', '.mov']
  return localExts.some(ext => url.endsWith(ext)) || url.includes('/storage/') || url.includes('/video/')
}

function embedUrl(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/')
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1]?.split('?')[0]
    return `https://player.vimeo.com/video/${id}`
  }
  return url
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function demarrerCompteur() {
  if (countdownInterval) clearInterval(countdownInterval)
  nextCountdown.value = 5
  countdownInterval = setInterval(() => {
    nextCountdown.value--
    if (nextCountdown.value <= 0) {
      clearInterval(countdownInterval)
      countdownInterval = null
      if (suivant.value) {
        ouvrirCours(suivant.value)
      } else {
        showCompletion.value = true
      }
    }
  }, 1000)
}

async function onVideoEnded() {
  if (!currentCours.value || completing.value || nextCountdown.value > 0) return
  completing.value = true
  try {
    await formationService.completerCours(currentCours.value.id)
    const res = await formationService.getApprentissage(inscriptionId.value)
    coursCompletesIds.value = res.cours_completes_ids || []
    if (formationData.value) formationData.value.progression = res.progression
    currentCours.value.est_complete = true
    completing.value = false
    demarrerCompteur()
  } catch (e) {
    console.error('Erreur complétion cours:', e)
    completing.value = false
  }
}

async function ouvrirCours(coursId) {
  if (!coursId) return
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  nextCountdown.value = 0
  mode.value = 'cours'
  evaluationData.value = null
  showCompletion.value = false
  router.replace({
    name: 'coursPlayerCours',
    params: { inscriptionId: inscriptionId.value, coursId: coursId }
  })
  await chargerCours(coursId)
}

async function chargerCours(coursId) {
  if (!coursId) return
  try {
    const res = await formationService.getCoursCourant(inscriptionId.value, coursId)
    currentCours.value = res.cours
    precedent.value = res.precedent
    suivant.value = res.suivant
    coursCompletesIds.value = res.cours_completes_ids || []
    const learningRes = await formationService.getApprentissage(inscriptionId.value)
    formationData.value.progression = learningRes.progression
    await nextTick()
    if (videoEl.value && dureesReelles.value[coursId]) {
      dureeActuelle.value = dureesReelles.value[coursId]
    }
  } catch (e) {
    console.error('Erreur chargement cours:', e)
  }
}

async function ouvrirEvaluation(mod) {
  if (!tousCoursModuleCompletes(mod)) return
  mode.value = 'evaluation'
  currentCours.value = null
  moduleEvaluationId.value = mod.evaluation.id
  try {
    const res = await formationService.getEvaluation(mod.id)
    evaluationData.value = res
    evaluationReponses.value = {}
    if (res.resultat) {
      evaluationResultats.value[mod.evaluation.id] = res.resultat
    }
  } catch (e) {
    console.error('Erreur chargement évaluation:', e)
  }
}

async function soumettreEvaluation() {
  if (!evaluationData.value) return
  soumettant.value = true
  try {
    const reponses = Object.entries(evaluationReponses.value).map(([questionId, reponse]) => ({
      question_id: parseInt(questionId),
      reponse,
    }))
    const res = await formationService.soumettreEvaluation(evaluationData.value.evaluation.id, reponses)
    const modId = evaluationData.value.evaluation.module_id
    const mod = modules.value.find(m => m.id === modId)
    if (mod?.evaluation) {
      evaluationResultats.value[mod.evaluation.id] = {
        score: res.score,
        reussite: res.reussite,
        termine_le: new Date().toISOString(),
      }
    }
    await ouvrirEvaluation(modules.value.find(m => m.id === modId))
  } catch (e) {
    console.error('Erreur soumission évaluation:', e)
  } finally {
    soumettant.value = false
  }
}

function resetEvaluation() {
  evaluationReponses.value = {}
  evaluationData.value = { ...evaluationData.value, resultat: null }
}

const accessError = ref(null)

async function chargerApprentissage() {
  loading.value = true
  accessError.value = null
  try {
    const res = await formationService.getApprentissage(inscriptionId.value)
    formationData.value = { ...res.formation, progression: res.progression }
    modules.value = res.modules
    coursCompletesIds.value = res.cours_completes_ids || []

    let coursTarget = coursInitialId.value
    if (!coursTarget) {
      coursTarget = res.premier_cours_non_complete || res.premier_cours
    }
    if (coursTarget) await chargerCours(coursTarget)
    if ((res.progression || 0) === 100) showCompletion.value = true
  } catch (e) {
    console.error('Erreur chargement apprentissage:', e)
    if (e.response?.data?.code === 'PAYMENT_REQUIRED') {
      accessError.value = {
        title: 'Paiement requis',
        message: e.response.data.message || 'Veuillez finaliser votre paiement pour accéder aux cours.',
        action: 'payer',
      }
    } else if (e.response?.status === 403) {
      accessError.value = {
        title: 'Accès refusé',
        message: e.response.data?.message || 'Vous n\'avez pas accès à cette formation.',
        action: 'inscription',
      }
    } else {
      accessError.value = {
        title: 'Erreur',
        message: 'Impossible de charger la formation.',
        action: null,
      }
    }
    formationData.value = null
  } finally {
    loading.value = false
  }
}

onMounted(chargerApprentissage)
</script>

<style scoped>
.player-container { background: #f5f5f5; min-height: 100vh; }
.player-header { position: sticky; top: 0; z-index: 10; }
.player-sidebar { scrollbar-width: thin; }
.cours-item { transition: background-color 0.15s; }
.cours-item:hover:not(.text-muted) { background-color: rgba(13, 110, 253, 0.05); }
.cours-item.active { background-color: rgba(13, 110, 253, 0.1); border-left: 3px solid #0d6efd; }
.video-wrapper { background: #000; }
video:focus { outline: none; }
.progress { border-radius: 10px; }
</style>
