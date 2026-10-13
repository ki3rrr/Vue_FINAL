<script setup>
defineProps({ label: String, value: [String, Number], detail: String, tone: { type: String, default: 'violet' }, icon: Object })
</script>
<template>
  <article class="metric-card">
    <div class="metric-top"><span>{{ label }}</span><span class="metric-icon" :class="`tone-${tone}`"><component :is="icon" :size="18" /></span></div>
    <div class="metric-value">{{ value }}</div>
    <div class="metric-detail">{{ detail }}</div>
  </article>
</template>
