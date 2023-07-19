<template>
   <div>
      <div class="breadcrumbs">
         <div class="container">

            <div class="d-flex justify-content-between align-items-center">
               <h2>{{ props.title }}</h2>

               <div class="d-flex flex-row-reverse">
                  <ol class="align-items-center">
                     <li><a href="index.html">Home</a></li>
                     <li>Portfolio Details</li>
                  </ol>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script setup>
const props = defineProps({
   title: String,
   link: Array
})
</script>
<style></style>