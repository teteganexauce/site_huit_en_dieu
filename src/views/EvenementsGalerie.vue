<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'
import defaultImg from '../assets/img/blog/blog-3.jpg'

const events = ref([])
const isLoading = ref(true)
const selectedEvent = ref(null)
const similaires = ref([])
const filtreActif = ref('tout')
const searchQuery = ref('')
const playVideo = ref(false)
const videoTimer = ref(null)
const videoEnded = ref(false)

const maintenant = computed(() => new Date())

const filtres = [
  { key: 'tout', label: 'Tous' },
  { key: 'avenir', label: 'À venir' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'passes', label: 'Passés' },
]

const annees = computed(() => {
  const set = new Set()
  events.value.forEach(e => {
    if (e.dateDebut) set.add(new Date(e.dateDebut).getFullYear())
  })
  return [...set].sort((a, b) => b - a)
})

const anneeActive = ref(null)

const eventsFiltres = computed(() => {
  let liste = events.value

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    liste = liste.filter(e =>
      e.titre?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.lieu?.toLowerCase().includes(q)
    )
  }

  if (filtreActif.value === 'avenir') {
    liste = liste.filter(e => e.dateDebut && new Date(e.dateDebut) > maintenant.value)
  } else if (filtreActif.value === 'en_cours') {
    liste = liste.filter(e => {
      const debut = e.dateDebut ? new Date(e.dateDebut) : null
      const fin = e.dateFin ? new Date(e.dateFin) : null
      return debut && debut <= maintenant.value && (!fin || fin >= maintenant.value)
    })
  } else if (filtreActif.value === 'passes') {
    liste = liste.filter(e => {
      const fin = e.dateFin || e.dateDebut
      return fin && new Date(fin) < maintenant.value
    })
  }

  if (anneeActive.value) {
    liste = liste.filter(e => {
      const d = e.dateDebut ? new Date(e.dateDebut).getFullYear() : null
      return d === anneeActive.value
    })
  }

  return liste
})

const lightboxUrl = ref(null)

const firstVideo = computed(() => {
  if (!selectedEvent.value?.media?.length) return null
  return selectedEvent.value.media.find(m => m.type === 'video') || null
})

function isExternalUrl(url) {
  return url?.includes('youtube') || url?.includes('youtu.be') || url?.includes('vimeo') || url?.includes('dailymotion')
}

function onVideoEnded() {
  playVideo.value = false
  videoEnded.value = true
  setTimeout(() => { videoEnded.value = false }, 300)
}

function handleYouTubeMessage(event) {
  if (!firstVideo.value || !isExternalUrl(firstVideo.value.url)) return
  try {
    const data = JSON.parse(event.data)
    if (data.event === 'onStateChange' && data.info === 0) {
      onVideoEnded()
    }
  } catch {}
}

function startVideoTimer() {
  stopVideoTimer()
  playVideo.value = false
  videoEnded.value = false
  videoTimer.value = setTimeout(() => {
    if (firstVideo.value) {
      playVideo.value = true
    }
  }, 5000)
}

function stopVideoTimer() {
  if (videoTimer.value) {
    clearTimeout(videoTimer.value)
    videoTimer.value = null
  }
}

function openLightbox(url) {
  lightboxUrl.value = url
}

function closeLightbox() {
  lightboxUrl.value = null
}

function selectEvent(event) {
  selectedEvent.value = event
  playVideo.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
  startVideoTimer()
  if (event?.id) {
    publicService.getEventSimilaires(event.id).then(data => {
      similaires.value = data.data || data || []
    }).catch(() => {
      similaires.value = []
    })
  }
}

function closeDetail() {
  selectedEvent.value = null
  similaires.value = []
  stopVideoTimer()
  playVideo.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function getJour(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).getDate()
}

function getMois(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short' })
}

function estPasse(dateFin, dateDebut) {
  const fin = dateFin || dateDebut
  return fin && new Date(fin) < maintenant.value
}

function getImageUrl(item) {
  return item.imageUrl || defaultImg
}

function classerParDate(liste) {
  return [...liste].sort((a, b) => new Date(b.dateDebut || b.created_at) - new Date(a.dateDebut || a.created_at))
}

onMounted(async () => {
  try {
    const data = await publicService.getEvents({ limit: 100 })
    events.value = data.data || data || []
    if (annees.value.length > 0) {
      anneeActive.value = annees.value[0]
    }
  } catch (error) {
    console.error('Erreur chargement événements:', error)
  } finally {
    isLoading.value = false
  }
  window.addEventListener('message', handleYouTubeMessage)
})

onUnmounted(() => {
  stopVideoTimer()
  window.removeEventListener('message', handleYouTubeMessage)
})
</script>

