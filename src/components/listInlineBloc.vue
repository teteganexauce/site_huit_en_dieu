<script setup>

</script>

<template>
   <section id="featured-services" class="featured-services">
      <div class="container" data-aos="fade-out">
         <h3 class="w-100 text-primary fw-bold text-center mb-5">Nos Formations</h3>
         <div class="row gy-4">

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate" data-aos="zoom-out">
               <div class="service-item position-relative">
                  <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                  <h4><a href="" class="stretched-link">Lorem Ipsum</a></h4>
                  <p>Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                  <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>
               </div>
            </div><!-- End Service Item -->

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate" data-aos="zoom-out" data-aos-delay="200">
               <div class="service-item position-relative">
                  <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                  <h4><a href="" class="stretched-link">Sed ut perspici</a></h4>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                  <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>

               </div>
            </div><!-- End Service Item -->

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate" data-aos="zoom-out" data-aos-delay="400">
               <div class="service-item position-relative">
                  <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                  <h4><a href="" class="stretched-link">Magni Dolores</a></h4>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia</p>
                  <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>

               </div>
            </div><!-- End Service Item -->

            <div class="col-xl-3 col-md-6 d-flex aos-init aos-animate" data-aos="zoom-out" data-aos-delay="600">
               <div class="service-item position-relative">
                  <div class="icon"><i class="bi bi-star-fill icon"></i></div>
                  <h4><a href="" class="stretched-link">Nemo Enim</a></h4>
                  <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis</p>
                  <a href="" class="mt-2 d-block">Lire plus <i class="bi bi-arrow-right"></i> </a>

               </div>
            </div><!-- End Service Item -->
         </div>
      </div>
   </section>

   <section id="espace-vente" class="espace-vente bg-light mb-5">
      <div class="container" data-aos="fade-down">
         <div class="row espace vente">
            <div class="col-md-6 d-flex align-items-center">
               <div class="title" data-aos="slide-right">
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
      <div class="container aos-init aos-animate" data-aos="fade-up">
         <div class="row g-5">
            <div class="col-lg-12">
               <div class="row gy-4 posts-list">

                  <div class="col-lg-4" v-for="n in 3">
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
                                 Comments</span></li>
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

      <div class="container mt-0" data-aos="fade-up">
         <h3 class="w-100 text-primary fw-bold text-center mb-5 head-temo">Témoignages</h3>
         <div class="testimonials-slider swiper">
            <div class="swiper-wrapper">

               <div class="swiper-slide">
                  <div class="testimonial-item">
                     <img src="../assets/img/testimonials/testimonials-1.jpg" class="testimonial-img" alt="">
                     <h3>Saul Goodman</h3>
                     <h4>Ceo &amp; Founder</h4>
                     <div class="stars">
                        <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                           class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                     </div>
                     <p>
                        <i class="bi bi-quote quote-icon-left"></i>
                        Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus.
                        Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.
                        <i class="bi bi-quote quote-icon-right"></i>
                     </p>
                  </div>
               </div><!-- End testimonial item -->

               <div class="swiper-slide">
                  <div class="testimonial-item">
                     <img src="../assets/img/testimonials/testimonials-2.jpg" class="testimonial-img" alt="">
                     <h3>Sara Wilsson</h3>
                     <h4>Designer</h4>
                     <div class="stars">
                        <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                           class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                     </div>
                     <p>
                        <i class="bi bi-quote quote-icon-left"></i>
                        Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram
                        malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.
                        <i class="bi bi-quote quote-icon-right"></i>
                     </p>
                  </div>
               </div><!-- End testimonial item -->

               <div class="swiper-slide">
                  <div class="testimonial-item">
                     <img src="../assets/img/testimonials/testimonials-3.jpg" class="testimonial-img" alt="">
                     <h3>Jena Karlis</h3>
                     <h4>Store Owner</h4>
                     <div class="stars">
                        <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                           class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                     </div>
                     <p>
                        <i class="bi bi-quote quote-icon-left"></i>
                        Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim
                        tempor labore quem eram duis noster aute amet eram fore quis sint minim.
                        <i class="bi bi-quote quote-icon-right"></i>
                     </p>
                  </div>
               </div><!-- End testimonial item -->

               <div class="swiper-slide">
                  <div class="testimonial-item">
                     <img src="../assets/img/testimonials/testimonials-4.jpg" class="testimonial-img" alt="">
                     <h3>Matt Brandon</h3>
                     <h4>Freelancer</h4>
                     <div class="stars">
                        <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                           class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                     </div>
                     <p>
                        <i class="bi bi-quote quote-icon-left"></i>
                        Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit
                        minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.
                        <i class="bi bi-quote quote-icon-right"></i>
                     </p>
                  </div>
               </div><!-- End testimonial item -->

               <div class="swiper-slide">
                  <div class="testimonial-item">
                     <img src="../assets/img/testimonials/testimonials-5.jpg" class="testimonial-img" alt="">
                     <h3>John Larson</h3>
                     <h4>Entrepreneur</h4>
                     <div class="stars">
                        <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                           class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                     </div>
                     <p>
                        <i class="bi bi-quote quote-icon-left"></i>
                        Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim
                        culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum
                        quid.
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
      <div class="container" data-aos="zoom-out">
         <div class="clients-slider swiper">
            <div class="swiper-wrapper align-items-center">
               <div class="swiper-slide"><img src="../assets/img/clients/client-1.png" class="img-fluid" alt=""></div>
               <div class="swiper-slide"><img src="../assets/img/clients/client-2.png" class="img-fluid" alt=""></div>
               <div class="swiper-slide"><img src="../assets/img/clients/client-3.png" class="img-fluid" alt=""></div>
               <div class="swiper-slide"><img src="../assets/img/clients/client-4.png" class="img-fluid" alt=""></div>
               <div class="swiper-slide"><img src="../assets/img/clients/client-5.png" class="img-fluid" alt=""></div>
               <div class="swiper-slide"><img src="../assets/img/clients/client-6.png" class="img-fluid" alt=""></div>
               <div class="swiper-slide"><img src="../assets/img/clients/client-7.png" class="img-fluid" alt=""></div>
               <div class="swiper-slide"><img src="../assets/img/clients/client-8.png" class="img-fluid" alt=""></div>
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