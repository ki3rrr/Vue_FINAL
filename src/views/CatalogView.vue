<script setup>
import { computed, ref } from 'vue'
import { Search, SlidersHorizontal, LibraryBig } from 'lucide-vue-next'
import BookCard from '../components/BookCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { useAuth } from '../composables/useAuth'
import { useLibrary } from '../composables/useLibrary'

const { currentUser, isAdmin } = useAuth()
const { books, categories, requestBorrow } = useLibrary()
const search = ref('')
const category = ref('All categories')
const availability = ref('all')
const notice = ref('')
const noticeType = ref('success')
const bookToBorrow = ref(null)

const filteredBooks = computed(() => books.value.filter(book => {
  const term = search.value.trim().toLowerCase()
  const matchesText = !term || [book.title, book.author, book.category, book.isbn].some(value => String(value || '').toLowerCase().includes(term))
  const matchesCategory = category.value === 'All categories' || book.category === category.value
  const matchesAvailability = availability.value === 'all' || (availability.value === 'available' ? book.availableCopies > 0 : book.availableCopies === 0)
  return matchesText && matchesCategory && matchesAvailability
}))

function borrowBook(book) {
  if (!currentUser.value) {
    notice.value = 'Please log in before borrowing a book.'
    noticeType.value = 'error'
    return
  }
  bookToBorrow.value = book
}

function confirmBorrow() {
  if (!bookToBorrow.value || !currentUser.value) return
  const result = requestBorrow(bookToBorrow.value.id, currentUser.value.id)
  notice.value = result.message
  noticeType.value = result.ok ? 'success' : 'error'
  bookToBorrow.value = null
}
</script>

<template>
  <div class="page-heading"><div><p class="eyebrow">THE COLLECTION</p><h1>Book catalog</h1><p class="muted">Find something that sparks your curiosity.</p></div><div class="heading-meta"><LibraryBig :size="17" /> {{ books.length }} titles</div></div>
  <div v-if="notice" class="notice" :class="`notice-${noticeType}`" role="status"><span>{{ notice }}</span><button aria-label="Dismiss message" @click="notice = ''">×</button></div>
  <section class="catalog-toolbar panel">
    <label class="search-field"><Search :size="18" /><input v-model="search" placeholder="Search title, author, ISBN..." aria-label="Search books" /></label>
    <label class="filter-field"><SlidersHorizontal :size="17" /><select v-model="category" aria-label="Filter by category"><option>All categories</option><option v-for="item in categories" :key="item">{{ item }}</option></select></label>
    <select v-model="availability" class="availability-filter" aria-label="Filter by availability"><option value="all">All availability</option><option value="available">Available now</option><option value="unavailable">Currently unavailable</option></select>
  </section>
  <div class="catalog-summary"><span>Showing <strong>{{ filteredBooks.length }}</strong> of {{ books.length }} titles</span><span>Sorted by library collection</span></div>
  <section v-if="filteredBooks.length" class="book-grid">
    <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" :can-borrow="!isAdmin" @borrow="borrowBook" />
  </section>
  <EmptyState v-else title="No books match your search" message="Try another title, author, or category." />
  <div v-if="isAdmin" class="admin-tip"><strong>Admin view:</strong> Members can submit borrowing requests from this catalog. Manage inventory in <RouterLink to="/admin/books">Manage books</RouterLink>.</div>

  <Teleport to="body">
    <div v-if="bookToBorrow" class="modal-backdrop" @click.self="bookToBorrow = null" @keydown.esc="bookToBorrow = null">
      <section class="modal-panel borrow-confirm-panel" role="dialog" aria-modal="true" aria-labelledby="borrow-confirm-title">
        <div class="modal-header">
          <div>
            <p class="eyebrow">BORROW REQUEST</p>
            <h2 id="borrow-confirm-title">Confirm your book borrow</h2>
          </div>
          <button class="modal-close" type="button" aria-label="Close confirmation" @click="bookToBorrow = null">×</button>
        </div>
        <div class="borrow-confirm-book">
          <img v-if="bookToBorrow.cover" :src="bookToBorrow.cover" :alt="`Cover of ${bookToBorrow.title}`" />
          <div v-else class="borrow-confirm-cover-fallback"><LibraryBig :size="25" /></div>
          <div><strong>{{ bookToBorrow.title }}</strong><p>by {{ bookToBorrow.author }}</p><span>{{ bookToBorrow.availableCopies }} {{ bookToBorrow.availableCopies === 1 ? 'copy' : 'copies' }} available</span></div>
        </div>
        <p class="borrow-confirm-copy">Do you want to send a borrowing request for this book? You can cancel now if you changed your mind.</p>
        <div class="modal-actions">
          <button class="button button-secondary" type="button" @click="bookToBorrow = null">Cancel</button>
          <button class="button button-primary" type="button" @click="confirmBorrow">Yes, I Borrow</button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
