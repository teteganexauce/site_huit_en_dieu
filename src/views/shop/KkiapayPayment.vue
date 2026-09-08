<template>
  <BreadcombsComponent title="Paiement sécurisé" />
  
  <div class="payment-universe-light">
    <!-- Animated background elements -->
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    <div class="ambient-orb orb-3"></div>
    
    <div class="container py-5 position-relative z-1">
      <div class="row justify-content-center">
        <div class="col-xl-5 col-lg-6 col-md-8">
          
          <!-- Loading State -->
          <div v-if="isLoading" class="premium-light-card p-5 text-center loading-state" data-aos="fade-up">
            <div class="pulse-ring mx-auto mb-4"></div>
            <h5 class="fw-bold text-dark-blue tracking-wide">Initialisation sécurisée...</h5>
            <p class="text-muted small mt-2">Veuillez patienter quelques instants</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error && !paiement" class="premium-light-card error-card text-center p-5" data-aos="zoom-in">
            <div class="error-icon-wrapper mx-auto mb-4">
              <i class="bi bi-exclamation-triangle-fill"></i>
              <div class="error-glow"></div>
            </div>
            <h4 class="text-dark-blue fw-bold mb-2">Erreur</h4>
            <p class="text-muted">{{ error }}</p>
            <router-link to="/" class="btn premium-btn-outline mt-4">
              <i class="bi bi-house me-2"></i>Retour à l'accueil
            </router-link>
          </div>

          <!-- Success State -->
          <div v-else-if="success" class="premium-light-card success-card" data-aos="zoom-in" data-aos-duration="800">
            <div class="card-body p-4 p-md-5 text-center">
              <div class="success-anim-wrapper mx-auto mb-4">
                <div class="success-ring"></div>
                <i class="bi bi-check-lg icon-check"></i>
                <div class="success-glow"></div>
              </div>
              
              <div class="badge-premium badge-success mx-auto mb-3">Transaction Confirmée</div>
              <h2 class="display-6 fw-bold text-dark-blue mb-2">Félicitations !</h2>
              
              <p class="text-muted fs-6 mb-4" v-if="paiement?.don_id">
                Merci infiniment pour votre don de <strong class="text-accent">{{ Number(paiement.montant || 0).toLocaleString('fr-FR') }} FCFA</strong>.
              </p>
              <p class="text-muted fs-6 mb-4" v-else>
                Votre paiement de <strong class="text-accent">{{ Number(paiement?.montant || 0).toLocaleString('fr-FR') }} FCFA</strong> a été validé avec succès.
              </p>
              
              <div class="receipt-box mx-auto mb-4 text-start">
                <div class="receipt-row">
                  <span class="text-slate">Référence</span>
                  <code class="text-dark-blue fw-bold font-monospace">{{ paiement?.referenceTransaction || '—' }}</code>
                </div>
                <div class="receipt-row">
                  <span class="text-slate">Statut</span>
                  <span class="text-success fw-bold d-flex align-items-center gap-2">
                    <span class="status-dot bg-success"></span> Réussi
                  </span>
                </div>
                <div class="receipt-row border-0 pb-0">
                  <span class="text-slate">Reçu</span>
                  <span class="text-dark-blue fw-medium">Envoyé par email <i class="bi bi-envelope-check ms-1 text-accent"></i></span>
                </div>
              </div>
              
              <div class="d-flex flex-column gap-3 mt-5">
                <router-link v-if="paiement?.commande_id" to="/profil/mes-commandes" class="btn premium-btn-secondary btn-lg w-100">
                  <i class="bi bi-receipt me-2"></i>Consulter mes commandes
                </router-link>
                <router-link v-else-if="paiement?.inscription_id" to="/profil/mes-formations" class="btn premium-btn-secondary btn-lg w-100">
                  <i class="bi bi-mortarboard me-2"></i>Accéder à ma formation
                </router-link>
                <router-link v-else to="/" class="btn premium-btn-secondary btn-lg w-100">
                  <i class="bi bi-house me-2"></i>Retour à l'accueil
                </router-link>
              </div>
            </div>
          </div>

          <!-- Payment State -->
          <div v-else class="premium-light-card payment-card" data-aos="fade-up" data-aos-duration="1000">
            <!-- Header -->
            <div class="payment-header text-center">
              <div class="shield-wrapper mx-auto mb-3">
                <i class="bi bi-shield-check"></i>
                <div class="shield-glow"></div>
              </div>
              <h3 class="fw-bold text-dark-blue mb-1">Paiement Sécurisé</h3>
              <p class="text-slate mb-0 fs-sm">Réglez via KKiaPay en toute sérénité</p>
            </div>

            <!-- Stepper -->
            <div class="stepper-wrapper">
              <div class="step completed">
                <div class="step-icon"><i class="bi bi-check2"></i></div>
                <span class="step-text">Commande</span>
              </div>
              <div class="step-divider completed"></div>
              <div class="step active">
                <div class="step-icon"><i class="bi bi-credit-card-2-front"></i></div>
                <span class="step-text">Paiement</span>
              </div>
              <div class="step-divider"></div>
              <div class="step">
                <div class="step-icon"><i class="bi bi-patch-check"></i></div>
                <span class="step-text">Validation</span>
              </div>
            </div>

            <div class="card-body p-4 p-md-5">
              <!-- Amount Display -->
              <div class="amount-display text-center mb-5">
                <div class="amount-label text-uppercase mb-2">Montant à régler</div>
                <div class="amount-value text-gradient-dark">
                  {{ Number(paiement?.montant || 0).toLocaleString('fr-FR') }} <span class="currency">FCFA</span>
                </div>

              </div>

              <!-- Supported Methods -->
              <div class="methods-section text-center mb-4">
                <div class="methods-title text-slate mb-3 fs-sm text-uppercase tracking-wide fw-semibold">Moyens acceptés</div>
                <div class="d-flex justify-content-center gap-2 flex-wrap">
                  <div class="method-pill"><i class="bi bi-phone"></i> MTN MoMo</div>
                  <div class="method-pill"><i class="bi bi-phone"></i> Moov Money</div>
                  <div class="method-pill"><i class="bi bi-credit-card"></i> Cartes Bancaires</div>
                </div>
              </div>

              <!-- Action Area -->
              <div class="action-area">
                <div class="security-notice mb-4">
                  <i class="bi bi-lock-fill text-accent fs-5"></i>
                  <span class="text-slate lh-sm fs-sm">Une fenêtre sécurisée s'ouvrira pour finaliser la transaction. Vos données sont chiffrées de bout en bout.</span>
                </div>
                
                <button class="btn premium-btn-pay btn-lg w-100 mb-3" :disabled="!widgetLoaded || paying" @click="openKkiapay">
                  <div class="btn-content" :class="{ 'opacity-0': paying }">
                    <i class="bi bi-wallet2 me-2"></i> Payer avec KKiaPay
                  </div>
                  <div v-if="paying" class="btn-loader">
                    <span class="spinner-border spinner-border-sm text-white"></span>
                    <span class="ms-2 fw-semibold text-white">Connexion sécurisée...</span>
                  </div>
                </button>
                
                <div class="text-center mt-4">
                  <router-link to="/" class="cancel-link text-slate text-decoration-none transition-all">
                    <i class="bi bi-arrow-left me-1"></i> Annuler et revenir à l'accueil
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Footer trust indicators -->
            <div class="payment-footer">
              <div class="trust-item"><i class="bi bi-shield-lock-fill text-success"></i> 100% Sécurisé</div>
              <div class="trust-item"><i class="bi bi-lightning-charge-fill text-warning"></i> Instantané</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AOS from 'aos'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import api from '../../services/api'
