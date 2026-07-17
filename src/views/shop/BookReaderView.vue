<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import shopService from '../../services/shopService'
import defaultAvatar from '../../assets/img/portfolio/app-1.jpg'

const route = useRoute()
const router = useRouter()
const livreId = route.params.livreId

const book = ref(null)
const downloadUrls = ref(null)
const isLoading = ref(true)
const error = ref(null)

async function loadBook() {
  isLoading.value = true
  error.value = null
  try {
    const res = await shopService.getDownloadUrl(livreId)
    downloadUrls.value = res.urls || {}
    book.value = res.produit || null
  } catch (e) {
    console.error('Erreur chargement livre:', e)
    error.value = "Impossible de charger ce livre. Vérifiez que vous avez bien acheté ce livre."
  } finally {
    isLoading.value = false
  }
}

onMounted(loadBook)
</script>

<template>
  <BreadcombsComponent title="Lecture" />
  <div class="container py-4">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Chargement du livre...</p>
    </div>

    <div v-else-if="error" class="text-center py-5">
      <i class="bi bi-exclamation-triangle display-3 text-warning"></i>
      <h5 class="mt-3">{{ error }}</h5>
      <button class="btn btn-primary mt-3" @click="router.back()">Retour</button>
    </div>

    <div v-else-if="book" class="row g-4">
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <img :src="book.imageUrl || defaultAvatar" class="card-img-top rounded-top" style="height: 320px; object-fit: cover;" alt="">
          <div class="card-body text-center">
            <h5 class="fw-bold">{{ book.nom }}</h5>
            <p class="text-muted small mb-0" v-if="book.livre?.auteur">
              <i class="bi bi-pencil me-1"></i>{{ book.livre.auteur }}
            </p>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="fw-bold mb-0">{{ book.nom }}</h5>
          </div>
          <div class="card-body">
            <p class="text-muted">{{ book.description || 'Aucune description disponible.' }}</p>

            <hr>
            <h6 class="fw-bold mb-3">Actions</h6>
            <div class="d-flex flex-wrap gap-2">
              <a v-if="downloadUrls?.pdf_url" :href="downloadUrls.pdf_url" target="_blank" class="btn btn-primary">
                <i class="bi bi-eye me-1"></i>Lire en ligne
              </a>
              <a v-if="downloadUrls?.pdf_url" :href="downloadUrls.pdf_url" target="_blank" class="btn btn-outline-success">
                <i class="bi bi-filetype-pdf me-1"></i>Télécharger PDF
              </a>
              <a v-if="downloadUrls?.epub_url" :href="downloadUrls.epub_url" target="_blank" class="btn btn-outline-info">
                <i class="bi bi-filetype-epub me-1"></i>Télécharger EPUB
              </a>
              <div v-if="!downloadUrls?.pdf_url && !downloadUrls?.epub_url" class="alert alert-warning py-2 mb-0 w-100">
                <i class="bi bi-exclamation-triangle me-1"></i>Aucun fichier disponible pour ce livre. Contactez l'administrateur.
              </div>
              <a href="/profile-inscrit" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left me-1"></i>Retour
              </a>
            </div>

            <hr v-if="book.livre">
            <div v-if="book.livre" class="row g-3">
              <div class="col-md-6">
                <div class="border rounded-3 p-3 text-center">
                  <small class="text-muted d-block">Auteur</small>
                  <span class="fw-bold">{{ book.livre.auteur || 'Non renseigné' }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="border rounded-3 p-3 text-center">
                  <small class="text-muted d-block">Pages</small>
                  <span class="fw-bold">{{ book.livre.nombrePages || '—' }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="border rounded-3 p-3 text-center">
                  <small class="text-muted d-block">ISBN</small>
                  <span class="fw-bold">{{ book.livre.isbn || '—' }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="border rounded-3 p-3 text-center">
                  <small class="text-muted d-block">Éditeur</small>
                  <span class="fw-bold">{{ book.livre.editeur || '—' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-book display-3 text-muted"></i>
      <h5 class="mt-3">Livre non trouvé</h5>
      <button class="btn btn-primary mt-3" @click="router.back()">Retour</button>
    </div>
  </div>
</template>
