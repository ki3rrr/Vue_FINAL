<script setup>
import { reactive, computed, watch } from 'vue'
import { X, BookPlus } from 'lucide-vue-next'
const props = defineProps({ open: Boolean, book: { type: Object, default: null } })
const emit = defineEmits(['close', 'save'])
const blank = () => ({ title: '', author: '', category: 'UX Design', type: 'Physical', isbn: '', price: 0, language: 'English', cover: 'blue', description: '' })
const form = reactive(blank())
const errors = reactive({})
const isEditing = computed(() => Boolean(props.book))
watch(() => [props.open, props.book], () => {
  if (props.open) {
    Object.keys(form).forEach(key => { form[key] = props.book ? (props.book[key] ?? '') : blank()[key] })
    Object.keys(errors).forEach(key => delete errors[key])
  }
}, { immediate: true })
function validate() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (!form.title.trim()) errors.title = 'Book title is required.'
  if (!form.author.trim()) errors.author = 'Author name is required.'
  if (!form.category) errors.category = 'Choose a category.'
  if (form.price !== '' && Number(form.price) < 0) errors.price = 'Price cannot be negative.'
  return Object.keys(errors).length === 0
}
function submit() {
  if (!validate()) return
  emit('save', { ...form, title: form.title.trim(), author: form.author.trim(), price: Number(form.price) || 0 })
}
</script>
<template>
  <div v-if="open" class="modal-backdrop" @click.self="emit('close')" @keydown.esc="emit('close')">
    <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="book-form-title">
      <header class="modal-header"><div class="modal-heading-icon"><BookPlus :size="19" /></div><div><h2 id="book-form-title">{{ isEditing ? 'Edit book details' : 'Add a new book' }}</h2><p>Fill in the information for your library catalog.</p></div><button class="icon-button" @click="emit('close')" aria-label="Close"><X :size="19" /></button></header>
      <form class="book-form" @submit.prevent="submit">
        <label class="field full-field">Book title <span>*</span><input v-model="form.title" placeholder="e.g. The Design of Everyday Things" /><small v-if="errors.title" class="field-error">{{ errors.title }}</small></label>
        <label class="field">Author <span>*</span><input v-model="form.author" placeholder="Author name" /><small v-if="errors.author" class="field-error">{{ errors.author }}</small></label>
        <label class="field">Category <span>*</span><select v-model="form.category"><option>UX Design</option><option>Programming</option><option>Web Development</option><option>Design</option><option>Business</option><option>Marketing</option><option>Science</option><option>Literature</option><option>Other</option></select></label>
        <label class="field">Book type<select v-model="form.type"><option>Physical</option><option>Online</option></select></label>
        <label class="field">Price (₱)<input v-model="form.price" type="number" min="0" step="0.01" placeholder="0" /><small v-if="errors.price" class="field-error">{{ errors.price }}</small></label>
        <label class="field">ISBN / Reference<input v-model="form.isbn" placeholder="ISBN or ebook reference" /></label>
        <label class="field">Language<input v-model="form.language" placeholder="English" /></label>
        <label class="field full-field">Description<textarea v-model="form.description" rows="3" placeholder="What is this book about?"></textarea></label>
        <div class="modal-footer"><button type="button" class="btn btn-quiet" @click="emit('close')">Cancel</button><button type="submit" class="btn btn-primary">{{ isEditing ? 'Save changes' : 'Add book' }}</button></div>
      </form>
    </section>
  </div>
</template>