import { useCartStore } from '../../stores/cart'

const route = useRoute()
const cartStore = useCartStore()
const paiementId = route.query.paiement_id
const isLoading = ref(true)
const paiement = ref(null)
const error = ref('')
const kkiapayConfig = ref(null)
const widgetLoaded = ref(false)
const paying = ref(false)
const success = ref(false)

async function loadPaiement() {
  if (!paiementId) {
    error.value = "Aucun paiement spécifié."
    isLoading.value = false
    return
  }
  try {
    const [paiementRes, configRes] = await Promise.all([
      api.get(`/paiements/${paiementId}`),
      api.get('/config/kkiapay')
    ])
    paiement.value = paiementRes.data || paiementRes
    kkiapayConfig.value = configRes.data || configRes

    if (paiement.value.statut === 'reussi') {
      success.value = true
      await cartStore.fetchCart()
      return
    }

    await loadKkiapayScript()
  } catch (e) {
    error.value = "Impossible de charger les informations du paiement."
  } finally {
    isLoading.value = false
    await nextTick()
    setTimeout(() => AOS.refresh(), 150)
  }
}

function loadKkiapayScript() {
  return new Promise((resolve) => {
    if (window.kkiapay) {
      widgetLoaded.value = true
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.kkiapay.me/k.js'
    script.onload = () => {
      widgetLoaded.value = true
      resolve()
    }
    document.head.appendChild(script)
  })
}

function openKkiapay() {
  if (!widgetLoaded.value || !kkiapayConfig.value || !paiement.value) return
  paying.value = true
  const callbackUrl = `${window.location.origin}/paiement/kkiapay?paiement_id=${paiementId}`

  window.addSuccessListener(async function() {
    paying.value = false
    success.value = true
    try {
      await api.post('/paiements/confirmer/' + paiementId)
    } catch (e) {
      console.error('Confirmation failed or already processed:', e)
    } finally {
      // On rafraîchit le panier quoi qu'il arrive (si le paiement a réussi, le backend créera un nouveau panier vide)
      await cartStore.fetchCart()
    }
  })

  window.addFailedListener(function() {
    paying.value = false
    error.value = "Le paiement a échoué. Veuillez réessayer."
  })

  window.openKkiapayWidget({
    amount: Number(paiement.value.montant),
    key: kkiapayConfig.value.public_key,
    sandbox: kkiapayConfig.value.sandbox,
    data: String(paiementId),
    callback: callbackUrl,
    theme: "#0ea2bd"
  })
}

onMounted(loadPaiement)
</script>

<style scoped>
/* ====== BASE UNIVERSE ====== */
.payment-universe-light {
  min-height: calc(100vh - 100px);
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.6;
  animation: float 15s infinite alternate ease-in-out;
}
.orb-1 {
  width: 450px;
  height: 450px;
  background: rgba(14, 162, 189, 0.15);
  top: -150px;
  left: -150px;
}
.orb-2 {
  width: 500px;
  height: 500px;
  background: rgba(139, 92, 246, 0.1);
  bottom: -200px;
  right: -150px;
  animation-delay: -5s;
}
.orb-3 {
  width: 300px;
  height: 300px;
  background: rgba(236, 72, 153, 0.08);
  top: 40%;
  left: 60%;
  animation-delay: -2s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, 40px) scale(1.1); }
  100% { transform: translate(-20px, 60px) scale(0.9); }
}

