<script setup>
import { ref, computed, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import BookComponent from '../components/book.vue'
import { useCatalogueStore } from '../stores/catalogue'

const store = useCatalogueStore()
const sousMenu = ref(['Nouveautés', 'Meilleures Ventes', 'Nos livres gratuits', 'Nos publications', 'Coups de coeur'])

const ebooks = computed(() => store.products.filter(p => p.type === 'ebook'))

onMounted(() => {
   store.fetchCatalogue()
})


</script>


<template>
   <BreadcombsComponent title="Nos e-books" />
   <div>
      <div class="">
         <!-- Tabs -->
         <div class="bg-ps-primary">
            <ul class="nav nav-pills mb-3 sub-menu container" role="tablist">

               <li class="py-0" v-for="(item, index) in sousMenu" :key="index">
                  <a class="nav-link px-3 mx-0 my-0 text-white" :class="{ 'active': index == 0 }" data-bs-toggle="pill" :href="`#tab${index + 1}`"
                     aria-selected="{{ (index==0) ? 'false':'' }}" role="tab" tabindex="-1">
                     {{ item }}
                  </a>
               </li>

            </ul><!-- End Tabs -->
         </div>

         <!-- Tab Content -->
         <div class="tab-content container p-0">
            <div v-for="(item, index) in sousMenu" :key="index" class="tab-pane fade p-0 m-0" :class="{ 'active show': index==0  }" :id="`tab${index + 1}`" role="tabpanel">
               <div class="row container-fluid my-5 p-0 m-0">
                  <div v-for="item in ebooks" :key="item.id" class="col-lg-4">
                     <BookComponent :product="item" />
                  </div>
               </div>
            </div><!-- End Tab 1 Content -->
         </div>

      </div>
   </div>
</template>

<style scoped>
.sub-menu .nav-link {
   border-bottom: 3px solid transparent;
   color: grey;
   margin-right: 20px;
}

.sub-menu .nav-link:hover {
   background-color: #485664;
   border-radius: 0px;
   color: var(--color-primary);
}

.sub-menu .nav-link.active {
   background-color: #485664;
   border-radius: 0px;
   color: white;
}

/* .bg-ps-light {
   background-color: rgba(238, 238, 238, 0.233);
} */
</style>