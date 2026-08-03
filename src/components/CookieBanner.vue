<template>
  <transition name="cookie-overlay">
    <div v-if="store.open" class="cookie-overlay" role="dialog" aria-modal="true" aria-label="Gestion des cookies">
      <div class="cookie-bg" aria-hidden="true">
        <div class="cookie-bg-grid" aria-hidden="true"></div>
      </div>

      <div class="cookie-modal">
        <span class="cookie-modal-glow" aria-hidden="true"></span>

        <div class="cookie-modal-top">
          <div class="cookie-logo">
            <img v-if="siteStore.siteLogo" :src="siteStore.siteLogo" alt="Logo" class="cookie-logo-img" />
            <span v-else class="cookie-logo-mark">{{ siteStore.siteMark }}</span>
          </div>
          <h4 class="cookie-modal-title">Votre vie privée compte</h4>
          <p class="cookie-modal-text">
            Nous utilisons des cookies pour garantir le bon fonctionnement du site,
            mémoriser vos préférences et comprendre la fréquentation de la plateforme.
            Les cookies nécessaires sont toujours actifs ; vous pouvez choisir d'activer
            les autres catégories ci-dessous.
          </p>
        </div>

        <div class="cookie-modal-body">
          <div v-if="store.customizing" class="cookie-categories">
            <label
              v-for="(cat, key) in categories"
              :key="key"
              class="cookie-cat"
              :class="{ 'is-disabled': cat.alwaysOn }"
            >
              <input
                type="checkbox"
                :checked="store.draft[key]"
                :disabled="cat.alwaysOn"
                @change="store.draft[key] = $event.target.checked"
              />
              <span class="cookie-cat-body">
                <span class="cookie-cat-label">{{ cat.label }}</span>
                <span class="cookie-cat-desc">{{ cat.description }}</span>
              </span>
            </label>
          </div>

          <div class="cookie-actions">
            <template v-if="!store.customizing">
              <button type="button" class="btn btn-cookie-primary" @click="acceptAll">
                <i class="bi bi-check-lg me-1"></i>Tout accepter
              </button>
              <button type="button" class="btn btn-cookie-outline" @click="refuseAll">
                Tout refuser
              </button>
              <button type="button" class="btn btn-cookie-link" @click="store.customizing = true">
                Personnaliser
              </button>
            </template>
            <template v-else>
              <button type="button" class="btn btn-cookie-primary" @click="saveDraft">
                <i class="bi bi-check-lg me-1"></i>Enregistrer mes choix
              </button>
              <button type="button" class="btn btn-cookie-link" @click="store.customizing = false">
                Retour
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { categories, consentState, acceptAll, refuseAll, saveDraft } from '../services/cookieConsent';
import { useSiteStore } from '../stores/site';

const store = consentState();
const siteStore = useSiteStore();
</script>

<style scoped>
.cookie-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

/* ── Arrière-plan discret : le contenu du site reste lisible ── */
.cookie-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: rgba(8, 22, 32, 0.35);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.cookie-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
}

.cookie-modal {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 22px;
  padding: 34px 34px 28px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  animation: cookie-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cookie-modal-glow {
  position: absolute;
  top: -90px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 180px;
  background: radial-gradient(ellipse at center, rgba(14, 162, 189, 0.28), transparent 70%);
  pointer-events: none;
}

@keyframes cookie-pop {
  from { opacity: 0; transform: translateY(26px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.cookie-modal-top { position: relative; text-align: center; padding: 0 6px; }

.cookie-logo {
  width: 86px;
  height: 86px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fff;
  box-shadow:
    0 10px 30px rgba(14, 162, 189, 0.25),
    inset 0 0 0 1px rgba(14, 162, 189, 0.14);
  padding: 7px;
}

.cookie-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.cookie-logo-mark {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}

.cookie-modal-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 10px;
  color: #14242e;
  letter-spacing: -0.01em;
}

.cookie-modal-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #5d6e7a;
  margin: 0 0 6px;
}

.cookie-modal-body { position: relative; margin-top: 18px; }

.cookie-categories {
  display: grid;
  gap: 9px;
  margin-bottom: 18px;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 2px;
}

.cookie-cat {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  padding: 11px 13px;
  border: 1px solid #e4ebf0;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.cookie-cat:hover {
  border-color: var(--color-primary);
  background: rgba(14, 162, 189, 0.05);
  transform: translateY(-1px);
}

.cookie-cat input {
  margin-top: 3px;
  accent-color: var(--color-primary);
  cursor: pointer;
  width: 17px;
  height: 17px;
}

.cookie-cat.is-disabled {
  opacity: 0.72;
  cursor: default;
  background: rgba(14, 162, 189, 0.06);
}

.cookie-cat.is-disabled input { cursor: default; }

.cookie-cat-body { display: flex; flex-direction: column; gap: 2px; }

.cookie-cat-label { font-size: 0.88rem; font-weight: 700; color: #1d2f3a; }

.cookie-cat-desc { font-size: 0.78rem; line-height: 1.45; color: #7c8b97; }

.cookie-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  align-items: center;
  justify-content: center;
}

.btn-cookie-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  padding: 11px 22px;
  border-radius: 11px;
  box-shadow: 0 8px 22px rgba(14, 162, 189, 0.32);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-cookie-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(14, 162, 189, 0.42);
  color: #fff;
}

.btn-cookie-outline {
  background: #fff;
  border: 1px solid #d7e0e7;
  color: #3d4c58;
  font-weight: 600;
  font-size: 0.88rem;
  padding: 11px 20px;
  border-radius: 11px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.btn-cookie-outline:hover { border-color: #8fa3b0; color: #1d2f3a; }

.btn-cookie-link {
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.88rem;
  padding: 11px 8px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── Transitions ── */
.cookie-overlay-enter-active,
.cookie-overlay-leave-active { transition: opacity 0.35s ease; }

.cookie-overlay-enter-from,
.cookie-overlay-leave-to { opacity: 0; }

.cookie-overlay-leave-active .cookie-modal { animation: cookie-pop-out 0.3s ease both; }

@keyframes cookie-pop-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(14px) scale(0.97); }
}

@media (max-width: 575px) {
  .cookie-modal { padding: 26px 20px 22px; }
  .cookie-actions { flex-direction: column; }
  .btn-cookie-primary,
  .btn-cookie-outline { width: 100%; }
}
</style>