/* ====== TYPOGRAPHY & COLORS ====== */
.text-accent { color: #0ea2bd; }
.text-dark-blue { color: #0f172a; }
.text-slate { color: #64748b; }
.text-gradient-dark {
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tracking-wide { letter-spacing: 1px; }
.tracking-widest { letter-spacing: 2px; }
.fs-sm { font-size: 0.85rem; }

/* ====== LIGHT GLASS CARD ====== */
.premium-light-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.08), 0 10px 20px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

/* ====== HEADER ====== */
.payment-header {
  padding: 40px 30px 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, transparent 100%);
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
}

.shield-wrapper {
  width: 68px;
  height: 68px;
  background: #ffffff;
  border: 2px solid rgba(14, 162, 189, 0.15);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #0ea2bd;
  position: relative;
  transform: rotate(-5deg);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 25px rgba(14, 162, 189, 0.15);
}
.premium-light-card:hover .shield-wrapper {
  transform: rotate(0deg) scale(1.05);
}
.shield-glow {
  position: absolute;
  inset: 0;
  background: #0ea2bd;
  filter: blur(20px);
  opacity: 0.15;
  border-radius: 50%;
  z-index: -1;
  animation: pulse-glow-light 3s infinite alternate;
}

@keyframes pulse-glow-light {
  0% { opacity: 0.1; transform: scale(0.9); }
  100% { opacity: 0.25; transform: scale(1.3); }
}

/* ====== STEPPER ====== */
.stepper-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px 0;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}
.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.step.active .step-icon {
  background: rgba(14, 162, 189, 0.1);
  border-color: #0ea2bd;
  color: #0ea2bd;
  box-shadow: 0 0 15px rgba(14, 162, 189, 0.2);
}
.step.completed .step-icon {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #10b981;
}
.step-text {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  color: #94a3b8;
}
.step.active .step-text { color: #0f172a; }
.step.completed .step-text { color: #10b981; }

.step-divider {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: -20px 10px 0;
  position: relative;
  border-radius: 2px;
}
.step-divider.completed {
  background: linear-gradient(90deg, #10b981 0%, #0ea2bd 100%);
}

/* ====== AMOUNT ====== */
.amount-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 700;
}
.amount-value {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}
.amount-value .currency {
  font-size: 1.5rem;
  font-weight: 600;
  color: #475569;
  -webkit-text-fill-color: initial;
}
.badge-light {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  color: #475569;
  font-family: monospace;
}

/* ====== METHODS ====== */
.method-pill {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02);
}
.method-pill:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.05);
}
.method-pill i { color: #0ea2bd; }

/* ====== SECURITY NOTICE ====== */
.security-notice {
  background: rgba(14, 162, 189, 0.05);
  border-left: 3px solid #0ea2bd;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

/* ====== BUTTONS ====== */
.premium-btn-pay {
  background: linear-gradient(135deg, #0ea2bd 0%, #086a7d 100%);
  border: none;
  color: #fff;
  padding: 16px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 10px 20px rgba(14, 162, 189, 0.25);
}
.premium-btn-pay::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transform: skewX(-20deg);
  transition: 0.5s;
}
.premium-btn-pay:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(14, 162, 189, 0.4);
  color: #fff;
}
.premium-btn-pay:hover:not(:disabled)::before {
  left: 150%;
}
.premium-btn-pay:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.btn-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: inherit;
  border-radius: inherit;
}

