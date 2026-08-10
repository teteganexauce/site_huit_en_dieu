<template>
  <footer id="footer" class="footer position-relative">
    <!-- SVG Wave Divider -->
    <div class="custom-shape-divider-top">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
      </svg>
    </div>
    
    <div class="footer-content position-relative z-1">
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
                <a v-if="siteStore.settings.FACEBOOK_URL" :href="siteStore.settings.FACEBOOK_URL" target="_blank" rel="noopener" title="Facebook"><i class="bi bi-facebook"></i></a>
                <a v-if="siteStore.settings.TWITTER_URL" :href="siteStore.settings.TWITTER_URL" target="_blank" rel="noopener" title="Twitter"><i class="bi bi-twitter"></i></a>
                <a v-if="siteStore.settings.INSTAGRAM_URL" :href="siteStore.settings.INSTAGRAM_URL" target="_blank" rel="noopener" title="Instagram"><i class="bi bi-instagram"></i></a>
                <a v-if="siteStore.settings.YOUTUBE_URL" :href="siteStore.settings.YOUTUBE_URL" target="_blank" rel="noopener" title="YouTube"><i class="bi bi-youtube"></i></a>
                <a v-if="siteStore.settings.LINKEDIN_URL" :href="siteStore.settings.LINKEDIN_URL" target="_blank" rel="noopener" title="LinkedIn"><i class="bi bi-linkedin"></i></a>
                <a v-if="siteStore.settings.WHATSAPP_NUMBER" :href="'https://wa.me/' + siteStore.settings.WHATSAPP_NUMBER.replace(/[^0-9]/g, '')" target="_blank" rel="noopener" title="WhatsApp"><i class="bi bi-whatsapp"></i></a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 footer-links">
            <h4>Liens rapides</h4>
            <ul>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/formations">Formations</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/boutique?type=ebook">E-books</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/boutique">Boutique</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/rubriques-culture">Rubriques Culturelles</router-link></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6 footer-newsletter">
            <h4>Notre Newsletter</h4>
            <p>Abonnez vous à notre Newsletter</p>
            <form @submit.prevent="subscribe" method="post">
              <input type="email" v-model="email" name="email" placeholder="Adresse Email" required><input type="submit" value="Souscrire" :disabled="loading">
            </form>
            <div v-if="message" class="mt-2 small newsletter-msg" :class="error ? 'newsletter-msg-error' : 'newsletter-msg-success'">{{ message }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-legal text-center">
      <div class="container">
        <div class="copyright">
          &copy; Copyright <strong><span>{{ siteStore.siteName }}</span></strong>. Tous droits réservés
        </div>
        <button type="button" class="cookie-manage-btn" @click="openBanner(true)">
          <i class="bi bi-cookie me-1"></i>Gérer mes cookies
        </button>
      </div>
    </div>
  </footer>
</template>
<script setup>
import { ref } from 'vue'
import { useSiteStore } from '../stores/site'
import api from '../services/api'
import { openBanner } from '../services/cookieConsent'

const siteStore = useSiteStore()
const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref(false)

const subscribe = async () => {
  if (!email.value) return
  loading.value = true
  message.value = ''
  error.value = false
  try {
    const res = await api.post('/newsletter/subscribe', { email: email.value })
    message.value = res.data.message
    email.value = ''
  } catch (err) {
    error.value = true
    message.value = err.response?.data?.message || 'Une erreur est survenue. Réessayez plus tard.'
  } finally {
    loading.value = false
  }
}
</script>
<style>
.cookie-manage-btn {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 0.85rem;
  text-decoration: underline;
  margin-top: 6px;
  opacity: 0.8;
  transition: opacity 0.2s ease, color 0.2s ease;
}
.cookie-manage-btn:hover {
  opacity: 1;
  color: var(--color-primary);
}
.newsletter-msg {
  padding: 6px 10px;
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
}
.newsletter-msg-success {
  background: #198754;
}
.newsletter-msg-error {
  background: #dc3545;
}

.custom-shape-divider-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    z-index: 0;
}
.custom-shape-divider-top svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 60px;
}
.custom-shape-divider-top .shape-fill {
    fill: #FFFFFF;
}
</style>