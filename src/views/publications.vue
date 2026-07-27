<script setup>
import { ref, onMounted, computed } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'

const categories = ref([
   { id: 'tous', title: "Toutes les publications" },
   { id: 'article', title: "Articles" },
   { id: 'livre', title: "Livres" },
   { id: 'these', title: "Thèses" },
   { id: 'video', title: "Vidéos" },
   { id: 'audio', title: "Audios" },
])

const activeTab = ref('tous')
const expandedPublications = ref([])

const toggleReadMore = (id) => {
  if (expandedPublications.value.includes(id)) {
    expandedPublications.value = expandedPublications.value.filter(pubId => pubId !== id)
  } else {
    expandedPublications.value.push(id)
  }
}
const publications = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 9

onMounted(async () => {
  try {
    const response = await publicService.getPublications()
    publications.value = response.data || []
  } catch (error) {
    console.error("Erreur lors de la récupération des publications", error)
  } finally {
    isLoading.value = false
  }
})

const filteredPublications = computed(() => {
  let filtered = publications.value

  if (activeTab.value !== 'tous') {
    filtered = filtered.filter(pub => pub.type === activeTab.value)
  }

  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(pub => 
      pub.titre?.toLowerCase().includes(query) || 
      pub.resume?.toLowerCase().includes(query) ||
      pub.chercheur?.nom?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredPublications.value.length / itemsPerPage)
})

