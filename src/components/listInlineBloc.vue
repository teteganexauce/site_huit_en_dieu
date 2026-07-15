<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { useContentStore } from '../stores/content'

import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const formations = ref([
  { titre: 'Lorem Ipsum', description: 'Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi' },
  { titre: 'Sed ut perspici', description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore' },
  { titre: 'Magni Dolores', description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia' },
  { titre: 'Nemo Enim', description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis' },
])

const blogPosts = ref([
  { titre: 'Possimus soluta ut id suscipit ea ut. In quo quia et soluta libero sit sint.', auteur: 'John Doe', date: 'Jan 1, 2022', commentaires: 12, image: '../assets/img/blog/blog-3.jpg' },
  { titre: 'Possimus soluta ut id suscipit ea ut. In quo quia et soluta libero sit sint.', auteur: 'John Doe', date: 'Jan 1, 2022', commentaires: 12, image: '../assets/img/blog/blog-3.jpg' },
  { titre: 'Possimus soluta ut id suscipit ea ut. In quo quia et soluta libero sit sint.', auteur: 'John Doe', date: 'Jan 1, 2022', commentaires: 12, image: '../assets/img/blog/blog-3.jpg' },
])

const contentStore = useContentStore()

onMounted(() => {
  contentStore.fetchPartenaires()
  contentStore.fetchTemoignages()
})
</script>

<template>
   <section id="featured-services" class="featured-services">
      <div class="container">
         <h3 class="w-100 text-primary fw-bold text-center mb-5">Nos Formations</h3>
         <div class="row gy-4">

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate" v-for="(formation, index) in formations" :key="index" :data-aos-delay="index > 0 ? index * 200 : undefined">
                <div class="service-item position-relative">
                   <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                   <h4><a href="" class="stretched-link">{{ formation.titre }}</a></h4>
                   <p>{{ formation.description }}</p>
                   <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>
                </div>
             </div><!-- End Service Item -->
         </div>
      </div>
   </section>

   <section id="espace-vente" class="espace-vente bg-light mb-5">
      <div class="container">
         <div class="row espace vente">
            <div class="col-md-6 d-flex align-items-center mb-4 mb-md-0">
               <div class="title">
                  <h1>Espace de vente d'article, de document et d'artéfact</h1>
                  <p class="w-75 mt-4">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores nulla quaerat
                     labore debitis, harum quae impedit atque commodi sunt quasi cum adipisci sapiente? Consequuntur rem
                     corrupti architecto, iusto quisquam quo.</p>
                  <a href="" class="btn btn-warning rounded-1 mt-4">En savoir plus <i class="bi bi-arrow-right"></i></a>
               </div>
            </div>
            <div class="col-md-6 d-flex align-items-center">
               <div class="row p-0">
                  <div class="col-6 grid-img" v-for="n in 4">
                     <img src="../assets/img/blog/blog-2.jpg" alt="">
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>

   <section id="blog" class="blog mt-4 pt-4">
      <div class="container aos-init aos-animate">
         <div class="row g-5">
            <div class="col-lg-12">
               <div class="row gy-4 posts-list">

                   <div class="col-lg-4" v-for="(post, index) in blogPosts" :key="index">
                     <article class="d-flex flex-column">

                        <div class="post-img">
                           <img src="../assets/img/blog/blog-3.jpg" width="100m" class="img-fluid">
                        </div>

                        <h5 class="title mt-3">
                           <router-link to="/publications/detail" class="pub-title fs-5">Possimus soluta ut id
                              suscipit ea ut.
                              In quo quia et soluta libero sit sint.</router-link>
                        </h5>

                        <div class="meta-top">
                           <ul>
                              <li class="d-flex align-items-center"><i class="bi bi-person"></i> <a
                                    href="blog-details.html">John Doe</a></li>
                              <li class="d-flex align-items-center"><i class="bi bi-clock"></i> <a
                                    href="blog-details.html"><time datetime="2022-01-01">Jan 1, 2022</time></a>
                              </li>
                           </ul>
                        </div>

                        <div class="content mb-3">
                           <p>
                              Aut iste neque ut illum qui perspiciatis similique recusandae non. Fugit autem
                              dolorem labore omnis et. Eum temporibus fugiat voluptate enim tenetur sunt omnis.
                           </p>
                        </div>

                        <div class="read-more mt-auto d-flex justify-content-between">
                           <li class="d-flex align-items-center small text-grey"><i class="bi bi-chat-dots"></i>&nbsp;
                              <span href="blog-detspanils.html">12
                                 Comments</span>
                           </li>
                           <a href="blog-details.html" class="d-block">Read More</a>
                        </div>

                     </article>
                  </div><!-- End post list item -->

               </div><!-- End blog posts list -->

               <div class="blog-pagination">
                  <ul class="justify-content-center">
                     <li><a href="#">1</a></li>
                     <li class="active"><a href="#">2</a></li>
                     <li><a href="#">3</a></li>
                  </ul>
               </div><!-- End blog pagination -->

            </div>

         </div>

      </div>
   </section>

   <section id="testimonials" class="testimonials pt-5">

      <div class="container mt-0">
         <h3 class="w-100 text-primary fw-bold text-center mb-5 head-temo">Témoignages</h3>
         <div class="testimonials-slider swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, index) in contentStore.temoignages" :key="index">
                   <div class="testimonial-item">
                      <img :src="item.photoUrl" class="testimonial-img" :alt="item.auteur">
                      <h3>{{ item.auteur }}</h3>
                      <div class="stars">
                         <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                            class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                      </div>
                      <p>
                         <i class="bi bi-quote quote-icon-left"></i>
                         {{ item.contenu }}
                         <i class="bi bi-quote quote-icon-right"></i>
                      </p>
                   </div>
                </div><!-- End testimonial item -->
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
         </div>
      </div>
   </section><!-- End Testimonials Section -->

   <section id="clients" class="clients mt-5">
      <h3 class="w-100 text-primary fw-bold text-center mb-5">Partenaires</h3>
      <div class="container">
         <div class="clients-slider swiper">
            <div class="swiper-wrapper align-items-center">
                <div class="swiper-slide" v-for="(item, index) in contentStore.partenaires" :key="index">
                   <a :href="item.siteWeb" target="_blank" rel="noopener noreferrer">
                      <img :src="item.logoUrl" class="img-fluid" :alt="item.nom">
                   </a>
                </div>
            </div>
         </div>

      </div>
   </section>
</template>

<style scoped>
.head-temo {
   position: relative;
   z-index: 1;
}

.grid-img {
   height: 200px;
   border: 2px solid transparent;
   padding: 0;
}

.grid-img img {
   object-fit: cover;
   width: 100%;
   height: 100%;
}

.post-img img {
   max-height: 150px !important;
   object-fit: cover;
   transition: .5s;
   width: 100% !important;
}
</style>