<template>
   <BreadcombsComponent title="Equipe d'animation" />

   <div>
      <section id="team" class="team">
         <div class="container aos-init aos-animate" data-aos="fade-up">

           <div class="section-header">
             <h2>Membres</h2>
           </div>

           <div class="row gy-5">
             <div v-if="isLoading" class="text-center py-5">
               <div class="spinner-border text-primary" role="status">
                 <span class="visually-hidden">Chargement...</span>
               </div>
             </div>
             <div v-for="(member, index) in members" :key="member.id" class="col-xl-4 col-md-4 col-sm-6 d-flex aos-init aos-animate" data-aos="zoom-in" :data-aos-delay="200 * (index % 3)">
               <div class="team-member">
                 <div class="member-img">
                   <img :src="member.photoUrl || defaultAvatar" class="img-fluid" :alt="member.prenom + ' ' + member.nom">
                 </div>
                 <div class="member-info">
                   <h5>{{ member.prenom }} {{ member.nom }}</h5>
                   <span>{{ member.fonction }}</span>
                 </div>
               </div>
             </div>
           </div>

         </div>
       </section>
      
   </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'
import defaultAvatar from '../assets/img/team/team-1.jpg'

const members = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await publicService.getTeam();
    members.value = data.data || data;
  } catch (error) {
    console.error('Erreur chargement equipe:', error);
  } finally {
    isLoading.value = false;
  }
})
</script>
<style>
   
</style>