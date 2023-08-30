<template>
   <div class="mb-4 book" data-aos="zoom-in" data-aos-delay="300">
      <router-link to="/e-book/detail" class="shadow">
         <div class="book-image">
            <img src="../assets/img/faq.jpg" alt="">
         </div>
         <div class="book-content mb-2 pb-3">
            <div class="book-title d-flex align-items-center justify-content-between py-2 px-3">
               <h6 class="m-0 text-secondary"><b>La pensée positive </b></h6>
               <div class="book-icon px-1 d-flex justify-content-center align-items-center rounded-circle">
                  <small>12 000 fcfa</small>
               </div>
            </div>
            <div class="px-3 book-paragraph">
               <small>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem earum
                  veritatis suscipit provident, totam, doloribus fugit aspernatur doloremque alias soluta
                  vitae omnis repudiandae impedit quos dolorem laudantium architecto sit odio.</small>
            </div>
         </div>
         <!--div class="book-footer d-flex justify-content-between px-3 py-2 border-top text-grey">
            <div class="book-evaluation">
               <div class="my-rating text-warning">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star"></i>
                  <i class="bi bi-star"></i>
                  <i class="bi bi-star"></i>
               </div>
            </div>
            <div class="book-download">
               <small>12 <i class="bi bi-download"></i></small>
            </div>
            <div class="book-author w-auto">
               <small class="w-auto"><i>Ecrit par <b class="text-ps-primary">Paul WARREN</b></i></small>
            </div>
         </div-->
      </router-link>
   </div>
</template>
<script>

</script>
<style scoped>
.book-image {
   height: 200px;
   overflow: hidden;
}

.book:hover {
   cursor: pointer;
}

.book-image:hover img,
.book:hover img {
   transform: scale(1.05);
   transition: .5s;
}

.book-image img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   transition: .5s;
}

.book-icon {
   margin-right: 10px;
   min-width: 40px !important;
   min-height: 40px !important;
   color: var(--color-primary);
   border-color: var(--color-primary);
   border: 2px solid var(--color-primary);
}

/* .text-ps-primary {
   color: var(--color-primary) !important;
}

.text-grey {
   color: rgb(133, 133, 133);
} */

.book-paragraph {
   -webkit-line-clamp: 2;
   display: -webkit-box;
   -webkit-box-orient: vertical;
   overflow: hidden;
   word-wrap: break-word;
}

.book-footer small {
   font-size: 13px;
}

.book-footer .book-evaluation {
   min-width: 100px;
}

.book-footer .book-download {
   min-width: 50px;
}

.book>a {
   color: black;
   display: block;
}
</style>