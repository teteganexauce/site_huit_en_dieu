<template>
  <footer id="footer" class="footer">
    <div class="footer-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="footer-info">
              <h3 class="mb-0">INSTITUT NOUBOUDO</h3>
              <h6 class="mb-4">Mystères Révélés</h6>
              <p>
                <strong>Phone:</strong> {{ settings.telephone || '+1 5589 55488 55' }}<br>
                <strong>Email:</strong> {{ settings.email_contact || 'info@example.com' }}<br>
                <strong>Adresse:</strong> {{ settings.adresse || '' }}<br>
              </p>
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
            <form @submit.prevent="subscribe" method="post">
              <input type="email" v-model="email" name="email" placeholder="Adresse Email" required><input type="submit" value="Souscrire" :disabled="loading">
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-legal text-center">
      <div class="container d-flex flex-column flex-lg-row justify-content-center justify-content-lg-between align-items-center">
        <div class="d-flex flex-column align-items-center align-items-lg-start">
          <div class="copyright">
            &copy; Copyright <strong><span>Institut Nouboundo</span></strong>. Tous droits réservés
          </div>
        </div>
        <div class="social-links order-first order-lg-last mb-3 mb-lg-0">
          <a v-if="settings.reseaux_sociaux_facebook" :href="settings.reseaux_sociaux_facebook" class="facebook"><i class="bi bi-facebook"></i></a>
          <a v-if="settings.reseaux_sociaux_twitter" :href="settings.reseaux_sociaux_twitter" class="twitter"><i class="bi bi-twitter"></i></a>
          <a v-if="settings.reseaux_sociaux_instagram" :href="settings.reseaux_sociaux_instagram" class="instagram"><i class="bi bi-instagram"></i></a>
          <a v-if="settings.reseaux_sociaux_youtube" :href="settings.reseaux_sociaux_youtube" class="youtube"><i class="bi bi-youtube"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import publicService from '../services/publicService'

const settings = ref({})

onMounted(async () => {
  try {
    const data = await publicService.getSettings();
    settings.value = data.data || data;
  } catch (error) {
    console.error('Erreur chargement settings:', error);
  }
})
</script>
<style></style>