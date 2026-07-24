<template>
  <main class="login-page">
    <div class="bg-particles" ref="particlesRef"></div>

    <div class="login-wrapper">
      <div class="login-card">
        <div class="logo-container">
          <img v-if="siteStore.siteLogo" :src="siteStore.siteLogo" alt="Logo" class="logo-img">
          <div v-else class="logo-icon">&#10013;</div>
          <h1 class="logo-title">{{ siteDisplayName }}</h1>
          <div class="logo-subtitle">Créer un compte</div>
        </div>

        <div v-if="globalError" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ globalError }}</span>
        </div>

        <div v-if="errors.nom && errors.nom[0]" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{{ errors.nom[0] }}</span>
        </div>

        <div v-if="errors.prenom && errors.prenom[0]" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{{ errors.prenom[0] }}</span>
        </div>

        <div v-if="errors.email && errors.email[0]" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{{ errors.email[0] }}</span>
        </div>

        <div v-if="errors.password && errors.password[0]" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{{ errors.password[0] }}</span>
        </div>

        <div v-if="errors.role && errors.role[0]" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{{ errors.role[0] }}</span>
        </div>

        <form @submit.prevent="handleRegister" autocomplete="off">
          <div class="row g-3">
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Nom</label>
                <input type="text" v-model="form.nom" class="form-input" :class="{ 'error': errors.nom }" placeholder="Dupont">
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Prénom</label>
                <input type="text" v-model="form.prenom" class="form-input" :class="{ 'error': errors.prenom }" placeholder="Jean">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Adresse email</label>
            <input type="email" v-model="form.email" class="form-input" :class="{ 'error': errors.email }" placeholder="nom@exemple.com">
          </div>

          <div class="row g-3">
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Mot de passe</label>
                <div class="password-wrapper">
                  <input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="form-input" :class="{ 'error': errors.password }" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;">
                  <button type="button" class="password-toggle" @click="showPassword = !showPassword" tabindex="-1">
                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Confirmer</label>
                <div class="password-wrapper">
                  <input :type="showConfirm ? 'text' : 'password'" v-model="form.password_confirmation" class="form-input" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;">
                  <button type="button" class="password-toggle" @click="showConfirm = !showConfirm" tabindex="-1">
                    <svg v-if="showConfirm" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Vous êtes</label>
            <select v-model="form.role" class="form-input" :class="{ 'error': errors.role }">
              <option value="etudiant" style="background:#1e293b;color:white">Étudiant</option>
              <option value="chercheur" style="background:#1e293b;color:white">Chercheur</option>
              <option value="client_boutique" style="background:#1e293b;color:white">Client / Fidèle</option>
            </select>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M20 12h-13l3 -3m0 6l-3 -3" />
            </svg>
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Inscription...' : 'Créer mon compte' }}
          </button>
        </form>

        <div class="login-footer">
          <span>{{ siteDisplayName }}</span> &bull; v2.0.1
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useSiteStore } from '../../stores/site'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const siteStore = useSiteStore()

const siteDisplayName = computed(() => {
  return siteStore.settings.SITE_NAME || 'Huit en Dieu'
})

const particlesRef = ref(null)

const showPassword = ref(false)
const showConfirm = ref(false)

const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'etudiant'
})

const errors = ref({})
const globalError = ref('')
const loading = ref(false)

const handleRegister = async () => {
  errors.value = {}
  globalError.value = ''
  loading.value = true

  try {
    await authStore.register({ ...form })
    const redirectPath = route.query.redirect || { name: 'profileInscrit' }
    router.push(redirectPath)
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      globalError.value = "Une erreur s'est produite lors de l'inscription."
    }
  } finally {
    loading.value = false
  }
}

function createParticles() {
  if (!particlesRef.value) return
  const container = particlesRef.value
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    const size = Math.random() * 200 + 50
    particle.style.width = size + 'px'
    particle.style.height = size + 'px'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.animationDuration = (Math.random() * 30 + 20) + 's'
    particle.style.animationDelay = (Math.random() * 20) + 's'
    container.appendChild(particle)
  }
}

onMounted(() => {
  siteStore.fetchSettings()
  createParticles()
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  position: fixed;
  inset: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
    #0f172a;
  z-index: 0;
}

.bg-particles {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.03), transparent);
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) scale(1); opacity: 0; }
}

.login-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 32px;
  padding: 48px 40px 40px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.logo-container {
  text-align: center;
  margin-bottom: 28px;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 18px;
  font-size: 28px;
  font-weight: 900;
  color: white;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.logo-icon:hover {
  transform: scale(1.05) rotate(-2deg);
}

.logo-img {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  object-fit: contain;
  margin-bottom: 16px;
  background: rgba(255,255,255,0.06);
  padding: 6px;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  transition: transform 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.05) rotate(-2deg);
}

.logo-title {
  color: white;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0 0 4px;
}

.logo-subtitle {
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: white;
  font-size: 15px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  transition: all 0.25s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper .form-input {
  padding-right: 44px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.password-toggle:hover {
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.06);
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.form-input.error {
  border-color: rgba(239, 68, 68, 0.4);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.08);
}

.form-input option {
  background: #1e293b;
  color: white;
}

.btn-login {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25);
  position: relative;
  overflow: hidden;
  margin-top: 4px;
}

.btn-login::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.35);
}

.btn-login:hover::before {
  opacity: 1;
}

.btn-login:active {
  transform: translateY(0);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.12);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 18px;
  color: rgba(239, 68, 68, 0.9);
  font-size: 13px;
  font-weight: 500;
}

.error-message svg {
  flex-shrink: 0;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.2);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.login-footer span {
  color: rgba(255, 255, 255, 0.15);
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px 28px;
    border-radius: 24px;
  }
  .logo-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
    border-radius: 16px;
  }
  .logo-img {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }
  .logo-title {
    font-size: 20px;
  }
}
</style>
