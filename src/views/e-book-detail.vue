<script setup>
import BreadcombsComponent from '../includes/breadcombs.vue'
import BookComponent from '../components/book.vue'

import { Navigation, Pagination, A11y } from 'swiper/modules';
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
}


</script>

<template>
   <BreadcombsComponent title="Details d'un e-book" />
   <div>
      <div class="container mt-5">
         <div class="row">
            <div class="col-lg-9">
               <div class="book-title d-flex align-items-center justify-content-between py-2 mb-1">
                  <div class="d-flex align-items-center">
                     <div class="book-icon d-flex justify-content-center align-items-center ">
                        <i class="bi bi-book text-ps-primary"></i>
                     </div>
                     <h5 class="m-0 text-ps-primary"><b>La pensée positive </b></h5>
                  </div>
                  <div class="">
                     <small class="text-grey"><i>Publié il y a 2 semaines</i></small>
                  </div>
               </div>
               <div class="book-image">
                  <img src="../assets/img/faq.jpg" alt="">
               </div>
               <div class="book-paragraph pt-2 mb-5">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum aut consequuntur molestias ullam corrupti
                  cum rem unde repellat repudiandae eligendi. Sit alias quibusdam libero placeat nesciunt consequatur
                  architecto beatae ex?
                  Unde officiis eveniet labore aspernatur sapiente dolore distinctio praesentium accusamus molestiae
                  molestias eos possimus eum, vel recusandae corrupti commodi hic illum, placeat similique quam
                  exercitationem maxime repellendus in. Enim, voluptatibus.
                  Earum quis maxime tempora fuga dolorem aut, dolores reiciendis incidunt magnam quas libero consectetur
                  impedit aliquam atque quia velit et. Molestias magnam vel mollitia similique quia inventore repellendus
                  quisquam sed!
                  Cum vero quos corrupti? Molestias, illum officia perferendis, ex asperiores architecto quia suscipit
                  eligendi corporis animi nesciunt sed. Fugit rerum omnis placeat, nulla vel amet impedit doloremque
                  cupiditate tempora consectetur!
                  Ipsam iste assumenda alias totam, odio odit iusto accusantium delectus. Quia sit harum repellendus alias,
                  tempore totam rem! At minus hic dolores quidem vero minima fuga quis sed ducimus officia?
                  Vel neque maxime eaque officiis illum excepturi incidunt inventore totam beatae doloremque qui, explicabo
                  temporibus, perferendis voluptas in dolorem id. Esse, impedit blanditiis excepturi reprehenderit natus
                  neque iusto praesentium dolorem?
                  Reiciendis quae voluptas autem itaque doloremque adipisci. Numquam in maiores eaque architecto aliquam
                  aperiam maxime corporis dicta dolorum sequi tempore quasi, expedita nam, quo nemo, nisi ut neque a!
                  Doloribus.
                  Dolorem iusto maiores sint itaque. Nostrum corrupti ut numquam provident unde nisi, error placeat maiores
                  repellat consequatur fuga magnam aut vero cumque dolor saepe illo dolorum? Reiciendis rem dolor totam!
                  Voluptatibus perferendis porro ipsum cumque sit, beatae libero iure ullam sunt! Id unde et cumque ipsum
                  praesentium nesciunt, vitae accusantium dolore, rerum, optio omnis iste numquam beatae odio quasi natus.
                  Recusandae iste ad mollitia aspernatur hic! Dolores a, quia incidunt quos earum laudantium inventore,
                  corrupti illo repellat quidem ipsum perspiciatis nisi, modi assumenda exercitationem aspernatur
                  voluptatum repellendus quibusdam nemo ad?
               </div>
            </div>
            <div class="col-lg-3 mt-3">
               <div class="">
                  <div class="bg-ps-primary  text-white rounded py-2 border px-2">
                     <h6 class="m-0 text-uppercase"><b>Auteur du Livre</b></h6>
                  </div>
                  <div class="py-3 px-3 text-center">
                     <h5 class="m-0 text-grey">Paul WARREN</h5>
                  </div>
                  <div class="bg-ps-primary rounded text-white border py-2 px-2">
                     <h6 class="m-0 text-uppercase"><b>Evaluation du Livre</b></h6>
                  </div>
                  <div class="py-3 text-center">
                     <div>
                        <i class="bi text-warning bi-star-fill"></i>
                        <i class="bi text-warning bi-star-fill"></i>
                        <i class="bi text-warning bi-star"></i>
                        <i class="bi text-warning bi-star"></i>
                        <i class="bi text-warning bi-star"></i>

                        <small class="mx-3">2/5</small>
                     </div>
                     <div class="mt-2">
                        <i class="bi bi-download"></i> <small>12 Téléchargements</small>
                     </div>
                  </div>
                  <div class="bg-ps-primary rounded text-white border py-2 px-2">
                     <h6 class="m-0 text-uppercase"><b>Acheter le Livre</b></h6>
                  </div>
               </div>

            </div>
         </div>

         <h3 class="text-ps-primary mb-3">Autre Livres de l'auteur</h3>

         <div class="mb-5">
            <swiper :modules="[Navigation, Pagination, A11y]" :breakpoints="breakpoint" :loop=" true "
               :space-between=" 50 " navigation :pagination=" { clickable: true } " @swiper=" onSwiper "
               @slideChange=" onSlideChange ">
               <swiper-slide v-for="n in 10">
                  <BookComponent />
               </swiper-slide>
            </swiper>
         </div>

      </div>
   </div>
</template>

<style scoped>
.book-image {
   width: 100%;
   height: 200px;
   overflow: hidden;
}

.book-image img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   transition: .5s;
}

.book-image:hover img {
   transform: scale(1.05);
}

.book-icon {
   min-width: 40px !important;
   min-height: 40px !important;
   color: var(--color-primary);
   border-color: var(--color-primary);
   /* border: 2px solid var(--color-primary); */
   margin-right: 10px;
}
.book-icon i{
   font-size: 30px !important;
}
.text-grey {
   color: rgb(133, 133, 133);
}

.swiper {
   background-color: transparent !important;
   padding: 10px 25px !important;
}

.book-title small{
   font-size: 12px;
}
</style>