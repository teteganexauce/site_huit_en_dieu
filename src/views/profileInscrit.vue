<script setup>
import { ref, computed, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import shopService from '../services/shopService'
import donService from '../services/donService'
import defaultAvatar from '../assets/img/portfolio/app-1.jpg'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('dashboard')
const isLoadingProfile = ref(false)
const isLoadingBooks = ref(false)
const isLoadingFormations = ref(false)
const isLoadingOrders = ref(false)
const isLoadingDons = ref(false)

const orders = ref([])
const purchasedBooks = ref([])
const inscriptions = ref([])
const dons = ref([])

const showPaymentModal = ref(false)
const selectedBook = ref(null)
const modalType = ref('pending')

const form = ref({
  nom: '', prenom: '', telephone: '', adresse: '',
  fonction: '', niveauEtude: '', specialite: '', bio: '',
  institution: '', adresseLivraison: '', preferencesNotification: ''
})
const photoFile = ref(null)
const photoPreview = ref(null)
const isLoading = ref(false)
const errors = ref({})
const successMessage = ref('')
const globalError = ref('')

const initializeForm = () => {
  if (!authStore.user) return
  const u = authStore.user
  form.value.nom = u.nom || ''
  form.value.prenom = u.prenom || ''
  form.value.telephone = u.telephone || ''
  form.value.adresse = u.adresse || ''
  if (u.profil_administrateur) form.value.fonction = u.profil_administrateur.fonction || ''
  if (u.profil_etudiant) form.value.niveauEtude = u.profil_etudiant.niveauEtude || ''
  if (u.profil_chercheur) {
    form.value.specialite = u.profil_chercheur.specialite || ''
    form.value.bio = u.profil_chercheur.bio || ''
    form.value.institution = u.profil_chercheur.institution || ''
  }
  if (u.profil_client_boutique) {
    form.value.adresseLivraison = u.profil_client_boutique.adresseLivraison || ''
    form.value.preferencesNotification = u.profil_client_boutique.preferencesNotification || ''
  }
  if (u.photo_profil_url) photoPreview.value = u.photo_profil_url
}

const stats = computed(() => ({
  livres: purchasedBooks.value.length,
  formations: inscriptions.value.length,
  commandes: orders.value.length,
  dons: dons.value.length,
  totalDons: dons.value.reduce((sum, d) => sum + Number(d.montant), 0)
}))

async function loadOrders() {
  isLoadingOrders.value = true
  try {
    const res = await shopService.getOrders()
    const data = res.data || res
    orders.value = data.data || data
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingOrders.value = false
  }
}

async function loadPurchasedBooks() {
  isLoadingBooks.value = true
  try {
    const res = await shopService.getOrders()
    const data = res.data || res
    const items = data.data || data
    const books = []
    for (const order of items) {
      if (order.lignes) {
        for (const line of order.lignes) {
          if (line.produit && (line.produit.type === 'ebook' || line.produit.type === 'ebook')) {
            books.push({
              id: line.produit.id,
              orderId: order.id,
              nom: line.produit.nom,
              description: line.produit.description,
              imageUrl: line.produit.imageUrl,
              prix: line.prixUnitaire,
              quantite: line.quantite,
              dateCommande: order.dateCommande,
              statut: order.statut,
              livre: line.produit.livre || null
            })
          }
        }
      }
    }
    purchasedBooks.value = books
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingBooks.value = false
  }
}

function openBookReader(book) {
  const livreId = book.livre?.id
  if (!livreId) {
    openPaymentModal(book)
    return
  }
  router.push({
    name: 'bookReader',
    params: { livreId: String(livreId) },
    query: { produit_id: String(book.id) }
  })
}

function openPaymentModal(book) {
  selectedBook.value = book
  if (book.statut === 'annulee') {
    modalType.value = 'cancelled'
  } else if (book.statut === 'en_attente_paiement' || book.statut === 'en_attente') {
    modalType.value = 'pending'
  } else {
    modalType.value = 'pending'
  }
  showPaymentModal.value = true
}

function closePaymentModal() {
  showPaymentModal.value = false
  selectedBook.value = null
}

async function loadFormations() {
  isLoadingFormations.value = true
  try {
    const res = await shopService.getMyInscriptions()
    const data = res.data || res
    inscriptions.value = data.data || data
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingFormations.value = false
  }
}

async function loadDons() {
  isLoadingDons.value = true
  try {
    const res = await donService.getMyDons()
    const data = res.data || res
    dons.value = data.data || data
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingDons.value = false
  }
}

onMounted(async () => {
  initializeForm()
  try {
    const res = await authService.getProfile()
    if (res && res.data) {
      authStore.user = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
      initializeForm()
    }
  } catch (e) {
    console.error(e)
  }
  loadOrders()
  loadPurchasedBooks()
  loadFormations()
  loadDons()
})

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    photoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => { photoPreview.value = e.target.result }
    reader.readAsDataURL(file)
  }
}

