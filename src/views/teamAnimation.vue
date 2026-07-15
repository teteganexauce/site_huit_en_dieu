<template>
   <BreadcombsComponent title="Equipe d'animation" />

   <div>
      <section id="team" class="team">
         <div class="container aos-init aos-animate" data-aos="fade-up">

           <div class="section-header">
             <h2>Membres</h2>
           </div>

           <div class="row gy-5">

              <div v-for="member in members" class="col-xl-4 col-md-4 col-sm-6 d-flex aos-init aos-animate" data-aos="zoom-in" data-aos-delay="200">
                <div class="team-member">
                  <div class="member-img">
                    <img :src="member.photoUrl" class="img-fluid" alt="">
                  </div>
                  <div class="member-info">
                    <div class="social">
                      <a href=""><i class="bi bi-twitter"></i></a>
                      <a href=""><i class="bi bi-facebook"></i></a>
                      <a href=""><i class="bi bi-instagram"></i></a>
                      <a href=""><i class="bi bi-linkedin"></i></a>
                    </div>
                    <h5>{{ member.prenom }} {{ member.nom }}</h5>
                    <span>{{ member.fonction }}</span>
                  </div>
                </div>
              </div><!-- End Team Member -->

           </div>

         </div>
       </section>
      
   </div>
</template>
<script setup>
import { onMounted, computed } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import { useContentStore } from '../stores/content'

const contentStore = useContentStore()

onMounted(() => {
  contentStore.fetchEquipe()
})

const members = computed(() => contentStore.equipe)
</script>
<style>
   
</style>