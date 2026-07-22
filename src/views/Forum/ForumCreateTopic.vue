<template>
  <main id="main">
    <div class="page-title" data-aos="fade">
      <div class="heading">
        <div class="container">
          <div class="row d-flex justify-content-center text-center">
            <div class="col-lg-8">
              <h1>Créer un nouveau sujet</h1>
              <p class="mb-0">Partagez votre question, idée ou problème avec la communauté.</p>
            </div>
          </div>
        </div>
      </div>
      <nav class="breadcrumbs">
        <div class="container">
          <ol>
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/forum">Forum</router-link></li>
            <li class="current">Nouveau Sujet</li>
          </ol>
        </div>
      </nav>
    </div>

    <section class="section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <form @submit.prevent="submitTopic">
                <div class="mb-4">
                  <label for="titre" class="form-label fw-bold">Titre du sujet <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control form-control-lg" 
                    id="titre" 
                    v-model="form.titre" 
                    placeholder="Ex: Comment améliorer ses méthodes de recherche ?" 
                    required 
                    minlength="5"
                    maxlength="255"
                  >
                  <div class="form-text">Soyez clair et précis pour que les autres comprennent votre sujet d'un coup d'œil.</div>
                </div>

                <div class="mb-4">
                  <label for="contenu" class="form-label fw-bold">Contenu <span class="text-danger">*</span></label>
                  <textarea 
                    class="form-control" 
                    id="contenu" 
                    v-model="form.contenu" 
                    rows="8" 
                    placeholder="Détaillez votre question ou votre idée ici..." 
                    required
                    minlength="10"
                  ></textarea>
                </div>

                <!-- Messages d'erreur ou succès -->
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  {{ errorMessage }}
                </div>

                <div class="d-flex justify-content-end gap-3 mt-4">
                  <router-link to="/forum" class="btn btn-light btn-lg rounded-pill">Annuler</router-link>
                  <button type="submit" class="btn btn-primary btn-lg rounded-pill px-4" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Publier le sujet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import forumService from '@/services/forumService';
import { useRouter } from 'vue-router';

export default {
  name: 'ForumCreateTopic',
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
        // On suppose que l'API renvoie le nouveau sujet dans response.data ou response
        const newId = response.data?.id || response.id;
        
        if (newId) {
          this.router.push(`/forum/${newId}`);
        } else {
          // Si on n'a pas l'ID, on retourne à l'index
          this.router.push('/forum');
        }
      } catch (error) {
        console.error("Erreur lors de la création du sujet:", error);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = "Une erreur s'est produite lors de la publication. Veuillez réessayer.";
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
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--color-primary-rgb), 0.25);
}
</style>
