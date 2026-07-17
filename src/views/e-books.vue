<template>
  <BreadcombsComponent title="Nos e-books" />
  <div class="container my-5">
    <div class="row">
      <div class="col-lg-3">
        <div class="filter-sidebar card p-3">
          <h5 class="border-bottom pb-2">Filtres</h5>

          <div class="mb-3">
            <label class="form-label fw-bold">Recherche</label>
            <input type="text" class="form-control" v-model="store.filters.recherche" @input="onFilterChange" placeholder="Rechercher...">
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Catégorie</label>
            <select class="form-select" v-model="store.filters.categorie" @change="onFilterChange">
              <option value="">Toutes</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Prix</label>
            <div class="d-flex gap-2">
              <input type="number" class="form-control form-control-sm" v-model.number="store.filters.prix_min" @input="onFilterChange" placeholder="Min">
              <input type="number" class="form-control form-control-sm" v-model.number="store.filters.prix_max" @input="onFilterChange" placeholder="Max">
            </div>
          </div>

          <div class="mb-2 form-check">
            <input type="checkbox" class="form-check-input" id="filterNouveaute" v-model="store.filters.nouveaute" @change="onFilterChange">
            <label class="form-check-label" for="filterNouveaute">Nouveautés</label>
          </div>
          <div class="mb-2 form-check">
            <input type="checkbox" class="form-check-input" id="filterCoupCoeur" v-model="store.filters.coup_de_coeur" @change="onFilterChange">
            <label class="form-check-label" for="filterCoupCoeur">Coups de coeur</label>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="filterGratuit" v-model="store.filters.gratuit" @change="onFilterChange">
            <label class="form-check-label" for="filterGratuit">Gratuits</label>
          </div>

          <button class="btn btn-outline-secondary btn-sm" @click="resetFilters">Réinitialiser</button>
        </div>
      </div>

      <div class="col-lg-9">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div class="nav nav-pills sub-menu" role="tablist">
            <button class="nav-link px-3 mx-0 my-0" :class="{ active: activeTab === 'all' }" @click="setTab('all')">Tous</button>
            <button class="nav-link px-3 mx-0 my-0" :class="{ active: activeTab === 'nouveautes' }" @click="setTab('nouveautes')">Nouveautés</button>
            <button class="nav-link px-3 mx-0 my-0" :class="{ active: activeTab === 'gratuits' }" @click="setTab('gratuits')">Nos livres gratuits</button>
            <button class="nav-link px-3 mx-0 my-0" :class="{ active: activeTab === 'coups_de_coeur' }" @click="setTab('coups_de_coeur')">Coups de coeur</button>
          </div>
          <select class="form-select w-auto" v-model="store.filters.tri" @change="onFilterChange">
            <option value="date">Plus récents</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="nom">Nom (A-Z)</option>
          </select>
        </div>

        <div v-if="store.loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="store.products.length === 0" class="text-center py-5 text-muted">
          <h5>Aucun e-book trouvé</h5>
        </div>

        <div v-else class="row">
          <div v-for="product in store.products" :key="product.id" class="col-lg-4 col-md-6">
            <ProductCard :product="product" />
          </div>
        </div>

        <nav v-if="store.pagination.lastPage > 1" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: store.pagination.currentPage <= 1 }">
              <button class="page-link" @click="store.setPage(store.pagination.currentPage - 1)">Précédent</button>
            </li>
            <li v-for="page in store.pagination.lastPage" :key="page" class="page-item" :class="{ active: page === store.pagination.currentPage }">
              <button class="page-link" @click="store.setPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: store.pagination.currentPage >= store.pagination.lastPage }">
              <button class="page-link" @click="store.setPage(store.pagination.currentPage + 1)">Suivant</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCatalogueStore } from '../stores/catalogue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import ProductCard from '../components/shop/ProductCard.vue'

const store = useCatalogueStore()
const categories = ref([])
const activeTab = ref('all')

const onFilterChange = () => {
  store.fetchCatalogue()
}

const resetFilters = () => {
  store.resetFilters()
  store.filters.type = 'ebook'
  activeTab.value = 'all'
  store.fetchCatalogue()
}

const setTab = (tab) => {
  activeTab.value = tab
  store.resetFilters()
  store.filters.type = 'ebook'
  if (tab === 'nouveautes') store.filters.nouveaute = true
  else if (tab === 'gratuits') store.filters.gratuit = true
  else if (tab === 'coups_de_coeur') store.filters.coup_de_coeur = true
  store.fetchCatalogue()
}

onMounted(async () => {
  store.filters.type = 'ebook'
  await store.fetchCategories()
  categories.value = store.categories
  store.fetchCatalogue()
})
</script>

<style scoped>
.filter-sidebar { position: sticky; top: 100px; }
.sub-menu .nav-link {
  border-bottom: 3px solid transparent;
  color: grey;
  margin-right: 20px;
  white-space: nowrap;
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
</style>
