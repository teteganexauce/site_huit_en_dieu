<script setup>
import { ref, watch } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import img2 from '../assets/audio1.mp3'
import img3 from '../assets/audio2.mp3'
import img4 from '../assets/audio4.mp3'

const sousMenu = ref(['Témoignage écrits', 'Témoignages audios', 'Témoignages vidéos'])

const audios = ref([
   {
      titre: 'Témoignagne',
      auteur: 'Thbaut DUrANT',
      text: '../assets/audio.mp3'
   },
   {
      titre: 'Témoignagne',
      auteur: 'Albert Francois',
      text: img2
   },
   {
      titre: 'Témoignagne',
      auteur: 'Loui FOINCIERT',
      text: img3
   },
   {
      titre: 'Témoignagne',
      auteur: 'John Doe',
      text: img4
   },
])

const currentModal = ref('');


function show(idx) {
   currentModal.value = audios.value[idx];
   console.log(currentModal.value.text);

   $("#audio").attr('src', currentModal.value.text);
   // $('#staticBackdrop').modal('show');
}

function show2(idx) {
   currentModal.value = audios.value[idx];
   console.log(currentModal.value.text);

   $("#audio").attr('src', currentModal.value.text);
   // $('#staticBackdrop1').modal('show');

}


</script>


<template>
   <BreadcombsComponent title="Témoignages" />
   <div>
      <div class="">
         <!-- Tabs -->
         <div class="bg-ps-primary">
            <ul class="nav nav-pills mb-3 sub-menu container" role="tablist">

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
                  <div v-if="idx == 0" v-for="n in 5" class="col-lg-4 col-md-6 mb-3">
                     <div class="border d-flex py-2 px-1 rounded">
                        <div class="icon-user w-25 mx-2">
                           <img src="../assets/default.jpg" alt="">
                        </div>
                        <div class="body py-1 mb-0">
                           <h6 class="text-secondary fw-bold">Thibaut DURANT</h6>
                           <p class="fst-italic text-grey mb-0"> Lorem ipsum dolor sit amet consectetur adipisicing elit.
                              Vel corporis ut,
                              qui ipsum provident sed ab expedita vitae modi nisi tempore error ipsa! Saepe perferendis
                              repellendus sint, laboriosam soluta voluptate.</p>
                        </div>
                     </div>
                  </div>
                  <div v-if="idx == 1" v-for="(item, idx1) in audios" :key="idx1" class="col-lg-4 col-md-6 mb-3">
                     <div class="border d-flex py-2 px-1 rounded">
                        <div class="icon-user w-20 mx-2">
                           <img src="../assets/default.jpg" alt="">
                        </div>
                        <div class="body py-1 mb-0">
                           <h6 class="text-secondary fw-bold">{{ item.auteur }}</h6>
                           <div class="file d-flex">
                              <div class="d-flex align-items-center">
                                 <div class="file-content w-20">
                                    <img src="../assets/audio.jpg" alt="">
                                 </div>
                                 <div class="info-content px-1">
                                    <small>
                                       <ul class="list-unstyled m-0 p-0">
                                          <li><b>Durée</b>: 10min</li>
                                          <li><b>Taille</b>: 4,5mo</li>
                                       </ul>
                                    </small>
                                 </div>
                              </div>
                              <div class="play-file px-3">
                                 <div class="btn btn-warning bes" @click="show(idx1)" data-bs-toggle="modal"
                                       data-bs-target="#staticBackdrop">Jouer</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div v-if="idx == 2" v-for="(item, idx2) in audios" :key="idx2" class="col-lg-4 col-md-6 mb-3">
                     <div class="border d-flex py-2 px-1 rounded">
                        <div class="icon-user w-20 mx-2">
                           <img src="../assets/default.jpg" alt="">
                        </div>
                        <div class="body py-1 mb-0">
                           <h6 class="text-secondary fw-bold">{{ item.auteur }}</h6>
                           <div class="file d-flex">
                              <div class="d-flex align-items-center">
                                 <div class="file-content w-20">
                                    <img src="../assets/film-3.png" alt="">
                                 </div>
                                 <div class="info-content px-2">
                                    <small>
                                       <ul class="list-unstyled m-0 p-0">
                                          <li><b>Durée</b>: 10min</li>
                                          <li><b>Taille</b>: 4,5mo</li>
                                       </ul>
                                    </small>
                                 </div>
                              </div>
                              <div class="play-file px-3">
                                 <div class="btn btn-warning" @click="show2(idx2)" data-bs-toggle="modal"
                                       data-bs-target="#staticBackdrop1">Voir</div>
                              </div>
                           </div>
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

.bg-ps-light {
   background-color: rgba(238, 238, 238, 0.233);
}

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

.text-grey {
   color: rgb(131, 131, 131);
}

.w-20 {
   width: 20% !important;
}
</style>