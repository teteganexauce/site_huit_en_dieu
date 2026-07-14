<template>
  <header id="header" class="header fixed-top" data-scrollto-offset="0">
    <div class="container-fluid d-flex align-items-center justify-content-between">
      <router-link to="/" class="logo d-flex align-items-center scrollto me-auto me-lg-0">
        <span class="logo-mark">HED</span>
        <div class="logo-text">
          <strong>École HED</strong>
          <small>Éducation • Formation • Engagement</small>
        </div>
      </router-link>

      <nav id="navbar" class="navbar">
        <ul>
          <li><router-link to="/" class="nav-link scrollto">Accueil</router-link></li>
          <li class="dropdown megamenu">
            <a href="#" class="nav-link dropdown-toggle">
              <span>Centre de formation / École</span>
              <i class="bi bi-chevron-down dropdown-indicator"></i>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a href="#">À la découverte du centre / école</a>
                <a href="#">Les réalités du centre / école</a>
                <a href="#">Hors des murs du centre</a>
              </li>
              <li>
                <a href="#">Orientation et choix de vie</a>
                <router-link to="/temoignages">Témoignages</router-link>
                <router-link to="/equipe-animation">Équipe d’animation</router-link>
              </li>
              <li>
                <router-link to="/galerie">Galerie d’images & vidéos</router-link>
                <a href="#">Nos partenaires</a>
                <router-link to="/formations">Nos formations</router-link>
                <router-link to="/rubriques-culture">Rubriques culturelles</router-link>
              </li>
            </ul>
          </li>
          <li><router-link to="/publications" class="nav-link scrollto">Publications</router-link></li>
          <li class="dropdown">
            <a href="#" class="nav-link dropdown-toggle">
              <span>Espace de vente</span>
              <i class="bi bi-chevron-down dropdown-indicator"></i>
            </a>
            <ul>
              <li><router-link to="/e-book" class="nav-link scrollto">Nos e-books</router-link></li>
              <li><router-link to="/objets" class="nav-link scrollto">Objets en vente</router-link></li>
            </ul>
          </li>
          <li><router-link to="/services" class="nav-link scrollto">Nos services</router-link></li>
          <li><router-link to="/contact" class="nav-link scrollto">Contact</router-link></li>
        </ul>
      </nav>

      <div class="header-actions">
        <router-link to="/#about" class="header-action-btn header-action-btn--don">
          <i class="bi bi-heart-fill"></i>
          Faire un don
        </router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="header-action-btn header-action-btn--ghost">
          <i class="bi bi-box-arrow-in-right"></i>
          Connexion
        </router-link>
        <router-link v-else to="/profile-inscrit" class="header-action-btn header-action-btn--ghost">
          <i class="bi bi-person-circle"></i>
          Mon profil
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 30px rgba(12, 41, 69, 0.08);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(12, 41, 69, 0.06);
}

.logo {
  text-decoration: none;
  color: #0f172a;
  gap: 0.75rem;
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0f766e 0%, #2563eb 100%);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.08em;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-text strong {
  font-size: 1rem;
  font-weight: 700;
}

.logo-text small {
  font-size: 0.75rem;
  color: #64748b;
}

.navbar ul {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navbar .nav-link,
.navbar a {
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  padding: 0.6rem 0.85rem;
  border-radius: 999px;
  transition: all 0.2s ease;
}

.navbar .nav-link:hover,
.navbar a:hover,
.navbar .nav-link.router-link-active {
  color: #0f766e;
  background: rgba(15, 118, 110, 0.08);
}

.dropdown ul {
  min-width: 280px;
  padding: 0.75rem;
  border: 0;
  border-radius: 16px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
}

.dropdown ul li {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.dropdown ul a,
.dropdown ul .router-link-active {
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  color: #334155;
}

.dropdown ul a:hover,
.dropdown ul .router-link-active {
  background: #f8fafc;
  color: #0f766e;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.header-action-btn:hover {
  transform: translateY(-1px);
}

.header-action-btn--don {
  background: linear-gradient(135deg, #0f766e 0%, #2563eb 100%);
  color: #fff;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
}

.header-action-btn--ghost {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

@media (max-width: 991px) {
  .navbar {
    display: none;
  }

  .header-actions {
    gap: 0.5rem;
  }

  .header-action-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.92rem;
  }
}

@media (max-width: 576px) {
  .container-fluid {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>