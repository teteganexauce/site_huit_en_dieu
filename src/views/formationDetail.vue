<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'


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

// TODO: Remplacer les données mockées par un appel API via formationService quand la route sera disponible
onMounted(() => {
   // formationsStore.fetchFormationDetail(id)
})

</script>


<template>
   <BreadcombsComponent title="Detail de la formation" />
   <div>
      <div class="">
         <!-- Tabs -->
         <!--div class="bg-ps-primary">
            <ul class="nav nav-pills mb-3 sub-menu container" role="tablist">

               <li class="py-0" v-for="(item, index) in formations" :key="index">
                  <a class="nav-link px-3 mx-0 my-0 text-white" :class="{ 'active': index == 0 }" data-bs-toggle="pill"
                     :href="`#tab${index + 1}`" aria-selected="{{ (index==0) ? 'false':'' }}" role="tab" tabindex="-1">
                     {{ item.title }}
                  </a>
               </li>

            </ul>
         </div-->

         <section id="blog" class="blog">
            <div class="container container-xxl  aos-init aos-animate" data-aos="fade-up">

               <div class="row g-5">

                  <div class="col-lg-12">

                     <article class="blog-details shadow-none p-0 ">
                        <div class="d-flex justify-content-between flex-wrap">
                           <div>
                              <h2 class="title mt-0 text-primary">Comment acquérir la pensée positive</h2>

                           <!--div class="post-img">
                              <img src="../assets/img/blog/blog-1.jpg" alt="" class="img-fluid">
                           </div-->

                           <div class="meta-top">
                              <ul>
                                 <li class="d-flex align-items-center"><i class="bi bi-clock"></i> <a
                                       href="blog-details.html"><time datetime="2020-01-01">3 mois</time></a></li>
                                 <li class="d-flex align-items-center"><i class="bi bi-calculator"></i> <a
                                       href="blog-details.html">20 000 fcfa</a></li>
                                 <li class="d-flex align-items-center"><i class="bi bi-person"></i> <a
                                       href="blog-details.html">John Doe</a></li>
                              </ul>
                           </div><!-- End meta top -->
                           </div>
                           <div>
                              <a href="#" class="btn btn-primary mt-4">Suivre cette formation</a>
                           </div>
                        </div>

                        <div class="content">
                           <p>
                              Similique neque nam consequuntur ad non maxime aliquam quas. Quibusdam animi praesentium.
                              Aliquam et laboriosam eius aut nostrum quidem aliquid dicta.
                              Et eveniet enim. Qui velit est ea dolorem doloremque deleniti aperiam unde soluta. Est cum et
                              quod quos aut ut et sit sunt. Voluptate porro consequatur assumenda perferendis dolore.
                           </p>

                           <p>
                              Sit repellat hic cupiditate hic ut nemo. Quis nihil sunt non reiciendis. Sequi in accusamus
                              harum vel aspernatur. Excepturi numquam nihil cumque odio. Et voluptate cupiditate.
                           </p>

                           <h3 class="mb-3">Et quae iure vel ut odit alias.</h3>
                           <div class="row justify-content-center d-flex">
                              <div class="accordion col-lg-9" id="accordionExample">
                                 <div class="accordion-item" v-for="n in 4">
                                    <h2 class="accordion-header rounded-1" id="headingOne">
                                       <button class="accordion-button shadow-none collapsed d-flex h-100 align-items-center" type="button" data-bs-toggle="collapse"
                                          :data-bs-target="`#collapse${n}`" aria-expanded="false" :aria-controls="`collapse${ n }`">
                                          
                                             <span
                                                class="number-list py-2 px-3 me-3 rounded-circle border border-primary">{{ n }}</span>
                                             <span class="text-module">Initiation à la pensée positive</span>
                                           </button>
                                    </h2>
                                    <div :id="`collapse${n}`" class="accordion-collapse collapse"
                                       :aria-labelledby="`heading${n}`" data-bs-parent="#accordionExample">
                                       <div class="accordion-body px-md-5">
                                          <ol type="i">
                                             <li class="mb-2" v-for="n in 6"><a href="#" class="px-2"><u>Informaton sur le cours</u></a></li>
                                          </ol>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                        </div><!-- End post content -->
                        <div class="d-flex justify-content-center d-md-none">
                                 <a href="#" class="btn btn-primary mt-4">Suivre cette formation</a>
                              </div>
                        <!-- End meta bottom -->

                     </article><!-- End blog post -->
                  </div>

                  <div class="col-lg-4 d-none">

                     <div class="sidebar">

                        <div class="sidebar-item search-form mb-3">
                           <div class="d-flex justify-content-center pt-2 pb-1">
                              <h5><b>Inscription</b></h5>
                           </div>
                        </div><!-- End sidebar search formn-->



                        <div class="sidebar-item recent-posts m-0">

                           <form action="forms/contact.php" method="post" role="form" class="php-email-form mt-4">
                              <div class="form-group">
                                 <input type="text" name="name" class="form-control rounded-1" id="name"
                                    placeholder="Your Name" required="">
                              </div>
                              <div class="form-group mt-3">
                                 <input type="email" class="form-control rounded-1" name="email" id="email"
                                    placeholder="Your Email" required="">
                              </div>
                              <div class="form-group mt-3">
                                 <input type="text" class="form-control rounded-1" name="telephone" id="subject"
                                    placeholder="Subject" required="">
                              </div>
                              <div class="form-group mt-3">
                                 <textarea class="form-control rounded-1" name="message" placeholder="Message"
                                    required=""></textarea>
                              </div>
                              <div class="my-3 d-none ">
                                 <div class="loading">Loading</div>
                                 <div class="error-message"></div>
                                 <div class="sent-message">Your message has been sent. Thank you!</div>
                              </div>
                              <div class="text-center mt-4"><button type="submit"
                                    class="btn rounded-1 text-white bg-primary">Send Message</button></div>
                           </form>

                        </div><!-- End sidebar recent posts-->

                        <!-- End sidebar tags-->

                     </div><!-- End Blog Sidebar -->

                  </div>
               </div>

            </div>
         </section>
      </div>
   </div>
</template>

<style scoped>
.accordion-button.collapsed {
   background-color: rgba(238, 238, 238, 0) !important;
}
.accordion-button, .accordion-button:hover {
   background-color: rgba(238, 238, 238, 0.363) !important;
}

.accordion-button .text-module{
   color: rgb(119, 119, 119) !important;
}
.accordion-button.collapsed .text-module{
   color: var(--ps-primary) !important;
}
/* .accordion-button::after {
   display: none !important;
} */

.search-form div {
   background-color: #485664;
   border-radius: 0px;
   color: white;
}

/* .bg-ps-light {
   background-color: rgba(238, 238, 238, 0.233);
} */

.w-30 {
   widows: 30% !important;
}

/* .text-grey {
   color: rgb(131, 131, 131);
} */

.formation:hover {
   cursor: pointer;
}</style>