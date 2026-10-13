<script setup>
import { computed, ref } from 'vue'
import { ClipboardList, Check, X, RotateCcw, Search, CalendarClock } from 'lucide-vue-next'
import StatusBadge from '../components/StatusBadge.vue'
import EmptyState from '../components/EmptyState.vue'
import timestampMixin from '../mixins/timestampMixin'
import { useAuth } from '../composables/useAuth'
import { useLibrary } from '../composables/useLibrary'

const { currentUser, isAdmin, users } = useAuth()
const { books, borrowings, approveBorrow, rejectBorrow, returnBorrow, cancelRequest } = useLibrary()
const filter = ref('all')
const search = ref('')
const notice = ref('')
const noticeType = ref('success')

const visibleLoans = computed(() => {
  const base = isAdmin.value ? borrowings.value : borrowings.value.filter(item => item.userId === currentUser.value.id)
  return base.filter(loan => {
    const matchesStatus = filter.value === 'all' || loan.status === filter.value
    const book = books.value.find(item => item.id === loan.bookId)
    const member = users.value.find(item => item.id === loan.userId)
    const term = search.value.toLowerCase().trim()
    const matchesSearch = !term || [book?.title, book?.author, member?.name, member?.email].some(value => String(value || '').toLowerCase().includes(term))
    return matchesStatus && matchesSearch
  }).sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
})
const counts = computed(() => ({
  all: (isAdmin.value ? borrowings.value : borrowings.value.filter(item => item.userId === currentUser.value.id)).length,
  pending: (isAdmin.value ? borrowings.value : borrowings.value.filter(item => item.userId === currentUser.value.id)).filter(item => item.status === 'pending').length,
  approved: (isAdmin.value ? borrowings.value : borrowings.value.filter(item => item.userId === currentUser.value.id)).filter(item => item.status === 'approved').length,
  returned: (isAdmin.value ? borrowings.value : borrowings.value.filter(item => item.userId === currentUser.value.id)).filter(item => item.status === 'returned').length,
}))
function bookTitle(id) { return books.value.find(book => book.id === id)?.title ?? 'Book removed' }
function memberName(id) { return users.value.find(user => user.id === id)?.name ?? 'Unknown member' }
function dueDate(loan) {
  if (!loan.dueAt) return 'Set after approval'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(loan.dueAt))
}
function act(action, loan) {
  let result
  if (action === 'approve') result = approveBorrow(loan.id)
  if (action === 'reject') result = rejectBorrow(loan.id)
  if (action === 'return') result = returnBorrow(loan.id, isAdmin.value ? null : currentUser.value.id)
  if (action === 'cancel') result = cancelRequest(loan.id, currentUser.value.id)
  if (result?.ok) {
    const messages = { approve: 'Request approved. The due date is 14 days from approval.', reject: 'Request rejected.', return: 'Book marked as returned.', cancel: 'Pending request cancelled.' }
    showNotice(messages[action])
  } else showNotice(result?.message || 'Action could not be completed.', 'error')
}
function showNotice(message, type = 'success') { notice.value = message; noticeType.value = type }
</script>

<template>
  <div class="page-heading"><div><p class="eyebrow">{{ isAdmin ? 'ADMINISTRATION / CIRCULATION' : 'YOUR LIBRARY ACCOUNT' }}</p><h1>{{ isAdmin ? 'Borrow requests' : 'My borrowings' }}</h1><p class="muted">{{ isAdmin ? 'Review member requests and keep every loan accounted for.' : 'Track your requests, due dates, and reading history.' }}</p></div><div class="heading-meta"><ClipboardList :size="18" /> {{ counts.all }} records</div></div>
  <div v-if="notice" class="notice" :class="`notice-${noticeType}`" role="status"><span>{{ notice }}</span><button aria-label="Dismiss message" @click="notice = ''">×</button></div>
  <section class="loan-summary-grid"><button v-for="item in [{key:'all',label:'All records'},{key:'pending',label:'Pending'},{key:'approved',label:'Active loans'},{key:'returned',label:'Returned'}]" :key="item.key" class="loan-summary" :class="{ 'loan-summary-active': filter === item.key, 'loan-summary-pending-alert': isAdmin && item.key === 'pending' && counts.pending > 0 }" @click="filter = item.key"><span>{{ item.label }}</span><strong>{{ counts[item.key] }}</strong></button></section>
  <section class="panel table-panel">
    <div class="table-toolbar"><div><h2>Borrowing transactions</h2><p>Requests are approved or rejected by the admin.</p></div><label class="search-field table-search"><Search :size="17" /><input v-model="search" :placeholder="isAdmin ? 'Search book or member...' : 'Search your books...'" aria-label="Search borrowing records" /></label></div>
    <div v-if="visibleLoans.length" class="table-scroll"><table class="data-table loan-table">
      <thead><tr><th>Book / Member</th><th>Requested</th><th>Due date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody><tr v-for="loan in visibleLoans" :key="loan.id" :class="{ 'admin-new-request-row': isAdmin && loan.status === 'pending' }">
        <td><div class="loan-book-copy"><strong>{{ bookTitle(loan.bookId) }}</strong><small v-if="isAdmin">{{ memberName(loan.userId) }}</small><small v-else>Library borrowing request</small></div></td>
        <td>{{ formatDate(loan.requestedAt) }}</td><td><span :class="loan.status === 'approved' && loan.dueAt && new Date(loan.dueAt) < new Date() ? 'text-red' : ''">{{ dueDate(loan) }}</span></td>
        <td>
          <span v-if="isAdmin && loan.status === 'pending'" class="new-request-badge"><span class="new-request-dot"></span> NEW REQUEST</span>
          <StatusBadge v-else :status="loan.status" />
        </td>
        <td><div class="table-actions">
          <template v-if="isAdmin && loan.status === 'pending'"><button class="icon-button action-approve" title="Approve request" :aria-label="`Approve ${bookTitle(loan.bookId)}`" @click="act('approve', loan)"><Check :size="17" /></button><button class="icon-button action-delete" title="Reject request" :aria-label="`Reject ${bookTitle(loan.bookId)}`" @click="act('reject', loan)"><X :size="17" /></button></template>
          <button v-if="loan.status === 'approved'" class="button button-secondary button-small" @click="act('return', loan)"><RotateCcw :size="14" /> Return</button>
          <button v-if="!isAdmin && loan.status === 'pending'" class="button button-secondary button-small" @click="act('cancel', loan)">Cancel request</button>
          <span v-if="loan.status === 'returned'" class="muted tiny-text">Returned {{ formatDate(loan.returnedAt) }}</span>
          <span v-if="isAdmin && !['pending','approved'].includes(loan.status)" class="muted tiny-text">No action</span>
        </div></td>
      </tr></tbody>
    </table></div>
    <EmptyState v-else title="No transactions found" message="Try another status filter, or browse the catalog to request a book.">
      <RouterLink class="button button-primary button-small" to="/catalog">Browse catalog</RouterLink>
    </EmptyState>
  </section>
  <div class="policy-note"><CalendarClock :size="18" /><div><strong>Library borrowing policy</strong><p>Approved loans are due 14 days after approval. Members should visit the library room to collect an approved book and bring their student ID. Return a book through this page so its available copy count is updated. This classroom demo does not send email reminders.</p></div></div>
</template>

<script>
export default {
  mixins: [timestampMixin],
}
</script>
