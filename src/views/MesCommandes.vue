<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import shopService from '../services/shopService'

const orders = ref([])
const isLoading = ref(true)

const formatPrice = (price) => {
  const num = parseFloat(price)
  return num.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }).replace('XOF', '').trim() + ' FCFA'
}

const statusLabel = (statut) => {
  const labels = {
    payee: 'Payée', en_attente_paiement: 'En attente', expediee: 'Expédiée',
    livree: 'Livrée', annulee: 'Annulée', panier: 'Panier',
    confirmee: 'Confirmée', en_attente: 'En attente'
  }
  return labels[statut] || statut
}

const statusClass = (statut) => {
  const classes = {
    payee: 'success', confirmee: 'success', livree: 'success',
    en_attente_paiement: 'warning', en_attente: 'warning',
    expediee: 'info', annulee: 'danger'
  }
  return classes[statut] || 'secondary'
}

async function loadOrders() {
  try {
    const res = await shopService.getOrders()
    const data = res.data || res
    orders.value = data.data || data
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadOrders)
</script>

<template>
  <BreadcombsComponent title="Mes commandes" />
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold mb-0">Mes commandes</h5>
    </div>

    <div v-if="isLoading" class="text-center py-5">
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
</template>
