<script setup>
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './includes/header.vue'
import FooterComponent from './includes/footer.vue'
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchProfile();
  }
});
</script>

<template>

   <HeaderComponent />

   <main id="main">

      <RouterView /> 

   </main>

   <FooterComponent />

</template>

<style>
:root{
   --ps-primary-hover: #1a92a7;
   --ps-primary-link: #1a92a70c;
   --ps-primary: #1a92a7e5;
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
