<template>
  <div>
    <BreadcombsComponent title="Commande réussie" />
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center p-5">
              <div class="mb-4">
                <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4">
                  <i class="bi bi-check-circle-fill text-success display-3"></i>
                </div>
              </div>
              <h2 class="fw-bold mb-2">Paiement réussi !</h2>
              <p class="text-muted mb-1">Votre commande <strong>#{{ orderId }}</strong> a été confirmée et est maintenant en cours de traitement.</p>
              <p class="text-muted mb-4">Un email de confirmation vous a été envoyé.</p>

              <div class="border rounded-3 p-3 bg-light text-start mb-4">
                <h6 class="fw-bold mb-2"><i class="bi bi-info-circle me-1"></i>Récapitulatif</h6>
                <p class="small mb-1"><strong>Numéro de commande :</strong> #{{ orderId }}</p>
                <p class="small mb-1"><strong>Statut :</strong> <span class="badge bg-success">Payée</span></p>
                <p class="small mb-1"><strong>Date :</strong> {{ new Date().toLocaleDateString('fr-FR') }}</p>
                <p class="small mb-0"><strong>Paiement :</strong> {{ paymentMethodLabel }}</p>
              </div>

              <div class="alert alert-info text-start small mb-4">
                <i class="bi bi-download me-1"></i>
                <strong>Accès à vos achats :</strong> Rendez-vous dans votre profil → <strong>Mes livres achetés</strong> pour lire ou télécharger vos e-books.
              </div>

              <div class="d-flex justify-content-center gap-2 flex-wrap">
                <router-link to="/profile-inscrit" class="btn btn-primary">
                  <i class="bi bi-person me-1"></i>Voir mes achats
                </router-link>
                <router-link to="/e-book" class="btn btn-outline-primary">
                  <i class="bi bi-book me-1"></i>Lire mes e-books
                </router-link>
                <router-link to="/boutique" class="btn btn-outline-secondary">
                  <i class="bi bi-cart me-1"></i>Continuer mes achats
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import BreadcombsComponent from '../../includes/breadcombs.vue'

const route = useRoute()
const orderId = route.query.orderId || '---'

const paymentMethodLabel = computed(() => {
  const method = route.query.method || ''
  const labels = { mobile_money: 'Mobile Money', carte_bancaire: 'Carte bancaire', paypal: 'PayPal' }
  return labels[method] || 'Paiement en ligne'
})
</script>
