<template>
  <main id="main" class="main-page">
    <section class="auth-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-8">
            <div class="card auth-card shadow-lg border-0 rounded-4" data-aos="fade-up">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h2 class="fw-bold text-primary">Mot de passe oublié</h2>
                  <p class="text-muted">Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
                </div>

                <div v-if="globalError" class="alert alert-danger rounded-3" role="alert">
                  {{ globalError }}
                </div>
                
                <div v-if="successMessage" class="alert alert-success rounded-3" role="alert">
                  {{ successMessage }}
                </div>

                <form @submit.prevent="handleForgot" v-if="!successMessage">
                  <div class="mb-4">
                    <label for="email" class="form-label fw-semibold">Adresse Email</label>
                    <input 
                      type="email" 
                      class="form-control form-control-lg" 
                      :class="{'is-invalid': errors.email}"
                      id="email" 
                      v-model="email" 
                      placeholder="nom@exemple.com"
                    >
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email[0] }}
                    </div>
                  </div>

                  <div class="d-grid mb-4">
                    <button type="submit" class="btn btn-primary btn-lg fw-bold" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
                    </button>
                  </div>
                </form>

                <div class="text-center mt-3">
                  <router-link :to="{ name: 'login' }" class="text-decoration-none fw-semibold">Retour à la connexion</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import authService from '../../services/authService';

const email = ref('');
const errors = ref({});
const globalError = ref('');
const successMessage = ref('');
const loading = ref(false);

const handleForgot = async () => {
  errors.value = {};
  globalError.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    const response = await authService.forgotPassword(email.value);
    successMessage.value = response.message || "Un lien de réinitialisation a été envoyé à votre adresse email.";
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors || {};
    } else if (error.response && error.response.status === 429) {
      globalError.value = "Vous avez fait trop de tentatives. Veuillez patienter avant de réessayer.";
    } else {
      globalError.value = "Une erreur s'est produite. Veuillez réessayer.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
}
.auth-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
}
.form-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--color-primary-rgb), 0.25);
}
</style>
