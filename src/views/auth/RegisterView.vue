<template>
  <main id="main" class="main-page">
    <section class="auth-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8">
            <div class="card auth-card shadow-lg border-0 rounded-4" data-aos="fade-up">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h2 class="fw-bold text-primary">Inscription</h2>
                  <p class="text-muted">Rejoignez notre communauté</p>
                </div>

                <div v-if="globalError" class="alert alert-danger rounded-3" role="alert">
                  {{ globalError }}
                </div>

                <form @submit.prevent="handleRegister">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="nom" class="form-label fw-semibold">Nom</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        :class="{'is-invalid': errors.nom}"
                        id="nom" 
                        v-model="form.nom" 
                        placeholder="Dupont"
                      >
                      <div v-if="errors.nom" class="invalid-feedback">
                        {{ errors.nom[0] }}
                      </div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                      <label for="prenom" class="form-label fw-semibold">Prénom</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        :class="{'is-invalid': errors.prenom}"
                        id="prenom" 
                        v-model="form.prenom" 
                        placeholder="Jean"
                      >
                      <div v-if="errors.prenom" class="invalid-feedback">
                        {{ errors.prenom[0] }}
                      </div>
                    </div>
                  </div>

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

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="password" class="form-label fw-semibold">Mot de passe</label>
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
                    
                    <div class="col-md-6 mb-4">
                      <label for="password_confirmation" class="form-label fw-semibold">Confirmer mot de passe</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        id="password_confirmation" 
                        v-model="form.password_confirmation" 
                        placeholder="••••••••"
                      >
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="role" class="form-label fw-semibold">Vous êtes :</label>
                    <select 
                      class="form-select form-select-lg" 
                      :class="{'is-invalid': errors.role}"
                      id="role" 
                      v-model="form.role"
                    >
                      <option value="etudiant">Étudiant</option>
                      <option value="chercheur">Chercheur</option>
                      <option value="client_boutique">Client / Fidèle</option>
                    </select>
                    <div v-if="errors.role" class="invalid-feedback">
                      {{ errors.role[0] }}
                    </div>
                  </div>

                  <div class="d-grid mb-4">
                    <button type="submit" class="btn btn-primary btn-lg fw-bold" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ loading ? 'Inscription...' : 'Créer mon compte' }}
                    </button>
                  </div>

                  <div class="text-center">
                    <span class="text-muted">Vous avez déjà un compte ?</span>
                    <router-link :to="{ name: 'login' }" class="text-decoration-none fw-semibold ms-1">Se connecter</router-link>
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
  nom: '',
  prenom: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'etudiant'
});

const errors = ref({});
const globalError = ref('');
const loading = ref(false);

const handleRegister = async () => {
  errors.value = {};
  globalError.value = '';
  loading.value = true;

  try {
    await authStore.register({ ...form });
    router.push({ name: 'profileInscrit' });
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      globalError.value = "Une erreur s'est produite lors de l'inscription.";
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
  transform: translateY(-3px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,.15)!important;
}
.form-control:focus, .form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--color-primary-rgb), 0.25);
}
</style>
