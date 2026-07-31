<template>
  <div>
    <BreadcombsComponent :title="product?.nom || 'Détail du produit'" />
    <div class="container my-5" v-if="product">
      <div class="row">
        <div class="col-lg-5" data-aos="fade-right" data-aos-duration="1000">
          <div class="main-image mb-3">
            <img :src="mainImage || product.imageUrl || defaultImg" :alt="product.nom" class="img-fluid rounded">
          </div>
          <div v-if="product.imagesSecondaires?.length" class="row g-2">
            <div v-for="(img, i) in product.imagesSecondaires" :key="i" class="col-4">
              <img :src="img" class="img-fluid rounded cursor-pointer" @click="mainImage = img">
            </div>
          </div>
        </div>

        <div class="col-lg-7" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="150">
          <h2 class="fw-bold">{{ product.nom }}</h2>

          <!-- Note moyenne -->
          <div class="pd-rating-summary mb-2" v-if="noteMoyenne > 0">
            <span class="pd-rating-score">{{ noteMoyenne }}</span>
            <span class="pd-rating-stars">
              <span v-for="s in 5" :key="s" class="pd-star" :class="{ 'is-filled': noteMoyenne >= s - 0.25 }">&#9733;</span>
            </span>
            <span class="pd-rating-count">{{ avisCount }} avis</span>
          </div>

          <div class="mb-2">
            <span v-if="product.estNouveaute" class="badge bg-danger me-1">Nouveau</span>
            <span v-if="product.estCoupDeCoeur" class="badge bg-warning text-dark me-1">Coup de coeur</span>
            <span v-if="product.estGratuit" class="badge bg-success me-1">Gratuit</span>
          </div>

          <div class="mb-3">

          </div>
          <p class="text-muted">{{ product.description }}</p>

          <div class="mb-3">
            <strong>Catégorie :</strong> {{ product.categorie?.nom || 'Non catégorisé' }}
          </div>
          <div class="mb-3">
            <strong>Type :</strong> <span class="text-capitalize">{{ product.type?.replace('_', ' ') }}</span>
          </div>
          <div class="mb-3" v-if="product.stock !== null">
            <strong>Stock :</strong>
            <span :class="product.stock > 0 ? 'text-success' : 'text-danger'">
              {{ product.stock > 0 ? 'En stock' : 'Rupture' }}
            </span>
          </div>

          <div v-if="product.livre" class="border-top pt-3 mt-3">
            <h5>Détails du livre</h5>
            <p v-if="product.livre.auteur"><strong>Auteur :</strong> {{ product.livre.auteur }}</p>
            <p v-if="product.livre.isbn"><strong>ISBN :</strong> {{ product.livre.isbn }}</p>
            <p v-if="product.livre.nombrePages"><strong>Pages :</strong> {{ product.livre.nombrePages }}</p>
            <p v-if="product.livre.editeur"><strong>Éditeur :</strong> {{ product.livre.editeur }}</p>
          </div>

          <div v-if="product.objet" class="border-top pt-3 mt-3">
            <h5>Détails de l'objet</h5>
            <p v-if="product.objet.matiere"><strong>Matière :</strong> {{ product.objet.matiere }}</p>
            <p v-if="product.objet.dimensions"><strong>Dimensions :</strong> {{ product.objet.dimensions }}</p>
            <p v-if="product.objet.origine"><strong>Origine :</strong> {{ product.objet.origine }}</p>
            <p v-if="product.objet.signification"><strong>Signification :</strong> {{ product.objet.signification }}</p>
          </div>

          <div class="d-flex gap-3 mt-4">
            <div class="input-group" style="width: 140px;">
              <button class="btn btn-outline-secondary" @click="qte = Math.max(1, qte - 1)">-</button>
              <input type="number" class="form-control text-center" v-model.number="qte" min="1">
              <button class="btn btn-outline-secondary" @click="qte++">+</button>
            </div>
            <button class="btn btn-primary" @click="addToCart" :disabled="adding">
              <span v-if="adding" class="spinner-border spinner-border-sm me-1"></span>
              Ajouter au panier
            </button>
          </div>
          <div v-if="cartMessage" class="mt-2" :class="cartSuccess ? 'text-success' : 'text-danger'">
            {{ cartMessage }}
          </div>
        </div>
      </div>

      <!-- ═══ Avis & notes ═══ -->
      <div class="pd-avis-section mt-5" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
        <h4 class="pd-avis-title"><i class="bi bi-chat-quote me-2"></i>Avis des clients
          <span v-if="avisCount" class="pd-avis-title-count">({{ avisCount }})</span>
        </h4>

        <div v-if="avisLoading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else>
          <div v-if="!avisList.length" class="text-muted text-center py-4">
            <i class="bi bi-chat-square-text display-4 d-block mb-2 opacity-50"></i>
            Aucun avis pour le moment. Soyez le premier à partager votre expérience !
          </div>

          <div v-else class="pd-avis-list">
            <div v-for="(a, i) in avisList" :key="a.id" class="pd-avis-item" data-aos="fade-up" data-aos-duration="800" :data-aos-delay="Math.min(i * 80, 400)">
              <div class="pd-avis-head">
                <img :src="a.user?.photoUrl || defaultAvatar" class="pd-avis-avatar" alt="">
                <div>
                  <strong class="pd-avis-author">{{ a.user?.name || 'Utilisateur' }}</strong>
                  <span v-if="a.user?.id === authStore.user?.id && !a.estApprouve" class="badge bg-warning text-dark ms-2 align-middle">En attente de validation</span>
                  <div class="pd-avis-stars">
                    <span v-for="s in 5" :key="s" class="pd-star" :class="{ 'is-filled': a.note >= s }">&#9733;</span>
                    <small class="ms-2 text-muted">{{ formatDate(a.date) }}</small>
                  </div>
                </div>
              </div>
              <p class="pd-avis-contenu">{{ a.contenu }}</p>
            </div>
          </div>

          <!-- Formulaire -->
          <div class="pd-avis-form" v-if="authStore.isAuthenticated">
            <h6 class="fw-bold mb-3"><i class="bi bi-pencil-square me-1"></i>Laisser un avis</h6>
            <template v-if="peutCommenter">
              <div class="pd-form-stars mb-2">
                <span
                  v-for="s in 5" :key="s"
                  class="pd-star pd-star-btn"
                  :class="{ 'is-filled': (avisNote || avisHover) >= s }"
                  @mouseover="avisHover = s"
                  @mouseleave="avisHover = 0"
                  @click="avisNote = s"
                >&#9733;</span>
              </div>
              <textarea v-model="avisContenu" class="form-control" rows="3" maxlength="2000" placeholder="Partagez votre expérience avec ce produit..."></textarea>
              <button class="btn btn-primary mt-2" @click="submitAvis" :disabled="avisEnvoi">
                <span v-if="avisEnvoi" class="spinner-border spinner-border-sm me-1"></span>
                <template v-else><i class="bi bi-send me-1"></i>Envoyer mon avis</template>
              </button>
              <p v-if="avisMessage" class="mt-2 mb-0 small" :class="avisMessageType === 'success' ? 'text-success' : avisMessageType === 'info' ? 'text-primary' : 'text-danger'">
                {{ avisMessage }}
              </p>
            </template>
            <p v-else class="text-muted small mb-0">Seuls les clients ayant acheté ce produit peuvent laisser un avis.</p>
          </div>
          <p v-else class="text-muted small mt-2">
            <router-link :to="{ name: 'login', query: { redirect: route.fullPath } }" class="text-decoration-none fw-bold">Connectez-vous</router-link> pour laisser un avis.
          </p>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="text-center py-5 text-muted">
      <h5>Produit non trouvé</h5>
    </div>
    <div v-else class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AOS from 'aos'
