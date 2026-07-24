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
                <a v-if="siteStore.settings.FACEBOOK_URL" :href="siteStore.settings.FACEBOOK_URL" target="_blank" rel="noopener" title="Facebook"><i class="bi bi-facebook"></i></a>
                <a v-if="siteStore.settings.TWITTER_URL" :href="siteStore.settings.TWITTER_URL" target="_blank" rel="noopener" title="Twitter"><i class="bi bi-twitter-x"></i></a>
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
              <li><i class="bi bi-chevron-right"></i> <router-link to="/temoignages">Témoignages</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/formations">Formations</router-link></li>
              <li><i class="bi bi-chevron-right"></i> <router-link to="/e-book">E-books</router-link></li>
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
            <div v-if="message" class="mt-2 small" :class="error ? 'text-danger' : 'text-success'">{{ message }}</div>
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
import { ref } from 'vue'
import { useSiteStore } from '../stores/site'
import api from '../services/api'

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
<style></style>