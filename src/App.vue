<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './includes/header.vue'
import FooterComponent from './includes/footer.vue'

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

</style>
