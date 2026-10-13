<script setup>
import { BookOpen } from 'lucide-vue-next'
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  message: { type: String, default: 'When there is something to show, it will appear here.' },
})
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon"><BookOpen :size="24" /></div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <slot />
  </div>
</template>