const handleUpdateProfile = async () => {
  errors.value = {}
  successMessage.value = ''
  globalError.value = ''
  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    if (form.value.nom) formData.append('nom', form.value.nom)
    if (form.value.prenom) formData.append('prenom', form.value.prenom)
    if (form.value.telephone) formData.append('telephone', form.value.telephone)
    if (form.value.adresse) formData.append('adresse', form.value.adresse)
    if (photoFile.value) formData.append('photo', photoFile.value)
    if (form.value.fonction) formData.append('fonction', form.value.fonction)
    if (form.value.niveauEtude) formData.append('niveauEtude', form.value.niveauEtude)
    if (form.value.specialite) formData.append('specialite', form.value.specialite)
    if (form.value.bio) formData.append('bio', form.value.bio)
    if (form.value.institution) formData.append('institution', form.value.institution)
    if (form.value.adresseLivraison) formData.append('adresseLivraison', form.value.adresseLivraison)
    if (form.value.preferencesNotification) formData.append('preferencesNotification', form.value.preferencesNotification)
    const response = await authService.updateProfile(formData)
    if (response.data) {
      authStore.user = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    successMessage.value = "Profil mis à jour avec succès."
  } catch (error) {
    if (error.response?.status === 422) errors.value = error.response.data.errors || {}
    else globalError.value = "Une erreur s'est produite."
  } finally {
    isLoading.value = false
  }
}

