<template>
  <div class="breadcrumbs">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center py-3">
        <h2>{{ title }}</h2>
        <div class="d-flex flex-row-reverse">
          <ol class="align-items-center">
            <li><router-link to="/">Accueil</router-link></li>
            <li v-for="(crumb, i) in breadcrumbs" :key="i">
              <router-link v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</router-link>
              <span v-else>{{ crumb.label }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  breadcrumbs: { type: Array, default: () => [] }
})

const formattedTitle = computed(() => {
  if (props.title) return props.title
  return ''
})
</script>
