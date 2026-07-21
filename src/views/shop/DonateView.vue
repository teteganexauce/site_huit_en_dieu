<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import BreadcombsComponent from '../../includes/breadcombs.vue'
import donService from '../../services/donService'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  montant: '',
  message: '',
  estAnonyme: false,
  mode_paiement: 'mobile_money',
  email_contact: authStore.user?.email || ''
})

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const paymentUrl = ref('')

// Chaque palier est relié à un impact concret pour rendre le don tangible.
const montantsSuggestions = [
  { valeur: 1000, impact: 'Un livret de méditation' },
  { valeur: 2500, impact: "Un module de formation en ligne" },
  { valeur: 5000, impact: 'Un accompagnement pastoral' },
  { valeur: 10000, impact: 'Une bourse partielle' },
  { valeur: 25000, impact: "Le parrainage d'un élève" },
  { valeur: 50000, impact: "Un mois de fonctionnement d'une classe" }
]

const impactActif = computed(() => {
  const match = montantsSuggestions.find(m => m.valeur == form.value.montant)
  return match ? match.impact : null
})

const montantFormate = computed(() => {
  return form.value.montant ? Number(form.value.montant).toLocaleString('fr-FR') : '0'
})

function selectMontant(montant) {
  form.value.montant = montant
}

async function handleSubmit() {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''
  paymentUrl.value = ''

  try {
    const res = await donService.createDon({
      montant: form.value.montant,
      message: form.value.message || null,
      estAnonyme: form.value.estAnonyme,
      mode_paiement: form.value.mode_paiement,
      email_contact: form.value.email_contact || null
    })
    successMessage.value = res.message || 'Don initié avec succès !'
    paymentUrl.value = res.paiement_url || ''
    if (res.paiement_url) {
      window.location.href = res.paiement_url
      return
    }
  } catch (e) {
    errorMessage.value = e.response?.data?.message || e.response?.data?.error || "Une erreur s'est produite."
  } finally {
    isLoading.value = false
  }
}

function proceedToPayment() {
  if (paymentUrl.value) {
    window.open(paymentUrl.value, '_blank')
  }
}
</script>

