<script setup>
import { ref } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import BookComponent from '../components/book.vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const formations = ref([
   {
      title: "Cours & Formations"
   },
   {
      title: "Sécurité du compte"
   },
])

const handleLogout = async () => {
   await authStore.logout()
   router.push({ name: 'login' })
}

</script>


<template>
   <BreadcombsComponent title="Profile" />
   <div>
      <div class="container pt-5">
         <div class="profile-content mb-5">
            <div class="row d-flex justify-content-center">
               <div class="col-lg-10 col-md-12">
                  <div class="">
                     <div class="row align-items-center">
                        <div class="profile-img col-lg-3 col-md-4 col-sm-6 h-100">
                           <img src="../assets/img/portfolio/app-1.jpg" width="100%" alt="">
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 mt-4 px-3">
                           <div class="row">
                              <div class="col-md-6">
                                 <span><b>Nom:</b></span> <br>
                                 <p>Docvonou Luc</p>
                              </div>
                              <div class="col-md-6">
                                 <span><b>Prénom:</b></span> <br>
                                 <p>Docvonou Luc</p>
                              </div>
                              <div class="col-md-6">
                                 <span><b>Email:</b></span> <br>
                                 <p>Docvonou Luc</p>
                              </div>
                              <div class="col-md-6">
                                 <span><b>Contact:</b></span> <br>
                                 <p>Docvonou Luc</p>
                              </div>
                              <div class="col-md-6">
                                 <span><b>Statut:</b></span> <br>
                                 <p>Etudiant</p>
                              </div>
                              <div class="col-md-12 mt-3">
                                 <button @click="handleLogout" class="btn btn-outline-danger btn-sm">Se déconnecter</button>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div class="mt-5">
                        <ul class="nav nav-pills mb-3 sub-menu container" role="tablist">
                           <li class="py-0" v-for="(item, index) in formations" :key="index">
                              <a class="nav-link px-3 mx-0 my-0 text-secondary border-bottom border-2 rounded-0"
                                 :class="{ 'active': index == 0 }" data-bs-toggle="pill" :href="`#tab${index + 1}`"
                                 aria-selected="{{ (index==0) ? 'false':'' }}" role="tab" tabindex="-1">
                                 {{ item.title }}
                              </a>
                           </li>
                        </ul><!-- End Tabs -->
                     </div>

                     <!-- Tab Content -->
                     <div class="tab-content container p-0">
                        <div v-for="(item, index) in formations" :key="index" class="tab-pane fade p-0 m-0"
                           :class="{ 'active show': index == 0 }" :id="`tab${index + 1}`" role="tabpanel">
                           <div class="" v-if="index == 1">
                              <div class="px-5 mt-4">
                                 <h5 class="text-primary">Parametre du profil</h5>
                                 <form action="">
                                    <div class="row mt-4">
                                       <div class="col-lg-6 mb-3">
                                          <label for="nom" class="text-secondary">Nom de l'utilisateur</label>
                                          <input type="text" name="nom" id="nom" class="rounded-1 form-control">
                                       </div>
                                       <div class="col-lg-6 mb-3">
                                          <label for="prenom" class="text-secondary">Prénom de l'utilisateur</label>
                                          <input type="text" name="prenom" id="prenom" class="rounded-1 form-control">
                                       </div>
                                       <div class="col-lg-6 mb-3">
                                          <label for="email" class="text-secondary">Email de l'utilisateur</label>
                                          <input type="email" name="email" id="email" class="rounded-1 form-control"
                                             disabled>
                                       </div>
                                       <div class="col-lg-6 mb-3">
                                          <label for="contact" class="text-secondary">Contact de l'utilisateur</label>
                                          <input type="text" name="contact" id="contact" class="rounded-1 form-control">
                                       </div>
                                       <div>
                                          <button type="submit"
                                             class="btn bg-ps-primary text-white rounded-1">Modifier</button>
                                       </div>
                                    </div>
                                 </form>
                              </div>
                              <div class="px-5 mt-4">
                                 <h5 class="text-primary">Changer de mot de passe</h5>
                                 <form action="">
                                    <div class="row mt-4">
                                       <div class="col-lg-6 mb-3">
                                          <label for="nom" class="text-secondary">Ancien mot de passe</label>
                                          <input type="password" name="nom" id="nom" class="form-control">
                                       </div>
                                       <div class="col-lg-6 mb-3">
                                          <label for="prenom" class="text-secondary">Nouveau mot de passe</label>
                                          <input type="password" name="prenom" id="prenom" class="form-control">
                                       </div>
                                       <div class="col-lg-6 mb-3">
                                          <label for="email" class="text-secondary">Confirmer le nouveau mot de
                                             passe</label>
                                          <input type="email" name="email" id="email" class="form-control">
                                       </div>
                                       <div>
                                          <button type="submit"
                                             class="btn bg-ps-primary text-white rounded-1">Modifier</button>
                                       </div>
                                    </div>
                                 </form>
                              </div>
                              <div class="px-5 mt-4">
                                 <a href="#"><u>Modifier l'email du compte</u></a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
   </div>
</template>

<style scoped>
.profile {
   height: 50px;
}

.profile-img img {
   height: 100%;
   object-fit: cover;
}
/* 
.bg-ps-light {
   background-color: rgba(238, 238, 238, 0.233);
} */

.sub-menu .nav-link {
   background: rgb(236, 236, 236);
}

.sub-menu .nav-link:hover {
   background-color: #485664;
   border-radius: 0px;
   color: white !important;
}

.sub-menu .nav-link.active {
   background-color: #485664;
   border-radius: 0px;
   color: white !important;
}
</style>