<template>
  <div v-if="!selectedEvent">
    <BreadcombsComponent title="Évènements" />

    <div class="bg-ps-primary py-4 pb-0">
      <div class="container">
        <p class="text-white-300 mb-3 text-white font-bold">Découvrez nos prochains rendez-vous et revivez nos moments forts</p>
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3">
          <div class="nav nav-pills gap-1" role="tablist">
            <button v-for="f in filtres" :key="f.key"
                    class="nav-link px-3 text-white border-0"
                    :class="filtreActif === f.key ? 'active bg-white text-dark' : ''"
                    @click="filtreActif = f.key">{{ f.label }}</button>
          </div>
          <div class="input-group" style="max-width:280px">
            <span class="input-group-text bg-white border-end-0"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <input type="text" class="form-control border-start-0 ps-0" placeholder="Rechercher..." v-model="searchQuery">
          </div>
        </div>
        <div v-if="annees.length > 1" class="d-flex gap-2 pb-2 flex-wrap">
          <button v-for="an in annees" :key="an"
                  class="btn btn-sm px-3"
                  :class="anneeActive === an ? 'btn-light' : 'btn-outline-light text-white border-white'"
                  @click="anneeActive = an">{{ an }}</button>
        </div>
      </div>
    </div>

    <div class="container my-5">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div>
      </div>

      <div v-else-if="eventsFiltres.length === 0" class="text-center py-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-muted mb-3"><rect x="4" y="5" width="16" height="16" rx="2"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="4" y1="11" x2="20" y2="11"/></svg>
        <p class="text-muted fs-5 mb-0">Aucun évènement trouvé</p>
      </div>

      <div v-else class="row g-4">
        <div v-for="event in classerParDate(eventsFiltres)" :key="event.id" class="col-lg-4 col-md-6">
          <div class="card border-0 shadow-sm h-100 overflow-hidden event-card" @click="selectEvent(event)">
            <div class="position-relative overflow-hidden" style="height:220px">
              <img :src="getImageUrl(event)" :alt="event.titre" class="w-100 h-100" style="object-fit:cover;transition:.4s">
              <div class="position-absolute top-0 start-0 bg-white rounded-end-3 px-3 py-2 text-center" style="min-width:56px">
                <div class="fw-bold fs-5 lh-1">{{ getJour(event.dateDebut) }}</div>
                <div class="small text-uppercase text-muted lh-1">{{ getMois(event.dateDebut) }}</div>
              </div>
              <span v-if="estPasse(event.dateFin, event.dateDebut)"
                    class="position-absolute top-0 end-0 badge bg-dark bg-opacity-75 m-2 px-3 py-1">Passé</span>
              <span v-else class="position-absolute top-0 end-0 badge bg-success bg-opacity-75 m-2 px-3 py-1">À venir</span>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-semibold mb-2">{{ event.titre }}</h5>
              <p class="card-text text-muted small flex-grow-1 mb-3">{{ event.description?.substring(0, 120) }}{{ event.description?.length > 120 ? '...' : '' }}</p>
              <div class="d-flex flex-wrap gap-2 mt-auto">
                <span v-if="event.lieu" class="small text-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .212l-6.364 6.364l-6.364 -6.364a9 9 0 1 1 12.728 -12.731z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                  {{ event.lieu }}
                </span>
                <span v-if="event.media?.length" class="ms-auto d-flex gap-2">
                  <span v-if="event.images?.length" class="small text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="4" y1="16" x2="10" y2="10"/><circle cx="8" cy="8" r="1"/><line x1="14" y1="16" x2="19" y2="11"/><line x1="19" y1="13" x2="20" y2="12"/></svg>
                    {{ event.images.length }}
                  </span>
                  <span v-if="event.videos?.length" class="small text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    {{ event.videos.length }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <BreadcombsComponent :title="selectedEvent.titre" />
    <div class="container my-5">
      <button class="btn btn-outline-secondary btn-sm mb-4 px-3" @click="closeDetail">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0"/><path d="M5 12l6 6"/><path d="M5 12l6 -6"/></svg>
        Retour aux évènements
      </button>

      <div class="row g-5">
        <div class="col-lg-8">
          <div v-if="selectedEvent.imageUrl || firstVideo" class="rounded-4 overflow-hidden shadow-sm mb-4 position-relative" style="aspect-ratio:16/9;max-height:500px;background:#000">
            <img v-if="!playVideo && selectedEvent.imageUrl" :src="getImageUrl(selectedEvent)" :alt="selectedEvent.titre" class="w-100 h-100" style="object-fit:cover">
            <iframe v-if="playVideo && firstVideo && isExternalUrl(firstVideo.url)" :src="(firstVideo.url.includes('youtube') ? firstVideo.url.replace('watch?v=', 'embed/').split('&')[0] : firstVideo.url) + (firstVideo.url.includes('youtube') ? '?enablejsapi=1&autoplay=1' : '')" class="w-100 h-100" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>
            <video v-if="playVideo && firstVideo && !isExternalUrl(firstVideo.url)" :src="firstVideo.url" class="w-100 h-100" style="object-fit:cover" controls autoplay playsinline @ended="onVideoEnded"></video>
            <button v-if="playVideo" class="btn btn-sm btn-dark bg-opacity-50 position-absolute top-0 start-0 m-2 border-0" @click="playVideo = false; videoEnded = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0"/><path d="M5 12l6 6"/><path d="M5 12l6 -6"/></svg>
              Photo
            </button>
            <button v-if="videoEnded && !playVideo" class="btn btn-sm btn-dark bg-opacity-50 position-absolute bottom-0 end-0 m-2 border-0" @click="playVideo = true; videoEnded = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Revoir
            </button>
          </div>

          <div class="d-flex flex-wrap gap-3 mb-3">
            <div class="d-flex align-items-center gap-1 text-muted small">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="16" rx="2"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="4" y1="11" x2="20" y2="11"/></svg>
              {{ formatDate(selectedEvent.dateDebut) }} à {{ formatTime(selectedEvent.dateDebut) }}
            </div>
            <div v-if="selectedEvent.dateFin" class="d-flex align-items-center gap-1 text-muted small">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 3 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="16" rx="2"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="4" y1="11" x2="20" y2="11"/></svg>
              {{ formatDate(selectedEvent.dateFin) }}
            </div>
            <div v-if="selectedEvent.lieu" class="d-flex align-items-center gap-1 text-muted small">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .212l-6.364 6.364l-6.364 -6.364a9 9 0 1 1 12.728 -12.731z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              {{ selectedEvent.lieu }}
            </div>
          </div>

          <h2 class="fw-bold mb-3">{{ selectedEvent.titre }}</h2>
          <div class="text-secondary lh-lg" style="line-height:1.8">{{ selectedEvent.description }}</div>

          <div v-if="selectedEvent.media?.length" class="mt-5">
            <hr>
            <h4 class="fw-bold mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="me-1"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="4" y1="16" x2="10" y2="10"/><circle cx="8" cy="8" r="1"/><line x1="14" y1="16" x2="19" y2="11"/><line x1="19" y1="13" x2="20" y2="12"/></svg>
              Galerie
            </h4>
            <div class="row g-3">
              <div v-for="m in selectedEvent.media" :key="m.id" class="col-md-4 col-sm-6">
                <div v-if="m.type === 'image'" class="rounded-3 overflow-hidden shadow-sm" style="aspect-ratio:3/2;cursor:pointer" @click="openLightbox(m.url)">
                  <img :src="m.url" :alt="m.titre || 'Photo'" class="w-100 h-100" style="object-fit:cover;transition:.3s" @mouseover="$event.target.style.transform='scale(1.05)'" @mouseout="$event.target.style.transform='scale(1)'">
                </div>
                <div v-else-if="isExternalUrl(m.url)" class="rounded-3 overflow-hidden shadow-sm position-relative" style="aspect-ratio:3/2;background:#000">
                  <iframe :src="m.url.includes('youtube') ? m.url.replace('watch?v=', 'embed/').split('&')[0] : m.url" class="w-100 h-100" frameborder="0" allowfullscreen></iframe>
                </div>
                <div v-else class="rounded-3 overflow-hidden shadow-sm position-relative" style="aspect-ratio:3/2;background:#000">
                  <video :src="m.url" class="w-100 h-100" style="object-fit:cover" controls preload="metadata"></video>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div v-if="similaires.length" class="card border-0 shadow-sm sticky-top" style="top:100px">
            <div class="card-header bg-white border-bottom py-3">
              <h5 class="fw-bold mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="me-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Évènements similaires
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-for="s in similaires" :key="s.id" class="d-flex gap-3 p-3 border-bottom" style="cursor:pointer;transition:.2s" @click="selectEvent(s)">
                <img :src="getImageUrl(s)" :alt="s.titre" style="width:72px;height:72px;object-fit:cover;border-radius:10px;flex-shrink:0">
                <div class="min-w-0">
                  <div class="fw-semibold small text-dark mb-1">{{ s.titre }}</div>
                  <div class="text-muted small d-flex align-items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="16" rx="2"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="4" y1="11" x2="20" y2="11"/></svg>
                    {{ formatDate(s.dateDebut) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="lightboxUrl" class="lightbox-overlay" @click="closeLightbox">
      <span class="lightbox-close">&times;</span>
      <img :src="lightboxUrl" class="lightbox-image" @click.stop>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1) !important;
}
.event-card:hover img {
  transform: scale(1.08);
}
.nav-pills .nav-link.active {
  background-color: #fff !important;
  color: #212529 !important;
}
.min-w-0 {
  min-width: 0;
}
.lightbox-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}
.lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  cursor: default;
}
.lightbox-close {
  position: absolute;
  top: 20px; right: 30px;
  font-size: 40px;
  color: #fff;
  cursor: pointer;
  line-height: 1;
}
</style>
