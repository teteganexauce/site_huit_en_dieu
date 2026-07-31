<template>
  <header id="header" class="site-header" :class="{ 'site-header--scrolled': isScrolled }">
    <div class="site-header__inner">

      <!-- Logo -->
      <router-link to="/" class="site-logo">
        <span class="site-logo__mark" v-if="!siteStore.siteLogo">
          {{ siteStore.siteMark }}
        </span>
        <img v-else :src="siteStore.siteLogo" alt="Logo" class="site-logo__img">
        <div class="site-logo__text">
          <strong>{{ siteStore.siteName }}</strong>
          <small>{{ siteStore.siteSlogan }}</small>
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
            <div class="site-dropdown site-dropdown--mega">
              <div class="site-dropdown__col">
                <router-link to="/temoignages">Témoignages</router-link>
                <router-link to="/publications">Publications</router-link>
                <router-link to="/galerie">Évènements</router-link>
              </div>
              <div class="site-dropdown__col">
                <router-link to="/partenaires">Nos partenaires</router-link>
                <router-link to="/formations">Nos formations</router-link>
                <router-link to="/rubriques-culture">Rubriques culturelles</router-link>
              </div>
              <div class="site-dropdown__col">
                <router-link to="/accompagnement">Demande d'accompagnement</router-link>
                <router-link to="/services">Nos services</router-link>
                <router-link to="/forum">Forum</router-link>
              </div>
            </div>
          </li>

          <li class="site-nav__item site-nav__item--dropdown">
            <a href="#" class="site-nav__link site-nav__link--toggle">
              <span>Espace de vente</span>
              <i class="bi bi-chevron-down site-nav__indicator"></i>
            </a>
            <div class="site-dropdown">
              <router-link to="/boutique" class="site-dropdown__link">
                <i class="bi bi-shop"></i> Toute la boutique
              </router-link>
              <router-link to="/e-book" class="site-dropdown__link">
                <i class="bi bi-book"></i> Nos e-books
              </router-link>
              <router-link to="/boutique?type=objet_sacre" class="site-dropdown__link">
                <i class="bi bi-gem"></i> Objets en vente
              </router-link>
            </div>
          </li>

          <li class="site-nav__item">
            <router-link to="/a-propos" class="site-nav__link">À propos</router-link>
          </li>

          <li class="site-nav__item">
            <router-link to="/contact" class="site-nav__link">Contact</router-link>
          </li>
        </ul>
      </nav>

      <!-- Actions desktop -->
      <div class="site-actions">
        <router-link to="/panier" class="site-btn site-btn--ghost site-btn--icon" title="Panier">
          <i class="bi bi-cart"></i>
          <span v-if="cartStore.itemCount > 0" class="site-badge">
            {{ cartStore.itemCount }}
          </span>
        </router-link>
        <router-link to="/dons" class="site-btn site-btn--donate">
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
      <div class="site-mobile-nav__header">
        <span>Menu</span>
        <button class="site-mobile-nav__close" @click="closeMobileNav" aria-label="Fermer le menu">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <ul>
        <li><router-link to="/" @click="closeMobileNav">Accueil</router-link></li>

        <li class="site-mobile-nav__dropdown">
          <a href="#" @click.prevent="toggleMobileDropdown">
            <span>Centre de formation / École</span>
            <i class="bi bi-chevron-down"></i>
          </a>
          <ul>

            <li><router-link to="/temoignages" @click="closeMobileNav">Témoignages</router-link></li>
            <li><router-link to="/publications" @click="closeMobileNav">Publications</router-link></li>
            <li><router-link to="/galerie" @click="closeMobileNav">Évènements</router-link></li>
            <li><router-link to="/partenaires" @click="closeMobileNav">Nos partenaires</router-link></li>
            <li><router-link to="/formations" @click="closeMobileNav">Nos formations</router-link></li>
            <li><router-link to="/rubriques-culture" @click="closeMobileNav">Rubriques culturelles</router-link></li>
            <li><router-link to="/accompagnement" @click="closeMobileNav">Demande d'accompagnement</router-link></li>
            <li><router-link to="/services" @click="closeMobileNav">Nos services</router-link></li>
            <li><router-link to="/forum" @click="closeMobileNav">Forum</router-link></li>
          </ul>
        </li>

        <li class="site-mobile-nav__dropdown">
          <a href="#" @click.prevent="toggleMobileDropdown">
            <span>Espace de vente</span>
            <i class="bi bi-chevron-down"></i>
          </a>
          <ul>
            <li><router-link to="/boutique" @click="closeMobileNav">Toute la boutique</router-link></li>
            <li><router-link to="/e-book" @click="closeMobileNav">Nos e-books</router-link></li>
            <li><router-link to="/boutique?type=objet_sacre" @click="closeMobileNav">Objets en vente</router-link></li>
          </ul>
        </li>

        <li><router-link to="/a-propos" @click="closeMobileNav">À propos</router-link></li>

        <li><router-link to="/contact" @click="closeMobileNav">Contact</router-link></li>
      </ul>

      <div class="site-mobile-nav__actions">
        <router-link to="/panier" class="site-btn site-btn--ghost" @click="closeMobileNav">
          <i class="bi bi-cart"></i> Panier
          <span v-if="cartStore.itemCount > 0">({{ cartStore.itemCount }})</span>
        </router-link>
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
import { useCartStore } from '../stores/cart'
import { useSiteStore } from '../stores/site'

