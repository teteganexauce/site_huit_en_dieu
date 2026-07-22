<template>
  <main id="main">
    <div class="page-title" data-aos="fade">
      <nav class="breadcrumbs">
        <div class="container">
          <ol>
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/forum">Forum</router-link></li>
            <li class="current text-truncate" style="max-width: 200px;">{{ topic ? topic.titre : 'Chargement...' }}</li>
          </ol>
        </div>
      </nav>
    </div>

    <section class="section">
      <div class="container">
        
        <!-- Loader Global -->
        <div v-if="loadingTopic" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
        </div>

        <div v-else-if="topic">
          <!-- Titre du Sujet -->
          <div class="mb-4">
            <h1 class="fw-bold d-flex align-items-center gap-2">
              <span v-if="topic.estEpingle" class="badge bg-danger fs-6"><i class="bi bi-pin-angle-fill"></i></span>
              <span v-if="topic.estFerme" class="badge bg-secondary fs-6"><i class="bi bi-lock-fill"></i></span>
              {{ topic.titre }}
            </h1>
            <div class="text-muted">
              Posté par <span class="fw-bold text-dark">{{ topic.utilisateur?.nom || 'Utilisateur inconnu' }}</span> le {{ formatDate(topic.dateCreation) }}
            </div>
          </div>

          <!-- Message Original (Sujet) -->
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-4 p-md-5">
              <div class="content text-break" style="white-space: pre-line;">
                {{ topic.contenu }}
              </div>
            </div>
          </div>

          <!-- Section Réponses -->
          <div class="d-flex justify-content-between align-items-center mb-4 mt-5">
            <h4 class="mb-0 fw-bold">{{ topic.reponses_count || reponses.length }} Réponse(s)</h4>
          </div>

          <div v-if="loadingReponses" class="text-center py-4">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>

          <div class="responses-list" v-else>
            <!-- Liste des réponses -->
            <div 
              v-for="reponse in reponses" 
              :key="reponse.id" 
              class="card border-0 shadow-sm rounded-4 mb-3"
              :class="{'border-success border-2': reponse.estSolution}"
            >
              <div class="card-body p-4">
                
                <!-- Badge Solution -->
                <div v-if="reponse.estSolution" class="text-success fw-bold mb-2 d-flex align-items-center gap-1">
                  <i class="bi bi-check-circle-fill"></i> Solution marquée par l'auteur
                </div>

                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="d-flex align-items-center gap-2">
                    <div class="bg-light rounded-circle d-flex justify-content-center align-items-center text-primary" style="width: 40px; height: 40px;">
                      <i class="bi bi-person-fill fs-5"></i>
                    </div>
                    <div>
                      <div class="fw-bold">{{ reponse.utilisateur?.nom || 'Utilisateur inconnu' }}</div>
                      <div class="text-muted small">{{ formatDate(reponse.dateCreation) }}</div>
                    </div>
                  </div>
                  
                  <!-- Actions Réponse -->
                  <div class="dropdown">
                    <button class="btn btn-sm btn-light rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                      <li v-if="isAuthor && !reponse.estSolution">
                        <a class="dropdown-item text-success" href="#" @click.prevent="markSolution(reponse.id)">
                          <i class="bi bi-check-circle me-2"></i> Marquer comme solution
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item text-danger" href="#" @click.prevent="reportResponse(reponse.id)">
                          <i class="bi bi-flag me-2"></i> Signaler
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="content text-break" style="white-space: pre-line;">
                  {{ reponse.contenu }}
                </div>
              </div>
            </div>

            <!-- Pagination Réponses -->
            <nav aria-label="Page navigation" class="mt-4" v-if="totalPages > 1">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Précédent</a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                  <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Suivant</a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Formulaire de réponse -->
          <div class="card border-0 shadow-sm rounded-4 mt-5 bg-light" v-if="!topic.estFerme && isLoggedIn">
            <div class="card-body p-4 p-md-5">
              <h5 class="fw-bold mb-3">Votre réponse</h5>
              <form @submit.prevent="submitResponse">
                <div class="mb-3">
                  <textarea 
                    class="form-control bg-white" 
                    v-model="newResponse" 
                    rows="5" 
                    placeholder="Écrivez votre réponse ici..." 
                    required
                  ></textarea>
                </div>
                <div class="text-end">
                  <button type="submit" class="btn btn-primary rounded-pill px-4" :disabled="submittingResponse">
                    <span v-if="submittingResponse" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Envoyer ma réponse
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div v-else-if="topic.estFerme" class="alert alert-secondary mt-5 text-center rounded-4">
            <i class="bi bi-lock-fill fs-4 d-block mb-2"></i>
            Ce sujet a été fermé. Il n'est plus possible d'y répondre.
          </div>
          
          <div v-else-if="!isLoggedIn" class="alert alert-info mt-5 text-center rounded-4">
            <p class="mb-2">Vous devez être connecté pour participer à la discussion.</p>
            <router-link to="/login" class="btn btn-primary btn-sm rounded-pill px-3">Se connecter</router-link>
          </div>

        </div>

        <div v-else class="text-center py-5">
          <h3>Sujet introuvable</h3>
          <p class="text-muted">Le sujet que vous cherchez n'existe pas ou a été supprimé.</p>
          <router-link to="/forum" class="btn btn-primary mt-3">Retour au forum</router-link>
        </div>

      </div>
    </section>
  </main>
