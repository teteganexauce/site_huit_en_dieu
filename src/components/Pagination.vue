<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  itemsPerPage: { type: Number, default: 10 }
})

const emit = defineEmits(['update:currentPage'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const pages = computed(() => {
  const range = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= props.currentPage - 1 && i <= props.currentPage + 1)) {
      range.push(i)
    } else if (range[range.length - 1] !== '...') {
      range.push('...')
    }
  }
  return range
})

const changePage = (page) => {
  if (page === '...' || page === props.currentPage || page < 1 || page > totalPages.value) return
  emit('update:currentPage', page)
  
  // Optional: Scroll to top of the tab content smoothly
  window.scrollTo({ top: 300, behavior: 'smooth' })
}
</script>

<template>
  <nav v-if="totalPages > 1" class="mt-4" aria-label="Pagination">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Précédent</a>
      </li>
      
      <li 
        v-for="(page, index) in pages" 
        :key="index" 
        class="page-item" 
        :class="{ active: page === currentPage, disabled: page === '...' }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Suivant</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.page-link {
  color: var(--color-primary);
  border-radius: 8px;
  margin: 0 2px;
  border: none;
  font-weight: 500;
}
.page-item.active .page-link {
  background-color: var(--color-primary);
  color: #fff;
}
.page-item.disabled .page-link {
  color: #6c757d;
  background-color: transparent;
}
</style>