const authStore = useAuthStore()
const cartStore = useCartStore()
const siteStore = useSiteStore()
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

watch(() => route.fullPath, () => {
  closeMobileNav()
  siteStore.fetchSettings()
})

onMounted(() => {
  siteStore.fetchSettings()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ==========================================
   TOKENS — palette et rythme partagés par
   tout le header (cohérent avec le logo)
   ========================================== */
.site-header {
  --ink: #0c2233;
  --ink-soft: #24445e;
  --brand-teal: #0f766e;
  --brand-blue: #2563eb;
  --brand-gold: #b1802f;
  --surface: #ffffff;
  --surface-soft: #f6f8fa;
  --border-soft: rgba(12, 34, 51, 0.09);
  --text-primary: #0f1f2e;
  --text-muted: #5c6b7a;
}

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
  border-bottom: 1px solid var(--border-soft);
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
  color: var(--text-primary);
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
  background: linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-blue) 100%);
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

.site-logo__img {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  object-fit: contain;
  flex-shrink: 0;
}

.site-logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.site-logo__text strong {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.site-logo__text small {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* ==========================================
   NAVIGATION DESKTOP — liens du menu principal
   ========================================== */
.site-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.site-nav__list {
  display: flex;
  align-items: center;
  gap: 0.15rem;
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
  gap: 0.35rem;
  padding: 0.6rem 0.85rem;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  border-radius: 8px;
  position: relative;
  transition: color 0.2s ease, background 0.2s ease;
  white-space: nowrap;
}

.site-nav__link:focus-visible {
  outline: 2px solid var(--brand-blue);
  outline-offset: 2px;
}

/* Survol ET lien actif : fond bleu nuit uni, texte blanc,
   contraste net et cohérent avec les dropdowns */
.site-nav__link:hover,
.site-nav__link.router-link-active {
  color: #ffffff;
  background: var(--ink);
}

.site-nav__link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--brand-gold);
  border-radius: 4px;
  transform: translateX(-50%);
  transition: width 0.25s ease;
}

.site-nav__link.router-link-active::after {
  width: 32%;
}

.site-nav__indicator {
  font-size: 0.65rem;
  transition: transform 0.25s ease;
}

.site-nav__item--dropdown:hover .site-nav__indicator {
  transform: rotate(180deg);
}

.site-nav__item--dropdown:hover .site-nav__link--toggle {
  color: #ffffff;
  background: var(--ink);
}

/* ==========================================
   DROPDOWN SIMPLE ("Espace de vente")
   ========================================== */
.site-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  min-width: 260px;
  padding: 0.6rem;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  box-shadow: 0 24px 48px -12px rgba(12, 34, 51, 0.22), 0 4px 12px rgba(12, 34, 51, 0.06);
  list-style: none;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(6px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
  overflow: hidden;
}

/* Fin liseré de signature en haut du panneau, dégradé de marque */
.site-dropdown::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--brand-teal), var(--brand-blue), var(--brand-gold));
}

/* Pont invisible qui comble le vide entre le lien et le dropdown,
   pour ne jamais perdre le survol en descendant vers le menu */
.site-nav__item--dropdown::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 16px;
  z-index: 5;
}

.site-nav__item--dropdown:not(.site-nav__item--mega) .site-dropdown {
  left: auto;
  right: 0;
}

.site-nav__item--dropdown:hover .site-dropdown {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
  transform: translateY(0);
}

.site-dropdown__link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.75rem;
  border-radius: 9px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.87rem;
  transition: background 0.15s ease, color 0.15s ease, padding-left 0.15s ease;
}

.site-dropdown__link i {
  color: var(--brand-teal);
  font-size: 0.95rem;
  width: 1.1rem;
  text-align: center;
  flex-shrink: 0;
}

.site-dropdown__link:hover,
.site-dropdown__link.router-link-active {
  background: var(--surface-soft);
  color: var(--brand-blue);
  padding-left: 1rem;
}

.site-dropdown__link:hover i,
.site-dropdown__link.router-link-active i {
  color: var(--brand-blue);
}

/* ==========================================
   MEGA MENU — colonnes structurées avec
   en-têtes de catégorie, lisible et scannable
   ========================================== */
.site-dropdown--mega {
  width: min(760px, 90vw);
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding: 1.5rem 0.5rem 1rem;
}

.site-dropdown__col {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  border-right: 1px solid var(--border-soft);
}

