<template>
  <div>
    <BreadcombsComponent title="Commande réussie" />
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-lg-6 text-center">
          <div class="card border-0 shadow-sm p-5">
            <div class="mb-4">
              <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4">
                <i class="bi bi-check-circle-fill text-success display-3"></i>
              </div>
            </div>
            <h2 class="fw-bold mb-2">Paiement réussi !</h2>
            <p class="text-muted mb-1">Votre commande #{{ orderId }} a été confirmée.</p>
            <p class="text-muted mb-4">Vous recevrez un email de confirmation sous peu.</p>
            <div class="d-flex justify-content-center gap-2 flex-wrap">
              <router-link to="/profile-inscrit" class="btn btn-primary">
                <i class="bi bi-person me-1"></i>Voir mes achats
              </router-link>
              <router-link to="/boutique" class="btn btn-outline-primary">
                <i class="bi bi-cart me-1"></i>Continuer mes achats
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import BreadcombsComponent from '../../includes/breadcombs.vue'

const route = useRoute()
const orderId = route.query.orderId || '---'
</script>
