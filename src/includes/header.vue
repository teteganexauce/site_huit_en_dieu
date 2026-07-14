<template>
  <header id="header" class="site-header" :class="{ 'site-header--scrolled': isScrolled }">
    <div class="site-header__inner">

      <!-- Logo -->
      <router-link to="/" class="site-logo">
        <span class="site-logo__mark">HED</span>
        <div class="site-logo__text">
          <strong>École HED</strong>
          <small>Éducation · Formation · Engagement</small>
        </div>
      </router-link>

      <!-- Navigation desktop -->
      <nav class="site-nav">
        <ul class="site-nav__list">
          <li class="site-nav__item">
            <router-link to="/" class="site-nav__link">Accueil</router-link>
          </li>

          <li class="site-nav__item site-nav__item--dropdown site-nav__item--mega">
            <a href="#" class="site-nav__link site-nav__link--toggle">
              <span>Centre de formation / École</span>
              <i class="bi bi-chevron-down site-nav__indicator"></i>
            </a>
            <ul class="site-dropdown site-dropdown--mega">
              <li>
                <a href="#">À la découverte du centre / école</a>
                <a href="#">Les réalités du centre / école</a>
                <a href="#">Hors des murs du centre</a>
              </li>
              <li>
                <a href="#">Orientation et choix de vie</a>
                <router-link to="/temoignages">Témoignages</router-link>
                <router-link to="/equipe-animation">Équipe d'animation</router-link>
              </li>
              <li>
                <router-link to="/galerie">Galerie d'images & vidéos</router-link>
                <a href="#">Nos partenaires</a>
                <router-link to="/formations">Nos formations</router-link>
                <router-link to="/rubriques-culture">Rubriques culturelles</router-link>
              </li>
            </ul>
          </li>

          <li class="site-nav__item">
            <router-link to="/publications" class="site-nav__link">Publications</router-link>
          </li>

          <li class="site-nav__item site-nav__item--dropdown">
            <a href="#" class="site-nav__link site-nav__link--toggle">
              <span>Espace de vente</span>
              <i class="bi bi-chevron-down site-nav__indicator"></i>
            </a>
            <ul class="site-dropdown">
              <li><router-link to="/e-book" class="site-nav__link">Nos e-books</router-link></li>
              <li><router-link to="/objets" class="site-nav__link">Objets en vente</router-link></li>
            </ul>
          </li>

          <li class="site-nav__item">
            <router-link to="/services" class="site-nav__link">Nos services</router-link>
          </li>
          <li class="site-nav__item">
            <router-link to="/contact" class="site-nav__link">Contact</router-link>
          </li>
        </ul>
      </nav>

      <!-- Actions desktop -->
      <div class="site-actions">
        <router-link to="/#about" class="site-btn site-btn--donate">
          <i class="bi bi-heart-fill"></i>
          Faire un don
        </router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="site-btn site-btn--ghost">
          <i class="bi bi-box-arrow-in-right"></i>
          Connexion
        </router-link>
        <router-link v-else to="/profile-inscrit" class="site-btn site-btn--ghost">
          <i class="bi bi-person-circle"></i>
          Mon profil
        </router-link>
      </div>

      <!-- Toggle mobile -->
      <button class="site-mobile-toggle" @click="toggleMobileNav" aria-label="Ouvrir le menu de navigation">
        <i class="bi bi-list"></i>
      </button>
    </div>

    <!-- Backdrop mobile -->
    <transition name="site-fade">
      <div v-if="isMobileNavOpen" class="site-mobile-backdrop" @click="closeMobileNav"></div>
    </transition>

    <!-- Navigation mobile -->
    <div class="site-mobile-nav" :class="{ 'site-mobile-nav--open': isMobileNavOpen }">
      <ul>
        <li><router-link to="/" @click="closeMobileNav">Accueil</router-link></li>

        <li class="site-mobile-nav__dropdown">
          <a href="#" @click.prevent="toggleMobileDropdown">
            <span>Centre de formation / École</span>
            <i class="bi bi-chevron-down"></i>
          </a>
          <ul>
            <li><a href="#">À la découverte du centre / école</a></li>
            <li><a href="#">Les réalités du centre / école</a></li>
            <li><a href="#">Hors des murs du centre</a></li>
            <li><a href="#">Orientation et choix de vie</a></li>
            <li><router-link to="/temoignages" @click="closeMobileNav">Témoignages</router-link></li>
            <li><router-link to="/equipe-animation" @click="closeMobileNav">Équipe d'animation</router-link></li>
            <li><router-link to="/galerie" @click="closeMobileNav">Galerie d'images & vidéos</router-link></li>
            <li><a href="#">Nos partenaires</a></li>
            <li><router-link to="/formations" @click="closeMobileNav">Nos formations</router-link></li>
            <li><router-link to="/rubriques-culture" @click="closeMobileNav">Rubriques culturelles</router-link></li>
          </ul>
        </li>

        <li><router-link to="/publications" @click="closeMobileNav">Publications</router-link></li>

        <li class="site-mobile-nav__dropdown">
          <a href="#" @click.prevent="toggleMobileDropdown">
            <span>Espace de vente</span>
            <i class="bi bi-chevron-down"></i>
          </a>
          <ul>
            <li><router-link to="/e-book" @click="closeMobileNav">Nos e-books</router-link></li>
            <li><router-link to="/objets" @click="closeMobileNav">Objets en vente</router-link></li>
          </ul>
        </li>

        <li><router-link to="/services" @click="closeMobileNav">Nos services</router-link></li>
        <li><router-link to="/contact" @click="closeMobileNav">Contact</router-link></li>
      </ul>

      <div class="site-mobile-nav__actions">
        <router-link to="/#about" class="site-btn site-btn--donate" @click="closeMobileNav">
          <i class="bi bi-heart-fill"></i> Faire un don
        </router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="site-btn site-btn--ghost" @click="closeMobileNav">
          <i class="bi bi-box-arrow-in-right"></i> Connexion
        </router-link>
        <router-link v-else to="/profile-inscrit" class="site-btn site-btn--ghost" @click="closeMobileNav">
          <i class="bi bi-person-circle"></i> Mon profil
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const isMobileNavOpen = ref(false)
const isScrolled = ref(false)

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