</template>

<script>
import forumService from '@/services/forumService';
import authService from '@/services/authService';

export default {
  name: 'ForumTopic',
  data() {
    return {
      topic: null,
      reponses: [],
      loadingTopic: true,
      loadingReponses: false,
      currentPage: 1,
      totalPages: 1,
      newResponse: '',
      submittingResponse: false,
      currentUser: null,
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    isAuthor() {
      if (!this.topic || !this.currentUser) return false;
      return this.topic.utilisateur?.id === this.currentUser.id;
    }
  },
  async mounted() {
    if (this.isLoggedIn) {
      try {
        // Optionnel : récupérer le user actuel pour vérifier s'il est l'auteur (bouton Solution)
        const userResp = await authService.getUserProfile();
        this.currentUser = userResp.data;
      } catch (e) {
        // ignorer
      }
    }
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const topicId = this.$route.params.id;
      this.loadingTopic = true;
      try {
        const res = await forumService.getSujet(topicId);
        this.topic = res.data || res;
        await this.fetchReponses(1);
      } catch (error) {
        console.error("Erreur de récupération du sujet", error);
      } finally {
        this.loadingTopic = false;
      }
    },
    async fetchReponses(page = 1) {
      const topicId = this.$route.params.id;
      this.loadingReponses = true;
      try {
        const res = await forumService.getReponses(topicId, { page });
        this.reponses = res.data || [];
        if (res.meta) {
          this.currentPage = res.meta.current_page;
          this.totalPages = res.meta.last_page;
        } else {
          this.totalPages = 1;
        }
      } catch (error) {
        console.error("Erreur de récupération des réponses", error);
      } finally {
        this.loadingReponses = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchReponses(page);
      }
    },
    async submitResponse() {
      if (!this.newResponse.trim()) return;
      this.submittingResponse = true;
      try {
        const topicId = this.topic.id;
        await forumService.createReponse(topicId, { contenu: this.newResponse });
        this.newResponse = '';
        // Recharger les réponses (idéalement aller à la dernière page)
        await this.fetchData(); 
      } catch (error) {
        alert("Erreur lors de l'envoi de la réponse.");
        console.error(error);
      } finally {
        this.submittingResponse = false;
      }
    },
    async markSolution(reponseId) {
      try {
        await forumService.marquerSolution(reponseId);
        // Refresh
        this.fetchReponses(this.currentPage);
      } catch (error) {
        alert("Erreur lors du marquage.");
      }
    },
    async reportResponse(reponseId) {
      const motif = prompt("Veuillez indiquer le motif du signalement :");
      if (!motif) return;
      try {
        await forumService.signalerReponse(reponseId, { motif });
        alert("Signalement envoyé avec succès.");
      } catch (error) {
        alert("Erreur lors du signalement.");
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
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
