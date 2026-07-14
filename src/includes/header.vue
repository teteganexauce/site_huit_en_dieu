<template>
  <!-- ======= Header ======= -->
  <header id="header" class="header fixed-top" data-scrollto-offset="0">
    <div class="container-fluid d-flex align-items-center justify-content-between">
      <router-link to="/" class="logo d-flex align-items-center scrollto me-auto me-lg-0">
        <h1>Ecole HED<span>.</span></h1>
      </router-link>

      <nav id="navbar" class="navbar" @click="show">
        <ul>
          <li><router-link to="/" class="nav-link scrollto">Accueil</router-link></li>
          <li class="dropdown megamenu">
            <a href="#">Centre de formation/Ecole <i class="bi bi-chevron-down dropdown-indicator"></i></a>
            <ul class="">
              <li>
                <a href="#">A la découverte du centre/école</a>
                <a href="#">Les realistés du centre/école</a>
                <a href="#">Hors des murs du centre</a>
              </li>
              <li>
                <a href="#">Orientation et choix de vie</a>
                <router-link to="/temoignages">Témoignages</router-link>
                <router-link to="/equipe-animation">Equipe d'animation</router-link>
              </li>
              <li>
                <router-link to="/galerie">Galerie d'image & videos</router-link>
                <a href="#">Nos Partenaires</a>
                <router-link to="/formations">Nos Formations</router-link>
              </li>
            </ul>
          </li>
          <li><router-link to="/publications" class="nav-link scrollto">Publications</router-link></li>
          <li><router-link to="/rubriques-culture" class="nav-link scrollto">Rubriques Culturelles</router-link></li>
          <li class="dropdown">
            <a href="#"><span>Espace de Vente</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
            <ul>
              <li><router-link to="/e-book" class="nav-link scrollto">Nos e-books</router-link></li>
              <li><router-link to="/objets" class="nav-link scrollto">Objets en Vente</router-link></li>
            </ul>
          </li>
          <li><router-link to="/services" class="nav-link scrollto">Nos Services</router-link></li>
          <li><router-link to="/contact" class="nav-link scrollto">Contact</router-link></li>
        </ul>
        <i class="bi bi-list mobile-nav-toggle d-none"></i>
      </nav>

      <router-link to="/#about" class="btn-getstarted scrollto">Faire un Don</router-link>
      <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn-getstarted scrollto ms-2">Connexion</router-link>
      <router-link v-else to="/profile-inscrit" class="btn-getstarted scrollto ms-2">Mon Profil</router-link>
    </div>
  </header><!-- End Header -->
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

$(document).ready(function () {
  $(".mobile-nav-active #vabar ul").click(function (e) {
    alert('jh')
    document.querySelector('body').classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });
});
</script>

<style scoped>
</style>