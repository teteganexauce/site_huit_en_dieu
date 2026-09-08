<script setup>
import { ref } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import api from '../services/api'
import { useSiteStore } from '../stores/site'

const siteStore = useSiteStore()

const form = ref({
  nom: '',
  email: '',
  sujet: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')
const showModal = ref(false)

async function handleSubmit() {
  loading.value = true
  success.value = false
  error.value = ''
  try {
    await api.post('/contact', form.value)
    success.value = true
    form.value = { nom: '', email: '', sujet: '', message: '' }
    showModal.value = true
  } catch (e) {
    error.value = e.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer."
  } finally {
    loading.value = false
  }
}

function closeModal() {
  showModal.value = false
}
</script>


<template>
  <BreadcombsComponent title="Notre Contact" />

  <section id="contact" class="contact-page">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Contact</span>
        <h2>Contactez-nous</h2>
        <p>Une question, un projet, une demande d'information ? Notre équipe vous répond rapidement.</p>
      </div>

      <div class="row gy-4 gx-lg-4">

        <!-- Colonne infos -->
        <div class="col-lg-4">
          <div class="info-card">
            <h3>Nos coordonnées</h3>
            <p class="text-muted">Nous sommes disponibles aux horaires indiqués ci-dessous, ou par email à tout moment.</p>

            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div>
                <h4>Adresse</h4>
                <p>{{ siteStore.settings.ADRESSE || 'Bénin, Abomey, Bohicon' }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-envelope"></i>
              </div>
              <div>
                <h4>Email</h4>
                <p>{{ siteStore.settings.CONTACT_EMAIL || 'nubutoinstitut@gmail.com' }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-telephone"></i>
              </div>
              <div>
                <h4>Téléphone</h4>
                <p>{{ siteStore.settings.TELEPHONE || '+229 0161422692 / 0143301462' }}</p>
              </div>
            </div>

            <div v-if="siteStore.settings.HORAIRE" class="info-item">
              <div class="info-icon">
                <i class="bi bi-clock"></i>
              </div>
              <div>
                <h4>Horaires</h4>
                <p>{{ siteStore.settings.HORAIRE }}</p>
              </div>
            </div>

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

        <!-- Colonne formulaire -->
        <div class="col-lg-8">
          <div class="form-card">
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="row gy-3">
                <div class="col-md-6">
                  <label class="form-label">Nom complet</label>
                  <div class="input-with-icon">
                    <i class="bi bi-person"></i>
                    <input
                      type="text"
                      v-model="form.nom"
                      class="form-control"
                      placeholder="Ex : Jean Dupont"
                      required
                    >
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Adresse email</label>
                  <div class="input-with-icon">
                    <i class="bi bi-envelope"></i>
                    <input
                      type="email"
                      v-model="form.email"
                      class="form-control"
                      placeholder="Ex : jean.dupont@email.com"
                      required
                    >
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label">Sujet</label>
                  <div class="input-with-icon">
                    <i class="bi bi-chat-square-text"></i>
                    <input
                      type="text"
                      v-model="form.sujet"
                      class="form-control"
                      placeholder="Objet de votre message"
                      required
                    >
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label">Message</label>
                  <textarea
                    v-model="form.message"
                    class="form-control"
                    rows="6"
                    placeholder="Décrivez votre demande en quelques lignes..."
                    required
                  ></textarea>
                </div>
              </div>

              <div v-if="error" class="alert-error mt-3">
                <i class="bi bi-exclamation-circle me-2"></i>{{ error }}
              </div>

              <div class="mt-4">
                <button type="submit" class="btn-submit" :disabled="loading">
                  <span v-if="loading" class="spinner"></span>
                  <span v-else><i class="bi bi-send me-2"></i>Envoyer le message</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>

  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Message envoyé</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <div class="success-icon mb-3">
              <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
            </div>
            <h4 class="mb-2">Merci pour votre message !</h4>
            <p class="text-muted mb-1">Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
            <p class="text-muted">Un accusé de réception vous a été envoyé par email.</p>
          </div>
          <div class="modal-footer justify-content-center border-0 pt-0">
            <button type="button" class="btn btn-primary px-4" @click="closeModal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

.contact-page {
  padding: 80px 0;
  background: #fff;
}

.section-header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 50px;
}

.section-tag {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #2c3e91;
  margin-bottom: 8px;
}

.section-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.section-header p {
  color: #6c7280;
  font-size: 1rem;
  margin: 0;
}

/* --- Colonne info --- */
.info-card {
  background: #f8f9fc;
  border: 1px solid #edeef3;
  border-radius: 14px;
  padding: 32px 28px;
  height: 100%;
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.info-card > p.text-muted {
  font-size: 0.9rem;
  margin-bottom: 28px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
}

.info-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e4e6f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e91;
  font-size: 1.05rem;
}

.info-item h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 2px;
}

.info-item p {
  font-size: 0.9rem;
  color: #6c7280;
  margin: 0;
  line-height: 1.5;
}

.social-links {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.social-links a {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e4e6f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e91;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-links a:hover {
  background: #2c3e91;
  color: #fff;
  border-color: #2c3e91;
}

/* --- Formulaire --- */
.form-card {
  background: #fff;
  border: 1px solid #edeef3;
  border-radius: 14px;
  padding: 36px;
  box-shadow: 0 4px 24px rgba(20, 20, 50, 0.04);
  height: 100%;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9aa0b4;
  font-size: 0.95rem;
}

.input-with-icon .form-control {
  padding-left: 40px;
}

.form-control {
  border: 1px solid #e4e6f0;
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 0.92rem;
  color: #1a1a2e;
  background: #fbfbfd;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #2c3e91;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(44, 62, 145, 0.08);
}

textarea.form-control {
  resize: vertical;
  min-height: 140px;
}

.alert-error {
  display: flex;
  align-items: center;
  background: #fdecec;
  color: #c0392b;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.88rem;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  background: #2c3e91;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 13px 28px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #23306f;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* --- Modal --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-dialog {
  width: 100%;
  max-width: 480px;
  margin: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.success-icon {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 767px) {
  .form-card, .info-card {
    padding: 24px 20px;
  }
}

</style>