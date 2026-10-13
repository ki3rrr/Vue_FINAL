<script setup>
import { computed, reactive, watch } from 'vue'
import { X, BookOpen, CalendarDays, UserRound, RotateCcw, BookMarked } from 'lucide-vue-next'
const props = defineProps({ open: Boolean, book: { type: Object, default: null }, borrowers: { type: Array, default: () => [] }, overdue: Boolean })
const emit = defineEmits(['close', 'borrow', 'return'])
const form = reactive({ borrower: '', dueDate: '' })
const today = new Date().toISOString().slice(0, 10)
const isBorrowed = computed(() => props.book?.status === 'Borrowed')
watch(() => [props.open, props.book], () => { form.borrower = ''; form.dueDate = '' })
function submitBorrow() {
  if (!form.borrower.trim() || !form.dueDate) return
  emit('borrow', { id: props.book.id, borrower: form.borrower.trim(), dueDate: form.dueDate })
}
</script>
<template>
  <div v-if="open && book" class="modal-backdrop" @click.self="emit('close')">
    <section class="modal-panel details-panel" role="dialog" aria-modal="true">
      <header class="modal-header"><div class="modal-heading-icon"><BookOpen :size="19" /></div><div><h2>Book details</h2><p>Catalog information and borrowing activity.</p></div><button class="icon-button" @click="emit('close')" aria-label="Close"><X :size="19" /></button></header>
      <div class="details-content">
        <div class="details-book-head"><div class="book-cover details-cover" :class="`cover-${book.cover || 'blue'}`"><BookOpen :size="32" /></div><div><span class="status-pill" :class="overdue ? 'status-overdue' : isBorrowed ? 'status-borrowed' : 'status-available'">{{ overdue ? 'Overdue' : book.status }}</span><h3>{{ book.title }}</h3><p>by {{ book.author }}</p></div></div>
        <p class="details-description">{{ book.description || 'No description has been added for this book yet.' }}</p>
        <div class="detail-grid"><div><span>Category</span><strong>{{ book.category }}</strong></div><div><span>Type</span><strong>{{ book.type }}</strong></div><div><span>Price</span><strong>{{ book.price ? `₱${Number(book.price).toLocaleString()}` : 'Free access' }}</strong></div><div><span>ISBN / Reference</span><strong>{{ book.isbn || 'Not provided' }}</strong></div></div>
        <div v-if="isBorrowed" class="borrow-record"><div><UserRound :size="16" /><span>Borrowed by</span><strong>{{ book.borrower }}</strong></div><div><CalendarDays :size="16" /><span>Due date</span><strong>{{ book.dueDate || 'Not set' }}</strong></div><button class="btn btn-primary full-button" @click="emit('return', book.id)"><RotateCcw :size="16" /> Mark as returned</button></div>
        <form v-else class="borrow-form" @submit.prevent="submitBorrow"><h3><BookMarked :size="17" /> Borrow this book</h3><label class="field">Borrower name<input v-model="form.borrower" list="borrower-options" placeholder="Enter student name" required /><datalist id="borrower-options"><option v-for="name in borrowers" :key="name" :value="name" /></datalist></label><label class="field">Due date<input v-model="form.dueDate" type="date" :min="today" required /></label><button class="btn btn-primary full-button" type="submit">Confirm borrowing</button></form>
      </div>
    </section>
  </div>
</template>
