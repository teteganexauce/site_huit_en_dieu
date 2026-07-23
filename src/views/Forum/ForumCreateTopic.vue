<template>
  <BreadcombsComponent title="Nouvelle Discussion" />
  <main id="main" class="bg-white min-vh-100 pb-5">

    <section class="section pt-4 position-relative z-2">
      <div class="container" style="max-width: 850px;">
        
        <!-- Form Card -->
        <div class="card border shadow-sm rounded-4 overflow-hidden">
          
          <div class="card-body p-4 p-md-5">
            <form @submit.prevent="submitTopic">
              
              <div class="mb-4 pb-2">
                <label for="titre" class="form-label fw-bold text-dark fs-5">Titre du sujet <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control form-control-lg bg-light border-0 px-4 py-3 rounded-3" 
                  id="titre" 
                  v-model="form.titre" 
                  placeholder="Soyez clair et précis (ex: Problème avec la méthode X)" 
                  required 
                  minlength="5"
                  maxlength="255"
                  style="box-shadow: none;"
                >
                <div class="form-text mt-2 text-muted small"><i class="bi bi-info-circle me-1"></i> Un bon titre attire plus de réponses.</div>
              </div>

              <div class="mb-4">
                <label for="contenu" class="form-label fw-bold text-dark fs-5">Détails de votre demande <span class="text-danger">*</span></label>
                <textarea 
                  class="form-control bg-light border-0 px-4 py-3 rounded-3" 
                  id="contenu" 
                  v-model="form.contenu" 
                  style="height: 250px; resize: vertical; box-shadow: none;" 
                  placeholder="Décrivez votre question ou votre idée avec le plus de détails possible..." 
                  required
                  minlength="10"
                ></textarea>
              </div>

              <!-- Messages d'erreur -->
              <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center p-3 mb-4 rounded-3 border-0" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                <div>{{ errorMessage }}</div>
              </div>

              <div class="d-flex justify-content-between align-items-center border-top pt-4 mt-5">
                <router-link to="/forum" class="btn btn-light rounded-pill px-4 text-secondary fw-semibold border">
                  Annuler
                </router-link>
                <button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm" :disabled="loading || !form.titre || !form.contenu">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <i v-else class="bi bi-send-fill me-2"></i> Publier le sujet
                </button>
              </div>
              
            </form>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script>
import forumService from '@/services/forumService';
import { useRouter } from 'vue-router';
import BreadcombsComponent from '@/includes/breadcombs.vue';

export default {
  name: 'ForumCreateTopic',
  components: {
    BreadcombsComponent
  },
  data() {
    return {
      form: {
        titre: '',
        contenu: ''
      },
      loading: false,
      errorMessage: ''
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async submitTopic() {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        const response = await forumService.createSujet(this.form);
        const newId = response.data?.id || response.id;
        
        if (newId) {
          this.router.push(`/forum/${newId}`);
        } else {
          this.router.push('/forum');
        }
      } catch (error) {
        console.error("Erreur lors de la création du sujet:", error);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = "Une erreur s'est produite lors de la publication. Veuillez réessayer plus tard.";
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.form-control:focus {
  background-color: #fff !important;
  border: 1px solid var(--color-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--color-primary-rgb), 0.1) !important;
}
</style>
