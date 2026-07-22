<template>
  <footer id="footer" class="footer">
    <div class="footer-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="footer-info">
              <h3 class="mb-0">{{ siteStore.siteName }}</h3>
              <h6 class="mb-4">{{ siteStore.siteSlogan }}</h6>
              <p>
                <strong>Téléphone :</strong> {{ siteStore.settings.TELEPHONE || '+1 5589 55488 55' }}<br>
                <strong>Email :</strong> {{ siteStore.settings.CONTACT_EMAIL || 'info@example.com' }}<br>
                <strong>Adresse :</strong> {{ siteStore.settings.ADRESSE || '' }}<br>
                <span v-if="siteStore.settings.HORAIRE"><strong>Horaires :</strong> {{ siteStore.settings.HORAIRE }}<br></span>
              </p>
              <div class="social-links mt-3">
                <a v-if="siteStore.settings.FACEBOOK_URL" :href="siteStore.settings.FACEBOOK_URL" class="facebook" target="_blank" rel="noopener"><i class="bi bi-facebook"></i></a>
                <a v-if="siteStore.settings.TWITTER_URL" :href="siteStore.settings.TWITTER_URL" class="twitter" target="_blank" rel="noopener"><i class="bi bi-twitter-x"></i></a>
                <a v-if="siteStore.settings.INSTAGRAM_URL" :href="siteStore.settings.INSTAGRAM_URL" class="instagram" target="_blank" rel="noopener"><i class="bi bi-instagram"></i></a>
                <a v-if="siteStore.settings.YOUTUBE_URL" :href="siteStore.settings.YOUTUBE_URL" class="youtube" target="_blank" rel="noopener"><i class="bi bi-youtube"></i></a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 footer-links">
            <h4>Liens rapides</h4>
            <ul>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/temoignages">Témoignages</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/formations">Formations</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/e-book">E-books</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/objets">Objets en vente</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/rubriques-culture">Rubriques Culturelles</router-link></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6 footer-newsletter">
            <h4>Notre Newsletter</h4>
            <p>Abonnez vous à notre Newsletter</p>
            <form action="" method="post">
              <input type="email" name="email" placeholder="Adresse Email"><input type="submit" value="Souscrire">
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-legal text-center">
      <div class="container">
        <div class="copyright">
          &copy; Copyright <strong><span>{{ siteStore.siteName }}</span></strong>. Tous droits réservés
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
import { useSiteStore } from '../stores/site'

const siteStore = useSiteStore()
</script>
<style></style>