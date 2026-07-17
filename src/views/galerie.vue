<script setup>
import { ref, onMounted, computed } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'

import Lightgallery from 'lightgallery/vue';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-video.css";

import publicService from '../services/publicService';
import defaultImg from '../assets/img/blog/blog-3.jpg';

const plugins = [lgThumbnail, lgZoom, lgVideo]

const sousMenu = ref(['Images', 'Videos'])
const categories = ref(['Sortie pédagogique', 'Formations', 'Séminaires'])

const medias = ref([])
const isLoading = ref(true)
const activeTab = ref('images')

const images = computed(() =>
  medias.value.filter(m => m.type === 'image')
)
const videos = computed(() =>
  medias.value.filter(m => m.type === 'video')
)

onMounted(async () => {
  try {
    const data = await publicService.getGallery();
    medias.value = data.data || data;
  } catch (error) {
    console.error('Erreur chargement galerie:', error);
  } finally {
    isLoading.value = false;
  }
})
</script>


<template>
   <BreadcombsComponent title="Galeries" />
   <div>
      <div class="">
         <!-- Tabs -->
         <div class="bg-ps-primary">
            <ul class="nav nav-pills mb-3 sub-menu container" role="tablist">

               <li class="py-0" v-for="(item, index) in sousMenu" :key="index">
                  <a class="nav-link px-3 mx-0 my-0 text-white" :class="{ 'active': index == 0 }" data-bs-toggle="pill"
                     :href="`#tab${index + 1}`" aria-selected="{{ (index==0) ? 'false':'' }}" role="tab" tabindex="-1">
                     {{ item }}
                  </a>
               </li>

            </ul><!-- End Tabs -->
         </div>

         <!-- Tab Content -->
         <div class="tab-content container p-0">
            <div v-for="(item, index) in sousMenu" :key="index" class="tab-pane fade p-0 m-0"
               :class="{ 'active show': index == 0 }" :id="`tab${index + 1}`" role="tabpanel">
               <div v-if="index === 0" class="row container-fluid my-5 p-0 m-0">
                   <div class="col-md-2 px-0">
                      <div class="d-flex justify-content-between">
                         <h4>Evenements</h4>
                      </div>
                      <ul class="list-unstyled s-menu p-0 m-0 h-auto w-100 d-flex flex-column">
                         <li v-for="(item, index) in categories" :key="index"><a href=""
                               class="px-3 py-2 d-block">{{ item }}</a></li>
                      </ul>
                   </div>
                   <div class="offset-1 col-md-9">
                      <div v-if="isLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Chargement...</span>
                        </div>
                      </div>
                      <div v-else class="row gallery">
                         <lightgallery class="row" :settings="{ speed: 500, plugins: plugins }">
                            <a v-for="item in images" :key="item.id" :href="item.url"
                               class="gallery-item col-lg-4 col-md-6 mb-2 px-1">
                               <img :alt="item.nom || 'Image'" class="p-image" :src="item.url" width="100%"
                                  height="100%" />
                            </a>
                         </lightgallery>
                      </div>
                   </div>
               </div>
                <div v-if="index === 1" class="row container-fluid my-5 p-0 m-0">
                   <div class="col-md-2 px-0">
                      <div class="d-flex justify-content-between">
                         <h4>Evenements</h4>
                      </div>
                      <ul class="list-unstyled s-menu p-0 m-0 h-auto w-100 d-flex flex-column">
                         <li v-for="(item, index) in categories" :key="index"><a href=""
                               class="px-3 py-2 d-block">{{ item }}</a>
                         </li>
                      </ul>
                   </div>
                   <div class="offset-1 col-md-9">
                      <div v-if="isLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Chargement...</span>
                        </div>
                      </div>
                      <div v-else class="row gallery">
                         <lightgallery class="row" :settings="{ speed: 500, plugins: plugins }">
                            <a v-for="item in videos" :key="item.id" class="gallery-item col-lg-4 col-md-6 mb-2 px-1"
                               data-lg-size="1280-720"
                               :data-video='`{"source": [{"src":"${item.url}", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}`'
                               :data-poster="item.url"
                               :data-sub-html="`<h4>${item.nom || 'Vidéo'}</h4>`">
                               <img width="300" height="100" class="img-responsive"
                                  :src="item.url" />
                            </a>
                         </lightgallery>
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

/* .bg-ps-light {
   background-color: rgba(238, 238, 238, 0.233);
} */

.gallery-item img,
.gallery-item video {
   width: 100%;
   height: 100%;
   transition: .3s;
}

.gallery-item img:hover {
   transform: scale(1.05);
}

.gallery-item {
   overflow: hidden;
}

.s-menu li:hover a {
   transition: .3s;
   color: rgb(15, 15, 139);
   /* transform: translateX(10px); */
}

.search i {
   font-size: 12px;
}

.search span:hover {
   background-color: rgb(218, 218, 218) !important;
   cursor: pointer;
}

.p-image {
   width: 100% !important;
   height: 100% !important;
   object-fit: cover;
}
</style>