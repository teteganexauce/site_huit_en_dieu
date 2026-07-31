<template>
  <BreadcombsComponent title="Paiement sécurisé" />
  <div class="kk-container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8">

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="error && !paiement" class="alert alert-danger text-center">{{ error }}</div>

        <!-- ═══ SUCCÈS ═══ -->
        <div v-else-if="success" class="kk-card kk-success" data-aos="fade-up" data-aos-duration="900">
          <div class="kk-card-body text-center p-5">
            <div class="kk-check-anim mx-auto mb-4">
              <i class="bi bi-check-lg"></i>
            </div>
            <span class="kk-badge kk-badge-success mb-3">Paiement confirmé</span>
            <h4 class="kk-title mb-2">Paiement réussi !</h4>
            <p class="text-muted mb-3" v-if="paiement?.don_id">
              Merci pour votre don de <strong class="text-primary">{{ Number(paiement.montant || 0).toLocaleString('fr-FR') }} FCFA</strong>.
            </p>
            <p class="text-muted mb-3" v-else>
              Votre paiement de <strong class="text-primary">{{ Number(paiement?.montant || 0).toLocaleString('fr-FR') }} FCFA</strong> a été confirmé.
            </p>
            <div class="kk-receipt mx-auto mb-4">
              <div class="d-flex justify-content-between py-2">
                <span class="text-muted">Référence</span>
                <code class="text-dark">{{ paiement?.referenceTransaction || '—' }}</code>
              </div>
              <div class="d-flex justify-content-between py-2">
                <span class="text-muted">Statut</span>
                <span class="text-success fw-bold">Réussi</span>
              </div>
              <div class="d-flex justify-content-between py-2">
                <span class="text-muted">Reçu</span>
                <span class="text-muted">Envoyé par email</span>
              </div>
            </div>
            <router-link v-if="paiement?.commande_id" to="/profil/mes-commandes" class="btn btn-primary btn-lg px-4">
              <i class="bi bi-receipt me-2"></i>Voir mes commandes
            </router-link>
            <router-link v-else-if="paiement?.inscription_id" to="/profil/mes-formations" class="btn btn-primary btn-lg px-4">
              <i class="bi bi-mortarboard me-2"></i>Voir mes formations
            </router-link>
            <router-link v-else to="/" class="btn btn-primary btn-lg px-4">
              <i class="bi bi-house me-2"></i>Retour à l'accueil
            </router-link>
          </div>
        </div>

        <!-- ═══ PAIEMENT ═══ -->
        <div v-else class="kk-card" data-aos="fade-up" data-aos-duration="900">
          <div class="kk-card-header">
            <div class="kk-shield mx-auto">
              <i class="bi bi-shield-lock"></i>
            </div>
            <h4 class="kk-title mb-1">Paiement sécurisé</h4>
            <p class="kk-subtitle mb-0">Réglez votre commande en toute confiance via KKiaPay</p>
          </div>

          <!-- Étapes -->
          <div class="kk-steps">
            <div class="kk-step is-done">
              <span class="kk-step-num"><i class="bi bi-check-lg"></i></span>
              <span class="kk-step-label">Commande</span>
            </div>
            <div class="kk-step-line"></div>
            <div class="kk-step is-active">
              <span class="kk-step-num"><i class="bi bi-wallet2"></i></span>
              <span class="kk-step-label">Paiement</span>
            </div>
            <div class="kk-step-line"></div>
            <div class="kk-step">
              <span class="kk-step-num"><i class="bi bi-check-circle"></i></span>
              <span class="kk-step-label">Confirmation</span>
            </div>
          </div>

          <div class="kk-card-body p-4 p-md-5">

            <!-- Montant -->
            <div class="kk-amount text-center">
              <span class="kk-amount-label">Montant à payer</span>
              <div class="kk-amount-value">
                {{ Number(paiement?.montant || 0).toLocaleString('fr-FR') }} <small>FCFA</small>
              </div>
              <span class="kk-amount-ref"><i class="bi bi-hash me-1"></i>Référence : {{ paiement?.referenceTransaction || '—' }}</span>
            </div>

            <!-- Moyens de paiement -->
            <div class="kk-methods">
              <span class="kk-methods-label">Moyens acceptés</span>
              <div class="kk-methods-row">
                <span class="kk-method-chip"><i class="bi bi-phone"></i> MTN MoMo</span>
                <span class="kk-method-chip"><i class="bi bi-phone"></i> Moov Money</span>
                <span class="kk-method-chip"><i class="bi bi-phone"></i> Celta Cash</span>
              </div>
            </div>

            <!-- Info -->
            <div class="kk-info">
              <i class="bi bi-info-circle kk-info-icon"></i>
              <small>
                Vous allez payer via <strong>KKiaPay</strong>. Une fenêtre sécurisée s'ouvrira pour saisir
                votre numéro de téléphone et confirmer le paiement.
              </small>
            </div>

            <!-- Actions -->
            <div class="d-flex flex-column gap-2 mt-4">
              <button class="kk-btn-pay btn-lg w-100" :disabled="!widgetLoaded || paying" @click="openKkiapay">
                <span v-if="paying" class="spinner-border spinner-border-sm me-2"></span>
                <template v-else><i class="bi bi-wallet2 me-2"></i>Payer avec KKiaPay</template>
              </button>
              <router-link to="/" class="btn btn-link text-muted w-100">Annuler et revenir à l'accueil</router-link>
            </div>

            <!-- Trust -->
            <div class="kk-trust">
              <span><i class="bi bi-lock-fill me-1"></i>Paiement chiffré</span>
              <span><i class="bi bi-shield-check me-1"></i>Garanti KKiaPay</span>
              <span><i class="bi bi-lightning-charge-fill me-1"></i>Confirmation instantanée</span>
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