const formatPrice = (price) => {
  const num = parseFloat(price)
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

const statusLabel = (statut) => {
  const labels = {
    payee: 'Payée', en_attente_paiement: 'En attente', expediee: 'Expédiée',
    livree: 'Livrée', annulee: 'Annulée', panier: 'Panier',
    confirmee: 'Confirmée', en_attente: 'En attente',
    REUSSI: 'Réussi', ECHOUE: 'Échoué', EN_ATTENTE: 'En attente'
  }
  return labels[statut] || statut
}

const statusClass = (statut) => {
  const classes = {
    payee: 'success', confirmee: 'success', livree: 'success',
    en_attente_paiement: 'warning', en_attente: 'warning',
    expediee: 'info', annulee: 'danger',
    REUSSI: 'success', ECHOUE: 'danger', EN_ATTENTE: 'warning'
  }
  return classes[statut] || 'secondary'
}
</script>

<template>
  <BreadcombsComponent title="Mon Profil" />
  <div class="container py-4">
    <div class="row g-4">
      <!-- Sidebar -->
      <div class="col-lg-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center p-4">
            <div class="position-relative d-inline-block">
              <img :src="photoPreview || defaultAvatar" class="rounded-circle border border-3 border-primary" width="120" height="120" style="object-fit: cover;">
            </div>
            <h5 class="mt-3 mb-1 fw-bold">{{ authStore.user?.prenom || '' }} {{ authStore.user?.nom || '' }}</h5>
            <p class="text-muted small mb-2 text-capitalize">{{ authStore.user?.role || 'Utilisateur' }}</p>
            <p class="text-muted small mb-3"><i class="bi bi-envelope me-1"></i>{{ authStore.user?.email }}</p>
            <hr>
            <div class="row text-center g-0">
              <div class="col-3">
                <h6 class="fw-bold text-primary mb-0">{{ stats.livres }}</h6>
                <small class="text-muted">Livres</small>
              </div>
              <div class="col-3">
                <h6 class="fw-bold text-primary mb-0">{{ stats.formations }}</h6>
                <small class="text-muted">Formations</small>
              </div>
              <div class="col-3">
                <h6 class="fw-bold text-primary mb-0">{{ stats.commandes }}</h6>
                <small class="text-muted">Commandes</small>
              </div>
              <div class="col-3">
                <h6 class="fw-bold text-primary mb-0">{{ stats.dons }}</h6>
                <small class="text-muted">Dons</small>
              </div>
            </div>
            <hr>
            <button @click="handleLogout" class="btn btn-outline-danger btn-sm w-100">
              <i class="bi bi-box-arrow-right me-1"></i>Déconnexion
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-lg-9">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom">
            <ul class="nav nav-pills nav-fill gap-2" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
                  <i class="bi bi-speedometer2 me-1"></i>Vue d'ensemble
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: activeTab === 'books' }" @click="activeTab = 'books'">
                  <i class="bi bi-book me-1"></i>Mes livres <span v-if="purchasedBooks.length" class="badge bg-primary ms-1">{{ purchasedBooks.length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: activeTab === 'formations' }" @click="activeTab = 'formations'">
                  <i class="bi bi-mortarboard me-1"></i>Mes formations <span v-if="inscriptions.length" class="badge bg-primary ms-1">{{ inscriptions.length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
                  <i class="bi bi-receipt me-1"></i>Commandes
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: activeTab === 'dons' }" @click="activeTab = 'dons'">
                  <i class="bi bi-heart me-1"></i>Mes dons <span v-if="dons.length" class="badge bg-danger ms-1">{{ dons.length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
                  <i class="bi bi-gear me-1"></i>Paramètres
                </button>
              </li>
            </ul>
          </div>
          <div class="card-body p-4">

            <!-- Dashboard -->
            <div v-if="activeTab === 'dashboard'">
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="bg-primary bg-opacity-10 rounded-3 p-3 text-center">
                    <i class="bi bi-book text-primary fs-1"></i>
                    <h3 class="fw-bold text-primary mt-2">{{ stats.livres }}</h3>
                    <p class="text-muted mb-0">Livres achetés</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="bg-success bg-opacity-10 rounded-3 p-3 text-center">
                    <i class="bi bi-mortarboard text-success fs-1"></i>
                    <h3 class="fw-bold text-success mt-2">{{ stats.formations }}</h3>
                    <p class="text-muted mb-0">Formations inscrites</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="bg-warning bg-opacity-10 rounded-3 p-3 text-center">
                    <i class="bi bi-receipt text-warning fs-1"></i>
                    <h3 class="fw-bold text-warning mt-2">{{ stats.commandes }}</h3>
                    <p class="text-muted mb-0">Commandes</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="bg-danger bg-opacity-10 rounded-3 p-3 text-center">
                    <i class="bi bi-heart text-danger fs-1"></i>
                    <h3 class="fw-bold text-danger mt-2">{{ stats.totalDons.toLocaleString('fr-FR') }} FCFA</h3>
                    <p class="text-muted mb-0">Dons ({{ stats.dons }})</p>
                  </div>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-12">
                  <div class="border rounded-3 p-3">
                    <div class="d-flex align-items-center gap-3">
                      <img :src="photoPreview || defaultAvatar" class="rounded-circle border" width="60" height="60" style="object-fit: cover;">
                      <div>
                        <h5 class="mb-1 fw-bold">{{ authStore.user?.prenom || '' }} {{ authStore.user?.nom || '' }}</h5>
                        <p class="text-muted small mb-1"><i class="bi bi-envelope me-1"></i>{{ authStore.user?.email }} &nbsp; <i class="bi bi-telephone me-1"></i>{{ authStore.user?.telephone || 'Non renseigné' }}</p>
                        <p class="text-muted small mb-0"><i class="bi bi-geo-alt me-1"></i>{{ authStore.user?.adresse || 'Adresse non renseignée' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 d-flex gap-2 flex-wrap">
                <router-link to="/formations" class="btn btn-outline-primary"><i class="bi bi-mortarboard me-1"></i>Voir toutes les formations</router-link>
                <router-link to="/boutique" class="btn btn-outline-success"><i class="bi bi-book me-1"></i>Voir la boutique</router-link>
                <router-link to="/boutique" class="btn btn-outline-warning"><i class="bi bi-cart me-1"></i>Continuer mes achats</router-link>
              </div>
            </div>

            <!-- Books -->
            <div v-if="activeTab === 'books'">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Mes livres achetés</h5>
                <span class="text-muted small">{{ purchasedBooks.length }} livre(s)</span>
              </div>
              <div v-if="isLoadingBooks" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="!purchasedBooks.length" class="text-center py-5 text-muted">
                <i class="bi bi-book display-3"></i>
                <h5 class="mt-3">Vous n'avez pas encore acheté de livres</h5>
                <router-link to="/e-book" class="btn btn-primary mt-3">Découvrir les e-books</router-link>
              </div>
              <div v-else class="row g-3">
                <div v-for="book in purchasedBooks" :key="book.id" class="col-md-6">
                  <div class="border rounded-3 p-3 h-100 d-flex book-card"
                       :class="{
                         'book-card-clickable': book.statut !== 'payee' && book.statut !== 'livree',
                         'book-card-paid': book.statut === 'payee' || book.statut === 'livree'
                       }"
                       @click="book.statut === 'payee' || book.statut === 'livree' ? openBookReader(book) : openPaymentModal(book)">
                    <img :src="book.imageUrl || defaultAvatar" class="rounded me-3" width="80" height="100" style="object-fit: cover;">
                    <div class="flex-grow-1 d-flex flex-column">
                      <h6 class="fw-bold mb-1">{{ book.nom }}</h6>
                      <small class="text-muted">{{ book.description?.substring(0, 80) || '' }}{{ book.description?.length > 80 ? '...' : '' }}</small>
                      <div class="mt-auto">
                        <span class="badge mb-2" :class="'bg-' + statusClass(book.statut) + ' bg-opacity-25 text-' + statusClass(book.statut)">
                          <i v-if="book.statut === 'payee' || book.statut === 'livree'" class="bi bi-check-circle me-1"></i>
                          <i v-else-if="book.statut === 'annulee'" class="bi bi-x-circle me-1"></i>
                          <i v-else class="bi bi-clock me-1"></i>
                          {{ statusLabel(book.statut) }}
                        </span>
                        <small v-if="book.statut === 'payee' || book.statut === 'livree'" class="text-success d-block mt-1">
                          <i class="bi bi-arrow-right-circle me-1"></i>Cliquez pour lire / télécharger
                        </small>
                        <small v-else class="text-muted d-block mt-1">
                          <i class="bi bi-info-circle me-1"></i>Cliquez pour plus d'informations
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formations -->
            <div v-if="activeTab === 'formations'">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Mes formations</h5>
                <span class="text-muted small">{{ inscriptions.length }} formation(s)</span>
              </div>
              <div v-if="isLoadingFormations" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="!inscriptions.length" class="text-center py-5 text-muted">
                <i class="bi bi-mortarboard display-3"></i>
                <h5 class="mt-3">Vous n'êtes inscrit à aucune formation</h5>
                <router-link to="/formations" class="btn btn-primary mt-3">Voir les formations</router-link>
              </div>
              <div v-else class="row g-3">
                <div v-for="ins in inscriptions" :key="ins.id" class="col-md-6">
                  <div class="border rounded-3 p-3 h-100 d-flex">
                    <img :src="ins.formation?.imageUrl || defaultAvatar" class="rounded me-3" width="80" height="80" style="object-fit: cover;">
                    <div class="flex-grow-1 d-flex flex-column">
                      <h6 class="fw-bold mb-1">{{ ins.formation?.titre || 'Formation' }}</h6>
                      <div class="mb-1">
                        <span class="badge" :class="'bg-' + statusClass(ins.statut)">{{ statusLabel(ins.statut) }}</span>
                      </div>
                      <div class="mt-auto">
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-muted">Progression</span>
                          <span class="fw-bold">{{ Math.round(ins.progression || 0) }}%</span>
                        </div>
                        <div class="progress" style="height: 6px;">
                          <div class="progress-bar bg-success" :style="{ width: (ins.progression || 0) + '%' }"></div>
                        </div>
                        <div class="mt-2">
                          <router-link :to="'/formations/' + ins.formation_id" class="btn btn-sm btn-outline-primary me-1">
                            <i class="bi bi-eye me-1"></i>Voir
                          </router-link>
                          <router-link v-if="ins.progression === 100" :to="{ name: 'certificat', params: { id: ins.id } }" class="btn btn-sm btn-outline-warning">
                            <i class="bi bi-award me-1"></i>Certificat
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Orders -->
            <div v-if="activeTab === 'orders'">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Mes commandes</h5>
              </div>
              <div v-if="isLoadingOrders" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="!orders.length" class="text-center py-5 text-muted">
                <i class="bi bi-receipt display-3"></i>
                <h5 class="mt-3">Aucune commande pour le moment</h5>
                <router-link to="/boutique" class="btn btn-primary mt-3">Découvrir la boutique</router-link>
              </div>
              <div v-else>
                <div v-for="order in orders" :key="order.id" class="border rounded-3 p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <h6 class="fw-bold mb-1">Commande #{{ order.id }}</h6>
                      <small class="text-muted">{{ order.dateCommande ? new Date(order.dateCommande).toLocaleDateString('fr-FR') : '---' }}</small>
                    </div>
                    <div class="text-end">
                      <span class="badge" :class="'bg-' + statusClass(order.statut)">{{ statusLabel(order.statut) }}</span>
                      <div class="fw-bold text-primary mt-1">{{ formatPrice(order.montantTotal || 0) }}</div>
                    </div>
                  </div>
                  <div v-if="order.lignes?.length" class="mt-2">
                    <small class="text-muted">{{ order.lignes.length }} article(s)</small>
                    <div class="d-flex gap-2 mt-1 flex-wrap">
                      <span v-for="l in order.lignes" :key="l.id" class="badge bg-light text-dark border">
                        {{ l.produit?.nom || 'Produit' }} x{{ l.quantite }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dons -->
            <div v-if="activeTab === 'dons'">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Mes dons</h5>
                <span class="text-muted small">{{ stats.totalDons.toLocaleString('fr-FR') }} FCFA total</span>
              </div>
              <div v-if="isLoadingDons" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="!dons.length" class="text-center py-5 text-muted">
                <i class="bi bi-heart display-3"></i>
                <h5 class="mt-3">Vous n'avez pas encore fait de don</h5>
                <router-link to="/dons" class="btn btn-danger mt-3">Faire un don</router-link>
              </div>
              <div v-else>
                <div v-for="don in dons" :key="don.id" class="border rounded-3 p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <h6 class="fw-bold mb-1">Don #{{ don.id }}</h6>
                      <small class="text-muted">{{ don.dateDon ? new Date(don.dateDon).toLocaleDateString('fr-FR') : '---' }}</small>
                      <p v-if="don.message" class="small text-muted mt-1 mb-0">{{ don.message }}</p>
                    </div>
                    <div class="text-end">
                      <span class="badge" :class="'bg-' + statusClass(don.statut)">{{ statusLabel(don.statut) }}</span>
                      <div class="fw-bold text-danger mt-1">{{ Number(don.montant).toLocaleString('fr-FR') }} FCFA</div>
                      <small v-if="don.reference" class="text-muted">Ref: {{ don.reference }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings -->
            <div v-if="activeTab === 'settings'">
              <div v-if="successMessage" class="alert alert-success py-2">{{ successMessage }}</div>
              <div v-if="globalError" class="alert alert-danger py-2">{{ globalError }}</div>
              <form @submit.prevent="handleUpdateProfile">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Nom</label>
                    <input type="text" class="form-control" :class="{'is-invalid': errors.nom}" v-model="form.nom">
                    <div class="invalid-feedback" v-if="errors.nom">{{ errors.nom[0] }}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Prénom</label>
                    <input type="text" class="form-control" :class="{'is-invalid': errors.prenom}" v-model="form.prenom">
                    <div class="invalid-feedback" v-if="errors.prenom">{{ errors.prenom[0] }}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Email</label>
                    <input type="email" class="form-control" disabled :value="authStore.user?.email">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Téléphone</label>
                    <input type="text" class="form-control" :class="{'is-invalid': errors.telephone}" v-model="form.telephone">
                    <div class="invalid-feedback" v-if="errors.telephone">{{ errors.telephone[0] }}</div>
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label small fw-bold">Adresse</label>
                    <input type="text" class="form-control" :class="{'is-invalid': errors.adresse}" v-model="form.adresse">
                    <div class="invalid-feedback" v-if="errors.adresse">{{ errors.adresse[0] }}</div>
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label small fw-bold">Photo de profil</label>
                    <input type="file" class="form-control" accept="image/*" @change="handleFileChange">
                    <div class="invalid-feedback" v-if="errors.photo">{{ errors.photo[0] }}</div>
                  </div>

                  <template v-if="authStore.user?.role === 'admin'">
                    <div class="col-12 mb-3">
                      <label class="form-label small fw-bold">Fonction</label>
                      <input type="text" class="form-control" v-model="form.fonction">
                    </div>
                  </template>

                  <template v-if="authStore.user?.role === 'etudiant'">
                    <div class="col-12 mb-3">
                      <label class="form-label small fw-bold">Niveau d'étude</label>
                      <input type="text" class="form-control" v-model="form.niveauEtude">
                    </div>
                  </template>

                  <template v-if="authStore.user?.role === 'chercheur'">
                    <div class="col-md-6 mb-3">
                      <label class="form-label small fw-bold">Spécialité</label>
                      <input type="text" class="form-control" v-model="form.specialite">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label small fw-bold">Institution</label>
                      <input type="text" class="form-control" v-model="form.institution">
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label small fw-bold">Bio</label>
                      <textarea rows="3" class="form-control" v-model="form.bio"></textarea>
                    </div>
                  </template>

                  <div class="col-12">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </form>
              <hr class="my-4">
              <h5 class="fw-bold mb-3">Changer le mot de passe</h5>
              <form>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label small fw-bold">Ancien mot de passe</label>
                    <input type="password" class="form-control">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label small fw-bold">Nouveau mot de passe</label>
                    <input type="password" class="form-control">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label small fw-bold">Confirmer</label>
                    <input type="password" class="form-control">
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-outline-primary">Modifier le mot de passe</button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
  </div>
</div>

<!-- Payment Status Modal -->
<div v-if="showPaymentModal" class="modal-backdrop fade show"></div>
<div v-if="showPaymentModal" class="modal fade show d-block" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold">{{ selectedBook?.nom }}</h5>
        <button type="button" class="btn-close" @click="closePaymentModal"></button>
      </div>
      <div class="modal-body text-center py-4">
        <template v-if="modalType === 'pending'">
          <div class="mb-3">
            <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
              <i class="bi bi-clock-history fs-1 text-warning"></i>
            </div>
          </div>
          <h5 class="fw-bold mb-2">Paiement en attente de confirmation</h5>
          <p class="text-muted mb-0">
            Votre commande pour <strong>{{ selectedBook?.nom }}</strong> est en attente de confirmation de paiement.
            Dès que l'administrateur aura vérifié et confirmé le paiement, vous pourrez lire et télécharger votre livre.
          </p>
          <hr class="my-3">
          <div class="d-flex justify-content-center gap-3 small text-muted">
            <span><i class="bi bi-credit-card me-1"></i>Payé</span>
            <span><i class="bi bi-shield-check me-1"></i>En vérification</span>
            <span><i class="bi bi-book me-1"></i>Bientôt disponible</span>
          </div>
        </template>
        <template v-else-if="modalType === 'cancelled'">
          <div class="mb-3">
            <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
              <i class="bi bi-x-circle fs-1 text-danger"></i>
            </div>
          </div>
          <h5 class="fw-bold mb-2">Commande annulée</h5>
          <p class="text-muted mb-0">
            La commande pour <strong>{{ selectedBook?.nom }}</strong> a été annulée.
            Si vous avez effectué un paiement, veuillez contacter l'administrateur pour un remboursement.
          </p>
        </template>
      </div>
      <div class="modal-footer border-0 pt-0 justify-content-center">
        <button type="button" class="btn btn-primary px-4" @click="closePaymentModal">
          <i class="bi bi-check-lg me-1"></i>Compris
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.nav-pills .nav-link {
  color: #6c757d;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}
.nav-pills .nav-link:hover {
  background-color: #f0f0f0;
}
.nav-pills .nav-link.active {
  background-color: var(--color-primary, #0d6efd);
  color: #fff;
}
.progress {
  background-color: #e9ecef;
}

.book-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  border-color: #e9ecef !important;
}
.book-card-paid {
  border-left: 4px solid var(--color-primary, #0d6efd) !important;
}
.book-card-clickable {
  border-left: 4px solid #ffc107 !important;
  cursor: pointer;
}
.book-card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: #ffc107 !important;
}
.book-card-paid:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
</style>
