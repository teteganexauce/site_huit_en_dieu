<template>
  <BreadcombsComponent title="Forum de Discussion" />
  <main id="main" class="bg-white min-vh-100 pb-5">
    <section class="section pt-4 position-relative z-2">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            
              <!-- Toolbar & Search -->
              <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-chat-right-text text-primary fs-4"></i>
                  <span class="fw-semibold fs-5 text-dark">Discussions récentes</span>
                </div>
                
                <div class="d-flex align-items-center gap-2" style="flex: 1; max-width: 500px; justify-content: flex-end;">
                  <form @submit.prevent="searchTopics" class="flex-grow-1" style="max-width: 350px;">
                    <div class="input-group search-group rounded-pill overflow-hidden border bg-white shadow-sm">
                      <span class="input-group-text bg-white border-0 text-muted ps-3"><i class="bi bi-search"></i></span>
                      <input 
                        type="text" 
                        class="form-control border-0 px-2" 
                        placeholder="Rechercher un sujet..." 
                        v-model="searchQuery"
                        style="box-shadow: none;"
                      >
                      <button class="btn btn-white border-0 text-primary fw-semibold pe-3" type="submit" v-if="searchQuery">
                        Chercher
                      </button>
                      <button class="btn btn-white border-0 text-danger pe-3" type="button" @click="resetSearch" v-if="searchQuery">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </form>
                  <router-link v-if="authStore.isAdmin" to="/forum/creer" class="btn btn-primary shadow-sm rounded-pill d-none d-md-flex align-items-center gap-2">
                    <i class="bi bi-pencil-square"></i> Nouveau
                  </router-link>
                </div>
              </div>

            <!-- Loader -->
            <div v-if="loading" class="text-center py-5 my-4">
              <div class="spinner-grow text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>

            <!-- Topics List -->
            <div v-else-if="topics.length > 0" class="topics-container">
              
              <div 
                v-for="topic in topics" 
                :key="topic.id"
                class="card topic-card border shadow-sm rounded-4 mb-3"
              >
                <router-link :to="`/forum/${topic.id}`" class="text-decoration-none">
                  <div class="card-body p-4 d-flex align-items-sm-center flex-column flex-sm-row gap-4">
                    
                    <!-- Avatar (Desktop) -->
                    <div class="d-none d-sm-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-sm flex-shrink-0" 
                         :style="`width: 55px; height: 55px; font-size: 1.2rem; background-color: ${getAvatarColor(topic.auteur?.name || 'U')}`">
                      {{ getInitials(topic.auteur?.name || 'U') }}
                    </div>

                    <!-- Main Info -->
                    <div class="flex-grow-1 min-w-0">
                      <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <span v-if="topic.estEpingle" class="badge bg-danger-subtle text-danger rounded-pill px-2 py-1 small fw-semibold"><i class="bi bi-pin-angle-fill me-1"></i> Épinglé</span>
                        <span v-if="topic.estFerme" class="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1 small fw-semibold"><i class="bi bi-lock-fill me-1"></i> Fermé</span>
                        <h4 class="mb-0 fw-bold text-dark text-truncate topic-title" style="max-width: 100%;">
                          {{ topic.titre }}
                        </h4>
                      </div>
                      
                      <div class="d-flex align-items-center text-secondary small">
                        <!-- Avatar (Mobile) -->
                        <div class="d-sm-none align-items-center justify-content-center text-white rounded-circle fw-bold flex-shrink-0 me-2 d-inline-flex" 
                             :style="`width: 24px; height: 24px; font-size: 0.7rem; background-color: ${getAvatarColor(topic.auteur?.name || 'U')}`">
                          {{ getInitials(topic.auteur?.name || 'U') }}
                        </div>
                        <span class="text-dark fw-medium me-1">{{ topic.auteur?.name || 'Utilisateur inconnu' }}</span> 
                        <span class="mx-1">•</span>
                        <span>{{ formatDate(topic.dateCreation) }}</span>
                      </div>
                    </div>

                    <!-- Stats -->
                    <div class="d-flex align-items-center gap-4 mt-3 mt-sm-0 flex-shrink-0">
                      <div class="stat-box text-center">
                        <div class="fs-5 fw-bold" :class="topic.reponses_count > 0 ? 'text-primary' : 'text-muted'">{{ topic.reponses_count || 0 }}</div>
                        <div class="text-uppercase text-secondary fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.5px;">Réponses</div>
                      </div>
                      <div class="stat-box text-center d-none d-md-block">
                        <div class="fs-5 fw-bold text-dark">{{ topic.nombreVues || 0 }}</div>
                        <div class="text-uppercase text-secondary fw-semibold" style="font-size: 0.7rem; letter-spacing: 0.5px;">Vues</div>
                      </div>
                    </div>

                  </div>
                </router-link>
              </div>

            </div>

            <!-- Empty State -->
            <div v-else class="card border shadow-sm rounded-4 text-center py-5 mt-4">
              <div class="card-body py-5">
                <div class="mb-4 text-primary opacity-50">
                  <i class="bi bi-chat-square-dots" style="font-size: 4rem;"></i>
                </div>
                <h3 class="fw-bold text-dark">Aucune discussion trouvée</h3>
                <p class="text-secondary fs-5 mb-0">Il n'y a pas de sujets correspondant à votre recherche pour le moment.</p>
              </div>
            </div>

            <!-- Pagination -->
            <nav aria-label="Page navigation" class="mt-5" v-if="totalPages > 1">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link shadow-sm border-0 rounded-start-pill px-3" href="#" @click.prevent="changePage(currentPage - 1)">
                    <i class="bi bi-chevron-left me-1"></i> Précédent
                  </a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                  <a class="page-link shadow-sm border-0" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link shadow-sm border-0 rounded-end-pill px-3" href="#" @click.prevent="changePage(currentPage + 1)">
                    Suivant <i class="bi bi-chevron-right ms-1"></i>
                  </a>
                </li>
              </ul>
            </nav>

          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import forumService from '@/services/forumService';
