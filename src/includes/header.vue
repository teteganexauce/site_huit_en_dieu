<template>
   <!-- ======= Header ======= -->
   <header id="header" class="header fixed-top" data-scrollto-offset="0">
      <div class="container-fluid d-flex align-items-center justify-content-between">

         <a href="index.html" class="logo d-flex align-items-center scrollto me-auto me-lg-0">
            <!-- Uncomment the line below if you also wish to use an image logo -->
            <!-- <img src="assets/img/logo.png" alt=""> -->
            <h1>Ecole HED<span>.</span></h1>
         </a>

         <nav id="navbar" class="navbar" @click="show">
            <ul>
               <li>
                  <router-link to="/" class="nav-link scrollto">Accueil</router-link>
               </li>

               <!--li class="dropdown"><a href="#"><span>Home</span> <i
                           class="bi bi-chevron-down dropdown-indicator"></i></a>
                     <ul>
                        <li><a href="index.html">Home 1 - index.html</a></li>
                        <li><a href="index-2.html">Home 2 - index-2.html</a></li>
                        <li><a href="index-3.html">Home 3 - index-3.html</a></li>
                        <li><a href="index-4.html" class="active">Home 4 - index-4.html</a></li>
                     </ul>
                  </li-->
               <li class="dropdown megamenu"><a href="#">Centre de formation/Ecole <i
                        class="bi bi-chevron-down dropdown-indicator"></i></a>
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

               <li>
                  <router-link to="/publications" class="nav-link scrollto">Publications</router-link>
               </li>
                <li class="dropdown"><a href="#"><span>Espace de Vente</span> <i
                         class="bi bi-chevron-down dropdown-indicator"></i></a>
                   <ul>
                      <li>
                         <router-link to="/boutique" class="nav-link scrollto">Toute la boutique</router-link>
                      </li>
                      <li>
                         <router-link to="/e-book" class="nav-link scrollto">Nos e-books</router-link>
                      </li>
                      <li>
                         <router-link to="/objets" class="nav-link scrollto">Objets en Vente</router-link>
                      </li>
                   </ul>
                </li>
               <li>
                  <router-link to="/services" class="nav-link scrollto">Nos Services</router-link>
               </li>
               <!--li><a href="blog.html">Blog</a></li-->
               <!--li class="dropdown megamenu"><a href="#"><span>Mega Menu</span> <i
                           class="bi bi-chevron-down dropdown-indicator"></i></a>
                     <ul>
                        <li>
                           <a href="#">Column 1 link 1</a>
                           <a href="#">Column 1 link 2</a>
                           <a href="#">Column 1 link 3</a>
                        </li>
                        <li>
                           <a href="#">Column 2 link 1</a>
                           <a href="#">Column 2 link 2</a>
                           <a href="#">Column 3 link 3</a>
                        </li>
                        <li>
                           <a href="#">Column 3 link 1</a>
                           <a href="#">Column 3 link 2</a>
                           <a href="#">Column 3 link 3</a>
                        </li>
                        <li>
                           <a href="#">Column 4 link 1</a>
                           <a href="#">Column 4 link 2</a>
                           <a href="#">Column 4 link 3</a>
                        </li>
                     </ul>
                  </li-->
               <li>
                  <router-link to="/contact" class="nav-link scrollto">Contact</router-link>
               </li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle d-none"></i>
         </nav><!-- .navbar -->

         <router-link to="/panier" class="btn-getstarted scrollto position-relative" title="Panier">
            <i class="bi bi-cart"></i>
            <span v-if="cartStore.itemCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 10px;">
               {{ cartStore.itemCount }}
            </span>
         </router-link>
         <a class="btn-getstarted scrollto" href="index.html#about">Faire un Don</a>
         <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn-getstarted scrollto ms-2">Connexion</router-link>
         <router-link v-else to="/profile-inscrit" class="btn-getstarted scrollto ms-2">Mon Profil</router-link>

      </div>
   </header><!-- End Header -->
</template>
<script setup>
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

$(document).ready(function () {
   $(".mobile-nav-active #vabar ul").click(function (e) {
alert('jh')
      document.querySelector('body').classList.toggle('mobile-nav-active');

      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
   });
});
</script>
<style></style>