<script setup>
import { ref } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import BookComponent from '../components/book.vue'

const categories = ref([
   {
      title: "Travaux de recherches"
   },
   {
      title: "Pensées quotidienne"
   },
   {
      title: "Réflexion sur les travaux de recherches"
   },
])

</script>


<template>
   <BreadcombsComponent title="Nos Publications" />
   <div>
      <div class="">
         <!-- Tabs -->
         <div class="bg-ps-primary">
            <ul class="nav nav-pills mb-3 sub-menu container" role="tablist">

               <li class="py-0" v-for="(item, index) in categories" :key="index">
                  <a class="nav-link px-3 mx-0 my-0 text-white" :class="{ 'active': index == $route.params.key }"
                     data-bs-toggle="pill" :href="`#tab${index + 1}`"
                     aria-selected="{{ (index==$route.params.key) ? 'false':'' }}" role="tab" tabindex="-1">
                     {{ item.title }}
                  </a>
               </li>
            </ul><!-- End Tabs -->
         </div>

         <!-- Tab Content -->
         <div class="tab-content container p-0">
            <div v-for="(item, index) in categories" :key="index" class="tab-pane fade p-0 m-0"
               :class="{ 'active show': index == $route.params.key }" :id="`tab${index + 1}`" role="tabpanel">
               <div class="d-flex mt-4 align-items-center justify-content-between">
                  <h3 class="text-secondary mb-0">{{ item.title }}</h3>
                  <div class="search">
                     <span class="bg-light py-2 px-3" data-bs-toggle="collapse" data-bs-target="#collapseExample"
                        aria-expanded="false" aria-controls="collapseExample"><i class="bi bi-search"></i></span>
                  </div>
               </div>
               <div>
                  <div class="collapse mt-4" id="collapseExample">
                     <form action="" class="d-flex">
                        <div class="w-100">
                           <input class="form-control rounded-1 shadow-none" type="text" name="search" id="search"
                              placeholder="Faites un recherche">
                        </div>
                        <div class="d-flex">
                           <button class="btn btn-primary mx-1 rounded-1" type="submit">Rechercher</button>
                           <button class="btn btn-danger rounded-1" type="reset">Annuler</button>
                        </div>
                     </form>
                  </div>
               </div>
               <section id="blog" class="blog mt-4 pt-4">
                  <div class="container aos-init aos-animate" data-aos="fade-up">
                     <div class="row g-5">
                        <div class="col-lg-12">
                           <div class="row gy-4 posts-list">

                              <div class="col-lg-4" v-for="n in 5">
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
                                       <li class="d-flex align-items-center small text-grey"><i
                                             class="bi bi-chat-dots"></i>&nbsp; <span href="blog-detspanils.html">12
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

.pub-title {
   -webkit-line-clamp: 2;
   display: -webkit-box;
   -webkit-box-orient: vertical;
   overflow: hidden;
   word-wrap: break-word;
}

.posts-list .content {
   -webkit-line-clamp: 3;
   display: -webkit-box;
   -webkit-box-orient: vertical;
   overflow: hidden;
   word-wrap: break-word;
}

/* .text-grey {
   color: rgb(131, 131, 131);
} */

.post-img img {
   max-height: 150px !important;
   object-fit: cover;
   transition: .5s;
   width: 100% !important;
}

.search span {
   cursor: pointer;
   transition: .3s;
}

.search span:hover {
   background-color: rgb(224, 224, 224) !important;
}

.post-img:hover img {
   transform: scale(1.05);
}
</style>