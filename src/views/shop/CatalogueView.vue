<template>
  <div>
    <BreadcombsComponent :title="'Boutique'" />
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
              <label class="form-label fw-bold">Type</label>
              <select class="form-select" v-model="store.filters.type" @change="onFilterChange">
                <option value="">Tous</option>
                <option value="livre_physique">Livre physique</option>
                <option value="ebook">E-book</option>
                <option value="objet_sacre">Objet sacré</option>
                <option value="tableau">Tableau</option>
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
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span>{{ store.pagination.total }} produit(s) trouvé(s)</span>
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
            <h5>Aucun produit trouvé</h5>
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
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useCatalogueStore } from '../../stores/catalogue'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import ProductCard from '../../components/shop/ProductCard.vue'

const store = useCatalogueStore()
const categories = ref([])

const onFilterChange = () => {
  store.fetchCatalogue()
}

const resetFilters = () => {
  store.resetFilters()
  store.fetchCatalogue()
}

onMounted(async () => {
  await store.fetchCategories()
  categories.value = store.categories
  store.fetchCatalogue()
})
</script>

<style scoped>
.filter-sidebar { position: sticky; top: 100px; }
</style>
