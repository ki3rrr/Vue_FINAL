<script setup>
import { BookOpen, LayoutDashboard, Users, ArrowLeftRight, LibraryBig, RotateCcw, Menu, X } from 'lucide-vue-next'
defineProps({ activePage: { type: String, default: 'inventory' }, mobileOpen: Boolean })
const emit = defineEmits(['navigate', 'toggle-mobile', 'reset'])
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Book Inventory', icon: BookOpen },
  { id: 'borrow', label: 'Borrow / Return Books', icon: ArrowLeftRight },
  { id: 'users', label: 'Borrowing Users', icon: Users },
]
</script>

<template>
  <button class="mobile-menu" type="button" @click="emit('toggle-mobile')" aria-label="Toggle menu">
    <X v-if="mobileOpen" :size="19" /><Menu v-else :size="19" />
  </button>
  <div v-if="mobileOpen" class="sidebar-scrim" @click="emit('toggle-mobile')"></div>
  <aside class="sidebar" :class="{ 'sidebar-open': mobileOpen }">
    <div class="brand">
      <div class="brand-mark"><LibraryBig :size="21" /></div>
      <div><strong>Ulearna Learning</strong><span>Centre</span></div>
      <button class="icon-button sidebar-close" @click="emit('toggle-mobile')" aria-label="Close menu"><X :size="17" /></button>
    </div>
    <p class="nav-label">WORKSPACE</p>
    <nav>
      <button v-for="item in navItems" :key="item.id" class="nav-link" :class="{ active: activePage === item.id }" @click="emit('navigate', item.id)">
        <component :is="item.icon" :size="17" stroke-width="1.8" /><span>{{ item.label }}</span>
      </button>
    </nav>
    <div class="sidebar-bottom">
      <div class="help-card"><div class="help-icon"><BookOpen :size="17" /></div><strong>Library help</strong><p>Keep your collection organized and up to date.</p></div>
      <button class="nav-link reset-link" @click="emit('reset')"><RotateCcw :size="16" /><span>Reset demo data</span></button>
      <div class="sidebar-user"><div class="avatar">AD</div><div><strong>Library Admin</strong><span>Administrator</span></div><span class="online-dot"></span></div>
    </div>
  </aside>
</template>
