<script setup>
import { ref, computed, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import shopService from '../services/shopService'
import donService from '../services/donService'
import accompagnementService from '../services/accompagnementService'
import chercheurService from '../services/chercheurService'
import ArticleModal from '../components/ArticleModal.vue'
import defaultAvatar from '../assets/img/portfolio/app-1.jpg'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('dashboard')
const isLoadingProfile = ref(false)
const isLoadingBooks = ref(true)
const isLoadingFormations = ref(true)
const isLoadingOrders = ref(true)
const isLoadingDons = ref(true)
const isLoadingAccompagnements = ref(true)
const isLoadingArticles = ref(true)

const orders = ref([])
const purchasedBooks = ref([])
const inscriptions = ref([])
const dons = ref([])
const accompagnements = ref([])
const articlesChercheur = ref([])

const showPaymentModal = ref(false)
const selectedBook = ref(null)
const modalType = ref('pending')

const showDemandeModal = ref(false)
const selectedDemande = ref(null)

const showArticleModal = ref(false)
const selectedArticle = ref(null)

const showDeleteArticleModal = ref(false)
const articleToDelete = ref(null)

const showSubmitArticleModal = ref(false)
const articleToSubmit = ref(null)

const showActionRequestModal = ref(false)
const actionType = ref('')
const actionMotif = ref('')
const articleForAction = ref(null)

const showSuccessModal = ref(false)

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
  totalDons: dons.value.reduce((sum, d) => sum + Number(d.montant), 0),
  accompagnements: accompagnements.value.length,
  articles: articlesChercheur.value.length
}))

const studentStats = computed(() => {
  const confirmees = inscriptions.value.filter(i => i.statut === 'confirmee')
  return {
    formationsSuivies: confirmees.length,
    coursCompletes: confirmees.reduce((sum, i) => sum + (Number(i.cours_completes_count) || 0), 0),
    progressionMoyenne: confirmees.length
      ? confirmees.reduce((sum, i) => sum + (Number(i.progression) || 0), 0) / confirmees.length
      : 0,
    certificatsObtenus: confirmees.filter(i => i.dateCertificat).length
  }
})

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

async function loadAccompagnements() {
  isLoadingAccompagnements.value = true
  try {
    const res = await accompagnementService.getHistorique()
    accompagnements.value = res.data || res
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingAccompagnements.value = false
  }
}

function viewDemandeDetails(demande) {
  selectedDemande.value = demande
  showDemandeModal.value = true
}

function closeDemandeModal() {
  showDemandeModal.value = false
  selectedDemande.value = null
}

async function loadArticles() {
  if (authStore.user?.role !== 'chercheur') return
  isLoadingArticles.value = true
  try {
    const res = await chercheurService.getMesArticles()
    articlesChercheur.value = res.data?.data || res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingArticles.value = false
  }
}

function openArticleModal(article = null) {
  selectedArticle.value = article
  showArticleModal.value = true
}

function closeArticleModal() {
  showArticleModal.value = false
  selectedArticle.value = null
}

async function saveArticle(formData, id) {
  try {
    if (id) {
      await chercheurService.updateArticle(id, formData)
    } else {
      await chercheurService.createArticle(formData)
    }
    closeArticleModal()
    loadArticles()
  } catch (error) {
    console.error(error)
    alert("Erreur lors de l'enregistrement de l'article")
  }
}

function openSubmitArticleModal(id) {
  articleToSubmit.value = id
  showSubmitArticleModal.value = true
}

function closeSubmitArticleModal() {
  showSubmitArticleModal.value = false
  articleToSubmit.value = null
}

async function processSubmitArticle() {
  if (!articleToSubmit.value) return
  try {
    await chercheurService.soumettreArticle(articleToSubmit.value)
    loadArticles()
    closeSubmitArticleModal()
  } catch (error) {
    console.error(error)
    alert("Erreur lors de la soumission de l'article")
  }
}

function openActionRequestModal(id, type) {
  articleForAction.value = id
  actionType.value = type
  actionMotif.value = ''
  showActionRequestModal.value = true
}