<template>
  <BreadcombsComponent title="Faire un don" />

  <div class="don-page">
    <div class="container don-container py-5">
      <div class="row g-5 align-items-start">

        <!-- Colonne gauche : intention -->
        <div class="col-lg-5">
          <div class="don-left">
            <span class="don-eyebrow">Générosité</span>

            <div class="don-headline-wrap">
              <svg class="don-ripple" viewBox="0 0 200 200" aria-hidden="true">
                <circle cx="40" cy="40" r="18" class="ring ring-1" />
                <circle cx="40" cy="40" r="34" class="ring ring-2" />
                <circle cx="40" cy="40" r="50" class="ring ring-3" />
              </svg>
              <h1 class="don-headline">Chaque don<br>élargit le cercle.</h1>
            </div>

            <p class="don-lead">
              Votre soutien finance la formation, l'accompagnement et les ressources
              qui font vivre notre mission, jour après jour.
            </p>

            <ul class="don-impact-list">
              <li>
                <span class="don-impact-icon"><i class="bi bi-book"></i></span>
                <div>
                  <strong>Formation</strong>
                  <p>Des parcours accessibles à ceux qui veulent apprendre et grandir.</p>
                </div>
              </li>
              <li>
                <span class="don-impact-icon"><i class="bi bi-people"></i></span>
                <div>
                  <strong>Accompagnement</strong>
                  <p>Un suivi humain pour chaque personne engagée dans son parcours.</p>
                </div>
              </li>
              <li>
                <span class="don-impact-icon"><i class="bi bi-house-heart"></i></span>
                <div>
                  <strong>Continuité</strong>
                  <p>Le fonctionnement quotidien de l'œuvre, assuré durablement.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Colonne droite : formulaire -->
        <div class="col-lg-7">

          <div v-if="errorMessage" class="don-alert don-alert-error">
            <i class="bi bi-exclamation-circle"></i> {{ errorMessage }}
          </div>

          <!-- Étape confirmation -->
          <div v-if="paymentUrl" class="don-card don-confirm text-center">
            <div class="don-confirm-icon">
              <i class="bi bi-check-lg"></i>
            </div>
            <h4 class="don-confirm-title">Don initié avec succès</h4>
            <p class="don-confirm-amount">{{ montantFormate }} <span>FCFA</span></p>
            <p class="don-confirm-text">Cliquez ci-dessous pour procéder au paiement sécurisé.</p>
            <button class="don-btn-primary" @click="proceedToPayment">
              <i class="bi bi-credit-card"></i> Procéder au paiement
            </button>
            <p class="don-confirm-note">Vous serez redirigé vers une plateforme de paiement sécurisée.</p>
          </div>

          <!-- Étape formulaire -->
          <form v-else class="don-card" @submit.prevent="handleSubmit">

            <div class="don-field-group">
              <label class="don-label">Choisissez votre montant</label>
              <div class="don-amount-grid">
                <button
                  type="button"
                  v-for="m in montantsSuggestions"
                  :key="m.valeur"
                  class="don-amount-tile"
                  :class="{ 'is-active': form.montant == m.valeur }"
                  @click="selectMontant(m.valeur)"
                >
                  <span class="don-amount-value">{{ m.valeur.toLocaleString('fr-FR') }}</span>
                  <span class="don-amount-unit">FCFA</span>
                </button>
              </div>
              <p v-if="impactActif" class="don-impact-caption">
                <i class="bi bi-arrow-return-right"></i> Finance : {{ impactActif }}
              </p>
            </div>

            <div class="don-field-group">
              <label class="don-label">Ou saisissez un montant personnalisé</label>
              <div class="don-input-wrap">
                <input
                  type="number"
                  class="don-input"
                  v-model="form.montant"
                  min="100"
                  placeholder="Montant"
                  required
                >
                <span class="don-input-suffix">FCFA</span>
              </div>
            </div>

            <div class="don-field-group">
              <label class="don-label">Message <span class="don-optional">(optionnel)</span></label>
              <textarea
                class="don-textarea"
                rows="3"
                v-model="form.message"
                placeholder="Un mot pour accompagner votre don..."
              ></textarea>
            </div>

            <div class="don-field-group don-switch-row">
              <label class="don-switch">
                <input type="checkbox" v-model="form.estAnonyme">
                <span class="don-switch-track"><span class="don-switch-thumb"></span></span>
              </label>
              <span class="don-switch-label">Faire un don anonyme</span>
            </div>

            <div class="don-field-group">
              <label class="don-label">Email <span class="don-required">— pour recevoir votre reçu</span></label>
              <input
                type="email"
                class="don-input don-input-full"
                v-model="form.email_contact"
                placeholder="votre@email.com"
                required
              >
            </div>

            <div class="don-field-group">
              <label class="don-label">Mode de paiement</label>
              <div class="don-payment-grid">
                <label class="don-payment-option" :class="{ 'is-active': form.mode_paiement === 'mobile_money' }">
                  <input type="radio" value="mobile_money" v-model="form.mode_paiement">
                  <i class="bi bi-phone"></i>
                  <span>Mobile Money</span>
                </label>
                <label class="don-payment-option" :class="{ 'is-active': form.mode_paiement === 'carte_bancaire' }">
                  <input type="radio" value="carte_bancaire" v-model="form.mode_paiement">
                  <i class="bi bi-credit-card-2-front"></i>
                  <span>Carte bancaire</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              class="don-btn-primary don-btn-submit"
              :disabled="isLoading || !form.montant || form.montant < 100"
            >
              <span v-if="isLoading" class="don-spinner"></span>
              <i v-else class="bi bi-heart-fill"></i>
              {{ isLoading ? 'Traitement en cours…' : `Faire un don de ${montantFormate} FCFA` }}
            </button>

            <p class="don-secure-note"><i class="bi bi-shield-check"></i> Paiement sécurisé · Reçu envoyé par email</p>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

.don-page {
  --ink: #1B2A44;
  --ink-soft: #4A5670;
  --gold: #B4842A;
  --gold-soft: #E8D2A0;
  --gold-pale: #FBF3E3;
  --cream: #FBF9F5;
  --line: #E9E3D6;
  --muted: #75798A;
  --danger: #C0392B;
  font-family: 'Inter', sans-serif;
  background: var(--cream);
  padding-bottom: 2rem;
}

.don-container {
  max-width: 1140px;
}

/* ---------- Left column ---------- */
.don-left {
  position: sticky;
  top: 2rem;
  padding-right: 1rem;
}

.don-eyebrow {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.25rem;
}

.don-headline-wrap {
  position: relative;
  margin-bottom: 1.25rem;
}

.don-ripple {
  position: absolute;
  top: -30px;
  left: -30px;
  width: 110px;
  height: 110px;
  opacity: 0.5;
  pointer-events: none;
}
.don-ripple .ring {
  fill: none;
  stroke: var(--gold);
}
.don-ripple .ring-1 { stroke-width: 2; opacity: 0.9; }
.don-ripple .ring-2 { stroke-width: 1.4; opacity: 0.55; }
.don-ripple .ring-3 { stroke-width: 1; opacity: 0.3; }

.don-headline {
  position: relative;
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 2.6rem;
  line-height: 1.12;
  color: var(--ink);
  margin: 0;
}

.don-lead {
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 34rem;
  margin-bottom: 2.25rem;
}

.don-impact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--line);
}

.don-impact-list li {
  display: flex;
  gap: 1rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--line);
}

.don-impact-icon {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gold-pale);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
}

.don-impact-list strong {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  color: var(--ink);
  font-size: 1rem;
  display: block;
  margin-bottom: 0.15rem;
}

.don-impact-list p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.5;
}

/* ---------- Card ---------- */
.don-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 2.25rem;
  box-shadow: 0 20px 48px -28px rgba(27, 42, 68, 0.25);
}