function closeMobileNav() {
  isMobileNavOpen.value = false
}

function toggleMobileDropdown(event) {
  const parent = event.currentTarget.closest('.site-mobile-nav__dropdown')
  parent.classList.toggle('is-open')
}

function handleScroll() {
  isScrolled.value = window.scrollY > 12
}

// Ferme le menu mobile automatiquement au changement de page
watch(() => route.fullPath, closeMobileNav)

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ==========================================
   HEADER — hauteur pilotée par --header-height
   (définie dans App.vue), synchronisée avec #main
   ========================================== */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(12, 41, 69, 0.06);
  box-shadow: 0 8px 30px rgba(12, 41, 69, 0.08);
  transition: box-shadow 0.3s ease;
}

.site-header--scrolled {
  box-shadow: 0 4px 25px rgba(12, 41, 69, 0.12);
}

.site-header__inner {
  min-height: var(--header-height, 92px);
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 1.5rem;
}

/* ==========================================
   LOGO
   ========================================== */
.site-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #0f172a;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.site-logo:hover {
  transform: scale(1.02);
}

.site-logo__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0f766e 0%, #2563eb 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.site-logo:hover .site-logo__mark {
  box-shadow: 0 14px 35px rgba(37, 99, 235, 0.35);
  transform: rotate(-3deg) scale(1.05);
}

