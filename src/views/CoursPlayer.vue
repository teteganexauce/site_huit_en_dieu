<template>
  <div v-if="loading" class="cp-loading">
    <div class="cp-spinner"></div>
    <p>Chargement de votre formation…</p>
  </div>

  <div v-else-if="accessError" class="cp-state-screen">
    <div class="cp-state-card">
      <div class="cp-state-icon" :class="accessError.action === 'payer' ? 'is-warning' : 'is-danger'">
        <i v-if="accessError.action === 'payer'" class="bi bi-credit-card"></i>
        <i v-else class="bi bi-lock-fill"></i>
      </div>
      <h4>{{ accessError.title }}</h4>
      <p>{{ accessError.message }}</p>
      <div class="cp-state-actions">
        <router-link to="/formations" class="cp-btn cp-btn-ghost">
          <i class="bi bi-arrow-left me-1"></i>Voir les formations
        </router-link>
        <router-link
          v-if="accessError.action === 'payer'"
          :to="'/formations/' + (formationData?.id || route.params.inscriptionId)"
          class="cp-btn cp-btn-warning"
        >
          <i class="bi bi-credit-card me-1"></i>Finaliser le paiement
        </router-link>
      </div>
    </div>
  </div>

  <div v-else-if="!formationData" class="cp-state-screen">
    <div class="cp-state-card">
      <h5>Formation introuvable</h5>
      <router-link to="/formations" class="cp-btn cp-btn-primary mt-3">Voir les formations</router-link>
    </div>
  </div>

  <div v-else class="cp-player">
    <!-- En-tête -->
    <header class="cp-header">
      <div class="cp-header-left">
        <router-link :to="'/formations/' + formationData.id" class="cp-icon-btn" aria-label="Retour à la formation">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div class="cp-header-title">
          <h6>{{ formationData.titre }}</h6>
          <span>{{ Math.round(progression) }}% complété</span>
        </div>
      </div>

      <div class="cp-header-right">
        <div class="cp-ring" role="img" :aria-label="`Progression ${Math.round(progression)}%`">
          <svg viewBox="0 0 44 44">
            <circle class="cp-ring-track" cx="22" cy="22" r="18" />
            <circle
              class="cp-ring-fill"
              cx="22" cy="22" r="18"
              :style="{ strokeDasharray: ringCircumference, strokeDashoffset: ringOffset }"
            />
          </svg>
          <span>{{ Math.round(progression) }}%</span>
        </div>
      </div>
    </header>

    <div class="cp-body">
      <!-- Sommaire -->
      <aside class="cp-sidebar" :class="{ 'is-open': sidebarOuvert }">
        <div class="cp-sidebar-head cp-only-mobile" @click="toggleSidebar">
          <span><i class="bi bi-list-ul me-2"></i>Sommaire</span>
          <i class="bi bi-chevron-down cp-sidebar-chevron"></i>
        </div>

        <div class="cp-sidebar-scroll">
          <div v-for="(mod, mi) in modules" :key="mod.id" class="cp-module">
            <div class="cp-module-head">
              <span class="cp-module-index">{{ String(mi + 1).padStart(2, '0') }}</span>
              <span class="cp-module-title">{{ mod.titre }}</span>
            </div>

            <button
              v-for="c in mod.cours"
              :key="c.id"
              type="button"
              class="cp-lesson"
              :class="{
                'is-active': mode === 'cours' && currentCours?.id === c.id,
                'is-locked': !estDebloque(c.id) && !(mode === 'cours' && currentCours?.id === c.id),
                'is-done': estComplete(c.id),
              }"
              :disabled="!estDebloque(c.id) && !(mode === 'cours' && currentCours?.id === c.id)"
              @click="ouvrirCours(c.id)"
            >
              <span class="cp-lesson-icon">
                <i v-if="estComplete(c.id)" class="bi bi-check-lg"></i>
                <i v-else-if="mode === 'cours' && currentCours?.id === c.id" class="bi bi-play-fill"></i>
                <i v-else-if="estDebloque(c.id)" class="bi bi-circle"></i>
                <i v-else class="bi bi-lock-fill"></i>
              </span>
              <span class="cp-lesson-label">{{ c.titre }}</span>
              <span class="cp-lesson-duration">{{ formaterDuree(dureesReelles[c.id] || c.dureeMinutes) }}</span>
            </button>

          </div>

          <div v-if="formationEvaluations.length > 0" class="cp-eval-section">
            <div class="cp-eval-section-title">Évaluations</div>
            <button
              v-for="ev in formationEvaluations"
              :key="ev.id"
              type="button"
              class="cp-lesson cp-lesson-eval"
              :class="{ 'is-active': mode === 'evaluation' && moduleEvaluationId === ev.id }"
              @click="ouvrirEvaluationById(ev.id)"
            >
              <span class="cp-lesson-icon">
                <i v-if="ev.reussite" class="bi bi-check-lg"></i>
                <i v-else-if="ev.nb_tentatives > 0" class="bi bi-x-lg"></i>
                <i v-else class="bi bi-pencil"></i>
              </span>
              <span class="cp-lesson-label">{{ ev.titre }}</span>
              <span v-if="ev.nb_tentatives > 0" class="cp-lesson-duration">{{ ev.dernier_score }}%</span>
            </button>
          </div>

          <div v-if="modules.length === 0" class="cp-empty">Aucun contenu disponible.</div>
        </div>
      </aside>

      <!-- Contenu principal -->
      <main class="cp-main">
        <div v-if="!currentCours && mode !== 'evaluation' && !showCompletion" class="cp-placeholder">
          <i class="bi bi-play-circle"></i>
          <h5>Sélectionnez un cours pour commencer</h5>
        </div>

        <!-- Mode Évaluation -->
        <template v-if="mode === 'evaluation' && evaluationData">
          <div class="cp-scroll-area">
            <div class="cp-eval-header">
              <h4>{{ evaluationData.evaluation.titre }}</h4>
              <p v-if="evaluationData.evaluation.instructions">{{ evaluationData.evaluation.instructions }}</p>
              <span class="cp-eval-meta">
                {{ evaluationData.evaluation.questions.length }} question(s) · {{ evaluationData.evaluation.total_points }} point(s)
              </span>
            </div>

            <div v-if="evaluationData.resultat" class="cp-result" :class="evaluationData.resultat.reussite ? 'is-success' : 'is-fail'">
              <div class="cp-result-icon">
                <i :class="evaluationData.resultat.reussite ? 'bi bi-check-lg' : 'bi bi-x-lg'"></i>
              </div>
              <div>
                <h5>{{ evaluationData.resultat.reussite ? 'Réussi !' : 'Non réussi' }}</h5>
                <p>Score : {{ evaluationData.resultat.score }}% · Terminé le {{ formatDate(evaluationData.resultat.termine_le) }}</p>
              </div>
              <button class="cp-btn cp-btn-ghost cp-ms-auto" @click="resetEvaluation">Recommencer</button>
            </div>

            <div v-else>
              <div v-for="(q, qi) in evaluationData.evaluation.questions" :key="q.id" class="cp-question">
                <h6>{{ qi + 1 }}. {{ q.texte }}</h6>
                <label
                  v-for="opt in q.options"
                  :key="opt.value"
                  class="cp-option"
                  :class="{ 'is-selected': evaluationReponses[q.id] === opt.value }"
                >
                  <input
                    type="radio"
                    :name="'q_' + q.id"
                    :value="opt.value"
                    v-model="evaluationReponses[q.id]"
                  >
                  <span class="cp-option-dot"></span>
                  <span>{{ opt.label }}</span>
                </label>
              </div>

              <button
                class="cp-btn cp-btn-success cp-btn-block"
                @click="soumettreEvaluation"
                :disabled="soumettant || Object.keys(evaluationReponses).length < evaluationData.evaluation.questions.length"
              >
                <span v-if="soumettant" class="cp-spinner cp-spinner-sm"></span>
                <i v-else class="bi bi-send-check me-1"></i>
                {{ soumettant ? 'Correction en cours…' : 'Soumettre mes réponses' }}
              </button>
            </div>
          </div>
        </template>

        <!-- Mode Cours -->
        <template v-else-if="currentCours">
          <div class="cp-video-zone">
            <div v-if="currentCours.video" class="cp-video-frame">
              <video
                v-if="isVideoLocale(currentCours.video)"
                ref="videoEl"
                :src="currentCours.video"
                controls
                autoplay
                class="cp-video"
                @loadedmetadata="onVideoMetaLoaded"
                @ended="onVideoEnded"
                @timeupdate="onTimeUpdate"
              ></video>
              <div v-else class="ratio ratio-16x9">
                <iframe :src="embedUrl(currentCours.video)" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>
            <div v-else class="cp-no-video">
              <i class="bi bi-camera-video-off"></i>
              <p>Aucune vidéo pour ce cours</p>
            </div>

            <transition name="cp-slide-up">
              <div v-if="nextCountdown > 0" class="cp-countdown">
                <i class="bi bi-arrow-right-circle"></i> Prochain cours dans {{ nextCountdown }}s…
              </div>
            </transition>
          </div>

          <div class="cp-lesson-info">
            <div class="cp-lesson-info-top">
              <div>
                <h5>{{ currentCours.titre }}</h5>
                <span class="cp-lesson-meta"><i class="bi bi-clock me-1"></i>{{ formaterDuree(dureeActuelle || currentCours.dureeMinutes) }}</span>
              </div>
              <span v-if="currentCours.est_complete" class="cp-badge-done">
                <i class="bi bi-check-circle me-1"></i>Terminé
              </span>
            </div>
            <p v-if="currentCours.contenu" class="cp-lesson-desc">{{ currentCours.contenu }}</p>
          </div>

          <div v-if="!currentCours.est_complete" class="cp-nav-bar">
            <button class="cp-btn cp-btn-ghost" :disabled="!precedent" @click="ouvrirCours(precedent)">
              <i class="bi bi-chevron-left me-1"></i>Précédent
            </button>
            <span class="cp-nav-hint"><i class="bi bi-play-circle me-1"></i>Lisez la vidéo jusqu'à la fin</span>
            <button class="cp-btn cp-btn-primary" :disabled="!suivant" @click="ouvrirCours(suivant)">
              Suivant<i class="bi bi-chevron-right ms-1"></i>
            </button>
          </div>
        </template>

        <!-- Fin de formation -->
        <div v-if="showCompletion" class="cp-completion">
          <div class="cp-completion-glow"></div>
          <div class="cp-trophy"><i class="bi bi-trophy-fill"></i></div>
          <h4>Félicitations !</h4>
          <p>Vous avez terminé tous les cours de cette formation.</p>
          <p class="cp-completion-sub">Votre progression est de 100&nbsp;%. Vous pouvez télécharger votre certificat.</p>
          <router-link :to="{ name: 'certificat', params: { id: inscriptionId } }" class="cp-btn cp-btn-warning cp-btn-lg">
            <i class="bi bi-award me-1"></i>Obtenir mon certificat
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
const formationEvaluations = ref([])
const soumettant = ref(false)