import { useAuthStore } from '@/stores/auth';
import BreadcombsComponent from '@/includes/breadcombs.vue';

export default {
  name: 'ForumIndex',
  components: {
    BreadcombsComponent
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      topics: [],
      loading: true,
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
    };
  },
  mounted() {
    this.fetchTopics();
  },
  methods: {
    async fetchTopics(page = 1) {
      this.loading = true;
      try {
        const response = await forumService.getSujets({
          page: page,
          titre: this.searchQuery
        });
        this.topics = response.data || [];
        if (response.meta) {
          this.currentPage = response.meta.current_page;
          this.totalPages = response.meta.last_page;
        } else {
          this.totalPages = 1;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des sujets:", error);
      } finally {
        this.loading = false;
      }
    },
    searchTopics() {
      this.fetchTopics(1);
    },
    resetSearch() {
      this.searchQuery = '';
      this.fetchTopics(1);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchTopics(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
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
.search-group:focus-within {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--color-primary-rgb), 0.1) !important;
}
.topic-card {
  transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
  border: 1px solid transparent !important;
}
.topic-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04) !important;
  border-color: #e2e8f0 !important;
}
.topic-title {
  transition: color 0.2s;
}
.topic-card:hover .topic-title {
  color: var(--color-primary) !important;
}
.min-w-0 {
  min-width: 0;
}
.stat-box {
  min-width: 60px;
}

/* Pagination Styling */
.page-link {
  color: #475569;
  font-weight: 500;
  margin: 0 2px;
}
.page-item.active .page-link {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* Bootstrap 5.3 Utility Fallbacks */
.bg-danger-subtle { background-color: #fee2e2 !important; }
.bg-secondary-subtle { background-color: #f1f5f9 !important; }
</style>
