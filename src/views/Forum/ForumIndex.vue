<template>
  <main id="main">
    <!-- Page Title -->
    <div class="page-title" data-aos="fade">
      <div class="heading">
        <div class="container">
          <div class="row d-flex justify-content-center text-center">
            <div class="col-lg-8">
              <h1>Forum de Discussion</h1>
              <p class="mb-0">Participez à la communauté, posez vos questions et échangez avec les étudiants, chercheurs et membres.</p>
            </div>
          </div>
        </div>
      </div>
      <nav class="breadcrumbs">
        <div class="container">
          <ol>
            <li><router-link to="/">Accueil</router-link></li>
            <li class="current">Forum</li>
          </ol>
        </div>
      </nav>
    </div>

    <section id="forum-index" class="forum-index section">
      <div class="container">
        
        <!-- Toolbar -->
        <div class="row mb-4 align-items-center">
          <div class="col-md-6 mb-3 mb-md-0">
            <form @submit.prevent="searchTopics" class="search-form">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Rechercher un sujet..." v-model="searchQuery">
                <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
              </div>
            </form>
          </div>
          <div class="col-md-6 text-md-end">
            <router-link to="/forum/creer" class="btn btn-primary btn-lg rounded-pill shadow-sm">
              <i class="bi bi-plus-circle me-2"></i> Nouveau Sujet
            </router-link>
          </div>
        </div>

        <!-- Loader -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
        </div>

        <!-- Topics List -->
        <div v-else-if="topics.length > 0" class="topics-list">
          <div class="card topic-card mb-3 shadow-sm border-0" v-for="topic in topics" :key="topic.id">
            <div class="card-body d-flex flex-column flex-md-row align-items-md-center gap-3">
              <!-- Avatar or Icon -->
              <div class="topic-icon d-none d-md-flex align-items-center justify-content-center bg-light rounded-circle text-primary" style="width: 60px; height: 60px;">
                <i class="bi bi-chat-text-fill fs-3"></i>
              </div>
              
              <!-- Content -->
              <div class="flex-grow-1">
                <h5 class="card-title mb-1">
                  <router-link :to="`/forum/${topic.id}`" class="text-decoration-none text-dark fw-bold">
                    <span v-if="topic.estEpingle" class="badge bg-danger me-2"><i class="bi bi-pin-angle-fill"></i> Épinglé</span>
                    <span v-if="topic.estFerme" class="badge bg-secondary me-2"><i class="bi bi-lock-fill"></i> Fermé</span>
                    {{ topic.titre }}
                  </router-link>
                </h5>
                <div class="text-muted small">
                  Par <span class="fw-semibold">{{ topic.utilisateur?.nom || 'Utilisateur inconnu' }}</span> 
                  &bull; Créé le {{ formatDate(topic.dateCreation) }}
                  <span v-if="topic.dateDerniereReponse && topic.dateDerniereReponse !== topic.dateCreation">
                    &bull; Dernière réponse le {{ formatDate(topic.dateDerniereReponse) }}
                  </span>
                </div>
              </div>

              <!-- Stats -->
              <div class="d-flex align-items-center gap-3 text-muted text-center mt-3 mt-md-0">
                <div>
                  <div class="fs-5 fw-bold text-dark">{{ topic.reponses_count || 0 }}</div>
                  <div class="small">Réponses</div>
                </div>
                <div>
                  <div class="fs-5 fw-bold text-dark">{{ topic.nombreVues || 0 }}</div>
                  <div class="small">Vues</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
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

        <!-- Empty State -->
        <div v-else class="text-center py-5 bg-light rounded-4">
          <i class="bi bi-chat-square-text text-muted" style="font-size: 3rem;"></i>
          <h4 class="mt-3">Aucun sujet trouvé</h4>
          <p class="text-muted">Soyez le premier à démarrer une discussion !</p>
          <router-link to="/forum/creer" class="btn btn-outline-primary mt-2">Créer un sujet</router-link>
        </div>

      </div>
    </section>
  </main>
</template>

<script>
import forumService from '@/services/forumService';

export default {
  name: 'ForumIndex',
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
        // L'API renvoie des ressources paginées, on s'attend à data, meta, etc.
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
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchTopics(page);
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
.topic-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.topic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.08)!important;
}
.topic-icon {
  background-color: var(--color-primary-light, #e3f2fd);
}
.search-form .form-control:focus {
  box-shadow: none;
  border-color: var(--color-primary);
}
</style>
