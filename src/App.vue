<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, RouterView } from 'vue-router'
import HeaderComponent from './includes/header.vue'
import FooterComponent from './includes/footer.vue'
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import { useContentStore } from './stores/content';
import ChatBot from './components/ChatBot.vue';
import CookieBanner from './components/CookieBanner.vue';
import { openBanner } from './services/cookieConsent';

const authStore = useAuthStore();
const cartStore = useCartStore();
const contentStore = useContentStore();
const route = useRoute();

const isAuthPage = computed(() => route.name === 'login' || route.name === 'register' || route.name === 'forgotPassword' || route.name === 'resetPassword');

onMounted(() => {
  contentStore.fetchAll()
  if (authStore.isAuthenticated) {
    authStore.fetchProfile();
    cartStore.fetchCart();
  }
  openBanner();
});
</script>

<template>


   <HeaderComponent v-if="!isAuthPage" />

   <main id="main" :class="{ 'main--auth': isAuthPage }">

      <RouterView /> 
   </main>

   <FooterComponent v-if="!isAuthPage" />

   <ChatBot />

   <CookieBanner />

</template>

<style>
:root{
   --ps-primary-hover: #1a92a7;
   --ps-primary-link: #1a92a70c;
   --ps-primary: #1a92a7e5;

   /* Hauteur du header, légèrement augmentée et synchronisée
      avec le vrai rendu du composant header.vue (min-height) */
   --header-height: 92px;
}

/* Offset du header fixed */
#main {
   padding-top: var(--header-height);
}

#main.main--auth {
   padding-top: 0;
}

@media (max-width: 991px) {
   :root {
      --header-height: 76px;
   }
}

@media (max-width: 576px) {
   :root {
      --header-height: 64px;
   }
}
.text-ps-primary{
   color: var(--color-primary) !important;
}
.bg-ps-primary{
   background-color: var(--color-primary) !important;
}
.bg-ps-light {
   background-color: rgba(238, 238, 238, 0.233);
}
.text-grey {
   color: rgb(131, 131, 131);
}
</style>