import { useCatalogueStore } from '../../stores/catalogue'
import { useCartStore } from '../../stores/cart'
import { useAuthStore } from '../../stores/auth'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import avisService from '../../services/avisService'
import defaultImg from '../../assets/img/faq.jpg'
import defaultAvatar from '../../assets/default.jpg'

const route = useRoute()
const catalogueStore = useCatalogueStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = ref(null)
const loading = ref(true)
const qte = ref(1)
const adding = ref(false)
const cartMessage = ref('')
const cartSuccess = ref(false)
const mainImage = ref('')

const avisList = ref([])
const avisLoading = ref(false)
const noteMoyenne = ref(0)
const avisCount = ref(0)
const avisNote = ref(0)
const avisHover = ref(0)
const avisContenu = ref('')
const avisEnvoi = ref(false)
const avisMessage = ref('')
const avisMessageType = ref('')
const peutCommenter = ref(false)

const formatPrice = (price) => {
  const num = parseFloat(price)
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    cartMessage.value = 'Veuillez vous connecter pour ajouter au panier'
    cartSuccess.value = false
    return
  }
  adding.value = true
  cartMessage.value = ''
  const result = await cartStore.addToCart(product.value.id, qte.value)
  adding.value = false
  cartSuccess.value = result.success
  cartMessage.value = result.success ? 'Ajouté au panier !' : result.error
}

