<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContentStore } from '../stores/content'
import BreadcombsComponent from '../includes/breadcombs.vue'

const contentStore = useContentStore()

const services = ref([
   { nom: "Accompagnement spirituel", description: "Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi" },
   { nom: "Formation initiale", description: "Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi" },
   { nom: "Formation spécialisée", description: "Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi" },
   { nom: "Demandez un accompagnement", description: "Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi" },
   { nom: "Les formations gratuites", description: "Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi" },
])

const items = computed(() => contentStore.rubriques.length > 0 ? contentStore.rubriques : services.value)

onMounted(() => {
   contentStore.fetchRubriquesCulture()
})
</script>

<template>
   <BreadcombsComponent title="Nos services" />
   <section id="featured-services" class="featured-services">
      <div class="container">

         <div class="row gy-4">

             <div v-for="(item, index) in items" :key="index" class="col-lg-3 col-md-4 d-flex aos-init aos-animate" data-aos="zoom-out">
                <div class="border service-item position-relative w-100 px-4">
                   <div class="icon p-0 bg-ps-primary d-flex justify-content-center align-items-center rounded-circle"><i class="bi bi-star text-white icon p-0 m-0"></i></div>
                   <h4 class="mb-2"><a href="" class="stretched-link">{{item.nom}}</a></h4>
                   <p class="">{{item.description}}</p>
                </div>
             </div><!-- End Service Item -->
         </div>
      </div>
   </section>
</template>

<style scoped>
div.icon{
   width: 40px;
   height: 40px;
}
div.icon i{
   font-size: 20px !important;
}
.service-item h4{
   font-size: 20px !important;
}
.service-item {
margin-bottom: 0% !important;
padding-bottom: 1em !important;
padding-top: 1em !important;
}
.service-item p{
   font-size: 14px !important;
}
/* *{
   margin: 0% !important;
   padding: 0% !important;
} */
</style>