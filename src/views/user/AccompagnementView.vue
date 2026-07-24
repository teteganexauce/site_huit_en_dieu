<template>
  <BreadcombsComponent title="Demande d'Accompagnement" />
  <main id="main" class="bg-white">

    <section class="accompagnement-section pt-3 pb-5 bg-white">
      <div class="container" data-aos="fade-up">
        
        <div class="row g-0 rounded-4 shadow-lg overflow-hidden bg-white">
          <!-- Partie Informations (Gauche) -->
          <div class="col-lg-5 bg-primary text-white p-5 d-flex flex-column justify-content-center">
            <h3 class="fw-bold mb-4">Laissez-nous vous accompagner</h3>
            <p class="mb-4 text-white-50">
              Notre équipe d'experts et de guides est prête à vous écouter et à vous fournir l'assistance dont vous avez besoin.
            </p>
            
            <div class="d-flex align-items-start mb-4">
              <div class="icon-box bg-white rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-heart-fill text-primary fs-4"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-1">Spirituel</h5>
                <p class="text-white-50 small mb-0">Retrouvez la paix intérieure et grandissez dans votre foi.</p>
              </div>
            </div>

            <div class="d-flex align-items-start mb-4">
              <div class="icon-box bg-white rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-mortarboard-fill text-primary fs-4"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-1">Formation</h5>
                <p class="text-white-50 small mb-0">Un encadrement adapté pour réussir votre parcours académique.</p>
              </div>
            </div>

            <div class="d-flex align-items-start">
              <div class="icon-box bg-white rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-search text-primary fs-4"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-1">Recherche</h5>
                <p class="text-white-50 small mb-0">Des conseils pointus pour vos mémoires, thèses et articles.</p>
              </div>
            </div>
          </div>

          <!-- Formulaire (Droite) -->
          <div class="col-lg-7 p-5">
            <h4 class="fw-bold mb-4 text-dark">Remplissez votre demande</h4>

            <div v-if="successMessage" class="alert alert-success d-flex align-items-center" role="alert">
              <i class="bi bi-check-circle-fill me-2 fs-5"></i>
              <div>{{ successMessage }}</div>
            </div>
            
            <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>{{ errorMessage }}</div>
            </div>

            <form @submit.prevent="submitDemande" class="needs-validation" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select id="type" v-model="form.type" class="form-select" :class="{ 'is-invalid': errors.type }" required>
                      <option value="" disabled selected>Choisir...</option>
                      <option value="spirituel">Spirituel</option>
                      <option value="formation">Formation</option>
                      <option value="recherche">Recherche</option>
                      <option value="autre">Autre</option>
                    </select>
                    <label for="type">Type d'accompagnement *</label>
                    <div class="invalid-feedback" v-if="errors.type">{{ errors.type[0] }}</div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="tel" id="telephone" v-model="form.telephone" class="form-control" :class="{ 'is-invalid': errors.telephone }" placeholder="Téléphone" required>
                    <label for="telephone">Numéro de téléphone *</label>
                    <div class="invalid-feedback" v-if="errors.telephone">{{ errors.telephone[0] }}</div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input type="text" id="titre" v-model="form.titre" class="form-control" :class="{ 'is-invalid': errors.titre }" placeholder="Sujet" required>
                    <label for="titre">Sujet de votre demande *</label>
                    <div class="invalid-feedback" v-if="errors.titre">{{ errors.titre[0] }}</div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-floating mb-4">
                    <textarea id="description" v-model="form.description" class="form-control" :class="{ 'is-invalid': errors.description }" placeholder="Description" style="height: 150px" required></textarea>
                    <label for="description">Décrivez votre besoin en détail... *</label>
                    <div class="invalid-feedback" v-if="errors.description">{{ errors.description[0] }}</div>
                  </div>
                </div>

                <div class="col-12 text-end mt-2">
                  <button type="submit" class="btn btn-primary btn-lg px-5 rounded-pill" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-send me-2"></i> Envoyer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import accompagnementService from '@/services/accompagnementService';
import { useAuthStore } from '@/stores/auth';
import BreadcombsComponent from '@/includes/breadcombs.vue';

export default {
  name: 'AccompagnementView',
  components: {
    BreadcombsComponent
  },
  setup() {
    const authStore = useAuthStore();
    
    const form = ref({
      type: '',
      titre: '',
      description: '',
      telephone: authStore.user?.telephone || ''
    });

    const errors = ref({});
    const isSubmitting = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');


    const submitDemande = async () => {
      isSubmitting.value = true;
      errors.value = {};
      successMessage.value = '';
      errorMessage.value = '';

      try {
        await accompagnementService.soumettreDemande(form.value);
        successMessage.value = 'Votre demande d\'accompagnement a été soumise avec succès.';
        
        // Mettre à jour le téléphone localement si changé
        if (authStore.user && authStore.user.telephone !== form.value.telephone) {
          authStore.user.telephone = form.value.telephone;
          localStorage.setItem('user', JSON.stringify(authStore.user));
        }

        // Reset form
        form.value = { type: '', titre: '', description: '', telephone: authStore.user?.telephone || '' };
      } catch (err) {
        if (err.errors) {
          errors.value = err.errors;
        } else {
          errorMessage.value = err.message || 'Une erreur est survenue lors de la soumission de votre demande.';
        }
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      form,
      errors,
      isSubmitting,
      successMessage,
      errorMessage,
      submitDemande
    };
  }
};
</script>

<style scoped>
.accompagnement-section {
  padding-bottom: 60px;
}
</style>
