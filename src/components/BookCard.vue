<script setup>
import { BookOpen, CheckCircle2, CircleAlert } from 'lucide-vue-next'
defineProps({
  book: { type: Object, required: true },
  canBorrow: { type: Boolean, default: false },
})
defineEmits(['borrow'])
</script>

<template>
  <article class="book-card">
    <div class="book-cover-wrap">
      <img v-if="book.cover" class="book-cover" :src="book.cover" :alt="`Cover of ${book.title}`" loading="lazy" @error="$event.target.style.display='none'" />
      <div v-else class="book-cover-fallback"><BookOpen :size="34" /></div>
      <span class="cover-category">{{ book.category }}</span>
    </div>
    <div class="book-card-body">
      <div class="book-author">{{ book.author }}</div>
      <h3>{{ book.title }}</h3>
      <p class="book-description">{{ book.description }}</p>
      <div class="book-card-bottom">
        <span class="availability" :class="book.availableCopies > 0 ? 'available' : 'unavailable'">
          <CheckCircle2 v-if="book.availableCopies > 0" :size="14" />
          <CircleAlert v-else :size="14" />
          {{ book.availableCopies }} {{ book.availableCopies === 1 ? 'copy' : 'copies' }} available
        </span>
        <button v-if="canBorrow" class="button button-primary button-small" :disabled="book.availableCopies < 1" @click="$emit('borrow', book)">
          {{ book.availableCopies > 0 ? 'Borrow' : 'Unavailable' }}
        </button>
      </div>
    </div>
  </article>
</template>
