<script setup>
import { ref, computed, onMounted } from 'vue'
import publicService from '../services/publicService'
import defaultAvatar from '../assets/img/team/team-1.jpg'
import defaultSection from '../assets/img/blog/blog-2.jpg'

const isLoading = ref(true)
const sections = ref({})
const equipe = ref([])
const anneesExperience = ref(new Date().getFullYear() - 2019) // Création dynamique

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')
  : 'http://localhost:8000'

const getImageUrl = (path) => {
  if (!path) return defaultAvatar
  if (path.startsWith('http')) return path
  return `${baseUrl}/storage/${path}`
}

const getSectionImage = (section) => {
  if (!section) return defaultSection
  if (section.image_url) return section.image_url
  return defaultSection
}

const onImageError = (e) => { e.target.src = defaultAvatar }

onMounted(async () => {
  try {
    const data = await publicService.getAProposData()
    sections.value = data.sections || {}
    equipe.value = data.equipe?.data || data.equipe || []
  } catch (error) {
    console.error('Erreur chargement À propos:', error)
  } finally {
    isLoading.value = false
  }
})

// Parsing dynamique des cartes Mission
const parseMissionCards = computed(() => {
  if (!sections.value.mission?.contenu) return []
  const div = document.createElement('div')
  div.innerHTML = sections.value.mission.contenu
  const cards = []
  const icons = ['bi-bullseye', 'bi-eye', 'bi-compass', 'bi-lightning']
  let currentCard = null

  // On parcourt TOUS les noeuds (y compris les text nodes non vides)
  Array.from(div.childNodes).forEach(node => {
    // Si c'est un noeud texte pur qui n'est pas vide
    if (node.nodeType === 3) {
      if (node.textContent.trim().length > 0) {
        if (!currentCard) currentCard = { title: 'Objectif', html: '', icon: icons[0] }
        currentCard.html += `<p>${node.textContent}</p>`
      }
      return
    }
    
    // Si c'est un élément
    if (node.nodeType === 1) {
      const tagName = node.tagName.toUpperCase()
      const text = node.textContent.trim()
      
      const isHeading = tagName.match(/^H[1-6]$/) || (tagName === 'P' && node.querySelector('strong') && text === node.querySelector('strong').textContent.trim())
      
      if (isHeading) {
        if (currentCard) cards.push(currentCard)
        currentCard = { title: text, html: '', icon: icons[cards.length % icons.length] }
      } else {
        if (!currentCard) {
          currentCard = { title: 'Objectif', html: '', icon: icons[0] }
        }
        currentCard.html += node.outerHTML
      }
    }
  })
  if (currentCard) cards.push(currentCard)
  
  // Si le parsing n'a rien donné, on crée une carte par défaut avec tout le contenu
  if (cards.length === 0 && sections.value.mission.contenu.trim()) {
    return [{ title: sections.value.mission.titre, html: sections.value.mission.contenu, icon: icons[0] }]
  }
  
  return cards
})

// Parsing dynamique des cartes Valeurs
const parseValeursCards = computed(() => {
  if (!sections.value.valeurs?.contenu) return []
  const div = document.createElement('div')
  div.innerHTML = sections.value.valeurs.contenu
  
  let blocks = Array.from(div.querySelectorAll('p, li, div'))
                      .map(el => el.textContent.trim())
                      .filter(text => text.length > 3)
                      
  if (blocks.length === 0) {
    // Fallback: séparer par les sauts de ligne si aucun élément p n'est trouvé
    blocks = sections.value.valeurs.contenu.replace(/<[^>]*>?/gm, '\n').split('\n')
                      .map(text => text.trim())
                      .filter(text => text.length > 3)
  }
                      
  const icons = ['bi-heart-fill', 'bi-people-fill', 'bi-shield-check', 'bi-brightness-high-fill', 'bi-star-fill']
  const colors = ['text-primary', 'text-info', 'text-success', 'text-warning', 'text-danger']
  
  const cards = blocks.map((text, idx) => {
    let title = 'Valeur'
    let desc = text
    if (text.includes(':')) {
      const parts = text.split(':')
      title = parts[0].trim()
      desc = parts.slice(1).join(':').trim()
    } else if (text.includes('-')) {
      const parts = text.split('-')
      title = parts[0].trim()
      desc = parts.slice(1).join('-').trim()
    }
    return {
      title,
      text: desc,
      icon: icons[idx % icons.length],
      colorClass: colors[idx % colors.length]
    }
  })
  
  if (cards.length === 0 && sections.value.valeurs.contenu.trim()) {
     return [{ title: 'Nos Valeurs', text: sections.value.valeurs.contenu.replace(/<[^>]*>?/gm, ''), icon: icons[0], colorClass: colors[0] }]
  }
  
  return cards
})

