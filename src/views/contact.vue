<script setup>
import { ref } from 'vue'
import BreadcombsComponent from '../includes/breadcombs.vue'
import api from '../services/api'

const form = ref({
  nom: '',
  email: '',
  sujet: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')
const showModal = ref(false)

async function handleSubmit() {
  loading.value = true
  success.value = false
  error.value = ''
  try {
    await api.post('/contact', form.value)
    success.value = true
    form.value = { nom: '', email: '', sujet: '', message: '' }
    showModal.value = true
  } catch (e) {
    error.value = e.response?.data?.message || "Une erreur s'est produite."
  } finally {
    loading.value = false
  }
}

function closeModal() {
  showModal.value = false
}
</script>


<template>
   <BreadcombsComponent title="Notre Contact" />
   <div>
      <section id="contact" class="contact">
         <div class="container">

           <div class="section-header">
             <h2>Contactez Nous</h2>
           </div>

         </div>

         <div class="container mb-5">

           <div class="row gy-5 gx-lg-5">

             <div class="col-lg-4">

               <div class="info">
                 <h3>Get in touch</h3>
                 <p>Et id eius voluptates atque nihil voluptatem enim in tempore minima sit ad mollitia commodi minus.</p>

                 <div class="info-item d-flex">
                   <i class="bi bi-geo-alt flex-shrink-0"></i>
                   <div>
                     <h4>Location:</h4>
                     <p>A108 Adam Street, New York, NY 535022</p>
                   </div>
                 </div>

                 <div class="info-item d-flex">
                   <i class="bi bi-envelope flex-shrink-0"></i>
                   <div>
                     <h4>Email:</h4>
                     <p>info@example.com</p>
                   </div>
                 </div>

                 <div class="info-item d-flex">
                   <i class="bi bi-phone flex-shrink-0"></i>
                   <div>
                     <h4>Call:</h4>
                     <p>+1 5589 55488 55</p>
                   </div>
                 </div>

               </div>

             </div>

              <div class="col-lg-8">
                <form @submit.prevent="handleSubmit" method="post" role="form" class="php-email-form">
                  <div class="row">
                    <div class="col-md-6 form-group">
                      <input type="text" v-model="form.nom" class="form-control" id="name" placeholder="Your Name" required="">
                    </div>
                    <div class="col-md-6 form-group mt-3 mt-md-0">
                      <input type="email" v-model="form.email" class="form-control" name="email" id="email" placeholder="Your Email" required="">
                    </div>
                  </div>
                  <div class="form-group mt-3">
                    <input type="text" v-model="form.sujet" class="form-control" name="subject" id="subject" placeholder="Subject" required="">
                  </div>
                  <div class="form-group mt-3">
                    <textarea v-model="form.message" class="form-control" name="message" placeholder="Message" required=""></textarea>
                  </div>
                  <div class="my-3">
                    <div v-if="loading" class="loading">Loading</div>
                    <div v-if="error" class="error-message">{{ error }}</div>
                  </div>
                  <div class="text-center"><button type="submit" :disabled="loading">Send Message</button></div>
                </form>
              </div>

           </div>

         </div>

       </section>
   </div>

  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Message envoyé !</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <div class="success-icon mb-3">
              <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
            </div>
            <h4 class="mb-2">Merci pour votre message !</h4>
            <p class="text-muted mb-1">Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
            <p class="text-muted">Un accusé de réception vous a été envoyé par email.</p>
          </div>
          <div class="modal-footer justify-content-center border-0 pt-0">
            <button type="button" class="btn btn-primary px-4" @click="closeModal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-dialog {
  width: 100%;
  max-width: 480px;
  margin: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.success-icon {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

</style>
