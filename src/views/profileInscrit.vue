<script setup>
import { ref, onMounted } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import BookComponent from '../components/book.vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import defaultAvatar from '../assets/img/portfolio/app-1.jpg'

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

const form = ref({
   nom: '',
   prenom: '',
   telephone: '',
   adresse: ''
})

const photoFile = ref(null)
const photoPreview = ref(null)

const isLoading = ref(false)
const errors = ref({})
const successMessage = ref('')
const globalError = ref('')

onMounted(() => {
   if (authStore.user) {
      form.value.nom = authStore.user.nom || ''
      form.value.prenom = authStore.user.prenom || ''
      form.value.telephone = authStore.user.telephone || ''
      form.value.adresse = authStore.user.adresse || ''
      
      if (authStore.user.photo_profil_url) {
         photoPreview.value = authStore.user.photo_profil_url
      }
   }
})

const handleLogout = async () => {
   await authStore.logout()
   router.push({ name: 'login' })
}

const handleFileChange = (e) => {
   const file = e.target.files[0]
   if (file) {
      photoFile.value = file
      const reader = new FileReader()
      reader.onload = (e) => {
         photoPreview.value = e.target.result
      }
      reader.readAsDataURL(file)
   }
}

const handleUpdateProfile = async () => {
   errors.value = {}
   successMessage.value = ''
   globalError.value = ''
   isLoading.value = true
   
   try {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      if (form.value.nom) formData.append('nom', form.value.nom)
      if (form.value.prenom) formData.append('prenom', form.value.prenom)
      if (form.value.telephone) formData.append('telephone', form.value.telephone)
      if (form.value.adresse) formData.append('adresse', form.value.adresse)
      
      if (photoFile.value) {
         formData.append('photo', photoFile.value)
      }

      const response = await authService.updateProfile(formData)
      
      if (response.data) {
         authStore.user = response.data
         localStorage.setItem('user', JSON.stringify(response.data))
      }
      
      successMessage.value = "Votre profil a été mis à jour avec succès."
   } catch (error) {
      if (error.response && error.response.status === 422) {
         errors.value = error.response.data.errors || {}
      } else {
         globalError.value = "Une erreur s'est produite lors de la mise à jour."
      }
   } finally {
      isLoading.value = false
   }
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
                        <div class="profile-img col-lg-3 col-md-4 col-sm-6 h-100 position-relative">
                           <img :src="photoPreview || defaultAvatar" width="100%" alt="Photo de profil" style="border-radius: 8px;">
                           <div class="mt-2 text-center">
                              <label for="photoUpload" class="btn btn-sm btn-outline-secondary w-100">
                                 Changer la photo
                              </label>
                              <input type="file" id="photoUpload" class="d-none" accept="image/*" @change="handleFileChange">
                           </div>
                           <div v-if="errors.photo" class="text-danger small mt-1 text-center">{{ errors.photo[0] }}</div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 mt-4 px-3">
                           <div class="row">
                              <div class="col-md-6">
                                 <span><b>Nom:</b></span> <br>
                                 <p>{{ authStore.user?.nom || 'Non renseigné' }}</p>
                              </div>
                              <div class="col-md-6">
                                 <span><b>Prénom:</b></span> <br>
                                 <p>{{ authStore.user?.prenom || 'Non renseigné' }}</p>
                              </div>
                              <div class="col-md-6">
                                 <span><b>Email:</b></span> <br>
                                 <p>{{ authStore.user?.email || 'Non renseigné' }}</p>
                              </div>
                              <div class="col-md-6">
                                 <span><b>Contact:</b></span> <br>
                                 <p>{{ authStore.user?.telephone || 'Non renseigné' }}</p>
                              </div>
                              <div class="col-md-6">
                                 <span><b>Statut:</b></span> <br>
                                 <p class="text-capitalize">{{ authStore.user?.role || 'Utilisateur' }}</p>
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
                                 <h5 class="text-primary">Paramètre du profil</h5>
                                 
                                 <div v-if="successMessage" class="alert alert-success mt-3 py-2">
                                    {{ successMessage }}
                                 </div>
                                 <div v-if="globalError" class="alert alert-danger mt-3 py-2">
                                    {{ globalError }}
                                 </div>

                                 <form @submit.prevent="handleUpdateProfile">
                                    <div class="row mt-4">
                                       <div class="col-lg-6 mb-3">
                                          <label for="nom" class="text-secondary">Nom de l'utilisateur</label>
                                          <input type="text" id="nom" class="rounded-1 form-control" :class="{'is-invalid': errors.nom}" v-model="form.nom">
                                          <div class="invalid-feedback" v-if="errors.nom">{{ errors.nom[0] }}</div>
                                       </div>
                                       <div class="col-lg-6 mb-3">
                                          <label for="prenom" class="text-secondary">Prénom de l'utilisateur</label>
                                          <input type="text" id="prenom" class="rounded-1 form-control" :class="{'is-invalid': errors.prenom}" v-model="form.prenom">
                                          <div class="invalid-feedback" v-if="errors.prenom">{{ errors.prenom[0] }}</div>
                                       </div>
                                       <div class="col-lg-6 mb-3">
                                          <label for="email" class="text-secondary">Email de l'utilisateur</label>
                                          <input type="email" id="email" class="rounded-1 form-control" disabled :value="authStore.user?.email">
                                       </div>
                                       <div class="col-lg-6 mb-3">
                                          <label for="contact" class="text-secondary">Contact de l'utilisateur</label>
                                          <input type="text" id="contact" class="rounded-1 form-control" :class="{'is-invalid': errors.telephone}" v-model="form.telephone">
                                          <div class="invalid-feedback" v-if="errors.telephone">{{ errors.telephone[0] }}</div>
                                       </div>
                                       <div class="col-lg-12 mb-3">
                                          <label for="adresse" class="text-secondary">Adresse</label>
                                          <input type="text" id="adresse" class="rounded-1 form-control" :class="{'is-invalid': errors.adresse}" v-model="form.adresse">
                                          <div class="invalid-feedback" v-if="errors.adresse">{{ errors.adresse[0] }}</div>
                                       </div>
                                       <div class="col-lg-12">
                                          <button type="submit" class="btn bg-ps-primary text-white rounded-1" :disabled="isLoading">
                                             <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                             Modifier
                                          </button>
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