// Centre sections définies par ordre
const centreSections = [
  { key: 'decouverte', icon: 'bi-compass', color: '#0ea2bd', anchor: 'decouverte' },
  { key: 'realites',   icon: 'bi-house-heart', color: '#8e44ad', anchor: 'realites' },
  { key: 'hors_murs',  icon: 'bi-globe2', color: '#27ae60', anchor: 'hors-murs' },
  { key: 'orientation',icon: 'bi-signpost-2', color: '#e67e22', anchor: 'orientation' },
]
</script>

<template>
  <main class="about-page">

    <!-- ═══════════════════════════
         HERO BANNER
    ════════════════════════════ -->
    <section class="about-hero d-flex align-items-center justify-content-center text-center">
      <div class="container position-relative z-1" data-aos="fade-up" data-aos-duration="900">
        <span class="hero-label">Qui sommes-nous ?</span>
        <h1 class="display-3 fw-bold text-white mb-4">À propos de Huit en Dieu</h1>
        <p class="lead text-white-50 mx-auto" style="max-width:650px;">
          Découvrez notre histoire, notre mission et notre engagement à promouvoir l'éveil
          spirituel, la prière et la croissance personnelle au quotidien.
        </p>
        <!-- Ancres de navigation -->
        <div class="hero-nav mt-4">
          <a href="#histoire"     class="hero-nav-pill">Notre histoire</a>
          <a href="#mission"      class="hero-nav-pill">Mission & Vision</a>
          <a href="#decouverte"   class="hero-nav-pill">Le centre</a>
          <a href="#equipe"       class="hero-nav-pill">L'équipe</a>
        </div>
      </div>
      <div class="hero-overlay"></div>
    </section>

    <!-- ═══════════════════════════
         LOADER GLOBAL
    ════════════════════════════ -->
    <div v-if="isLoading" class="text-center py-5 my-5">
      <div class="spinner-border text-primary" style="width:3rem;height:3rem;" role="status"></div>
      <p class="text-muted mt-3">Chargement du contenu...</p>
    </div>

    <template v-else>

      <!-- ═══════════════════════════
           NOTRE HISTOIRE
      ════════════════════════════ -->
      <section id="histoire" class="about-story py-5 my-5" v-if="sections.histoire">
        <div class="container">
          <div class="row align-items-center gy-5">
            <div class="col-lg-6 pe-lg-5" data-aos="fade-right">
              <span class="section-eyebrow">{{ sections.histoire.sous_titre || 'Nos Racines' }}</span>
              <h2 class="display-5 fw-bold mb-4">{{ sections.histoire.titre }}</h2>
              <div class="prose-content text-muted" v-html="sections.histoire.contenu"></div>
              <router-link to="/contact" class="btn btn-primary px-4 py-2 mt-4 rounded-pill">
                <i class="bi bi-arrow-right me-2"></i>Rejoignez notre aventure
              </router-link>
            </div>
            <div class="col-lg-6" data-aos="fade-left">
              <div class="position-relative">
                <img
                  :src="getSectionImage(sections.histoire)"
                  alt="Notre histoire"
                  class="img-fluid rounded-4 shadow-lg w-100 section-img"
                />
                <div class="experience-badge text-center">
                  <h3 class="fw-bold text-dark mb-0">+{{ anneesExperience }} Ans</h3>
                  <p class="text-muted mb-0 small text-uppercase">D'engagement<br>spirituel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════
           MISSION & VISION
      ════════════════════════════ -->
      <section id="mission" class="about-mission bg-light py-5" v-if="sections.mission">
        <div class="container py-4">
          <div class="text-center mb-5" data-aos="fade-up">
            <span class="section-eyebrow">{{ sections.mission.sous_titre || 'Ce qui nous anime' }}</span>
            <h2 class="display-5 fw-bold">{{ sections.mission.titre }}</h2>
          </div>
          <div class="row gy-4 justify-content-center">
            <div :class="[parseMissionCards.length === 1 ? 'col-lg-8' : 'col-md-6']" v-for="(card, index) in parseMissionCards" :key="index" data-aos="fade-up" :data-aos-delay="100 * (index + 1)">
              <div :class="['mission-card bg-white p-4 rounded-4 shadow-sm text-center border-top border-4 h-100', index % 2 === 0 ? 'border-primary' : 'border-secondary']">
                <div :class="['mission-icon mb-4', index % 2 === 0 ? 'bg-primary-subtle text-primary' : 'bg-secondary-subtle text-secondary']">
                  <i :class="['bi', card.icon]"></i>
                </div>
                <h3 class="fw-bold mb-3">{{ card.title }}</h3>
                <div class="text-muted mb-0 prose-content" style="line-height:1.7;" v-html="card.html"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════
           NOS VALEURS
      ════════════════════════════ -->
      <section id="valeurs" class="about-values py-5 my-5" v-if="sections.valeurs">
        <div class="container">
          <div class="text-center mb-5" data-aos="fade-up">
            <span class="section-eyebrow">{{ sections.valeurs.sous_titre || 'Principes Fondamentaux' }}</span>
            <h2 class="display-5 fw-bold">{{ sections.valeurs.titre }}</h2>
          </div>
          <div class="row gy-4 justify-content-center">
            <div class="col-lg-3 col-md-6" v-for="(card, index) in parseValeursCards" :key="index" data-aos="zoom-in" :data-aos-delay="100 * (index + 1)">
              <div class="value-card p-4 text-center rounded-4 h-100">
                <div :class="['value-icon mb-3', card.color]"><i :class="['bi', card.icon]"></i></div>
                <h4 class="fw-bold h5">{{ card.title }}</h4>
                <div class="text-muted small mb-0" v-html="card.text"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════
           CENTRE DE FORMATION — 4 SECTIONS
      ════════════════════════════════════════ -->
      <section class="centre-divider py-5">
        <div class="container">
          <div class="centre-divider-inner text-center" data-aos="fade-up">
            <div class="centre-badge">
              <i class="bi bi-mortarboard-fill me-2"></i>Centre de Formation / École
            </div>
            <h2 class="display-5 fw-bold mt-3 mb-2">Notre Centre</h2>
            <p class="text-muted mx-auto" style="max-width:600px;">
              Découvrez toutes les dimensions de notre école : son cadre de vie, ses activités,
              son ouverture sur le monde et son accompagnement vocationnel.
            </p>
          </div>

          <!-- Onglets de navigation -->
          <div class="centre-nav mt-4" data-aos="fade-up" data-aos-delay="100">
            <a v-for="cs in centreSections" :key="cs.key"
               :href="`#${cs.anchor}`"
               class="centre-nav-tab">
              <i :class="`bi ${cs.icon} me-1`"></i>
              {{ sections[cs.key]?.titre || cs.key }}
            </a>
          </div>
        </div>
      </section>

      <!-- Section Découverte -->
      <section id="decouverte" class="centre-section py-5"
               v-if="sections.decouverte"
               style="--accent: #0ea2bd;">
        <div class="container">
          <div class="row align-items-center gy-5">
            <div class="col-lg-6" data-aos="fade-right">
              <div class="centre-img-wrap">
                <img :src="getSectionImage(sections.decouverte)" alt="Découverte du centre" class="img-fluid rounded-4 shadow section-img" />
                <div class="centre-accent-bar" style="background:#0ea2bd;"></div>
              </div>
            </div>
            <div class="col-lg-6 ps-lg-5" data-aos="fade-left">
              <div class="centre-section-icon" style="background:rgba(14,162,189,0.1);color:#0ea2bd;">
                <i class="bi bi-compass"></i>
              </div>
              <span class="section-eyebrow" style="color:#0ea2bd;">{{ sections.decouverte.sous_titre }}</span>
              <h2 class="h2 fw-bold mb-4">{{ sections.decouverte.titre }}</h2>
              <div class="prose-content text-muted" v-html="sections.decouverte.contenu"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Réalités (inversée) -->
      <section id="realites" class="centre-section centre-section--alt py-5 bg-light"
               v-if="sections.realites"
               style="--accent:#8e44ad;">
        <div class="container">
          <div class="row align-items-center gy-5 flex-lg-row-reverse">
            <div class="col-lg-6" data-aos="fade-left">
              <div class="centre-img-wrap">
                <img :src="getSectionImage(sections.realites)" alt="Réalités du centre" class="img-fluid rounded-4 shadow section-img" />
                <div class="centre-accent-bar" style="background:#8e44ad;"></div>
              </div>
            </div>
            <div class="col-lg-6 pe-lg-5" data-aos="fade-right">
              <div class="centre-section-icon" style="background:rgba(142,68,173,0.1);color:#8e44ad;">
                <i class="bi bi-house-heart"></i>
              </div>
              <span class="section-eyebrow" style="color:#8e44ad;">{{ sections.realites.sous_titre }}</span>
              <h2 class="h2 fw-bold mb-4">{{ sections.realites.titre }}</h2>
              <div class="prose-content text-muted" v-html="sections.realites.contenu"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Hors des murs -->
      <section id="hors-murs" class="centre-section py-5"
               v-if="sections.hors_murs"
               style="--accent:#27ae60;">
        <div class="container">
          <div class="row align-items-center gy-5">
            <div class="col-lg-6" data-aos="fade-right">
              <div class="centre-img-wrap">
                <img :src="getSectionImage(sections.hors_murs)" alt="Hors des murs" class="img-fluid rounded-4 shadow section-img" />
                <div class="centre-accent-bar" style="background:#27ae60;"></div>
              </div>
            </div>
            <div class="col-lg-6 ps-lg-5" data-aos="fade-left">
              <div class="centre-section-icon" style="background:rgba(39,174,96,0.1);color:#27ae60;">
                <i class="bi bi-globe2"></i>
              </div>
              <span class="section-eyebrow" style="color:#27ae60;">{{ sections.hors_murs.sous_titre }}</span>
              <h2 class="h2 fw-bold mb-4">{{ sections.hors_murs.titre }}</h2>
              <div class="prose-content text-muted" v-html="sections.hors_murs.contenu"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Orientation (inversée) -->
      <section id="orientation" class="centre-section centre-section--alt py-5 bg-light"
               v-if="sections.orientation"
               style="--accent:#e67e22;">
        <div class="container">
          <div class="row align-items-center gy-5 flex-lg-row-reverse">
            <div class="col-lg-6" data-aos="fade-left">
              <div class="centre-img-wrap">
                <img :src="getSectionImage(sections.orientation)" alt="Orientation et choix de vie" class="img-fluid rounded-4 shadow section-img" />
                <div class="centre-accent-bar" style="background:#e67e22;"></div>
              </div>
            </div>
            <div class="col-lg-6 pe-lg-5" data-aos="fade-right">
              <div class="centre-section-icon" style="background:rgba(230,126,34,0.1);color:#e67e22;">
                <i class="bi bi-signpost-2"></i>
              </div>
              <span class="section-eyebrow" style="color:#e67e22;">{{ sections.orientation.sous_titre }}</span>
              <h2 class="h2 fw-bold mb-4">{{ sections.orientation.titre }}</h2>
              <div class="prose-content text-muted" v-html="sections.orientation.contenu"></div>
              <router-link to="/accompagnement" class="btn btn-outline-warning px-4 py-2 mt-3 rounded-pill">
                <i class="bi bi-person-check me-2"></i>Demander un accompagnement
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════
           NOTRE ÉQUIPE
      ════════════════════════════ -->
      <section id="equipe" class="team py-5 my-5">
        <div class="container" data-aos="fade-up">
          <div class="text-center mb-5">
            <span class="section-eyebrow">Les Porteurs du Projet</span>
            <h2 class="display-5 fw-bold">Notre Équipe d'Animation</h2>
            <p class="text-muted mx-auto mt-3" style="max-width:600px;">
              Des hommes et des femmes dévoués, au service de votre épanouissement spirituel.
            </p>
          </div>

          <div class="row gy-4 justify-content-center">
            <div v-if="!equipe.length" class="text-center text-muted py-4">
              <p>Aucun membre d'équipe disponible pour le moment.</p>
            </div>

            <div
              v-for="(member, index) in equipe"
              :key="member.id"
              class="col-xl-3 col-lg-4 col-md-6 d-flex"
              data-aos="zoom-in"
              :data-aos-delay="100 * (index % 4)"
            >
              <div class="team-member card border-0 shadow-sm rounded-4 w-100 overflow-hidden text-center hover-lift">
                <div class="member-img position-relative overflow-hidden bg-light" style="height:280px;">
                  <img
                    :src="getImageUrl(member.photoUrl)"
                    @error="onImageError"
                    class="img-fluid w-100 h-100 object-fit-cover"
                    :alt="member.prenom + ' ' + member.nom"
                  />
                </div>
                <div class="member-info card-body p-4 bg-white">
                  <h5 class="fw-bold mb-1 text-dark">{{ member.prenom }} {{ member.nom }}</h5>
                  <span class="text-primary fw-medium small">{{ member.fonction }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </template>

  </main>
</template>

<style scoped>
/* ════════════════════════════════════
   Hero
════════════════════════════════════ */
.about-hero {
  position: relative;
  min-height: 520px;
  background-image: url('https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?q=80&w=1920&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding-top: 120px;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13,27,42,0.85) 0%, rgba(14,162,189,0.5) 100%);
  z-index: 0;
}
.hero-label {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 4px 16px;
  border-radius: 50px;
  margin-bottom: 1rem;
}
.hero-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.hero-nav-pill {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 50px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.85);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s;
  backdrop-filter: blur(6px);
}
.hero-nav-pill:hover {
  background: rgba(255,255,255,0.25);
  color: #fff;
  transform: translateY(-2px);
}

/* ════════════════════════════════════
   Common
════════════════════════════════════ */
.section-eyebrow {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--bs-primary, #0ea2bd);
  margin-bottom: 0.5rem;
}
.prose-content {
  line-height: 1.85;
  font-size: 1.02rem;
}
.prose-content p { margin-bottom: 1rem; }

.section-img {
  object-fit: cover;
  height: 420px;
  width: 100%;
}

/* ════════════════════════════════════
   Notre Histoire
════════════════════════════════════ */
.experience-badge {
  background: #fff;
  padding: 1.2rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  position: absolute;
  bottom: -1.5rem;
  left: 1.5rem;
  border-left: 4px solid var(--bs-primary);
}

/* ════════════════════════════════════
   Mission
════════════════════════════════════ */
.mission-icon {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  margin: 0 auto 1.2rem;
}

/* ════════════════════════════════════
   Valeurs
════════════════════════════════════ */
.value-card {
  background: #f8f9fa;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}
.value-card:hover {
  background: #fff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.value-icon { font-size: 2.5rem; }

/* ════════════════════════════════════
   Centre Divider
════════════════════════════════════ */
.centre-divider {
  background: linear-gradient(135deg, #1a2a3a 0%, #0d4f6b 100%);
  color: #fff;
}
.centre-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(14,162,189,0.25);
  border: 1px solid rgba(14,162,189,0.4);
  color: #7ee8f8;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 18px;
  border-radius: 50px;
}
.centre-divider h2 { color: #fff; }
.centre-divider .text-muted { color: rgba(255,255,255,0.6) !important; }

.centre-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
}
.centre-nav-tab {
  padding: 8px 20px;
  border-radius: 50px;
  background: rgba(255,255,255,0.1);
  border: 1.5px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.8);
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.25s;
}
.centre-nav-tab:hover {
  background: rgba(14,162,189,0.3);
  border-color: #0ea2bd;
  color: #fff;
  transform: translateY(-2px);
}

/* ════════════════════════════════════
   Centre Sections
════════════════════════════════════ */
.centre-section { scroll-margin-top: 80px; }

.centre-img-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}
.centre-accent-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5px;
}

.centre-section-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

/* ════════════════════════════════════
   Équipe
════════════════════════════════════ */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
}
.hover-lift .member-img img {
  transition: transform 0.5s ease;
}
.hover-lift:hover .member-img img {
  transform: scale(1.08);
}

/* Scroll smooth */
html { scroll-behavior: smooth; }

/* Responsive */
@media (max-width: 768px) {
  .about-hero { background-attachment: scroll; }
  .section-img { height: 260px; }
  .experience-badge { display: none; }
}
</style>