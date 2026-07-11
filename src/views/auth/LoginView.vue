<template>
  <main id="main" class="main-page">
    <section class="auth-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-8">
            <div class="card auth-card shadow-lg border-0 rounded-4" data-aos="fade-up">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h2 class="fw-bold text-primary">Connexion</h2>
                  <p class="text-muted">Accédez à votre espace personnel</p>
                </div>

                <div v-if="globalError" class="alert alert-danger rounded-3" role="alert">
                  {{ globalError }}
                </div>

                <form @submit.prevent="handleLogin">
                  <div class="mb-4">
                    <label for="email" class="form-label fw-semibold">Adresse Email</label>
                    <input 
                      type="email" 
                      class="form-control form-control-lg" 
                      :class="{'is-invalid': errors.email}"
                      id="email" 
                      v-model="form.email" 
                      placeholder="nom@exemple.com"
                    >
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email[0] }}
                    </div>
                  </div>

                  <div class="mb-4">
                    <div class="d-flex justify-content-between">
                      <label for="password" class="form-label fw-semibold">Mot de passe</label>
                      <router-link :to="{ name: 'forgotPassword' }" class="text-decoration-none small">Mot de passe oublié ?</router-link>
                    </div>
                    <input 
                      type="password" 
                      class="form-control form-control-lg" 
                      :class="{'is-invalid': errors.password}"
                      id="password" 
                      v-model="form.password" 
                      placeholder="••••••••"
                    >
                    <div v-if="errors.password" class="invalid-feedback">
                      {{ errors.password[0] }}
                    </div>
                  </div>

                  <div class="d-grid mb-4">
                    <button type="submit" class="btn btn-primary btn-lg fw-bold" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ loading ? 'Connexion...' : 'Se connecter' }}
                    </button>
                  </div>

                  <div class="text-center">
                    <span class="text-muted">Pas encore de compte ?</span>
                    <router-link :to="{ name: 'register' }" class="text-decoration-none fw-semibold ms-1">Créer un compte</router-link>
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const errors = ref({});
const globalError = ref('');
const loading = ref(false);

const handleLogin = async () => {
  errors.value = {};
  globalError.value = '';
  loading.value = true;

  try {
    await authStore.login({
      email: form.email,
      password: form.password
    });
    // Redirection après connexion
    router.push({ name: 'profileInscrit' });
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors || {};
    } else if (error.response && error.response.status === 401) {
      globalError.value = "Identifiants incorrects. Veuillez réessayer.";
    } else {
      globalError.value = "Une erreur s'est produite lors de la connexion.";
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
