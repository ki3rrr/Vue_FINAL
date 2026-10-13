<script setup>
import { computed, ref } from 'vue'
import { BookOpen, Plus, Search, Pencil, Trash2, PackageOpen } from 'lucide-vue-next'
import BookForm from '../components/BookForm.vue'
import EmptyState from '../components/EmptyState.vue'
import { useLibrary } from '../composables/useLibrary'

const { books, createBook, updateBook, deleteBook } = useLibrary()
const search = ref('')
const modalOpen = ref(false)
const editingBook = ref(null)
const notice = ref('')
const noticeType = ref('success')
const filteredBooks = computed(() => books.value.filter(book => [book.title, book.author, book.category, book.isbn].some(value => String(value || '').toLowerCase().includes(search.value.toLowerCase().trim()))))
const copyCount = computed(() => books.value.reduce((sum, book) => sum + book.totalCopies, 0))
const availableCount = computed(() => books.value.reduce((sum, book) => sum + book.availableCopies, 0))

function openCreate() { editingBook.value = null; modalOpen.value = true }
function openEdit(book) { editingBook.value = { ...book }; modalOpen.value = true }
function saveBook(payload) {
  if (editingBook.value) {
    const result = updateBook(editingBook.value.id, payload)
    if (!result.ok) { showNotice(result.message, 'error'); return }
    showNotice('Book details updated.')
  } else {
    createBook(payload)
    showNotice('New book added to the collection.')
  }
  modalOpen.value = false
}
function removeBook(book) {
  if (!window.confirm(`Delete "${book.title}" from the catalog?`)) return
  const result = deleteBook(book.id)
  showNotice(result.ok ? 'Book deleted from the catalog.' : result.message, result.ok ? 'success' : 'error')
}
function showNotice(message, type = 'success') { notice.value = message; noticeType.value = type }
</script>

<template>
  <div class="page-heading"><div><p class="eyebrow">ADMINISTRATION / INVENTORY</p><h1>Manage books</h1><p class="muted">Keep the catalog accurate and your shelves organized.</p></div><button class="button button-primary" @click="openCreate"><Plus :size="17" /> Add a book</button></div>
  <div v-if="notice" class="notice" :class="`notice-${noticeType}`" role="status"><span>{{ notice }}</span><button aria-label="Dismiss message" @click="notice = ''">×</button></div>
  <div class="mini-stats-grid"><div class="mini-stat"><span>Total titles</span><strong>{{ books.length }}</strong></div><div class="mini-stat"><span>Total copies</span><strong>{{ copyCount }}</strong></div><div class="mini-stat"><span>Available copies</span><strong>{{ availableCount }}</strong></div><div class="mini-stat"><span>Checked out</span><strong>{{ copyCount - availableCount }}</strong></div></div>
  <section class="panel table-panel">
    <div class="table-toolbar"><div><h2>Library inventory</h2><p>{{ filteredBooks.length }} records found</p></div><label class="search-field table-search"><Search :size="17" /><input v-model="search" placeholder="Search inventory..." aria-label="Search inventory" /></label></div>
    <div v-if="filteredBooks.length" class="table-scroll"><table class="data-table inventory-table">
      <thead><tr><th>Book / Author</th><th>Category</th><th>ISBN</th><th>Copies</th><th>Available</th><th>Actions</th></tr></thead>
      <tbody><tr v-for="book in filteredBooks" :key="book.id">
        <td><div class="table-book"><img v-if="book.cover" :src="book.cover" :alt="''" @error="$event.target.style.display='none'" /><div class="table-book-copy"><strong>{{ book.title }}</strong><small>{{ book.author }} · {{ book.year }}</small></div></div></td>
        <td><span class="category-pill">{{ book.category }}</span></td><td class="isbn-cell">{{ book.isbn || '—' }}</td><td>{{ book.totalCopies }}</td><td><span :class="book.availableCopies ? 'text-green' : 'text-red'">{{ book.availableCopies }}</span></td>
        <td><div class="table-actions"><button class="icon-button action-edit" :aria-label="`Edit ${book.title}`" title="Edit book" @click="openEdit(book)"><Pencil :size="16" /></button><button class="icon-button action-delete" :aria-label="`Delete ${book.title}`" title="Delete book" @click="removeBook(book)"><Trash2 :size="16" /></button></div></td>
      </tr></tbody>
    </table></div>
    <EmptyState v-else title="No matching books" message="Try a different search or add a new book."><button class="button button-primary button-small" @click="openCreate">Add a book</button></EmptyState>
  </section>
  <div class="admin-tip"><PackageOpen :size="17" /> <span>Inventory rule: available copies are updated when requests are approved and when books are returned. Books with active requests or loans cannot be deleted.</span></div>
  <BookForm v-if="modalOpen" :book="editingBook" @save="saveBook" @cancel="modalOpen = false" />
</template>
