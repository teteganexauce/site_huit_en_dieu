<template>
   <BreadcombsComponent title="Equipe d'animation" />

   <div>
      <section id="team" class="team">
         <div class="container aos-init aos-animate" data-aos="fade-up">

           <div class="section-header">
             <h2>Membres</h2>
           </div>

           <div class="row gy-5">

             <div v-for="n in 5" class="col-xl-4 col-md-4 col-sm-6 d-flex aos-init aos-animate" data-aos="zoom-in" data-aos-delay="200">
               <div class="team-member">
                 <div class="member-img">
                   <img src="../assets/img/team/team-1.jpg" class="img-fluid" alt="">
                 </div>
                 <div class="member-info">
                   <div class="social">
                     <a href=""><i class="bi bi-twitter"></i></a>
                     <a href=""><i class="bi bi-facebook"></i></a>
                     <a href=""><i class="bi bi-instagram"></i></a>
                     <a href=""><i class="bi bi-linkedin"></i></a>
                   </div>
                   <h5>Walter White</h5>
                   <span>Chief Executive Officer</span>
                 </div>
               </div>
             </div><!-- End Team Member -->

           </div>

         </div>
       </section>
      
   </div>
</template>
<script setup>
import BreadcombsComponent from '../includes/breadcombs.vue'

</script>
<style>
   
</style>