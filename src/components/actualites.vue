<script setup>
import { ref } from "vue";

import { Navigation, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const breakpoint = {
  200: {
    slidesPerView: 1,
  },
  770: {
    slidesPerView: 2,
    spaceBetween: 50,
  },
  1200: {
    slidesPerView: 3,
    spaceBetween: 40,
  },
};

const pubs = ref([
  {
    type: "Pensées quotidiennes",
    dataPub: "il y a 3minutes",
    titre: "La pensée positive",
    contenu: "",
    auteur: "Paul WARREN",
  },
  {
    type: "Recherches Scientifiques",
    dataPub: "il y a 10minutes",
    titre: "Qui est Dieu",
    contenu: "",
    auteur: "Louis Vincent",
  },
  {
    type: "Annonces Ouvrages",
    dataPub: "il y a 27minutes",
    titre: "L'ouvrage de  Bible Antique",
    contenu: "",
    auteur: "Paul WARREN",
  },
  {
    type: "Annonces Ouvrages",
    dataPub: "il y a 27minutes",
    titre: "L'ouvrage de  Bible Antique",
    contenu: "",
    auteur: "Paul WARREN",
  },
]);
</script>
<template>
  <div class="container mt-5">
    <h4 class="border-bottom pb-3 border-4 border-primary text-secondary">
      <b>Les Pensées quotidiennes</b>
    </h4>
    <div class="row container-fluid mb-5 mt-4 px-0 mx-0">
      <!--div class="col-lg-4 col-md-6 p-1 mb-3" v-for="(pub, index) in pubs" :key="index">
            <div class="px-3 py-3 publications shadow">
               <div class="d-flex flex-wrap align-items-center justify-content-between">
                  <div>
                     <h6 class="m-0 text-grey"><b>{{ pub.type }}</b></h6>
                  </div>
                  <div>
                     <small><i>{{ pub.dataPub }}</i></small>
                  </div>
               </div>
               <div class="mt-3">
                  <h5 class="text-primary">{{ pub.titre }}</h5>
                  <p class="pub45 text-grey" v-if="pub.contenu != ''">{{ pub.contenu }}</p>
                  <p class="pub45 text-grey" v-else>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi
                     asperiores modi
                     perferendis atque ipsum culpa voluptatem cum architecto exercitationem veritatis possimus incidunt, a
                     repellendus expedita numquam labore eum quo quasi!</p>
                  <small class="text-grey"><i>Paul WARREN</i></small>
               </div>
            </div>
         </div-->
      <swiper
        :modules="[Navigation, Pagination, A11y]"
        :breakpoints="breakpoint"
        loop
        :space-between="50"
        navigation
        :pagination="{ clickable: true }"
        @swiper="onSwiper"
        @slideChange="onSlideChange">
        <swiper-slide
          v-for="(pub, index) in pubs"
          :key="index"
          class="col-lg-4 col-md-6 p-1 mb-3">
          <div>
            <div
              class="px-3 py-3 mb-4 publications shadow"
              :class="index == 0 ? `active` : ``">
              <a href="">
                <div
                  class="d-flex flex-wrap align-items-center justify-content-between">
                  <div>
                    <h6 class="m-0 text-grey">
                      <b>{{ pub.type }}</b>
                    </h6>
                  </div>
                  <div>
                    <small
                      ><i>{{ pub.dataPub }}</i></small
                    >
                  </div>
                </div>
                <div class="mt-3">
                  <h5 class="text-primary">{{ pub.titre }}</h5>
                  <p class="pub45" v-if="pub.contenu != ''">
                    {{ pub.contenu }}
                  </p>
                  <p class="pub45" v-else>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Sequi asperiores modi perferendis atque ipsum culpa
                    voluptatem cum architecto exercitationem veritatis possimus
                    incidunt, a repellendus expedita numquam labore eum quo
                    quasi!
                  </p>
                  <small class=""><i>Paul WARREN</i></small>
                </div>
              </a>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style scoped>
.publications .pub45 {
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-grey {
  color: grey !important;
}

.swiper {
  background-color: transparent !important;
  padding: 10px 25px !important;
}
.publications.active {
  background-color: #35b9d342;
}

.publications a {
  color: unset;
}
</style>
