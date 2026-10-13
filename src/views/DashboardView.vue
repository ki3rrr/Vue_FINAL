<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BookOpen, BookMarked, Clock3, Users, ArrowUpRight, LibraryBig, ClipboardCheck } from 'lucide-vue-next'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import EmptyState from '../components/EmptyState.vue'
import { useAuth } from '../composables/useAuth'
import { useLibrary } from '../composables/useLibrary'

const { currentUser, isAdmin, users } = useAuth()
const { books, borrowings, availableBooks } = useLibrary()
const myBorrowings = computed(() => borrowings.value.filter(item => item.userId === currentUser.value?.id))
const recentLoans = computed(() => (isAdmin.value ? borrowings.value : myBorrowings.value).slice(0, 5))
const activeLoans = computed(() => borrowings.value.filter(item => item.status === 'approved').length)
const pendingCount = computed(() => borrowings.value.filter(item => item.status === 'pending').length)
const totalCopies = computed(() => books.value.reduce((sum, book) => sum + book.totalCopies, 0))
const greeting = computed(() => {
  const hour = new Date().getHours()
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
})
function bookTitle(id) { return books.value.find(book => book.id === id)?.title ?? 'Book removed' }
function userName(id) { return users.value.find(user => user.id === id)?.name ?? 'Unknown member' }
function formatDate(value) { return value ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) : '—' }
</script>

<template>
  <div class="page-heading">
    <div><p class="eyebrow">{{ isAdmin ? 'LIBRARY OVERVIEW' : 'YOUR READING SPACE' }}</p><h1>{{ greeting }}, {{ currentUser.name.split(' ')[0] }} <span class="wave">✦</span></h1><p class="muted">{{ isAdmin ? 'Here is what is happening across your library today.' : 'Ready to find your next great read? Your library is waiting.' }}</p></div>
    <RouterLink class="button button-primary" to="/catalog"><BookOpen :size="17" /> Explore catalog</RouterLink>
  </div>

  <section v-if="isAdmin" class="welcome-banner">
    <div class="banner-copy"><span class="banner-label">LIBRARY ADMINISTRATION</span><h2>Every great library starts with a great collection.</h2><p>Manage your collection, respond to requests, and keep readers moving to their next chapter.</p><div class="banner-links"><RouterLink to="/admin/books">Manage collection <ArrowUpRight :size="15" /></RouterLink><RouterLink to="/borrowings">Review requests <ArrowUpRight :size="15" /></RouterLink></div></div>
    <div class="banner-illustration"><div class="banner-circle"><BookOpen :size="56" /></div><span class="floating-book floating-a"><BookMarked :size="22" /></span><span class="floating-book floating-b"><LibraryBig :size="22" /></span></div>
  </section>
  <section v-else class="member-banner">
    <div><p class="banner-label">YOUR LIBRARY, YOUR JOURNEY</p><h2>One more chapter can change everything.</h2><p>Browse a new subject, revisit a classic, or discover a book recommended by another reader.</p></div>
    <div class="member-banner-action"><span>{{ availableBooks.length }} books ready to explore</span><RouterLink to="/catalog" class="button button-light">Find a book <ArrowUpRight :size="16" /></RouterLink></div>
  </section>

  <section class="stats-grid">
    <StatCard v-if="isAdmin" label="Titles in catalog" :value="books.length" note="Unique book records" :icon="BookOpen" tone="blue" />
    <StatCard v-else label="Titles to explore" :value="books.length" note="Across all categories" :icon="BookOpen" tone="blue" />
    <StatCard label="Copies available" :value="availableBooks.reduce((sum, book) => sum + book.availableCopies, 0)" note="Ready to be borrowed" :icon="BookMarked" tone="green" />
    <StatCard :label="isAdmin ? 'Active loans' : 'Your active loans'" :value="isAdmin ? activeLoans : myBorrowings.filter(item => item.status === 'approved').length" note="Currently with readers" :icon="ClipboardCheck" tone="violet" />
    <StatCard v-if="isAdmin" label="Pending requests" :value="pendingCount" note="Awaiting your review" :icon="Clock3" tone="amber" />
    <StatCard v-else label="Your requests" :value="myBorrowings.filter(item => item.status === 'pending').length" note="Waiting for approval" :icon="Clock3" tone="amber" />
  </section>

  <div class="dashboard-columns">
    <section class="panel recent-panel">
      <div class="section-heading"><div><h2>{{ isAdmin ? 'Recent borrowing activity' : 'Your recent activity' }}</h2><p>Keep up with the latest library transactions.</p></div><RouterLink to="/borrowings" class="text-link">View all <ArrowUpRight :size="15" /></RouterLink></div>
      <div v-if="recentLoans.length" class="table-scroll">
        <table class="data-table">
          <thead><tr><th>Book</th><th v-if="isAdmin">Member</th><th>Status</th><th>Date</th></tr></thead>
          <tbody><tr v-for="loan in recentLoans" :key="loan.id"><td><strong>{{ bookTitle(loan.bookId) }}</strong></td><td v-if="isAdmin">{{ userName(loan.userId) }}</td><td><StatusBadge :status="loan.status" /></td><td>{{ formatDate(loan.requestedAt) }}</td></tr></tbody>
        </table>
      </div>
      <EmptyState v-else title="No borrowing activity yet" message="Book requests and loans will appear here." />
    </section>
    <section class="panel quick-panel">
      <div class="section-heading"><div><h2>Quick actions</h2><p>Jump straight into your next task.</p></div></div>
      <RouterLink class="quick-action" to="/catalog"><span class="quick-icon quick-blue"><LibraryBig :size="18" /></span><span><strong>Browse catalog</strong><small>Discover available titles</small></span><ArrowUpRight :size="16" /></RouterLink>
      <RouterLink v-if="isAdmin" class="quick-action" to="/admin/books"><span class="quick-icon quick-green"><BookMarked :size="18" /></span><span><strong>Add or edit books</strong><small>Maintain your collection</small></span><ArrowUpRight :size="16" /></RouterLink>
      <RouterLink v-if="isAdmin" class="quick-action" to="/admin/members"><span class="quick-icon quick-violet"><Users :size="18" /></span><span><strong>Member directory</strong><small>{{ users.filter(user => user.role === 'member').length }} registered members</small></span><ArrowUpRight :size="16" /></RouterLink>
      <RouterLink class="quick-action" to="/borrowings"><span class="quick-icon quick-amber"><Clock3 :size="18" /></span><span><strong>{{ isAdmin ? 'Review borrow requests' : 'My borrowing history' }}</strong><small>{{ isAdmin ? `${pendingCount} requests need attention` : 'Check statuses and due dates' }}</small></span><ArrowUpRight :size="16" /></RouterLink>
    </section>
  </div>
  <p class="dashboard-footnote"><BookOpen :size="15" /> {{ totalCopies }} physical copies tracked across your library collection.</p>
</template>