.site-dropdown__col:last-child {
  border-right: none;
}

.site-dropdown__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand-teal);
  margin-bottom: 0.65rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border-soft);
}

.site-dropdown--mega a {
  display: block;
  padding: 0.5rem 0.6rem;
  margin: 0 -0.6rem;
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.84rem;
  line-height: 1.4;
  transition: background 0.15s ease, color 0.15s ease, padding-left 0.15s ease;
}

.site-dropdown--mega a:hover,
.site-dropdown--mega a.router-link-active {
  background: var(--surface-soft);
  color: var(--brand-blue);
  padding-left: 0.9rem;
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
  font-size: 0.83rem;
  border: none;
  cursor: pointer;
  transition: box-shadow 0.25s ease, transform 0.25s ease, background 0.2s ease, border-color 0.2s ease;
}

.site-btn:focus-visible {
  outline: 2px solid var(--brand-blue);
  outline-offset: 2px;
}

.site-btn--icon {
  padding: 0.6rem 0.75rem;
  position: relative;
}

.site-btn--donate {
  background: linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-blue) 100%);
  color: #fff;
  box-shadow: 0 8px 22px rgba(37, 99, 235, 0.28);
}

.site-btn--donate:hover {
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.38);
  transform: translateY(-2px);
}

.site-btn--ghost {
  background: var(--surface-soft);
  color: var(--text-primary);
  border: 1px solid var(--border-soft);
}

.site-btn--ghost:hover {
  background: #eef1f4;
  border-color: #d7dde3;
}

.site-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--brand-gold);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 0 0 2px var(--surface);
}

/* ==========================================
   TOGGLE MOBILE
   ========================================== */
.site-mobile-toggle {
  display: none;
  background: var(--surface-soft);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  font-size: 1.4rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  line-height: 1;
}

.site-mobile-toggle:focus-visible {
  outline: 2px solid var(--brand-blue);
  outline-offset: 2px;
}

/* ==========================================
   NAV MOBILE — padding-top synchronisé sur
   --header-height, plus jamais de décalage
   ========================================== */
.site-mobile-nav {
  position: fixed;
  top: 0;
  right: -100%;
  width: 88%;
  max-width: 400px;
  height: 100vh;
  height: 100dvh;
  background: var(--surface);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.12);
  padding: 0 0 2rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transition: right 0.35s ease;
  z-index: 1050;
}

.site-mobile-nav--open {
  right: 0;
}

.site-mobile-nav__header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border-soft);
  font-weight: 700;
  color: var(--text-primary);
  z-index: 2;
}

.site-mobile-nav__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  background: var(--surface-soft);
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
}

.site-mobile-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.site-mobile-nav > ul {
  padding: 0.5rem 1.25rem 0;
}

.site-mobile-nav > ul > li > a,
.site-mobile-nav > ul > li > .router-link-active {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 0.25rem;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 1px solid var(--surface-soft);
}

.site-mobile-nav > ul > li > .router-link-active {
  color: var(--brand-blue);
}

/* Sous-menu mobile : identité bleu nuit unie, cohérente avec
   le fond de survol desktop, plutôt qu'un dégradé bleu clair
   qui cassait le contraste sur les petits écrans */
.site-mobile-nav__dropdown ul {
  padding-left: 0.5rem;
  margin-top: 4px;
  max-height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: var(--ink);
  transition: max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease;
}

.site-mobile-nav__dropdown.is-open ul {
  max-height: 700px;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.5rem 0.4rem 1rem;
}

.site-mobile-nav__dropdown ul a {
  display: block;
  padding: 0.65rem 0.5rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.88rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.site-mobile-nav__dropdown ul li:last-child a {
  border-bottom: none;
}

.site-mobile-nav__dropdown ul a:hover,
.site-mobile-nav__dropdown ul a.router-link-active {
  color: #ffffff;
}

.site-mobile-nav__dropdown i {
  transition: transform 0.3s ease;
  color: var(--text-muted);
}

.site-mobile-nav__dropdown.is-open i {
  transform: rotate(180deg);
  color: var(--brand-blue);
}

.site-mobile-nav__actions {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin: 1.5rem 1.25rem 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-soft);
}

.site-mobile-nav__actions .site-btn {
  justify-content: center;
  width: 100%;
}

.site-mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(12, 34, 51, 0.45);
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

/* Zone intermédiaire : on garde le menu desktop mais on
   resserre l'espacement pour éviter que ça déborde avant
   le vrai point de bascule mobile */
@media (max-width: 1200px) and (min-width: 992px) {
  .site-nav__link {
    padding: 0.55rem 0.6rem;
    font-size: 0.82rem;
  }

  .site-actions {
    gap: 0.4rem;
  }

  .site-btn {
    padding: 0.55rem 0.85rem;
    font-size: 0.78rem;
  }
}

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

  .site-logo__img {
    width: 38px;
    height: 38px;
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
    width: 100%;
    max-width: none;
  }
}
</style>