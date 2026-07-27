<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogueStore } from '../../stores/catalogue'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import ProductCard from '../../components/shop/ProductCard.vue'

const store = useCatalogueStore()
const route = useRoute()
const categories = ref([])

const onFilterChange = () => store.fetchCatalogue()

const resetFilters = () => {
  store.resetFilters()
  store.fetchCatalogue()
}

onMounted(async () => {
  if (route.query.type) store.filters.type = route.query.type
  if (route.query.categorie) store.filters.categorie = route.query.categorie
  await store.fetchCategories()
  categories.value = store.categories
  store.fetchCatalogue()
})

const pageRange = (current, last) => {
  const range = []
  const delta = 2
  for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
    range.push(i)
  }
  return range
}
</script>

<template>
  <BreadcombsComponent title="Boutique" />

  <div class="boutique-page">

    <!-- Hero Section -->
    <div class="boutique-hero">
      <div class="container">
        <div class="hero-inner">
          <div>
            <p class="hero-label">Notre sélection</p>
            <h1 class="hero-title">Explorez notre boutique</h1>
            <p class="hero-subtitle">Livres, e-books, objets sacrés et tableaux soigneusement sélectionnés pour vous.</p>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-num">{{ store.pagination.total || 0 }}</span>
              <span class="stat-lbl">Produits</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ categories.length }}</span>
              <span class="stat-lbl">Catégories</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container boutique-layout">
      <div class="row g-4">

        <!-- ═══ SIDEBAR FILTRES ═══ -->
        <div class="col-lg-3">
          <div class="filter-panel">
            <div class="filter-header">
              <i class="bi bi-sliders me-2"></i> Filtres
              <button class="btn-reset" @click="resetFilters">
                <i class="bi bi-arrow-counterclockwise me-1"></i> Réinitialiser
              </button>
            </div>

            <!-- Recherche -->
            <div class="filter-group">
              <label class="filter-label">Recherche</label>
              <div class="search-input-wrap">
                <i class="bi bi-search search-icon"></i>
                <input
                  type="text"
                  class="filter-input"
                  v-model="store.filters.recherche"
                  @input="onFilterChange"
                  placeholder="Titre, auteur..."
                />
              </div>
            </div>

            <!-- Catégorie -->
            <div class="filter-group">
              <label class="filter-label">Catégorie</label>
              <select class="filter-select" v-model="store.filters.categorie" @change="onFilterChange">
                <option value="">Toutes les catégories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
              </select>
            </div>

            <!-- Type -->
            <div class="filter-group">
              <label class="filter-label">Type de produit</label>
              <div class="type-chips">
                <button
                  class="type-chip"
                  :class="{ active: store.filters.type === '' }"
                  @click="store.filters.type = ''; onFilterChange()"
                >Tous</button>
                <button
                  class="type-chip"
                  :class="{ active: store.filters.type === 'livre_physique' }"
                  @click="store.filters.type = 'livre_physique'; onFilterChange()"
                ><i class="bi bi-book me-1"></i>Livre</button>
                <button
                  class="type-chip"
                  :class="{ active: store.filters.type === 'ebook' }"
                  @click="store.filters.type = 'ebook'; onFilterChange()"
                ><i class="bi bi-file-earmark-text me-1"></i>E-book</button>
                <button
                  class="type-chip"
                  :class="{ active: store.filters.type === 'objet_sacre' }"
                  @click="store.filters.type = 'objet_sacre'; onFilterChange()"
                ><i class="bi bi-gem me-1"></i>Objet sacré</button>
                <button
                  class="type-chip"
                  :class="{ active: store.filters.type === 'tableau' }"
                  @click="store.filters.type = 'tableau'; onFilterChange()"
                ><i class="bi bi-image me-1"></i>Tableau</button>
              </div>
            </div>

            <!-- Prix -->
            <div class="filter-group">
              <label class="filter-label">Fourchette de prix (FCFA)</label>
              <div class="price-range">
                <input
                  type="number"
                  class="filter-input"
                  v-model.number="store.filters.prix_min"
                  @input="onFilterChange"
                  placeholder="Min"
                />
                <span class="price-sep">—</span>
                <input
                  type="number"
                  class="filter-input"
                  v-model.number="store.filters.prix_max"
                  @input="onFilterChange"
                  placeholder="Max"
                />
              </div>
            </div>

            <!-- Checkboxes -->
            <div class="filter-group">
              <label class="filter-label">Options</label>
              <div class="filter-checks">
                <label class="check-item">
                  <input type="checkbox" v-model="store.filters.nouveaute" @change="onFilterChange" />
                  <span>Nouveautés</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" v-model="store.filters.coup_de_coeur" @change="onFilterChange" />
                  <span>Coups de cœur ❤️</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" v-model="store.filters.gratuit" @change="onFilterChange" />
                  <span>Gratuits uniquement</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ GRID PRODUITS ═══ -->
        <div class="col-lg-9">

          <!-- Barre de résultats / tri -->
          <div class="results-bar">
            <p class="results-count">
              <span>{{ store.pagination.total || 0 }}</span> produit(s) trouvé(s)
            </p>
            <div class="sort-wrap">
              <i class="bi bi-sort-down me-1 text-muted"></i>
              <select class="sort-select" v-model="store.filters.tri" @change="onFilterChange">
                <option value="date">Plus récents</option>
                <option value="prix_asc">Prix croissant</option>
                <option value="prix_desc">Prix décroissant</option>
                <option value="nom">Nom (A-Z)</option>
              </select>
            </div>
          </div>

          <!-- Spinner -->
          <div v-if="store.loading" class="loading-zone">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-3">Chargement des produits...</p>
          </div>

          <!-- Vide -->
          <div v-else-if="store.products.length === 0" class="empty-state">
            <i class="bi bi-bag-x empty-icon"></i>
            <h5>Aucun produit trouvé</h5>
            <p class="text-muted">Essayez de modifier vos filtres ou <button class="btn-link-inline" @click="resetFilters">réinitialisez</button>.</p>
          </div>

          <!-- Grille -->
          <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            <div class="col" v-for="product in store.products" :key="product.id">
              <ProductCard :product="product" />
            </div>
          </div>

          <!-- Pagination -->
          <nav v-if="store.pagination.lastPage > 1" class="mt-5">
            <ul class="custom-pagination">
              <li :class="{ disabled: store.pagination.currentPage <= 1 }">
                <button @click="store.setPage(store.pagination.currentPage - 1)" :disabled="store.pagination.currentPage <= 1">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>

              <li v-if="store.pagination.currentPage > 3">
                <button @click="store.setPage(1)">1</button>
              </li>
              <li v-if="store.pagination.currentPage > 4" class="ellipsis"><span>…</span></li>

              <li
                v-for="page in pageRange(store.pagination.currentPage, store.pagination.lastPage)"
                :key="page"
                :class="{ active: page === store.pagination.currentPage }"
              >
                <button @click="store.setPage(page)">{{ page }}</button>
              </li>

              <li v-if="store.pagination.currentPage < store.pagination.lastPage - 3" class="ellipsis"><span>…</span></li>
              <li v-if="store.pagination.currentPage < store.pagination.lastPage - 2">
                <button @click="store.setPage(store.pagination.lastPage)">{{ store.pagination.lastPage }}</button>
              </li>

              <li :class="{ disabled: store.pagination.currentPage >= store.pagination.lastPage }">
                <button @click="store.setPage(store.pagination.currentPage + 1)" :disabled="store.pagination.currentPage >= store.pagination.lastPage">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ══════════════════════════════════════
   Global
