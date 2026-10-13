<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import { useAuth } from './composables/useAuth'

const route = useRoute()
const router = useRouter()
const { currentUser, isAdmin, logout } = useAuth()
const isDark = ref(localStorage.getItem('book-library-theme') === 'dark')

watch(isDark, (dark) => {
  localStorage.setItem('book-library-theme', dark ? 'dark' : 'light')
}) 

function toggleTheme() {
  isDark.value = !isDark.value
}
const isAuthPage = computed(() => ['login', 'register'].includes(route.name))

function handleLogout() {
  logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="app-shell" :class="{ 'theme-dark': isDark }">
    <template v-if="!isAuthPage && currentUser">
      <AppSidebar :user="currentUser" :is-admin="isAdmin" :is-dark="isDark" @toggle-theme="toggleTheme" @logout="handleLogout" />
      <div class="main-column">
        <AppHeader :user="currentUser" :is-admin="isAdmin" @logout="handleLogout" />
        <main class="page-content">
          <RouterView />
        </main>
      </div>
    </template>
    <RouterView v-else />
  </div>
</template>
