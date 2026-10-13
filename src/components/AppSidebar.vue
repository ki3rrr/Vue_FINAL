<script setup>
import { BookOpen, LayoutDashboard, LibraryBig, ClipboardList, Users, LogOut, BookMarked, Sun, Moon } from 'lucide-vue-next'
defineProps({ user: { type: Object, required: true }, isAdmin: { type: Boolean, default: false }, isDark: { type: Boolean, default: false } })
defineEmits(['logout', 'toggle-theme'])
</script>

<template>
  <aside class="sidebar">
    <RouterLink class="brand" to="/dashboard">
      <span class="brand-mark"><BookOpen :size="22" /></span>
      <span>Book<small>LIBRARY SYSTEM</small></span>
    </RouterLink>
    <div class="nav-label">WORKSPACE</div>
    <nav class="side-nav">
      <RouterLink to="/dashboard" class="nav-link"><LayoutDashboard :size="18" />Dashboard</RouterLink>
      <RouterLink to="/catalog" class="nav-link"><LibraryBig :size="18" />Book catalog</RouterLink>
      <RouterLink to="/borrowings" class="nav-link"><ClipboardList :size="18" />{{ isAdmin ? 'Borrow requests' : 'My borrowings' }}</RouterLink>
      <template v-if="isAdmin">
        <div class="nav-label nav-label-spaced">ADMINISTRATION</div>
        <RouterLink to="/admin/books" class="nav-link"><BookMarked :size="18" />Manage books</RouterLink>
        <RouterLink to="/admin/members" class="nav-link"><Users :size="18" />Members</RouterLink>
      </template>
    </nav>
    <div class="sidebar-bottom">
      <button class="theme-toggle" type="button" @click="$emit('toggle-theme')" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <span class="theme-toggle-icon"><Sun v-if="isDark" :size="17" /><Moon v-else :size="17" /></span>
        <span class="theme-toggle-copy"><strong>{{ isDark ? 'Light mode' : 'Dark mode' }}</strong><small>{{ isDark ? 'Switch to light theme' : 'Switch to dark theme' }}</small></span>
        <span class="theme-switch" :class="{ 'theme-switch-on': isDark }"><span></span></span>
      </button>
      <div class="profile-mini">
        <div class="avatar avatar-large">{{ user.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase() }}</div>
        <div class="profile-copy"><strong>{{ user.name }}</strong><small>{{ isAdmin ? 'Library admin' : 'Member account' }}</small></div>
      </div>
      <button class="logout-link" @click="$emit('logout')"><LogOut :size="17" />Sign out</button>
      <div class="sidebar-foot">Made for readers, built with Vue 3.</div>
    </div>
  </aside>
</template>
