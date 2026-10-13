<script setup>
import { reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  book: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])
const form = reactive({
  title: '', author: '', category: 'Fiction', isbn: '', year: new Date().getFullYear(),
  totalCopies: 1, description: '', cover: '',
})
const categories = ['Fiction', 'Fantasy', 'Technology', 'Personal Growth', 'Finance', 'Design', 'History', 'Science', 'Education', 'Other']

watch(() => props.book, (book) => {
  Object.assign(form, {
    title: book?.title ?? '',
    author: book?.author ?? '',
    category: book?.category ?? 'Fiction',
    isbn: book?.isbn ?? '',
    year: book?.year ?? new Date().getFullYear(),
    totalCopies: book?.totalCopies ?? 1,
    description: book?.description ?? '',
    cover: book?.cover ?? '',
  })
}, { immediate: true })

function submitForm() {
  emit('save', {
    title: form.title.trim(), author: form.author.trim(), category: form.category,
    isbn: form.isbn.trim(), year: Number(form.year), totalCopies: Number(form.totalCopies),
    description: form.description.trim(), cover: form.cover.trim(),
  })
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <section class="modal-panel" role="dialog" aria-modal="true" :aria-label="book ? 'Edit book' : 'Add book'">
      <div class="modal-header">
        <div><p class="eyebrow">LIBRARY INVENTORY</p><h2>{{ book ? 'Edit book details' : 'Add a new book' }}</h2></div>
        <button class="icon-button" aria-label="Close form" @click="$emit('cancel')"><X :size="19" /></button>
      </div>
      <form class="form-grid" @submit.prevent="submitForm">
        <label class="field field-wide">Book title<input v-model="form.title" required maxlength="120" placeholder="e.g. The Great Gatsby" /></label>
        <label class="field">Author<input v-model="form.author" required maxlength="100" placeholder="Author name" /></label>
        <label class="field">Category
          <select v-model="form.category" required>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </label>
        <label class="field">ISBN<input v-model="form.isbn" maxlength="24" placeholder="ISBN / catalog code" /></label>
        <label class="field">Publication year<input v-model.number="form.year" type="number" min="1000" :max="new Date().getFullYear() + 1" required /></label>
        <label class="field">Total copies<input v-model.number="form.totalCopies" type="number" min="0" max="10000" required /></label>
        <label class="field field-wide">Cover image URL (optional)<input v-model="form.cover" type="url" placeholder="https://example.com/book-cover.jpg" /></label>
        <label class="field field-wide">Description<textarea v-model="form.description" rows="3" maxlength="600" placeholder="A short description of the book..." /></label>
        <div class="form-note field-wide">When editing, the number of copies currently on loan is protected automatically.</div>
        <div class="modal-actions field-wide">
          <button type="button" class="button button-secondary" @click="$emit('cancel')">Cancel</button>
          <button type="submit" class="button button-primary">{{ book ? 'Save changes' : 'Add book' }}</button>
        </div>
      </form>
    </section>
  </div>
</template>