══════════════════════════════════════ */
.boutique-page { background: #f5f7fa; min-height: 80vh; }

/* ══════════════════════════════════════
   Hero
══════════════════════════════════════ */
.boutique-hero {
  background: linear-gradient(135deg, #0d1b2a 0%, #0ea2bd 100%);
  padding: 3.5rem 0 3rem;
  color: #fff;
  margin-bottom: 0;
}
.hero-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.hero-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  margin-bottom: 0.4rem;
}
.hero-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.15;
}
.hero-subtitle {
  font-size: 1rem;
  color: rgba(255,255,255,0.75);
  margin: 0;
  max-width: 480px;
}
.hero-stats {
  display: flex;
  gap: 2rem;
  flex-shrink: 0;
}
.stat-item { text-align: center; }
.stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}
.stat-lbl {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ══════════════════════════════════════
   Layout
══════════════════════════════════════ */
.boutique-layout { padding-top: 2.5rem; padding-bottom: 4rem; }

/* ══════════════════════════════════════
   Filter Panel
══════════════════════════════════════ */
.filter-panel {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  overflow: hidden;
  position: sticky;
  top: 90px;
}
.filter-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, #0ea2bd, #0189a1);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
}
.btn-reset {
  margin-left: auto;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  border-radius: 50px;
  padding: 3px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-reset:hover { background: rgba(255,255,255,0.25); }

.filter-group { padding: 1rem 1.2rem; border-bottom: 1px solid #f0f2f5; }
.filter-group:last-child { border-bottom: none; }

.filter-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #adb5bd;
  margin-bottom: 0.6rem;
}

.search-input-wrap { position: relative; }
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  font-size: 0.85rem;
}
.filter-input {
  width: 100%;
  border: 1.5px solid #e9ecef;
  border-radius: 10px;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  font-size: 0.88rem;
  transition: border-color 0.2s;
  outline: none;
  background: #fafbfc;
}
.filter-input:focus { border-color: #0ea2bd; background: #fff; box-shadow: 0 0 0 3px rgba(14,162,189,0.1); }

.filter-select {
  width: 100%;
  border: 1.5px solid #e9ecef;
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  font-size: 0.88rem;
  background: #fafbfc;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:focus { border-color: #0ea2bd; box-shadow: 0 0 0 3px rgba(14,162,189,0.1); }

/* Type chips */
.type-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.type-chip {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 50px;
  border: 1.5px solid #dee2e6;
  background: #fff;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}
.type-chip:hover, .type-chip.active {
  background: #0ea2bd;
  border-color: #0ea2bd;
  color: #fff;
}

/* Price range */
.price-range { display: flex; align-items: center; gap: 0.5rem; }
.price-sep { color: #adb5bd; font-weight: 600; flex-shrink: 0; }
.price-range .filter-input { padding-left: 0.75rem; }

/* Checkboxes */
.filter-checks { display: flex; flex-direction: column; gap: 8px; }
.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.87rem;
  color: #343a40;
  cursor: pointer;
  font-weight: 500;
}
.check-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #0ea2bd;
  cursor: pointer;
}

/* ══════════════════════════════════════
   Results bar
══════════════════════════════════════ */
.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: #fff;
  border-radius: 12px;
  padding: 0.75rem 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.results-count { margin: 0; font-size: 0.88rem; color: #6c757d; }
.results-count span { font-weight: 700; color: #0ea2bd; font-size: 1rem; }
.sort-wrap { display: flex; align-items: center; }
.sort-select {
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  padding: 0.35rem 0.7rem;
  font-size: 0.85rem;
  background: #fafbfc;
  outline: none;
  cursor: pointer;
}

/* ══════════════════════════════════════
   States
══════════════════════════════════════ */
.loading-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
.empty-state {
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}
.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}
.btn-link-inline {
  background: none;
  border: none;
  color: #0ea2bd;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

/* ══════════════════════════════════════
   Pagination
══════════════════════════════════════ */
.custom-pagination {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
.custom-pagination li button {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1.5px solid #dee2e6;
  background: #fff;
  color: #343a40;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-pagination li button:hover:not(:disabled) {
  background: #eaf7fb;
  border-color: #0ea2bd;
  color: #0ea2bd;
}
.custom-pagination li.active button {
  background: linear-gradient(135deg, #0ea2bd, #0189a1);
  border-color: #0ea2bd;
  color: #fff;
  box-shadow: 0 3px 10px rgba(14,162,189,0.3);
}
.custom-pagination li.disabled button { opacity: 0.4; cursor: not-allowed; }
.custom-pagination li.ellipsis span {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-weight: 700;
}

/* ══════════════════════════════════════
   Responsive
══════════════════════════════════════ */
@media (max-width: 768px) {
  .boutique-hero { padding: 2rem 0 1.5rem; }
  .hero-stats { display: none; }
  .filter-panel { position: static; margin-bottom: 1.5rem; }
}
</style>
