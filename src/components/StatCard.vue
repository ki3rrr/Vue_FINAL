<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  note: { type: String, default: '' },
  icon: { type: Object, required: true },
  tone: { type: String, default: 'blue' },
})
</script>

<template>
  <article class="stat-card">
    <div class="stat-top"><span>{{ label }}</span><span class="stat-icon" :class="`tone-${tone}`"><component :is="icon" :size="19" /></span></div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-note">{{ note }}</div>
  </article>
</template>
