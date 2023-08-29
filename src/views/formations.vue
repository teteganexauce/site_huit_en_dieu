<script setup>
import { ref } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import BookComponent from '../components/book.vue'


const formations = ref([
   {
      title: "Formation initiale"
   },
   {
      title: "Formation spécialisée"
   },
   {
      title: "Les formations gratuites"
   },
   {
      title: "Demandez un accompagnement"
   },
])

</script>


<template>
   <BreadcombsComponent title="Nos Formations" />
   <div>
      <div class="">
         <!-- Tabs -->
         <div class="bg-ps-primary">
            <ul class="nav nav-pills mb-3 sub-menu container" role="tablist">

               <li class="py-0" v-for="(item, index) in formations" :key="index">
                  <a class="nav-link px-3 mx-0 my-0 text-white" :class="{ 'active': index == 0 }" data-bs-toggle="pill"
                     :href="`#tab${index + 1}`" aria-selected="{{ (index==0) ? 'false':'' }}" role="tab" tabindex="-1">
                     {{ item.title }}
                  </a>
               </li>

            </ul><!-- End Tabs -->
         </div>

         <!-- Tab Content -->
         <div class="tab-content container p-0">
            <div v-for="(item, index) in formations" :key="index" class="tab-pane fade p-0 m-0"
               :class="{ 'active show': index == 0 }" :id="`tab${index + 1}`" role="tabpanel">
               <div class="row container-fluid my-5 p-0 m-0">
                  <div class="row m-0 p-0">
                     <div class="col-lg-6 mb-4" v-for="n in 4" data-aos="fade-up" data-aos-delay="2000ms">
                        <div class="formation d-flex py-2 shadow-sm text-secondary">
                           <div class="formation-image px-2 w-25">
                              <img src="../assets/img/blog/blog-4.jpg" width="100%" height="100%" alt="">
                           </div>
                           <div class="formation-content w-75 text-capitalize mb-0 px-1">
                              <h5 class="formation-title">formation en pensée positive</h5>
                              <div class="mb-2">
                                 <div class="foramtion-duration d-flex justify-content-between">
                                    <small class="w-50">
                                       Durée: <b>3 mois</b>
                                    </small>
                                    <small class="w-50">
                                       Prix: <b>20 000 fcfa</b>
                                    </small>
                                 </div>
                              </div>
                              <p class="small formation-description mb-0 text-grey">
                                 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus impedit, suscipit,
                                 rerum rem quam alias dolor quas id a numquam, obcaecati aspernatur nihil voluptate? Quo
                                 suscipit obcaecati accusamus earum asperiores!
                              </p>
                           </div>
                        </div>
                     </div>
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

.bg-ps-light {
   background-color: rgba(238, 238, 238, 0.233);
}

.w-30 {
   widows: 30% !important;
}

.formation-image {
   max-width: 25% !important;
   min-width: 100px;
}

.formation-image img {
   object-fit: cover;
   transition: .5s;
}

.formation:hover {
   box-shadow: 0px 0px 15px 1px rgb(224, 224, 224) !important;
   transition: .4s;
}

.formation:hover .formation-title {
   color: var(--color-primary);
}

.formation-description {
   -webkit-line-clamp: 2;
   display: -webkit-box;
   -webkit-box-orient: vertical;
   overflow: hidden;
   word-wrap: break-word;
}

.text-grey {
   color: rgb(131, 131, 131);
}

.formation:hover {
   cursor: pointer;
}</style>