const videoEl = ref(null)
const dureesReelles = ref({})
const dureeActuelle = ref(null)
const nextCountdown = ref(0)
let countdownInterval = null

// --- UI: sommaire repliable sur mobile ---
const sidebarOuvert = ref(false)
function toggleSidebar() {
  sidebarOuvert.value = !sidebarOuvert.value
}

// --- UI: anneau de progression dans l'en-tête ---
const RING_RADIUS = 18
const ringCircumference = 2 * Math.PI * RING_RADIUS
const ringOffset = computed(() => ringCircumference * (1 - Math.min(progression.value, 100) / 100))

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
  sidebarOuvert.value = false
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

async function ouvrirEvaluationById(evaluationId) {
  mode.value = 'evaluation'
  currentCours.value = null
  moduleEvaluationId.value = evaluationId
  sidebarOuvert.value = false
  try {
    const res = await formationService.getEvaluationById(evaluationId)
    evaluationData.value = res
    evaluationReponses.value = {}
    if (res.resultat) {
      evaluationResultats.value[evaluationId] = res.resultat
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
    await ouvrirEvaluationById(evaluationData.value.evaluation.id)

    const learningRes = await formationService.getApprentissage(inscriptionId.value)
    formationEvaluations.value = learningRes.evaluations || []
    if (formationData.value) formationData.value.progression = learningRes.progression
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
    formationEvaluations.value = res.evaluations || []
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
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

.cp-player {
  /* Hauteur approximative de ta navbar globale (logo HED). Sert uniquement
     à décaler le header sticky et le sommaire sticky sous cette navbar —
     si la valeur n'est pas parfaite, l'effet "collant" sera juste un peu
     décalé, ça ne cassera plus jamais la mise en page. */
  --site-header-h: 72px;

  --cp-primary: #2952E3;
  --cp-primary-dark: #1B3AAE;
  --cp-ink: #14182B;
  --cp-muted: #6B7280;
  --cp-bg: #F4F6FB;
  --cp-surface: #FFFFFF;
  --cp-border: #E6E9F2;
  --cp-success: #17A672;
  --cp-danger: #E5484D;
  --cp-warning: #F5A623;
  --cp-radius: 14px;

  font-family: 'Inter', system-ui, sans-serif;
  color: var(--cp-ink);
  background: var(--cp-bg);
  /* Le lecteur suit le flux normal de la page : pas de hauteur forcée,
     pas d'overflow caché. C'est ce qui garantit qu'il ne peut plus jamais
     recouvrir ou être recouvert par le footer du site. */
  display: block;
  position: relative;
}

.cp-player h4, .cp-player h5, .cp-player h6 {
  font-family: 'Manrope', 'Inter', system-ui, sans-serif;
  letter-spacing: -0.01em;
}

/* ---------- En-tête ---------- */
.cp-header {
  position: sticky;
  top: var(--site-header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px;
  background: var(--cp-surface);
  border-bottom: 1px solid var(--cp-border);
  z-index: 5;
}
.cp-header-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.cp-header-title { min-width: 0; }
.cp-header-title h6 {
  margin: 0; font-weight: 700; font-size: 0.95rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 46vw;
}
.cp-header-title span { font-size: 0.75rem; color: var(--cp-muted); }

.cp-icon-btn {
  width: 36px; height: 36px; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 10px; border: 1px solid var(--cp-border);
  background: var(--cp-surface); color: var(--cp-ink);
  text-decoration: none; cursor: pointer; transition: background .15s, border-color .15s;
}
.cp-icon-btn:hover { background: #F0F3FF; border-color: var(--cp-primary); color: var(--cp-primary); }
.cp-only-mobile { display: none; }

.cp-ring { position: relative; width: 44px; height: 44px; flex-shrink: 0; }
.cp-ring svg { width: 44px; height: 44px; transform: rotate(-90deg); }
.cp-ring-track { fill: none; stroke: var(--cp-border); stroke-width: 4; }
.cp-ring-fill {
  fill: none; stroke: var(--cp-success); stroke-width: 4; stroke-linecap: round;
  transition: stroke-dashoffset .5s ease;
}
.cp-ring span {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 0.62rem; font-weight: 800; color: var(--cp-ink);
}

/* ---------- Corps ---------- */
.cp-body { display: flex; align-items: flex-start; }

/* ---------- Sommaire ---------- */
.cp-sidebar {
  width: 320px; flex-shrink: 0;
  background: var(--cp-surface);
  border-right: 1px solid var(--cp-border);
  position: sticky;
  top: calc(var(--site-header-h) + 57px);
  max-height: calc(100vh - var(--site-header-h) - 57px);
  display: flex; flex-direction: column;
}
.cp-sidebar-head { display: none; }
.cp-sidebar-scroll {
  overflow-y: auto; padding: 14px 10px;
  scrollbar-width: thin;
}
.cp-module { margin-bottom: 18px; }
.cp-module-head {
  display: flex; align-items: baseline; gap: 8px;
  padding: 6px 10px 10px;
}
.cp-module-index { font-weight: 800; font-size: 0.72rem; color: var(--cp-primary); }
.cp-module-title {
  font-weight: 700; font-size: 0.72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--cp-muted);
}

.cp-lesson {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 10px 10px; margin-bottom: 3px;
  border: none; border-radius: 10px; background: transparent;
  text-align: left; cursor: pointer; font: inherit; color: var(--cp-ink);
  border-left: 3px solid transparent;
  transition: background .15s, border-color .15s;
}
.cp-lesson:hover:not(:disabled) { background: #F0F3FF; }
.cp-lesson.is-active { background: #EAF0FF; border-left-color: var(--cp-primary); }
.cp-lesson.is-active .cp-lesson-label { color: var(--cp-primary); font-weight: 700; }
.cp-lesson:disabled { cursor: not-allowed; color: #ADB2C0; }
.cp-lesson.is-done .cp-lesson-icon { color: var(--cp-success); }
.cp-lesson-icon {
  flex-shrink: 0; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.85rem; color: var(--cp-muted);
}
.cp-lesson.is-active .cp-lesson-icon { color: var(--cp-primary); }
.cp-lesson-label { flex: 1; font-size: 0.85rem; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cp-lesson-duration { font-size: 0.72rem; color: var(--cp-muted); flex-shrink: 0; }
.cp-lesson-eval { border-top: 1px dashed var(--cp-border); margin-top: 4px; padding-top: 12px; }

.cp-empty { text-align: center; padding: 40px 10px; color: var(--cp-muted); font-size: 0.85rem; }

.cp-eval-section {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 2px solid var(--cp-border);
}
.cp-eval-section-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--cp-muted);
  padding: 6px 10px 10px;
}

/* ---------- Zone principale ---------- */
.cp-main { flex: 1; min-width: 0; }
.cp-scroll-area { padding: 28px; max-width: 900px; margin: 0 auto; width: 100%; }

.cp-placeholder {
  min-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: var(--cp-muted); gap: 10px;
}
.cp-placeholder i { font-size: 3rem; color: #C7CCDA; }
.cp-placeholder h5 { margin: 0; font-weight: 600; }

.cp-video-zone { position: relative; background: #0B0D17; }
.cp-video-frame { max-width: 1000px; margin: 0 auto; }
.cp-video { width: 100%; display: block; max-height: 64vh; outline: none; background: #000; }
.cp-no-video {
  padding: 70px 20px; text-align: center; color: rgba(255,255,255,.5);
}
.cp-no-video i { font-size: 2.4rem; }

.cp-countdown {
  position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%);
  background: rgba(20,24,43,.92); color: #fff; padding: 8px 18px; border-radius: 999px;
  font-size: 0.82rem; display: flex; align-items: center; gap: 6px; white-space: nowrap;
}
.cp-slide-up-enter-active, .cp-slide-up-leave-active { transition: all .25s ease; }
.cp-slide-up-enter-from, .cp-slide-up-leave-to { opacity: 0; transform: translate(-50%, 10px); }

.cp-lesson-info {
  padding: 18px 24px; background: var(--cp-surface); border-bottom: 1px solid var(--cp-border);
}
.cp-lesson-info-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.cp-lesson-info-top h5 { margin: 0 0 4px; font-weight: 700; }
.cp-lesson-meta { font-size: 0.8rem; color: var(--cp-muted); }
.cp-lesson-desc { margin: 10px 0 0; color: var(--cp-muted); font-size: 0.88rem; white-space: pre-line; }
.cp-badge-done {
  flex-shrink: 0; background: #E6F7EF; color: var(--cp-success); font-weight: 700;
  font-size: 0.75rem; padding: 5px 10px; border-radius: 999px;
}

.cp-nav-bar {
  padding: 14px 24px; background: var(--cp-surface);
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  border-top: 1px solid var(--cp-border);
}
.cp-nav-hint { font-size: 0.78rem; color: var(--cp-muted); display: none; }

/* ---------- Boutons ---------- */
.cp-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.86rem;
  padding: 9px 18px; border-radius: 10px; border: 1px solid transparent;
  cursor: pointer; text-decoration: none; transition: transform .1s, box-shadow .15s, background .15s;
}
.cp-btn:disabled { opacity: .45; cursor: not-allowed; }
.cp-btn:active:not(:disabled) { transform: translateY(1px); }
.cp-btn-primary { background: var(--cp-primary); color: #fff; }
.cp-btn-primary:hover:not(:disabled) { background: var(--cp-primary-dark); }
.cp-btn-success { background: var(--cp-success); color: #fff; }
.cp-btn-success:hover:not(:disabled) { background: #128A5D; }
.cp-btn-warning { background: var(--cp-warning); color: #fff; }
.cp-btn-warning:hover:not(:disabled) { background: #DB9515; }
.cp-btn-ghost { background: var(--cp-surface); color: var(--cp-ink); border-color: var(--cp-border); }
.cp-btn-ghost:hover:not(:disabled) { border-color: var(--cp-primary); color: var(--cp-primary); }
.cp-btn-block { width: 100%; padding: 13px; margin-bottom: 30px; }
.cp-btn-lg { padding: 13px 26px; font-size: 0.95rem; }
.cp-ms-auto { margin-left: auto; }

/* ---------- Évaluation ---------- */
.cp-eval-header { margin-bottom: 22px; }
.cp-eval-header h4 { font-weight: 800; margin-bottom: 6px; }
.cp-eval-header p { color: var(--cp-muted); margin-bottom: 6px; }
.cp-eval-meta { font-size: 0.8rem; color: var(--cp-muted); }

.cp-result {
  display: flex; align-items: center; gap: 14px; padding: 18px 20px;
  border-radius: var(--cp-radius); margin-bottom: 20px;
}
.cp-result.is-success { background: #E6F7EF; }
.cp-result.is-fail { background: #FDEBEC; }
.cp-result-icon {
  width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
}
.cp-result.is-success .cp-result-icon { background: var(--cp-success); }
.cp-result.is-fail .cp-result-icon { background: var(--cp-danger); }
.cp-result h5 { margin: 0 0 2px; font-weight: 700; }
.cp-result p { margin: 0; font-size: 0.85rem; color: var(--cp-muted); }

.cp-question {
  background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: var(--cp-radius);
  padding: 18px 20px; margin-bottom: 14px;
}
.cp-question h6 { font-weight: 700; margin-bottom: 14px; }
.cp-option {
  display: flex; align-items: center; gap: 10px; padding: 11px 14px; margin-bottom: 8px;
  border: 1px solid var(--cp-border); border-radius: 10px; cursor: pointer; transition: border-color .15s, background .15s;
}
.cp-option:hover { border-color: var(--cp-primary); }
.cp-option.is-selected { border-color: var(--cp-primary); background: #F0F3FF; }
.cp-option input { position: absolute; opacity: 0; width: 0; height: 0; }
.cp-option-dot {
  width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--cp-border); flex-shrink: 0; position: relative;
}
.cp-option.is-selected .cp-option-dot { border-color: var(--cp-primary); }
.cp-option.is-selected .cp-option-dot::after {
  content: ''; position: absolute; inset: 3px; border-radius: 50%; background: var(--cp-primary);
}

/* ---------- Fin de formation ---------- */
.cp-completion {
  min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 40px 20px; position: relative; overflow: hidden;
}
.cp-completion-glow {
  position: absolute; top: -120px; left: 50%; transform: translateX(-50%);
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(41,82,227,.12), transparent 70%);
}
.cp-trophy {
  width: 84px; height: 84px; border-radius: 50%;
  background: linear-gradient(145deg, #FFF3DA, #FFE3A8);
  display: flex; align-items: center; justify-content: center; margin-bottom: 18px; position: relative;
}
.cp-trophy i { font-size: 2.1rem; color: var(--cp-warning); }
.cp-completion h4 { font-weight: 800; margin-bottom: 6px; position: relative; }
.cp-completion p { color: var(--cp-muted); margin: 0 0 2px; max-width: 420px; position: relative; }
.cp-completion-sub { margin-bottom: 20px !important; }

/* ---------- États (erreur / introuvable) ---------- */
.cp-state-screen { display: flex; align-items: center; justify-content: center; min-height: 70vh; padding: 20px; font-family: 'Inter', sans-serif; }
.cp-state-card {
  max-width: 440px; width: 100%; text-align: center; background: #fff;
  border: 1px solid #E6E9F2; border-radius: 18px; padding: 40px 32px;
  box-shadow: 0 10px 30px -12px rgba(20,24,43,.12);
}
.cp-state-icon {
  width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 16px;
  display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
}
.cp-state-icon.is-warning { background: #FFF3DA; color: #F5A623; }
.cp-state-icon.is-danger { background: #FDEBEC; color: #E5484D; }
.cp-state-card h4, .cp-state-card h5 { font-family: 'Manrope', sans-serif; font-weight: 800; margin-bottom: 8px; }
.cp-state-card p { color: #6B7280; margin-bottom: 22px; }
.cp-state-actions { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }

/* ---------- Chargement ---------- */
.cp-loading {
  min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; color: #6B7280; font-family: 'Inter', sans-serif;
}
.cp-spinner {
  width: 34px; height: 34px; border-radius: 50%; border: 3px solid #E6E9F2; border-top-color: #2952E3;
  animation: cp-spin .8s linear infinite;
}
.cp-spinner-sm { width: 15px; height: 15px; border-width: 2px; }
@keyframes cp-spin { to { transform: rotate(360deg); } }

/* ============ RESPONSIVE ============ */
@media (max-width: 991px) {
  .cp-header-title h6 { max-width: 40vw; }
}

@media (max-width: 767px) {
  .cp-header { padding: 10px 14px; }
  .cp-header-title h6 { max-width: 46vw; font-size: 0.88rem; }

  /* Le sommaire passe d'une colonne latérale à un panneau repliable,
     toujours dans le flux normal de la page (pas de position fixed,
     pas de backdrop) : il ne peut plus jamais se superposer à autre chose. */
  .cp-body { flex-direction: column; }
  .cp-sidebar {
    width: 100%; position: static; max-height: none;
    border-right: none; border-bottom: 1px solid var(--cp-border);
  }
  .cp-sidebar-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; font-weight: 700; cursor: pointer;
  }
  .cp-sidebar-chevron { transition: transform .2s; color: var(--cp-muted); }
  .cp-sidebar:not(.is-open) .cp-sidebar-chevron { transform: rotate(-90deg); }
  .cp-sidebar-scroll { display: none; max-height: 60vh; }
  .cp-sidebar.is-open .cp-sidebar-scroll { display: block; overflow-y: auto; }

  .cp-scroll-area { padding: 18px 16px; }
  .cp-video { max-height: 42vh; }
  .cp-lesson-info { padding: 14px 16px; }
  .cp-nav-bar { padding: 12px 16px; }
  .cp-nav-hint { display: none; }
  .cp-btn { padding: 10px 14px; font-size: 0.82rem; }
  .cp-completion { padding: 30px 16px; }
}
</style>