<script setup>
import { ref, computed, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import contentService from '../services/contentService'

const pensees     = ref([])
const isLoading   = ref(true)
const search      = ref('')
const currentPage = ref(1)
const perPage     = 9

onMounted(async () => {
  try {
    const response = await contentService.getAllPensees()
    pensees.value = response.data || []
  } catch (e) {
    console.error('Erreur chargement pensées:', e)
  } finally {
    isLoading.value = false
  }
})

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return pensees.value
  return pensees.value.filter(
    p => p.contenu?.toLowerCase().includes(q) || p.auteur?.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))

const paginated = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Reset page on search
const onSearch = () => { currentPage.value = 1 }
</script>

<template>
  <BreadcombsComponent title="Pensées Quotidiennes" />

  <div class="container py-5">
    <!-- Header + Search -->
    <div class="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
      <div>
        <h2 class="text-secondary mb-1">Les Pensées Quotidiennes</h2>
        <p class="text-muted mb-0">Retrouvez toutes nos citations et sagesses</p>
      </div>
      <div class="pensees-search">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input
            v-model="search"
            @input="onSearch"
            type="text"
            class="form-control border-start-0"
            placeholder="Rechercher par auteur ou contenu…"
            style="min-width: 280px;"
          />
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Chargement des pensées…</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="filtered.length === 0" class="text-center py-5">
      <i class="bi bi-journal-x display-3 text-muted opacity-50"></i>
      <p class="mt-3 text-muted fs-5">Aucune pensée trouvée.</p>
    </div>

    <!-- Grid -->
    <div v-else class="row g-4">
      <div v-for="(pensee, i) in paginated" :key="pensee.id ?? i" class="col-lg-4 col-md-6">
        <div class="pensee-card h-100 d-flex flex-column shadow-sm">
          <!-- Header -->
          <div class="pensee-card-header d-flex justify-content-between align-items-center">
            <span class="badge-type">Pensée du jour</span>
            <small class="text-muted">{{ formatDate(pensee.date_publication) }}</small>
          </div>
          <!-- Body -->
          <div class="pensee-card-body flex-grow-1">
            <p class="pensee-contenu">{{ pensee.contenu }}</p>
          </div>
          <!-- Footer -->
          <div class="pensee-card-footer">
            <span class="pensee-auteur">— {{ pensee.auteur }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-5">
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li
            v-for="p in totalPages"
            :key="p"
            class="page-item"
            :class="{ active: currentPage === p }"
          >
            <button class="page-link" @click="goToPage(p)">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Count -->
    <p v-if="!isLoading && filtered.length > 0" class="text-center text-muted mt-2" style="font-size: 0.85rem;">
      {{ filtered.length }} pensée{{ filtered.length > 1 ? 's' : '' }} au total
    </p>
  </div>
</template>

<style scoped>
.pensees-search .form-control:focus {
  box-shadow: none;
  border-color: #35b9d3;
}
.pensees-search .input-group-text {
  border-color: #dee2e6;
}

.pensee-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e9ecef;
  transition: transform 0.2s, box-shadow 0.2s;
}
.pensee-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
}

.pensee-card-header {
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.badge-type {
  font-size: 0.72rem;
  font-weight: 600;
  color: #35b9d3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pensee-card-body {
  padding: 20px 16px;
}

.pensee-contenu {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.7;
  margin: 0;
}

.pensee-card-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.pensee-auteur {
  font-size: 0.85rem;
  font-weight: 600;
  color: #007bff;
}

/* Pagination */
.pagination .page-link {
  color: #35b9d3;
  border-radius: 6px !important;
  margin: 0 2px;
}
.pagination .page-item.active .page-link {
  background-color: #35b9d3;
  border-color: #35b9d3;
  color: #fff;
}
</style>