.premium-btn-secondary {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s;
}
.premium-btn-secondary:hover {
  background: #e2e8f0;
  color: #0f172a;
  border-color: #cbd5e1;
}
.premium-btn-outline {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
  border-radius: 12px;
  padding: 10px 24px;
}
.premium-btn-outline:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.cancel-link:hover { color: #0f172a !important; }

/* ====== FOOTER ====== */
.payment-footer {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  background: #f8fafc;
  border-top: 1px solid rgba(15, 23, 42, 0.05);
}
.trust-item {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ====== SUCCESS STATE ====== */
.success-card {
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.08), inset 0 4px 20px rgba(16, 185, 129, 0.05);
}
.success-anim-wrapper {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-ring {
  position: absolute;
  inset: 0;
  border: 3px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  animation: scale-up 0.5s ease-out forwards;
}
.icon-check {
  font-size: 3rem;
  color: #10b981;
  z-index: 2;
  animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  transform: scale(0.5);
}
.success-glow {
  position: absolute;
  inset: -20px;
  background: #10b981;
  filter: blur(30px);
  opacity: 0.15;
  border-radius: 50%;
  animation: pulse-glow-light 2s infinite alternate;
}

@keyframes scale-up {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes pop-in {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  display: inline-block;
}

.receipt-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px 24px;
  max-width: 380px;
  box-shadow: inset 0 2px 4px rgba(15, 23, 42, 0.02);
}
.receipt-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #cbd5e1;
  font-size: 0.9rem;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

/* ====== LOADERS ====== */
.pulse-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(14, 162, 189, 0.15);
  border-top-color: #0ea2bd;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

/* Responsive adjustments */
@media (max-width: 768px) {
  .amount-value { font-size: 2.8rem; }
  .premium-light-card { border-radius: 16px; }
  .stepper-wrapper { padding: 20px 20px 0; }
}
</style>
