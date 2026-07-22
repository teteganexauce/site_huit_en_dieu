<template>
  <div>
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-bottom">
            <h5 class="modal-title fw-bold">{{ isEditing ? 'Modifier l\'article' : 'Nouvel Article' }}</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          
          <form @submit.prevent="handleSubmit">
            <div class="modal-body p-4">
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
              
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-bold small">Titre *</label>
                  <input type="text" class="form-control" v-model="form.titre" :class="{'is-invalid': errors.titre}" required>
                  <div class="invalid-feedback" v-if="errors.titre">{{ errors.titre[0] }}</div>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label fw-bold small">Type de publication *</label>
                  <select class="form-select" v-model="form.type" :class="{'is-invalid': errors.type}" required>
                  <option value="">Sélectionnez un type</option>
                  <option value="article">Article</option>
                  <option value="livre">Livre</option>
                  <option value="these">Thèse</option>
                  <option value="video">Vidéo</option>
                  <option value="audio">Audio</option>
                </select>
                  <div class="invalid-feedback" v-if="errors.type">{{ errors.type[0] }}</div>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label fw-bold small">Mots-clés</label>
                  <input type="text" class="form-control" v-model="form.motsCles" placeholder="Séparés par des virgules">
                </div>
                
                <div class="col-12">
                  <label class="form-label fw-bold small">Résumé *</label>
                  <textarea class="form-control" v-model="form.resume" rows="4" :class="{'is-invalid': errors.resume}" required></textarea>
                  <div class="invalid-feedback" v-if="errors.resume">{{ errors.resume[0] }}</div>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label fw-bold small">Document (PDF)</label>
                  <input type="file" class="form-control" accept=".pdf" @change="handleFileChange" :class="{'is-invalid': errors.fichier}">
                  <div class="invalid-feedback" v-if="errors.fichier">{{ errors.fichier[0] }}</div>
                  <small class="text-muted" v-if="isEditing">Laissez vide pour conserver l'actuel.</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold small">Lien externe (URL)</label>
                  <input type="url" class="form-control" v-model="form.lien_externe" placeholder="https://..." :class="{'is-invalid': errors.lien_externe}">
                  <div class="invalid-feedback" v-if="errors.lien_externe">{{ errors.lien_externe[0] }}</div>
                </div>
                
                <div class="col-md-12">
                  <label class="form-label fw-bold small">Photo de couverture (Optionnel)</label>
                  <input type="file" class="form-control" accept="image/*" @change="handleImageChange" :class="{'is-invalid': errors.image}">
                  <div class="invalid-feedback" v-if="errors.image">{{ errors.image[0] }}</div>
                  <small class="text-muted" v-if="isEditing">Laissez vide pour conserver l'image actuelle.</small>
                </div>
              </div>
            </div>
            
            <div class="modal-footer border-top bg-light">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">Annuler</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                {{ isEditing ? 'Mettre à jour' : 'Créer l\'article' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const errors = ref({})
const file = ref(null)
const imageFile = ref(null)

const form = ref({
  titre: '',
  type: '',
  resume: '',
  motsCles: '',
  lien_externe: ''
})

onMounted(() => {
  if (props.article) {
    isEditing.value = true
    form.value.titre = props.article.titre || ''
    form.value.type = props.article.type || ''
    form.value.resume = props.article.resume || ''
    form.value.motsCles = props.article.motsCles || ''
    form.value.lien_externe = props.article.lien_externe || ''
  }
})

const handleFileChange = (e) => {
  if (e.target.files.length > 0) {
    file.value = e.target.files[0]
  }
}

const handleImageChange = (e) => {
  if (e.target.files.length > 0) {
    imageFile.value = e.target.files[0]
  }
}

const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('titre', form.value.titre)
  formData.append('type', form.value.type)
  formData.append('resume', form.value.resume)
  if (form.value.motsCles) formData.append('motsCles', form.value.motsCles)
  if (form.value.lien_externe) formData.append('lien_externe', form.value.lien_externe)
  
  if (file.value) {
    formData.append('fichierUrl', file.value)
  }
  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }
  
  emit('save', formData, props.article?.id)
}
</script>