const paginatedPublications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPublications.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Reset page to 1 when filters change
import { watch } from 'vue'
watch([activeTab, searchQuery], () => {
  currentPage.value = 1
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
   <BreadcombsComponent title="Nos Publications" />
   <div>
      <div class="">
         <!-- Tabs -->
         <div class="bg-ps-primary">
            <ul class="nav nav-pills mb-3 sub-menu container" role="tablist">
               <li class="py-0" v-for="item in categories" :key="item.id">
                  <a class="nav-link px-3 mx-0 my-0 text-white" :class="{ 'active': activeTab === item.id }"
                     href="#" @click.prevent="activeTab = item.id" role="tab">
                     {{ item.title }}
                  </a>
               </li>
            </ul>
         </div>

         <!-- Content -->
         <div class="container p-0">
            <div class="d-flex mt-4 align-items-center justify-content-between">
               <h3 class="text-secondary mb-0">
                  {{ categories.find(c => c.id === activeTab)?.title }}
               </h3>
               <div class="search">
                  <span class="bg-light py-2 px-3 rounded" data-bs-toggle="collapse" data-bs-target="#collapseSearch"
                     aria-expanded="false" aria-controls="collapseSearch"><i class="bi bi-search"></i></span>
               </div>
            </div>
            
            <div class="collapse mt-4" id="collapseSearch">
               <form action="" class="d-flex" @submit.prevent>
                  <div class="w-100">
                     <input v-model="searchQuery" class="form-control rounded-1 shadow-none" type="text" placeholder="Faites une recherche par titre, auteur ou mot-clé...">
                  </div>
                    <div class="d-flex">
                       <button class="btn btn-primary mx-1 rounded-1" type="submit">Rechercher</button>
                    </div>
                 </form>
              </div>

            <section id="blog" class="blog mt-4 pt-4 mb-5">
               <div class="container">
                  <div v-if="isLoading" class="text-center py-5">
                     <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Chargement...</span>
                     </div>
                  </div>
                  
                  <div v-else-if="filteredPublications.length === 0" class="text-center py-5 text-muted">
                     <i class="bi bi-journal-x display-1 text-secondary opacity-50 mb-3"></i>
                     <h4>Aucune publication trouvée</h4>
                     <p>Il n'y a pas encore de publications dans cette catégorie.</p>
                  </div>

                  <div v-else class="row g-4 posts-list">
                     <div class="col-lg-4 col-md-6" v-for="pub in paginatedPublications" :key="pub.id">
                        <article class="d-flex flex-column h-100">
                           <div class="post-img">
                              <router-link :to="{ name: 'pub-detail', params: { id: pub.id } }">
                                 <img v-if="pub.image_url" :src="pub.image_url" class="img-fluid" style="object-fit: cover; height: 150px; width: 100%;">
                                 <img v-else src="../assets/img/blog/blog-3.jpg" class="img-fluid" style="object-fit: cover; height: 150px; width: 100%;">
                              </router-link>
                           </div>
                           
                           <h5 class="title mt-3">
                              <router-link :to="{ name: 'pub-detail', params: { id: pub.id } }" class="pub-title fs-5">{{ pub.titre }}</router-link>
                           </h5>
                           
                           <div class="meta-top">
                              <ul>
                                 <li class="d-flex align-items-center">
                                    <i class="bi bi-person"></i> 
                                    <a href="#">{{ pub.chercheur?.nom || 'Auteur inconnu' }}</a>
                                 </li>
                                 <li class="d-flex align-items-center">
                                    <i class="bi bi-clock"></i> 
                                    <a href="#"><time>{{ formatDate(pub.created_at || pub.dateSoumission) }}</time></a>
                                 </li>
                                 <li class="d-flex align-items-center text-capitalize">
                                    <i class="bi bi-journal-text"></i> 
                                    <a href="#">{{ pub.type }}</a>
                                 </li>
                              </ul>
                           </div>
                           
                                                                                 <div class="content mb-3 flex-grow-1">
                              <p class="text-muted mb-1 line-clamp">
                                 {{ pub.resume || 'Aucun résumé disponible pour cette publication.' }}
                              </p>
                              <router-link :to="{ name: 'pub-detail', params: { id: pub.id } }" class="btn btn-link p-0 text-decoration-none small text-primary">
                                 Voir les détails
                              </router-link>
                           </div>
                           
                           <div class="read-more mt-auto align-self-end" v-if="pub.fichierUrl || pub.lien_externe">
                              <a v-if="pub.fichierUrl" :href="pub.fichierUrl" target="_blank" class="me-3">
                                 <i class="bi bi-file-earmark-pdf"></i> Consulter le document
                              </a>
                              <a v-else-if="pub.lien_externe" :href="pub.lien_externe" target="_blank" class="text-secondary">
                                 <i class="bi bi-box-arrow-up-right"></i> Lien externe
                              </a>
                           </div>
                        </article>
                     </div>
                  </div>
                  
                  <!-- Pagination UI -->
                  <div class="d-flex justify-content-center mt-5" v-if="totalPages > 1">
                     <nav aria-label="Page navigation">
                        <ul class="pagination pagination-lg">
                           <li class="page-item" :class="{ disabled: currentPage === 1 }">
                              <a class="page-link" href="#" aria-label="Précédent" @click.prevent="goToPage(currentPage - 1)">
                                 <span aria-hidden="true">&laquo;</span>
                              </a>
                           </li>
                           
                           <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                           </li>
                           
                           <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                              <a class="page-link" href="#" aria-label="Suivant" @click.prevent="goToPage(currentPage + 1)">
                                 <span aria-hidden="true">&raquo;</span>
                              </a>
                           </li>
                        </ul>
                     </nav>
                  </div>
               </div>
            </section>
         </div>
      </div>
   </div>
</template>

<style scoped>
.sub-menu .nav-link {
   border-bottom: 3px solid transparent;
   color: grey;
   margin-right: 20px;
}

.sub-menu .nav-link:hover {
   background-color: #485664;
   border-radius: 0px;
   color: var(--color-primary);
}

.sub-menu .nav-link.active {
   background-color: #485664;
   border-radius: 0px;
   color: white;
}

.bg-ps-primary {
   background-color: var(--color-primary);
   padding-top: 15px;
   border-radius: 0 0 10px 10px;
}

.pub-title {
   display: -webkit-box;
   -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
   overflow: hidden;
}

.card-text {
   display: -webkit-box;
   -webkit-line-clamp: 4;
   -webkit-box-orient: vertical;
   overflow: hidden;
}

.card {
   transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
   transform: translateY(-5px);
   box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.search span {
   cursor: pointer;
   transition: .3s;
}

.search span:hover {
   background-color: #e9ecef !important;
}
.line-clamp {
   display: -webkit-box;
   -webkit-line-clamp: 4;
   -webkit-box-orient: vertical;
   overflow: hidden;
}
</style>