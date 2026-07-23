<template>
  <BreadcombsComponent title="Forum - Sujet" />
  <main id="main" class="forum-page bg-white min-vh-100 pb-5">

    <section class="section pt-4">
      <div class="container" style="max-width: 950px;">
        
        <!-- Breadcrumb & Back -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none text-muted">Accueil</router-link></li>
              <li class="breadcrumb-item"><router-link to="/forum" class="text-decoration-none text-muted">Forum</router-link></li>
              <li class="breadcrumb-item active text-truncate fw-medium text-dark" aria-current="page" style="max-width: 250px;">
                {{ topic ? topic.titre : 'Chargement...' }}
              </li>
            </ol>
          </nav>
          <router-link to="/forum" class="btn btn-sm btn-white border shadow-sm text-dark fw-medium rounded-pill px-3">
            <i class="bi bi-arrow-left me-1"></i> Retour au forum
          </router-link>
        </div>

        <!-- Loader Global -->
        <div v-if="loadingTopic" class="text-center py-5 my-5">
          <div class="spinner-grow text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Chargement...</span>
          </div>
        </div>

        <div v-else-if="topic">
          
          <!-- Message Original (Sujet) -->
          <div class="card border shadow-sm rounded-4 mb-4 overflow-hidden">
            <div class="card-header bg-white border-bottom-0 p-3 p-md-4 pb-0 d-flex flex-column gap-3">
              <div class="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <span class="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 fw-semibold small"><i class="bi bi-question-circle-fill me-1"></i> Question initiale</span>
                  <span v-if="topic.estEpingle" class="badge bg-danger-subtle text-danger rounded-pill px-2 py-1 fw-semibold small"><i class="bi bi-pin-angle-fill me-1"></i> Épinglé</span>
                  <span v-if="topic.estFerme" class="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1 fw-semibold small"><i class="bi bi-lock-fill me-1"></i> Fermé</span>
                </div>
                
                <button v-if="hasSolutions" @click="showSolutionsInCard = !showSolutionsInCard" class="btn btn-sm btn-success bg-success-subtle text-success border border-success border-opacity-25 rounded-pill fw-bold shadow-sm px-3 flex-shrink-0">
                  <i class="bi" :class="showSolutionsInCard ? 'bi-arrow-return-left' : 'bi-check-circle-fill'"></i> 
                  {{ showSolutionsInCard ? 'Voir la question' : 'Voir les solutions (' + solutionsCount + ')' }}
                </button>
              </div>
              <h1 class="fw-bold text-dark mb-0 topic-title lh-sm">{{ topic.titre }}</h1>
            </div>
            
            <div class="card-body p-3 p-md-4 pt-3 pb-2">
              
              <!-- Affichage du sujet par défaut -->
              <div v-if="!showSolutionsInCard">
                <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <div class="d-flex align-items-center gap-2">
                    <img :src="topic.auteur?.photo_profil_url || defaultAvatar" class="rounded-circle shadow-sm" style="width: 40px; height: 40px; object-fit: cover;" alt="Avatar">
                    <div>
                      <div class="fw-bold text-dark">{{ topic.auteur?.name || 'Utilisateur inconnu' }}</div>
                      <div class="text-muted small">{{ formatDate(topic.dateCreation) }}</div>
                    </div>
                  </div>
                  <div class="text-secondary d-none d-sm-block">
                    <span class="badge bg-light text-dark border px-2 py-1 me-2"><i class="bi bi-chat-text text-muted me-1"></i> {{ topic.reponses_count || reponses.length }} réponse(s)</span>
                  </div>
                </div>

                <div class="topic-content text-dark mb-3" style="white-space: pre-line; line-height: 1.6; font-size: 1.05rem; word-break: break-word;">
                  {{ topic.contenu }}
                </div>
              </div>

              <!-- Affichage de la/les solution(s) -->
              <div v-else class="solutions-container mt-2">
                <div v-for="(sol, index) in approvedSolutions" :key="sol.id" class="mb-4">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <img :src="sol.auteur?.photo_profil_url || defaultAvatar" class="rounded-circle shadow-sm" style="width: 32px; height: 32px; object-fit: cover;" alt="Avatar">
                    <span class="fw-bold text-dark small">{{ sol.auteur?.name || 'Utilisateur inconnu' }}</span>
                    <span class="text-muted small" style="font-size: 0.8rem;">• {{ formatDate(sol.dateCreation) }}</span>
                  </div>
                  <div class="p-3 p-md-4 bg-success-subtle border border-success border-opacity-25 rounded-3 text-dark shadow-sm" style="white-space: pre-line; line-height: 1.6; font-size: 1.05rem; word-break: break-word;">
                    {{ sol.contenu }}
                  </div>
                  <hr v-if="index < approvedSolutions.length - 1" class="my-4 text-success border-success opacity-25">
                </div>
              </div>

            </div>
          </div>



          <!-- Section Réponses -->
          <div class="d-flex justify-content-between align-items-center mb-3 mt-4">
            <h5 class="mb-0 fw-bold text-dark">
              Réponses <span class="badge bg-light text-secondary border rounded-pill ms-2">{{ topic.reponses_count || reponses.length }}</span>
            </h5>
          </div>

          <div v-if="loadingReponses" class="text-center py-4">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>

          <div class="responses-list" v-else>
            <!-- Liste des réponses -->
            <div 
              v-for="reponse in reponses" 
              :key="reponse.id" 
              class="card border-0 shadow-sm rounded-4 mb-4 position-relative"
              :class="{'border-start border-success border-5': reponse.estSolution}"
            >
              <div class="card-body p-3 p-md-4">
                <!-- Top Status Bar for Solution -->
                <div v-if="reponse.estSolution" class="d-flex flex-wrap align-items-center mb-3 pb-2 border-bottom">
                  <span class="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold border border-success border-opacity-25">
                    <i class="bi bi-check-circle-fill me-1"></i> Solution approuvée
                  </span>
                </div>

                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-3 gap-3">
                  <div class="d-flex align-items-center gap-3">
                    <img :src="reponse.auteur?.photo_profil_url || defaultAvatar" class="rounded-circle shadow-sm flex-shrink-0" style="width: 40px; height: 40px; object-fit: cover;" alt="Avatar">
                    <div>
                      <div class="fw-bold text-dark text-break">{{ reponse.auteur?.name || 'Utilisateur inconnu' }}</div>
                      <div class="text-muted small" style="font-size: 0.85rem;">{{ formatDate(reponse.dateCreation) }}</div>
                    </div>
                  </div>
                  
                  <!-- Actions Réponse -->
                  <div class="dropdown align-self-end align-self-sm-start mt-2 mt-sm-0" style="position: relative;" @click.stop v-if="hasDropdown(reponse)">
                    <button class="btn btn-sm btn-light rounded-circle btn-icon border-0" type="button" @click="toggleDropdown(reponse.id)">
                      <i class="bi bi-three-dots-vertical text-secondary"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 py-2" :class="{ 'show': activeDropdown === reponse.id }" style="position: absolute; right: 0; top: 100%; z-index: 1050;">
                      <li v-if="isAuthor && !reponse.estSolution">
                        <a class="dropdown-item text-success fw-medium" href="#" @click.prevent="markSolution(reponse.id)">
                          <i class="bi bi-check-circle me-2"></i> Marquer comme solution
                        </a>
                      </li>
                      <li v-if="currentUser?.id === reponse.auteur?.id">
                        <a class="dropdown-item text-primary fw-medium" href="#" @click.prevent="startEditing(reponse)">
                          <i class="bi bi-pencil-square me-2"></i> Modifier
                        </a>
                      </li>
                      <li v-if="currentUser?.id === reponse.auteur?.id">
                        <a class="dropdown-item text-danger fw-medium" href="#" @click.prevent="deleteResponse(reponse.id)">
                          <i class="bi bi-trash me-2"></i> Supprimer
                        </a>
                      </li>
                      <li v-if="isLoggedIn && currentUser?.id !== reponse.auteur?.id && reponse.auteur?.role !== 'admin'">
                        <a class="dropdown-item text-warning fw-medium" href="#" @click.prevent="openReportModal(reponse.id)">
                          <i class="bi bi-flag me-2"></i> Signaler
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Edition Inline -->
                <div v-if="editingResponseId === reponse.id" class="mt-2">
                  <textarea class="form-control mb-2" rows="4" v-model="editingContent"></textarea>
                  <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-sm btn-light" @click="cancelEditing()">Annuler</button>
                    <button class="btn btn-sm btn-primary" @click="saveEditing(reponse.id)" :disabled="!editingContent.trim()">Enregistrer</button>
                  </div>
                </div>
                <!-- Contenu Normal -->
                <div v-else class="response-content text-dark mt-2" style="white-space: pre-line; line-height: 1.6; font-size: 1.05rem; word-break: break-word;">
                  {{ reponse.contenu }}
                </div>
              </div>
            </div>

            <!-- Pagination Réponses -->
            <nav aria-label="Page navigation" class="mt-4" v-if="totalPages > 1">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link shadow-sm border-0 rounded-start-pill px-3 text-secondary" href="#" @click.prevent="changePage(currentPage - 1)">
                    <i class="bi bi-chevron-left"></i>
                  </a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                  <a class="page-link shadow-sm border-0 text-secondary fw-medium" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link shadow-sm border-0 rounded-end-pill px-3 text-secondary" href="#" @click.prevent="changePage(currentPage + 1)">
                    <i class="bi bi-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Formulaire de réponse -->
          <div id="reply-section" class="card border shadow-sm rounded-4 mt-4 bg-white overflow-hidden" v-if="!topic.estFerme && isLoggedIn">
            <div class="card-body p-3 p-md-4">
              <div class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-reply-fill text-primary fs-4"></i>
                <h5 class="fw-bold mb-0 text-dark">Votre réponse</h5>
              </div>
              <form @submit.prevent="submitResponse">
                <div class="form-floating mb-3">
                  <textarea 
                    class="form-control border bg-light rounded-3" 
                    id="replyTextarea"
                    v-model="newResponse" 
                    style="height: 120px; resize: none; box-shadow: none;" 
                    placeholder="Écrivez votre réponse ici..." 
                    required
                  ></textarea>
                  <label for="replyTextarea" class="text-muted">Détaillez votre aide ou commentaire ici...</label>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm fw-semibold" :disabled="submittingResponse || !newResponse.trim()">
                    <span v-if="submittingResponse" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Publier la réponse
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div v-else-if="topic.estFerme" class="card border-0 bg-secondary-subtle mt-5 text-center py-5 rounded-4 shadow-sm">
            <div class="card-body">
              <div class="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style="width: 60px; height: 60px;">
                <i class="bi bi-lock-fill fs-3 text-secondary"></i>
              </div>
              <h5 class="fw-bold text-dark">Discussion fermée</h5>
              <p class="mb-0 text-muted">Ce sujet n'accepte plus de nouvelles réponses.</p>
            </div>
          </div>
          
          <div v-else-if="!isLoggedIn" class="card border-0 shadow-sm mt-5 rounded-4 bg-primary text-white text-center py-5">
            <div class="card-body py-4">
              <i class="bi bi-chat-quote fs-1 d-block mb-3 opacity-75"></i>
              <h4 class="fw-bold">Participez à la discussion</h4>
              <p class="mb-4 text-white-50 fs-5">Connectez-vous pour partager votre savoir et aider les autres membres.</p>
              <router-link to="/login" class="btn btn-light btn-lg rounded-pill px-5 text-primary fw-bold shadow-sm">Se connecter</router-link>
            </div>
          </div>

        </div>

        <div v-else class="text-center py-5 my-5">
          <i class="bi bi-exclamation-circle text-muted mb-3 d-block" style="font-size: 4rem;"></i>
          <h2 class="fw-bold text-dark">Sujet introuvable</h2>
          <p class="text-muted fs-5">Le sujet que vous cherchez n'existe pas ou a été supprimé.</p>
          <router-link to="/forum" class="btn btn-primary btn-lg rounded-pill mt-3 px-4 shadow-sm">
            Retour au forum
          </router-link>
        </div>

      </div>
    </section>

    <!-- Modal Signaler -->
    <div class="modal fade" id="reportModal" tabindex="-1" aria-labelledby="reportModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom py-3 bg-light rounded-top-4">
            <h5 class="modal-title fw-bold text-danger mb-0" id="reportModalLabel"><i class="bi bi-flag-fill me-2"></i> Signaler un abus</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="submitReport">
            <div class="modal-body p-4">
              <p class="text-muted mb-4 small">Aidez-nous à maintenir un espace respectueux. Pourquoi signalez-vous ce contenu ?</p>
              
              <div class="mb-3">
                <label for="reportReasonSelect" class="form-label fw-semibold text-dark">Motif du signalement</label>
                <select class="form-select form-select-lg bg-light border-0 fs-6" id="reportReasonSelect" v-model="reportReason" required style="box-shadow: none;">
                  <option value="" disabled>Choisissez une raison...</option>
                  <option value="Spam ou publicité">Spam ou publicité</option>
                  <option value="Langage inapproprié ou insultes">Langage inapproprié ou insultes</option>
                  <option value="Harcèlement">Harcèlement</option>
                  <option value="Contenu hors sujet">Contenu hors sujet</option>
                  <option value="Autre">Autre (précisez ci-dessous)</option>
                </select>
              </div>

              <div class="mb-2" v-if="reportReason === 'Autre'">
                <label for="reportDetails" class="form-label fw-semibold text-dark">Détails supplémentaires</label>
                <textarea 
                  class="form-control bg-light border-0" 
                  id="reportDetails" 
                  v-model="reportDetails" 
                  style="height: 100px; resize: none; box-shadow: none;" 
                  placeholder="Veuillez donner plus d'informations..."
                  required
                ></textarea>
              </div>
            </div>
            <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
              <button type="button" class="btn btn-light rounded-pill px-4 text-dark fw-medium border" data-bs-dismiss="modal">Annuler</button>
              <button type="submit" class="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm" :disabled="reportingLoading || !reportReason">
                <span v-if="reportingLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Envoyer le signalement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
