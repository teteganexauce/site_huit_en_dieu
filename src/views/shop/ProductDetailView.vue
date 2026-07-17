<template>
  <div>
    <BreadcombsComponent :title="product?.nom || 'Détail du produit'" />
    <div class="container my-5" v-if="product">
      <div class="row">
        <div class="col-lg-5">
          <div class="main-image mb-3">
            <img :src="product.imageUrl || defaultImg" :alt="product.nom" class="img-fluid rounded">
          </div>
          <div v-if="product.imagesSecondaires?.length" class="row g-2">
            <div v-for="(img, i) in product.imagesSecondaires" :key="i" class="col-4">
              <img :src="img" class="img-fluid rounded cursor-pointer" @click="mainImage = img">
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <h2 class="fw-bold">{{ product.nom }}</h2>
          <div class="mb-2">
            <span v-if="product.estNouveaute" class="badge bg-danger me-1">Nouveau</span>
            <span v-if="product.estCoupDeCoeur" class="badge bg-warning text-dark me-1">Coup de coeur</span>
            <span v-if="product.estGratuit" class="badge bg-success me-1">Gratuit</span>
          </div>

          <div class="mb-3">
            <span v-if="product.prixPromotion" class="text-decoration-line-through text-muted fs-5 me-2">{{ formatPrice(product.prix) }}</span>
            <span class="fs-3 fw-bold text-ps-primary">{{ formatPrice(product.prixPromotion || product.prix) }}</span>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogueStore } from '../../stores/catalogue'
import { useCartStore } from '../../stores/cart'
import { useAuthStore } from '../../stores/auth'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import defaultImg from '../../assets/img/faq.jpg'

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

const formatPrice = (price) => {
  const num = parseFloat(price)
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

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

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await catalogueStore.fetchProduct(id)
    product.value = catalogueStore.product
  }
  loading.value = false
})
</script>

<style scoped>
.main-image img { width: 100%; max-height: 400px; object-fit: contain; }
.cursor-pointer { cursor: pointer; }
</style>
