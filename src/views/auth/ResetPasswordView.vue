<template>
  <main id="main" class="main-page">
    <section class="auth-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-8">
            <div class="card auth-card shadow-lg border-0 rounded-4" data-aos="fade-up">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h2 class="fw-bold text-primary">Réinitialiser</h2>
                  <p class="text-muted">Définissez votre nouveau mot de passe</p>
                </div>

                <div v-if="globalError" class="alert alert-danger rounded-3" role="alert">
                  {{ globalError }}
                </div>
                
                <div v-if="successMessage" class="alert alert-success rounded-3" role="alert">
                  {{ successMessage }}
                  <div class="mt-2">
                    <router-link :to="{ name: 'login' }" class="btn btn-sm btn-success">Aller à la connexion</router-link>
                  </div>
                </div>

                <form @submit.prevent="handleReset" v-if="!successMessage">
                  <div class="mb-3">
                    <label for="email" class="form-label fw-semibold">Adresse Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      :class="{'is-invalid': errors.email}"
                      id="email" 
                      v-model="form.email" 
                      placeholder="nom@exemple.com"
                    >
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email[0] }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="password" class="form-label fw-semibold">Nouveau mot de passe</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      :class="{'is-invalid': errors.password}"
                      id="password" 
                      v-model="form.password" 
                      placeholder="••••••••"
                    >
                    <div v-if="errors.password" class="invalid-feedback">
                      {{ errors.password[0] }}
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="password_confirmation" class="form-label fw-semibold">Confirmer le nouveau mot de passe</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="password_confirmation" 
                      v-model="form.password_confirmation" 
                      placeholder="••••••••"
                    >
                  </div>

                  <div class="d-grid mb-4">
                    <button type="submit" class="btn btn-primary btn-lg fw-bold" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ loading ? 'Mise à jour...' : 'Mettre à jour' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import authService from '../../services/authService';

const route = useRoute();

const form = reactive({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const errors = ref({});
const globalError = ref('');
const successMessage = ref('');
const loading = ref(false);

onMounted(() => {
  // Récupérer le token depuis l'URL /password-reset/:token
  form.token = route.params.token || '';
  // Optionnel: On peut aussi récupérer l'email si passé en paramètre de requête (ex: ?email=...)
  form.email = route.query.email || '';
});

const handleReset = async () => {
  errors.value = {};
  globalError.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    const response = await authService.resetPassword({ ...form });
    successMessage.value = response.message || "Votre mot de passe a été réinitialisé avec succès.";
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      globalError.value = "Une erreur s'est produite ou le token est invalide.";
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