<div v-if="activeDropdown" @click="activeDropdown = null" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1040;"></div>
  </main>
</template>

<script>
import forumService from '@/services/forumService';
import authService from '@/services/authService';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import BreadcombsComponent from '@/includes/breadcombs.vue';
import defaultAvatar from '@/assets/img/portfolio/app-1.jpg';

export default {
  name: 'ForumTopic',
  components: {
    BreadcombsComponent
  },
  data() {
    return {
      defaultAvatar,
      topic: null,
      showSolutionsInCard: false,
      reponses: [],
      loadingTopic: true,
      loadingReponses: false,
      currentPage: 1,
      totalPages: 1,
      newResponse: '',
      submittingResponse: false,
      currentUser: null,
      
      reportModalInstance: null,
      reportingResponseId: null,
      reportReason: '',
      reportDetails: '',
      reportingLoading: false,
      
      editingResponseId: null,
      editingContent: '',

      activeDropdown: null
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    isAdmin() {
      return this.currentUser?.role === 'admin';
    },
    isAuthor() {
      if (!this.topic || !this.currentUser) return false;
      return this.topic.auteur?.id === this.currentUser.id;
    },
    hasSolutions() {
      return this.reponses.some(r => r.estSolution);
    },
    solutionsCount() {
      return this.reponses.filter(r => r.estSolution).length;
    },
    approvedSolutions() {
      return this.reponses.filter(r => r.estSolution);
    }
  },
  async mounted() {
    this.reportModalInstance = new bootstrap.Modal(document.getElementById('reportModal'));

    if (this.isLoggedIn) {
      try {
        const userResp = await authService.getProfile();
        this.currentUser = userResp.data || userResp;
      } catch (e) {
        // ignorer
      }
    }
    this.fetchData();
  },
  methods: {
    toggleDropdown(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = id;
      }
    },
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
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    },
    async submitResponse() {
      if (!this.newResponse.trim()) return;
      this.submittingResponse = true;
      try {
        const topicId = this.topic.id;
        await forumService.createReponse(topicId, { contenu: this.newResponse });
        this.newResponse = '';
        await this.fetchData(); 
      } catch (error) {
        if (error.response && error.response.status === 403) {
            alert(error.response.data.message || "Vous avez été bloqué et ne pouvez plus participer au forum.");
        } else {
            alert("Erreur lors de l'envoi de la réponse.");
        }
      } finally {
        this.submittingResponse = false;
      }
    },
    
    // -- Modération & Edition Inline --
    startEditing(reponse) {
        this.activeDropdown = null;
        this.editingResponseId = reponse.id;
        this.editingContent = reponse.contenu;
    },
    cancelEditing() {
        this.editingResponseId = null;
        this.editingContent = '';
    },
    async saveEditing(reponseId) {
        try {
            await forumService.updateReponse(reponseId, { contenu: this.editingContent });
            this.cancelEditing();
            this.fetchReponses(this.currentPage);
        } catch (error) {
            alert("Erreur lors de la modification de la réponse.");
        }
    },
    hasDropdown(reponse) {
      if (!this.isLoggedIn) return false;
      if (reponse.auteur?.role === 'admin') return false; // Ne jamais afficher les 3 points sur la réponse d'un admin
      
      if (this.currentUser?.id === reponse.auteur?.id) return true;
      if (this.isAuthor && !reponse.estSolution) return true;
      if (this.currentUser?.id !== reponse.auteur?.id && reponse.auteur?.role !== 'admin') return true;
      
      return false;
    },
    async deleteResponse(reponseId) {
        this.activeDropdown = null;
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")) return;
        try {
            await forumService.deleteReponse(reponseId);
            this.fetchReponses(this.currentPage);
        } catch (error) {
            alert("Erreur lors de la suppression.");
        }
    },
    async banUser(userId) {
        this.activeDropdown = null;
        if (!confirm("Êtes-vous sûr de vouloir bloquer cet utilisateur du forum ?")) return;
        try {
            await forumService.banUser(userId);
            alert("Utilisateur bloqué avec succès.");
        } catch (error) {
            alert("Erreur lors du blocage de l'utilisateur.");
        }
    },
    
    async markSolution(reponseId) {
      this.activeDropdown = null;
      try {
        await forumService.marquerSolution(reponseId);
        this.fetchReponses(this.currentPage);
      } catch (error) {
        alert("Erreur lors du marquage.");
      }
    },
    openReportModal(reponseId) {
      this.activeDropdown = null;
      this.reportingResponseId = reponseId;
      this.reportReason = '';
      this.reportDetails = '';
      this.reportModalInstance.show();
    },
    async submitReport() {
      if (!this.reportReason || !this.reportingResponseId) return;
      
      const finalMotif = this.reportReason === 'Autre' ? this.reportDetails : this.reportReason;
      
      if (this.reportReason === 'Autre' && !this.reportDetails.trim()) {
        alert("Veuillez préciser le motif.");
        return;
      }

      this.reportingLoading = true;
      try {
        await forumService.signalerReponse(this.reportingResponseId, { motif: finalMotif });
        this.reportModalInstance.hide();
      } catch (error) {
        alert("Erreur lors du signalement.");
      } finally {
        this.reportingLoading = false;
      }
    },
    scrollToReply() {
      const replySection = document.getElementById('reply-section');
      if (replySection) {
        replySection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => document.getElementById('replyTextarea').focus(), 500);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
    },
    getInitials(name) {
      return name.substring(0, 2).toUpperCase();
    },
    getAvatarColor(name) {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    }
  }
};
</script>

<style scoped>
.topic-title {
  font-size: 1.7rem;
  letter-spacing: -0.5px;
  word-break: break-word;
}
.btn-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.form-control:focus, .form-select:focus {
  border-color: var(--color-primary) !important;
}
.page-item.active .page-link {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white !important;
}

/* Bootstrap 5.3 Utility Fallbacks */
.bg-primary-subtle { background-color: #e0e7ff !important; }
.bg-danger-subtle { background-color: #fee2e2 !important; }
.bg-success-subtle { background-color: #d1fae5 !important; }
.bg-secondary-subtle { background-color: #f1f5f9 !important; }
</style>