const route = useRoute()
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
      console.error('Confirmation failed:', e)
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
.kk-container { min-height: 60vh; }

/* ── Carte principale ── */
.kk-card {
  background: #ffffff;
  border: 1px solid rgba(14, 162, 189, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(15, 40, 70, 0.10), 0 4px 12px rgba(15, 40, 70, 0.06);
}

.kk-card-header {
  background: linear-gradient(135deg, #0ea2bd 0%, #0b7f95 55%, #085f70 100%);
  color: #fff;
  text-align: center;
  padding: 32px 24px 28px;
}
.kk-card-header .kk-title { color: #fff; }
.kk-card-header .kk-subtitle { color: rgba(255, 255, 255, 0.85); font-size: 0.9rem; }

.kk-shield {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.35);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

/* ── Étapes ── */
.kk-steps {
  display: flex; align-items: center; justify-content: center;
  gap: 6px;
  padding: 18px 16px 0;
}
.kk-step { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 62px; }
.kk-step-num {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #e9ecef; color: #adb5bd; font-size: 0.95rem;
  transition: all 0.3s;
}
.kk-step.is-done .kk-step-num { background: #198754; color: #fff; }
.kk-step.is-active .kk-step-num {
  background: #0ea2bd; color: #fff;
  box-shadow: 0 0 0 5px rgba(14, 162, 189, 0.18);
}
.kk-step-label { font-size: 0.68rem; font-weight: 600; color: #adb5bd; text-transform: uppercase; letter-spacing: 0.4px; }
.kk-step.is-active .kk-step-label { color: #0ea2bd; }
.kk-step.is-done .kk-step-label { color: #198754; }
.kk-step-line { flex: 0 0 34px; height: 2px; background: #e9ecef; margin-top: -16px; border-radius: 2px; }

/* ── Montant ── */
.kk-amount { margin: 8px 0 20px; }
.kk-amount-label { font-size: 0.8rem; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; }
.kk-amount-value {
  font-size: 2.6rem; font-weight: 800; color: #0ea2bd; line-height: 1.15;
}
.kk-amount-value small { font-size: 1.1rem; font-weight: 600; }
.kk-amount-ref { display: inline-block; margin-top: 4px; font-size: 0.8rem; color: #6c757d; }

/* ── Moyens de paiement ── */
.kk-methods { text-align: center; margin-bottom: 16px; }
.kk-methods-label { font-size: 0.75rem; color: #6c757d; text-transform: uppercase; letter-spacing: 0.6px; display: block; margin-bottom: 8px; }
.kk-methods-row { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
.kk-method-chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 30px;
  padding: 6px 14px; font-size: 0.8rem; font-weight: 600; color: #334155;
}

/* ── Info ── */
.kk-info {
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(14, 162, 189, 0.06);
  border-left: 4px solid #0ea2bd;
  border-radius: 10px;
  padding: 12px 14px;
  color: #475569;
}
.kk-info-icon { color: #0ea2bd; font-size: 1.1rem; margin-top: 1px; }

/* ── Bouton ── */
.kk-btn-pay {
  background: linear-gradient(135deg, #0ea2bd 0%, #0b7f95 100%);
  border: none; border-radius: 12px;
  color: #fff; font-weight: 700; padding: 13px 20px;
  box-shadow: 0 10px 24px rgba(14, 162, 189, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.kk-btn-pay:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(14, 162, 189, 0.45); color: #fff; }
.kk-btn-pay:disabled { opacity: 0.65; cursor: not-allowed; }

/* ── Trust ── */
.kk-trust {
  display: flex; justify-content: center; gap: 18px; flex-wrap: wrap;
  margin-top: 18px; padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
  font-size: 0.72rem; color: #94a3b8;
}

/* ── Succès ── */
.kk-success { border-color: rgba(25, 135, 84, 0.2); }
.kk-check-anim {
  width: 92px; height: 92px; border-radius: 50%;
  background: linear-gradient(135deg, #198754 0%, #22b573 100%);
  color: #fff; font-size: 2.6rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 14px 30px rgba(25, 135, 84, 0.35);
  animation: kkPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes kkPop {
  0% { transform: scale(0.4); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.kk-badge {
  display: inline-block; border-radius: 30px; padding: 5px 14px;
  font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;
}
.kk-badge-success { background: rgba(25, 135, 84, 0.12); color: #198754; }
.kk-receipt {
  max-width: 340px; text-align: left;
  background: #f8fafc; border: 1px solid #e9ecef; border-radius: 12px;
  padding: 8px 18px; font-size: 0.86rem;
}
.kk-title { font-weight: 800; color: #1f2937; }
.kk-subtitle { color: #6c757d; }
</style>