const loadAvis = async () => {
  avisLoading.value = true
  try {
    const res = await avisService.getProduitAvis(route.params.id)
    const data = res.data || res
    avisList.value = data.avis?.data || data.avis || []
    noteMoyenne.value = parseFloat(data.note_moyenne || 0)
    avisCount.value = parseInt(data.avis_count ?? avisList.value.length)
  } catch (e) {
    console.error(e)
  } finally {
    avisLoading.value = false
  }
}

const loadStatutAvis = async () => {
  if (!authStore.isAuthenticated) return
  try {
    const res = await avisService.getStatut({ produit_id: route.params.id })
    const data = res.data || res
    peutCommenter.value = !!data.peut_commenter_produit
    const monAvis = data.mon_avis_produit
    if (monAvis) {
      avisNote.value = monAvis.note
      avisContenu.value = monAvis.contenu
      avisMessage.value = monAvis.estApprouve
        ? 'Votre avis est publié. Merci !'
        : 'Votre avis est en attente de validation par un administrateur.'
      avisMessageType.value = monAvis.estApprouve ? 'success' : 'info'
    }
  } catch (e) {
    console.error(e)
  }
}

const submitAvis = async () => {
  avisMessage.value = ''
  if (!avisNote.value) {
    avisMessage.value = 'Choisissez une note (1 à 5 étoiles).'
    avisMessageType.value = 'danger'
    return
  }
  if (avisContenu.value.trim().length < 5) {
    avisMessage.value = 'Votre avis doit contenir au moins 5 caractères.'
    avisMessageType.value = 'danger'
    return
  }
  avisEnvoi.value = true
  try {
    const res = await avisService.submitAvis({
      produit_id: route.params.id,
      note: avisNote.value,
      contenu: avisContenu.value,
    })
    avisMessage.value = res.message || 'Avis soumis avec succès !'
    avisMessageType.value = 'success'
    await Promise.all([loadAvis(), loadStatutAvis()])
  } catch (e) {
    avisMessage.value = e.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis'
    avisMessageType.value = 'danger'
  } finally {
    avisEnvoi.value = false
  }
}

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await catalogueStore.fetchProduct(id)
    product.value = catalogueStore.product
    if (product.value?.note_moyenne) noteMoyenne.value = parseFloat(product.value.note_moyenne)
    if (product.value?.avis_count) avisCount.value = parseInt(product.value.avis_count)
  }
  loading.value = false
  await Promise.all([loadAvis(), loadStatutAvis()])
  await nextTick()
  setTimeout(() => AOS.refresh(), 150)
})
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }

/* ── Note moyenne ── */
.pd-rating-summary { display: flex; align-items: center; gap: 8px; }
.pd-rating-score { font-size: 1.3rem; font-weight: 800; color: #0ea2bd; }
.pd-rating-stars { display: inline-flex; gap: 2px; }
.pd-star { color: #d9dce6; font-size: 1.1rem; }
.pd-star.is-filled { color: #f5a623; }
.pd-rating-count { color: #6c757d; font-size: 0.85rem; }

/* ── Section avis ── */
.pd-avis-section {
  background: #f8fafc;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem 1.8rem;
}
.pd-avis-title { font-weight: 800; margin-bottom: 1.2rem; }
.pd-avis-title-count { color: #6c757d; font-size: 0.9rem; font-weight: 600; }

.pd-avis-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.2rem; }
.pd-avis-item {
  background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 14px 16px;
}
.pd-avis-head { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.pd-avis-avatar {
  width: 42px; height: 42px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
  border: 2px solid #e9ecef;
}
.pd-avis-author { font-size: 0.9rem; }
.pd-avis-stars { display: flex; align-items: center; gap: 2px; }
.pd-avis-contenu { margin: 0; color: #495057; font-size: 0.9rem; line-height: 1.6; }

.pd-avis-form {
  background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 16px 18px;
}
.pd-form-stars { display: flex; gap: 4px; }
.pd-star-btn { font-size: 1.5rem; cursor: pointer; transition: transform .1s; }
.pd-star-btn:hover { transform: scale(1.15); }

@media (max-width: 575px) {
  .pd-avis-section { padding: 1.2rem 1rem; }
}
</style>