.don-alert {
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  font-size: 0.92rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.don-alert-error {
  background: #FBEAE8;
  color: var(--danger);
  border: 1px solid #F3CFC9;
}

/* ---------- Fields ---------- */
.don-field-group {
  margin-bottom: 1.6rem;
}
.don-field-group:last-of-type {
  margin-bottom: 0;
}

.don-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.65rem;
}
.don-optional {
  font-weight: 400;
  color: var(--muted);
}
.don-required {
  font-weight: 400;
  color: var(--muted);
  font-size: 0.8rem;
}

.don-amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.don-amount-tile {
  border: 1.5px solid var(--line);
  background: var(--cream);
  border-radius: 12px;
  padding: 0.7rem 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.don-amount-tile:hover {
  border-color: var(--gold-soft);
  transform: translateY(-1px);
}
.don-amount-tile.is-active {
  background: var(--ink);
  border-color: var(--ink);
}
.don-amount-value {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--ink);
}
.don-amount-unit {
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--muted);
}
.don-amount-tile.is-active .don-amount-value,
.don-amount-tile.is-active .don-amount-unit {
  color: #fff;
}

.don-impact-caption {
  margin: 0.7rem 0 0;
  font-size: 0.82rem;
  color: var(--gold);
  font-weight: 500;
}

.don-input-wrap {
  display: flex;
  align-items: stretch;
  border: 1.5px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s ease;
}
.don-input-wrap:focus-within {
  border-color: var(--gold);
}
.don-input {
  flex: 1;
  border: none;
  padding: 0.7rem 0.9rem;
  font-size: 0.95rem;
  outline: none;
  font-family: inherit;
  color: var(--ink);
  background: #fff;
}
.don-input-full {
  border: 1.5px solid var(--line);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  width: 100%;
  font-size: 0.95rem;
  transition: border-color 0.15s ease;
}
.don-input-full:focus {
  outline: none;
  border-color: var(--gold);
}
.don-input-suffix {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background: var(--cream);
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 600;
  border-left: 1.5px solid var(--line);
}

.don-textarea {
  width: 100%;
  border: 1.5px solid var(--line);
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--ink);
  resize: vertical;
  transition: border-color 0.15s ease;
}
.don-textarea:focus {
  outline: none;
  border-color: var(--gold);
}

.don-switch-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.don-switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
  flex: none;
}
.don-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.don-switch-track {
  position: absolute;
  inset: 0;
  background: var(--line);
  border-radius: 999px;
  transition: background 0.15s ease;
}
.don-switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.15s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
}
.don-switch input:checked + .don-switch-track {
  background: var(--gold);
}
.don-switch input:checked + .don-switch-track .don-switch-thumb {
  transform: translateX(18px);
}
.don-switch-label {
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.don-payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.don-payment-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1.5px solid var(--line);
  border-radius: 12px;
  padding: 0.75rem 0.9rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--ink-soft);
  transition: border-color 0.15s ease, background 0.15s ease;
}
.don-payment-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.don-payment-option i {
  font-size: 1.1rem;
  color: var(--muted);
}
.don-payment-option.is-active {
  border-color: var(--gold);
  background: var(--gold-pale);
  color: var(--ink);
}
.don-payment-option.is-active i {
  color: var(--gold);
}

/* ---------- Buttons ---------- */
.don-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.9rem 1.5rem;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}
.don-btn-primary:hover:not(:disabled) {
  background: #101c30;
  transform: translateY(-1px);
}
.don-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.don-btn-submit {
  width: 100%;
  margin-top: 0.5rem;
}

.don-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: don-spin 0.7s linear infinite;
}
@keyframes don-spin {
  to { transform: rotate(360deg); }
}

.don-secure-note {
  text-align: center;
  font-size: 0.78rem;
  color: var(--muted);
  margin: 1rem 0 0;
}

/* ---------- Confirmation ---------- */
.don-confirm {
  padding: 3.25rem 2.25rem;
}
.don-confirm-icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: var(--gold-pale);
  color: var(--gold);
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}
.don-confirm-title {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.5rem;
}
.don-confirm-amount {
  font-family: 'Fraunces', serif;
  font-size: 2rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.5rem;
}
.don-confirm-amount span {
  font-size: 1rem;
  color: var(--muted);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}
.don-confirm-text {
  color: var(--muted);
  margin-bottom: 1.75rem;
}
.don-confirm-note {
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 1.25rem;
}

/* ---------- Responsive ---------- */
@media (max-width: 991px) {
  .don-left {
    position: static;
    margin-bottom: 1rem;
  }
  .don-headline {
    font-size: 2.1rem;
  }
}

@media (max-width: 575px) {
  .don-card {
    padding: 1.5rem;
  }
  .don-amount-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .don-payment-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .don-amount-tile, .don-btn-primary, .don-switch-thumb, .don-spinner {
    transition: none;
    animation: none;
  }
}
</style>