function closeActionRequestModal() {
  showActionRequestModal.value = false
  articleForAction.value = null
  actionMotif.value = ''
}

async function processActionRequest() {
  if (!articleForAction.value || !actionMotif.value) return
  try {
    await chercheurService.demanderAction(articleForAction.value, actionType.value, actionMotif.value)
    loadArticles()
    closeActionRequestModal()
    showSuccessModal.value = true
  } catch (error) {
    console.error(error)
    alert("Erreur lors de l'envoi de la demande.")
  }
}

function removeArticle(id) {
  articleToDelete.value = id
  showDeleteArticleModal.value = true
}

function closeDeleteArticleModal() {
  showDeleteArticleModal.value = false
  articleToDelete.value = null
}

async function confirmDeleteArticle() {
  if (!articleToDelete.value) return
  try {
    await chercheurService.deleteArticle(articleToDelete.value)
    loadArticles()
    closeDeleteArticleModal()
  } catch (error) {
    console.error(error)
    alert("Erreur lors de la suppression de l'article")
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
  loadAccompagnements()
  loadArticles()
})

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'home' })
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
    REUSSI: 'Réussi', ECHOUE: 'Échoué', EN_ATTENTE: 'En attente',
    brouillon: 'Brouillon', publie: 'Publié', rejete: 'Rejeté',
    approuve: 'Publié', refuse: 'Rejeté', soumis: 'En attente', en_revue: 'En révision'
  }
  return labels[statut] || statut
}

const statusClass = (statut) => {
  const classes = {
    payee: 'success', confirmee: 'success', livree: 'success',
    en_attente_paiement: 'warning', en_attente: 'warning',
    expediee: 'info', annulee: 'danger',
    REUSSI: 'success', ECHOUE: 'danger', EN_ATTENTE: 'warning',
    en_traitement: 'primary', traite: 'success', ferme: 'secondary',
    brouillon: 'secondary', publie: 'success', rejete: 'danger',
    approuve: 'success', refuse: 'danger', soumis: 'warning', en_revue: 'info'
  }
  return classes[statut] || 'secondary'
}

const statusDemandeLabel = (statut) => {
  const statuts = {
    'en_attente': 'En attente',
    'en_traitement': 'En traitement',
    'traite': 'Traité',
    'ferme': 'Fermé'
  }
  return statuts[statut] || statut
}

const formatDemandeDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
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
            <!-- <hr> -->
            <!-- <div class="row text-center g-0">
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
            </div> -->
            <template v-if="authStore.user?.role === 'etudiant' && studentStats.formationsSuivies > 0">
              <hr>
              <div class="text-start small">
                <div class="fw-bold text-muted mb-2">Profil Étudiant</div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted">Formations suivies</span>
                  <span class="fw-bold">{{ studentStats.formationsSuivies }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted">Cours complétés</span>
                  <span class="fw-bold">{{ studentStats.coursCompletes }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted">Progression moyenne</span>
                  <span class="fw-bold">{{ Math.round(studentStats.progressionMoyenne * 100) / 100 }}%</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Certificats obtenus</span>
                  <span class="fw-bold text-success">{{ studentStats.certificatsObtenus }}</span>
                </div>
              </div>
            </template>
            <div class="row text-center g-0 mt-3 border-top pt-3">
              <div class="col-12">
                <h6 class="fw-bold text-primary mb-0">{{ stats.accompagnements }}</h6>
                <small class="text-muted">Demandes d'accompagnement</small>
              </div>
            </div>
            <div class="row text-center g-0 mt-3 border-top pt-3" v-if="authStore.user?.role === 'chercheur'">
              <div class="col-12">
                <h6 class="fw-bold text-primary mb-0">{{ stats.articles }}</h6>
                <small class="text-muted">Publications</small>
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
                  <i class="bi bi-receipt me-1"></i>Commandes <span v-if="orders.length" class="badge bg-warning ms-1">{{ orders.length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: activeTab === 'dons' }" @click="activeTab = 'dons'">
                  <i class="bi bi-heart me-1"></i>Mes dons <span v-if="dons.length" class="badge bg-danger ms-1">{{ dons.length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: activeTab === 'accompagnements' }" @click="activeTab = 'accompagnements'">
                  <i class="bi bi-person-lines-fill me-1"></i>Accompagnements <span v-if="accompagnements.length" class="badge bg-info ms-1">{{ accompagnements.length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation" v-if="authStore.user?.role === 'chercheur'">
                <button class="nav-link" :class="{ active: activeTab === 'articles' }" @click="activeTab = 'articles'">
                  <i class="bi bi-journal-text me-1"></i>Mes publications <span v-if="articlesChercheur.length" class="badge bg-primary ms-1">{{ articlesChercheur.length }}</span>
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
                <div class="col-sm-6 col-md-3">
                  <div class="stat-card stat-card-primary" @click="activeTab = 'books'" role="button">
                    <div class="stat-icon">
                      <i class="bi bi-book"></i>
                    </div>
                    <h3 class="stat-value">{{ stats.livres }}</h3>
                    <p class="stat-label">Livres achetés</p>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="stat-card stat-card-success" @click="activeTab = 'formations'" role="button">
                    <div class="stat-icon">
                      <i class="bi bi-mortarboard"></i>
                    </div>
                    <h3 class="stat-value">{{ stats.formations }}</h3>
                    <p class="stat-label">Formations inscrites</p>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="stat-card stat-card-warning" @click="activeTab = 'orders'" role="button">
                    <div class="stat-icon">
                      <i class="bi bi-receipt"></i>
                    </div>
                    <h3 class="stat-value">{{ stats.commandes }}</h3>
                    <p class="stat-label">Commandes</p>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="stat-card stat-card-danger" @click="activeTab = 'dons'" role="button">
                    <div class="stat-icon">
                      <i class="bi bi-heart"></i>
                    </div>
                    <h3 class="stat-value">{{ stats.totalDons.toLocaleString('fr-FR') }} FCFA</h3>
                    <p class="stat-label">Dons ({{ stats.dons }})</p>
                  </div>
                </div>
              </div>

              <!-- <template v-if="authStore.user?.role === 'etudiant' && studentStats.formationsSuivies > 0">
                <div class="row g-3 mt-2">
                  <div class="col-12">
                    <div class="border rounded-3 p-3">
                      <h6 class="fw-bold text-muted mb-3"><i class="bi bi-mortarboard me-1"></i>Profil Étudiant</h6>
                      <div class="row g-3">
                        <div class="col-md-3 col-6">
                          <div class="text-center p-2 bg-info bg-opacity-10 rounded-3">
                            <div class="h4 fw-bold text-info mb-0">{{ studentStats.formationsSuivies }}</div>
                            <small class="text-muted">Formations suivies</small>
                          </div>
                        </div>
                        <div class="col-md-3 col-6">
                          <div class="text-center p-2 bg-primary bg-opacity-10 rounded-3">
                            <div class="h4 fw-bold text-gray-700 mb-0">{{ studentStats.coursCompletes }}</div>
                            <small class="text-muted">Cours complétés</small>
                          </div>
                        </div>
                        <div class="col-md-3 col-6">
                          <div class="text-center p-2 bg-warning bg-opacity-10 rounded-3">
                            <div class="h4 fw-bold text-warning mb-0">{{ Math.round(studentStats.progressionMoyenne * 100) / 100 }}%</div>
                            <small class="text-muted">Progression moyenne</small>
                          </div>
                        </div>
                        <div class="col-md-3 col-6">
                          <div class="text-center p-2 bg-success bg-opacity-10 rounded-3">
                            <div class="h4 fw-bold text-success mb-0">{{ studentStats.certificatsObtenus }}</div>
                            <small class="text-muted">Certificats obtenus</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template> -->
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
                          <span class="text-muted">
                            Cours complétés: {{ ins.cours_completes_count || 0 }}/{{ ins.formation?.total_cours || '?' }}
                          </span>
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

            <!-- Accompagnements -->
            <div v-if="activeTab === 'accompagnements'">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Mes demandes d'accompagnement</h5>
              </div>
              <div v-if="isLoadingAccompagnements" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="!accompagnements.length" class="text-center py-5 text-muted">
                <i class="bi bi-person-lines-fill display-3"></i>
                <h5 class="mt-3">Aucune demande soumise</h5>
                <router-link to="/accompagnement" class="btn btn-primary mt-3">Faire une demande</router-link>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover align-middle border rounded">
                  <thead class="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Titre / Type</th>
                      <th>Statut</th>
                      <th>Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="demande in accompagnements" :key="demande.id">
                      <td>{{ formatDemandeDate(demande.dateDemande) }}</td>
                      <td>
                        <strong>{{ demande.titre }}</strong><br>
                        <small class="text-muted text-capitalize">{{ demande.type }}</small>
                      </td>
                      <td>
                        <span class="badge" :class="'bg-' + statusClass(demande.statut)">
                          {{ statusDemandeLabel(demande.statut) }}
                        </span>
                      </td>
                      <td>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="viewDemandeDetails(demande)">
                          <i class="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-3 text-end">
                <router-link to="/accompagnement" class="btn btn-outline-primary">Faire une nouvelle demande</router-link>
              </div>
            </div>

            <!-- Articles (Chercheur) -->
            <div v-if="activeTab === 'articles' && authStore.user?.role === 'chercheur'">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Mes publications</h5>
                <button class="btn btn-primary btn-sm" @click="openArticleModal()">
                  <i class="bi bi-plus-lg me-1"></i>Nouveau
                </button>
              </div>
              <div v-if="isLoadingArticles" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="!articlesChercheur.length" class="text-center py-5 text-muted">
                <i class="bi bi-journal-x display-3"></i>
                <h5 class="mt-3">Aucune publication trouvée</h5>
                <p>Vous n'avez pas encore publié d'article ou de ressource documentaire.</p>
                <button class="btn btn-primary mt-2" @click="openArticleModal()">Ajouter une publication</button>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover align-middle border rounded">
                  <thead class="table-light">
                    <tr>
                      <th>Titre</th>
                      <th>Type</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="art in articlesChercheur" :key="art.id">
                      <td>
                        <strong>{{ art.titre }}</strong><br>
                        <small class="text-muted">{{ new Date(art.created_at).toLocaleDateString('fr-FR') }}</small>
                        <div v-if="art.commentairesRevue" class="mt-2 small p-2 bg-light border border-warning rounded text-secondary" style="border-left: 4px solid #ffc107 !important;">
                          <strong class="text-dark"><i class="bi bi-chat-left-dots"></i> Remarque de l'administrateur :</strong><br> {{ art.commentairesRevue }}
                        </div>
                      </td>
                      <td class="text-capitalize">{{ art.type }}</td>
                      <td>
                        <span class="badge" :class="'bg-' + statusClass(art.statut)">
                          {{ statusLabel(art.statut) }}
                        </span>
                      </td>
                      <td>
                        <button v-if="art.statut === 'brouillon' || art.statut === 'refuse'" class="btn btn-sm btn-outline-primary me-2" @click="openArticleModal(art)" title="Modifier">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button v-if="art.statut === 'brouillon' || art.statut === 'refuse'" class="btn btn-sm btn-outline-danger me-2" @click="removeArticle(art.id)" title="Supprimer">
                          <i class="bi bi-trash"></i>
                        </button>
                        <button v-if="art.statut === 'brouillon' || art.statut === 'refuse'" class="btn btn-sm btn-outline-success" @click="openSubmitArticleModal(art.id)" title="Soumettre pour validation">
                          <i class="bi bi-send"></i>
                        </button>

                          <!-- Actions when published (approuve) and no pending request -->
                          <div v-if="art.requete_action" class="badge bg-warning text-dark mt-2 d-block">
                            <i class="bi bi-hourglass-split"></i> Demande de {{ art.requete_action }}
                          </div>
                          <div v-if="art.statut === 'approuve' && !art.requete_action" class="mt-2">
                            <button class="btn btn-sm btn-outline-primary me-2" @click="openActionRequestModal(art.id, 'modification')" title="Demander une modification">
                              <i class="bi bi-pencil"></i> Demander modification
                            </button>
                            <button class="btn btn-sm btn-outline-danger" @click="openActionRequestModal(art.id, 'suppression')" title="Demander la suppression">
                              <i class="bi bi-trash"></i> Retirer
                            </button>
                          </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

<!-- Demande Accompagnement Modal -->
<div v-if="showDemandeModal" class="modal-backdrop fade show"></div>
<div v-if="showDemandeModal" class="modal fade show d-block" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content border-0 shadow">
      <div class="modal-header border-bottom-0 pb-0">
        <h5 class="modal-title fw-bold text-primary">{{ selectedDemande?.titre }}</h5>
        <button type="button" class="btn-close" @click="closeDemandeModal"></button>
      </div>
      <div class="modal-body py-4">
        <div class="mb-3">
          <span class="fw-bold d-block">Type :</span> 
          <span class="text-capitalize">{{ selectedDemande?.type }}</span>
        </div>
        <div class="mb-3">
          <span class="fw-bold d-block">Description :</span>
          <p class="text-break bg-light p-3 rounded text-muted" style="font-size: 0.9rem;">{{ selectedDemande?.description }}</p>
        </div>
        <hr>
        <div class="mb-3">
          <span class="fw-bold d-block">Statut actuel :</span>
          <span class="badge mt-1" :class="'bg-' + statusClass(selectedDemande?.statut)">
            {{ statusDemandeLabel(selectedDemande?.statut) }}
          </span>
        </div>
        <div v-if="selectedDemande?.reponse" class="alert alert-info mt-3 border-0 shadow-sm">
          <h6 class="alert-heading fw-bold"><i class="bi bi-chat-quote-fill me-2"></i>Réponse de l'administration :</h6>
          <p class="mb-0 text-break" style="font-size: 0.9rem;">{{ selectedDemande?.reponse }}</p>
          <hr v-if="selectedDemande?.dateReponse">
          <small v-if="selectedDemande?.dateReponse" class="text-muted d-block text-end">Le {{ formatDemandeDate(selectedDemande?.dateReponse) }}</small>
        </div>
      </div>
      <div class="modal-footer border-0 pt-0 justify-content-end">
        <button type="button" class="btn btn-secondary px-4" @click="closeDemandeModal">Fermer</button>
      </div>
    </div>
  </div>
</div>

<!-- Article Modal (Chercheur) -->
<ArticleModal v-if="showArticleModal" :article="selectedArticle" @close="closeArticleModal" @save="saveArticle" />

<!-- Delete Article Modal -->
<div v-if="showDeleteArticleModal" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-bold text-danger">Confirmer la suppression</h5>
        <button type="button" class="btn-close" @click="closeDeleteArticleModal" aria-label="Close"></button>
      </div>
      <div class="modal-body py-4 text-center">
        <i class="bi bi-exclamation-triangle text-warning display-1 mb-3"></i>
        <p class="mb-0 fs-5">Êtes-vous sûr de vouloir supprimer cet article ?</p>
        <p class="text-muted small mt-2">Cette action est irréversible et supprimera le document PDF associé.</p>
      </div>
      <div class="modal-footer border-0 justify-content-center bg-light">
        <button type="button" class="btn btn-outline-secondary px-4" @click="closeDeleteArticleModal">Annuler</button>
        <button type="button" class="btn btn-danger px-4" @click="confirmDeleteArticle">Supprimer définitivement</button>
      </div>
    </div>
  </div>
</div>

<!-- Submit Article Modal -->
<div v-if="showSubmitArticleModal" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-bold text-success">Confirmer la soumission</h5>
        <button type="button" class="btn-close" @click="closeSubmitArticleModal" aria-label="Close"></button>
      </div>
      <div class="modal-body py-4 text-center">
        <i class="bi bi-send-check text-success display-1 mb-3"></i>
        <p class="mb-0 fs-5">Êtes-vous sûr de vouloir soumettre cet article pour validation ?</p>
        <p class="text-muted small mt-2">Il ne pourra plus être modifié une fois soumis.</p>
      </div>
      <div class="modal-footer border-0 justify-content-center bg-light">
        <button type="button" class="btn btn-outline-secondary px-4" @click="closeSubmitArticleModal">Annuler</button>
        <button type="button" class="btn btn-success px-4" @click="processSubmitArticle">Oui, soumettre</button>
      </div>
    </div>
  </div>
</div>

<!-- Action Request Modal -->
<div v-if="showActionRequestModal" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-bold" :class="actionType === 'suppression' ? 'text-danger' : 'text-primary'">
          Demande de {{ actionType }}
        </h5>
        <button type="button" class="btn-close" @click="closeActionRequestModal" aria-label="Close"></button>
      </div>
      <div class="modal-body py-4">
        <p class="mb-3">Cette publication est actuellement en ligne. Pour la modifier ou la supprimer, veuillez envoyer une demande à l'administrateur avec le motif.</p>
        <div class="mb-3">
          <label class="form-label fw-bold small">Motif de la demande *</label>
          <textarea class="form-control" v-model="actionMotif" rows="3" required placeholder="Expliquez brièvement votre demande..."></textarea>
        </div>
      </div>
      <div class="modal-footer border-0 bg-light">
        <button type="button" class="btn btn-outline-secondary px-4" @click="closeActionRequestModal">Annuler</button>
        <button type="button" class="btn px-4" :class="actionType === 'suppression' ? 'btn-danger' : 'btn-primary'" @click="processActionRequest" :disabled="!actionMotif">
          Envoyer la demande
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Action Request Success Modal -->
<div v-if="showSuccessModal" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header border-0">
        <button type="button" class="btn-close" @click="showSuccessModal = false" aria-label="Close"></button>
      </div>
      <div class="modal-body py-4 text-center">
        <i class="bi bi-check-circle-fill text-success display-1 mb-3"></i>
        <h5 class="fw-bold">Demande envoyée !</h5>
        <p class="mb-0 text-muted">Votre demande a bien été envoyée à l'administrateur.</p>
      </div>
      <div class="modal-footer border-0 justify-content-center">
        <button type="button" class="btn btn-success px-4" @click="showSuccessModal = false">Compris</button>
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

.stat-card {
  position: relative;
  padding: 1.5rem 1rem;
  border-radius: 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
  isolation: isolate;
}
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  opacity: 0.08;
  z-index: -1;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.stat-card:active {
  transform: translateY(-1px);
}
.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 0.75rem;
  font-size: 1.25rem;
  transition: transform 0.25s ease;
}
.stat-card:hover .stat-icon {
  transform: scale(1.1);
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}
.stat-label {
  font-size: 0.8rem;
  margin-bottom: 0;
  opacity: 0.7;
  font-weight: 500;
}

.stat-card-primary {
  background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
  color: #1a73e8;
}
.stat-card-primary::before { background: #1a73e8; }
.stat-card-primary .stat-icon { background: rgba(26, 115, 232, 0.12); color: #1a73e8; }
.stat-card-primary .stat-value { color: #1a73e8; }
.stat-card-primary .stat-label { color: #1a73e8; }

.stat-card-success {
  background: linear-gradient(135deg, #e6f4ea 0%, #ceead6 100%);
  color: #137333;
}
.stat-card-success::before { background: #137333; }
.stat-card-success .stat-icon { background: rgba(19, 115, 51, 0.12); color: #137333; }
.stat-card-success .stat-value { color: #137333; }
.stat-card-success .stat-label { color: #137333; }

.stat-card-warning {
  background: linear-gradient(135deg, #fef7e0 0%, #fcefcc 100%);
  color: #e37400;
}
.stat-card-warning::before { background: #e37400; }
.stat-card-warning .stat-icon { background: rgba(227, 116, 0, 0.12); color: #e37400; }
.stat-card-warning .stat-value { color: #e37400; }
.stat-card-warning .stat-label { color: #e37400; }

.stat-card-danger {
  background: linear-gradient(135deg, #fce8e6 0%, #f8d7d9 100%);
  color: #c5221f;
}
.stat-card-danger::before { background: #c5221f; }
.stat-card-danger .stat-icon { background: rgba(197, 34, 31, 0.12); color: #c5221f; }
.stat-card-danger .stat-value { color: #c5221f; }
.stat-card-danger .stat-label { color: #c5221f; }
</style>
