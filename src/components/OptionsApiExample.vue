<script>
import { auditMixin } from '../mixins/auditMixin'
export default {
  name: 'OptionsApiExample',
  mixins: [auditMixin],
  data() {
    return { show: false }
  },
  methods: {
    toggleExample() {
      this.show = !this.show
      this.recordAction(this.show ? 'Opened Options API example' : 'Closed Options API example')
    },
  },
}
</script>
<template>
  <section class="learning-note">
    <button class="learning-toggle" type="button" @click="toggleExample">
      <span><strong>Vue API learning corner</strong><small>Composition API, Options API, composables & mixins</small></span>
      <span class="learning-toggle-mark">{{ show ? '−' : '+' }}</span>
    </button>
    <div v-if="show" class="learning-content">
      <p><strong>Composition API:</strong> Used in <code>App.vue</code> and most components with <code>&lt;script setup&gt;</code>. It groups related state and logic together.</p>
      <p><strong>Options API:</strong> This small example uses <code>data()</code> and <code>methods</code> to organize component behavior.</p>
      <p><strong>Composable:</strong> <code>useLibrary()</code> shares book data and actions; <code>useToast()</code> shares notification logic.</p>
      <p><strong>Mixin:</strong> <code>auditMixin.js</code> adds a reusable action log to this Options API example. Prefer composables for most new Vue 3 code because dependencies are clearer.</p>
      <p class="last-action">Last example action: {{ lastAction }}</p>
    </div>
  </section>
</template>
