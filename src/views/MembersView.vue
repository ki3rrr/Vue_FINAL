<script setup>
import { computed, ref } from 'vue'
import { Search, Users, Mail, CalendarDays } from 'lucide-vue-next'
import EmptyState from '../components/EmptyState.vue'
import { useAuth } from '../composables/useAuth'
import { useLibrary } from '../composables/useLibrary'

const { users } = useAuth()
const { borrowings } = useLibrary()
const search = ref('')
const members = computed(() => users.value.filter(user => user.role === 'member').filter(user => [user.name, user.email].some(value => value.toLowerCase().includes(search.value.toLowerCase().trim()))))
function memberLoans(id) { return borrowings.value.filter(loan => loan.userId === id && ['approved', 'pending'].includes(loan.status)).length }
function memberHistory(id) { return borrowings.value.filter(loan => loan.userId === id).length }
function formatDate(value) { return value ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) : '—' }
</script>

<template>
  <div class="page-heading"><div><p class="eyebrow">ADMINISTRATION / COMMUNITY</p><h1>Library members</h1><p class="muted">A directory of readers registered with Book Library System.</p></div><div class="heading-meta"><Users :size="18" /> {{ members.length }} members</div></div>
  <div class="mini-stats-grid member-stats"><div class="mini-stat"><span>Registered members</span><strong>{{ members.length }}</strong></div><div class="mini-stat"><span>Currently borrowing / pending</span><strong>{{ members.reduce((sum, member) => sum + memberLoans(member.id), 0) }}</strong></div><div class="mini-stat"><span>Total recorded transactions</span><strong>{{ borrowings.length }}</strong></div></div>
  <section class="panel table-panel"><div class="table-toolbar"><div><h2>Member directory</h2><p>Member accounts are created from the registration page.</p></div><label class="search-field table-search"><Search :size="17" /><input v-model="search" placeholder="Search members..." aria-label="Search members" /></label></div>
    <div v-if="members.length" class="table-scroll"><table class="data-table"><thead><tr><th>Member</th><th>Email address</th><th>Joined</th><th>Active loans / requests</th><th>History</th></tr></thead><tbody><tr v-for="member in members" :key="member.id"><td><div class="member-cell"><span class="avatar">{{ member.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase() }}</span><strong>{{ member.name }}</strong></div></td><td><span class="email-cell"><Mail :size="14" />{{ member.email }}</span></td><td><span class="email-cell"><CalendarDays :size="14" />{{ formatDate(member.joinedAt) }}</span></td><td><strong>{{ memberLoans(member.id) }}</strong></td><td>{{ memberHistory(member.id) }} transactions</td></tr></tbody></table></div>
    <EmptyState v-else title="No members found" message="Registered member accounts will appear here." />
  </section>
  <div class="admin-tip"><strong>Privacy reminder:</strong> Only show member information that library staff need to operate the service. This sample stores data in the current browser.</div>
</template>