.site-logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.site-logo__text strong {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.site-logo__text small {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* ==========================================
   NAVIGATION DESKTOP
   ========================================== */
.site-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.site-nav__list {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-nav__item {
  position: relative;
}

.site-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 0.9rem;
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 999px;
  position: relative;
  transition: color 0.25s ease, background 0.25s ease;
  white-space: nowrap;
}

.site-nav__link:hover,
.site-nav__link.router-link-active {
  color: #0f766e;
  background: rgba(15, 118, 110, 0.1);
}

/* Seul trait conservé : le dégradé bleu */
.site-nav__link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 0;
  height: 2.5px;
  background: linear-gradient(90deg, #0f766e, #2563eb);
  border-radius: 4px;
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.site-nav__link:hover::after,
.site-nav__link.router-link-active::after {
  width: 60%;
}

.site-nav__indicator {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.site-nav__item--dropdown:hover .site-nav__indicator {
  transform: rotate(180deg);
}

/* ==========================================
   DROPDOWN — positionné par rapport à SON PROPRE
   item (.site-nav__item--dropdown), aucune classe
   partagée avec l'ancien thème
   ========================================== */
.site-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 260px;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12), 0 8px 20px rgba(0, 0, 0, 0.04);
  list-style: none;
  display: grid;
  gap: 0.5rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(8px) scale(0.97);
  transition: all 0.25s ease;
}

/* La dernière dropdown ("Espace de vente") colle son bord droit
   pour ne jamais déborder hors de l'écran */
.site-nav__item--dropdown:not(.site-nav__item--mega) .site-dropdown {
  left: auto;
  right: 0;
}

.site-nav__item--dropdown:hover .site-dropdown {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
  transform: translateY(0) scale(1);
}

.site-dropdown a {
  display: block;
  padding: 0.5rem 0.7rem;
  border-radius: 10px;
  color: #334155;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.site-dropdown a:hover,
.site-dropdown a.router-link-active {
  background: #f1f5f9;
  color: #0f766e;
}

/* Mega menu : s'affiche toujours pleinement sous son lien,
   largeur bornée par la fenêtre (jamais de débordement) */
.site-dropdown--mega {
  width: min(720px, 92vw);
  grid-template-columns: 1fr 1fr 1fr;
}

.site-dropdown--mega li {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

/* ==========================================
   ACTIONS
   ========================================== */
.site-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

.site-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.site-btn--donate {
  background: linear-gradient(135deg, #0f766e 0%, #2563eb 100%);
  color: #fff;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
}

.site-btn--donate:hover {
  box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px) scale(1.02);
}

.site-btn--ghost {
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

.site-btn--ghost:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

/* ==========================================
   TOGGLE MOBILE
   ========================================== */
.site-mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #0f172a;
  cursor: pointer;
  padding: 0.3rem;
}

/* ==========================================
   NAV MOBILE — padding-top synchronisé sur
   --header-height, plus jamais de décalage
   ========================================== */
.site-mobile-nav {
  position: fixed;
  top: 0;
  right: -100%;
  width: 85%;
  max-width: 380px;
  height: 100vh;
  background: #fff;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
  padding: calc(var(--header-height, 92px) + 16px) 1.5rem 2rem;
  overflow-y: auto;
  transition: right 0.35s ease;
  z-index: 1050;
}

.site-mobile-nav--open {
  right: 0;
}

.site-mobile-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.site-mobile-nav > ul > li > a,
.site-mobile-nav > ul > li > .router-link-active {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.5rem;
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 1px solid #f1f5f9;
}

.site-mobile-nav__dropdown ul {
  padding-left: 1rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.site-mobile-nav__dropdown.is-open ul {
  max-height: 600px;
  padding: 0.5rem 0 0.5rem 1rem;
}

.site-mobile-nav__dropdown ul a {
  display: block;
  padding: 0.6rem 0.5rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  border-bottom: 1px solid #f8fafc;
}

.site-mobile-nav__dropdown ul a:hover {
  color: #0f766e;
}

.site-mobile-nav__dropdown i {
  transition: transform 0.3s ease;
}

.site-mobile-nav__dropdown.is-open i {
  transform: rotate(180deg);
}

.site-mobile-nav__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.site-mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1040;
}

.site-fade-enter-active,
.site-fade-leave-active {
  transition: opacity 0.2s ease;
}
.site-fade-enter-from,
.site-fade-leave-to {
  opacity: 0;
}

/* ==========================================
   RESPONSIVE
   ========================================== */
@media (max-width: 991px) {
  .site-nav,
  .site-actions {
    display: none;
  }

  .site-mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .site-header__inner {
    padding: 0 1rem;
  }
}

@media (max-width: 576px) {
  .site-logo__text small {
    display: none;
  }

  .site-logo__mark {
    width: 38px;
    height: 38px;
    font-size: 0.9rem;
  }

  .site-logo__text strong {
    font-size: 0.9rem;
  }

  .site-header__inner {
    padding: 0 0.75rem;
  }

  .site-mobile-nav {
    width: 90%;
  }
}
</style>