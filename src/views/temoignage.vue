<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import publicService from '../services/publicService'
import defaultAvatar from '../assets/default.jpg'

const sousMenu = ref(['Témoignages écrits', 'Témoignages audios', 'Témoignages vidéos'])

const temoignages = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await publicService.getTestimonials();
    temoignages.value = data.data || data;
  } catch (error) {
    console.error('Erreur chargement temoignages:', error);
  } finally {
    isLoading.value = false;
  }
})
</script>


<template>
   <BreadcombsComponent title="Témoignages" />
   <div>
      <div class="">
         <!-- Tabs -->
         <div class="bg-ps-primary">
            <ul class="nav nav-pills d-flex justify-content-md-start justify-content-center mb-3 sub-menu container" role="tablist">
               <li class="py-0 d-flex" v-for="(item, index) in sousMenu" :key="index">
                  <div class="vr text-white d-lg-block d-none"></div>

                  <a class="nav-link px-3 mx-0 my-0 text-white" :class="{ 'active': index == 0 }" data-bs-toggle="pill"
                     :href="`#tab${index + 1}`" aria-selected="{{ (index==0) ? 'false':'' }}" role="tab" tabindex="-1">
                     {{ item }}
                  </a>
                  <div class="vr text-white d-lg-block d-none"></div>
               </li>


            </ul><!-- End Tabs -->
         </div>

         <!-- Tab Content -->
         <div class="tab-content container p-0">
            <div v-for="(item, idx) in sousMenu" :key="idx" class="tab-pane fade p-0 m-0"
               :class="{ 'active show': idx == 0 }" :id="`tab${idx + 1}`" role="tabpanel">
               <div class="row container-fluid my-5 p-0 m-0">
                   <div v-if="isLoading" class="text-center py-5 col-12">
                     <div class="spinner-border text-primary" role="status">
                       <span class="visually-hidden">Chargement...</span>
                     </div>
                   </div>
                   <div v-if="idx == 0 && !isLoading" v-for="item in temoignages" :key="item.id" class="col-lg-4 col-md-6 mb-3">
                      <div class="border d-flex py-2 px-1 rounded">
                         <div class="icon-user w-25 mx-2">
                            <img :src="item.photoUrl || defaultAvatar" :alt="item.auteur">
                         </div>
                         <div class="body py-1 mb-0">
                            <h6 class="text-secondary fw-bold">{{ item.auteur }}</h6>
                            <p class="fst-italic text-grey mb-0">{{ item.contenu }}</p>
                         </div>
                      </div>
                   </div>
                   <div v-if="idx == 1 && !isLoading" v-for="item in temoignages" :key="'a'+item.id" class="col-lg-4 col-md-6 mb-3">
                      <div class="border d-flex py-2 px-1 rounded">
                         <div class="icon-user w-20 mx-2">
                            <img :src="item.photoUrl || defaultAvatar" :alt="item.auteur">
                         </div>
                         <div class="body py-1 mb-0">
                            <h6 class="text-secondary fw-bold">{{ item.auteur }}</h6>
                            <p class="fst-italic text-grey mb-0 small">{{ item.contenu }}</p>
                         </div>
                      </div>
                   </div>
                   <div v-if="idx == 2 && !isLoading" v-for="item in temoignages" :key="'v'+item.id" class="col-lg-4 col-md-6 mb-3">
                      <div class="border d-flex py-2 px-1 rounded">
                         <div class="icon-user w-20 mx-2">
                            <img :src="item.photoUrl || defaultAvatar" :alt="item.auteur">
                         </div>
                         <div class="body py-1 mb-0">
                            <h6 class="text-secondary fw-bold">{{ item.auteur }}</h6>
                            <p class="fst-italic text-grey mb-0 small">{{ item.contenu }}</p>
                         </div>
                      </div>
                   </div>
                  <!-- Button trigger modal -->

               </div>
            </div><!-- End Tab 1 Content -->
         </div>

      </div>

      <!-- Modal -->
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
         aria-labelledby="staticBackdropLabel" aria-hidden="true">
         <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
               <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">{{ currentModal.titre }} de {{ currentModal.auteur }}
                  </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body">
                  <div class="content-file d-flex mt-2 justify-content-between align-items-center">
                     <div>
                        <button class="btn btn-primary mb-2"> <i class="bi bi-play"></i></button>
                     </div>
                     <div>
                        <audio title="Noir Désir" preload="auto" controls loop>
                           <source id="audio" :src="currentModal.text" type="audio/mp3">
                           <p class="p-0 m-0">Votre navigateur est trop ancien pour lire ce fichier</p>
                        </audio>
                     </div>
                  </div>
               </div>
               <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Understood</button>
               </div>
            </div>
         </div>
      </div>

      <div class="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
         aria-labelledby="staticBackdrop1Label" aria-hidden="true">
         <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
               <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdrop1Label">{{ currentModal.titre }} de {{ currentModal.auteur }}
                  </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body">
                  <div class="content-file d-flex mt-2 justify-content-center align-items-center">
                     <div>
                        <video width="320" height="240" controls>
                           <source src="" type="video/mp4">
                           <source src="" type="video/ogg">
                           Your browser does not support the video tag.
                        </video>
                     </div>
                  </div>
               </div>
               <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Understood</button>
               </div>
            </div>
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

.icon-user img {
   width: 100%;
   height: auto;
}

.body p {
   -webkit-line-clamp: 3;
   display: -webkit-box;
   -webkit-box-orient: vertical;
   overflow: hidden;
   word-wrap: break-word;
   font-size: 14px;
}

.file-content img {
   width: 100% !important;
   max-height: inherit;
}

/* .text-grey {
   color: rgb(131, 131, 131);
} */

.w-20 {
   width: 20% !important;
}
</style>