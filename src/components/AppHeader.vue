<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, LogOut, Search, CheckCheck, BookOpenCheck, CircleX, Info } from 'lucide-vue-next'
import { useLibrary } from '../composables/useLibrary'

const props = defineProps({ user: { type: Object, required: true }, isAdmin: { type: Boolean, default: false } })
const emit = defineEmits(['logout'])
const router = useRouter()
const { notifications, markNotificationRead, markAllNotificationsRead } = useLibrary()
const showNotifications = ref(false)
const memberNotifications = computed(() => props.isAdmin ? [] : notifications.value.filter(item => item.userId === props.user.id).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
const unreadCount = computed(() => memberNotifications.value.filter(item => !item.read).length)
function notificationIcon(type) {
  if (type === 'approved') return BookOpenCheck
  if (type === 'rejected') return CircleX
  return Info
}
function notificationClass(type) {
  if (type === 'approved') return 'notification-approved'
  if (type === 'rejected') return 'notification-rejected'
  return 'notification-info'
}
function openNotification(notification) {
  markNotificationRead(notification.id, props.user.id)
  showNotifications.value = false
  router.push('/borrowings')
}
function markAllRead() {
  markAllNotificationsRead(props.user.id)
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-search"><Search :size="17" /><span>Welcome back, {{ user.name.split(' ')[0] }}</span></div>
    <div class="topbar-actions">
      <span class="role-pill">{{ isAdmin ? 'Administrator' : 'Library member' }}</span>
      <div v-if="!isAdmin" class="notification-menu-wrap">
        <button class="icon-button notification-trigger" :class="{ 'notification-trigger-active': showNotifications }" aria-label="Notifications" title="Notifications" :aria-expanded="showNotifications" @click="showNotifications = !showNotifications">
          <Bell :size="18" />
          <span v-if="unreadCount" class="notification-count">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </button>
        <section v-if="showNotifications" class="notification-dropdown" aria-label="Member notifications">
          <div class="notification-heading">
            <div><strong>Notifications</strong><small>{{ unreadCount ? `${unreadCount} unread` : 'You are all caught up' }}</small></div>
            <button v-if="unreadCount" class="notification-mark-all" @click="markAllRead"><CheckCheck :size="14" /> Mark all read</button>
          </div>
          <div v-if="memberNotifications.length" class="notification-list">
            <button v-for="item in memberNotifications.slice(0, 12)" :key="item.id" class="notification-item" :class="[{ 'notification-unread': !item.read }, notificationClass(item.type)]" @click="openNotification(item)">
              <span class="notification-item-icon"><component :is="notificationIcon(item.type)" :size="17" /></span>
              <span class="notification-item-copy"><strong>{{ item.title }}</strong><span>{{ item.message }}</span><small>{{ new Date(item.createdAt).toLocaleString() }}</small></span>
              <span v-if="!item.read" class="notification-unread-dot" aria-label="Unread"></span>
            </button>
          </div>
          <div v-else class="notification-empty"><Bell :size="24" /><strong>No notifications yet</strong><span>We’ll let you know here when the admin reviews your book request.</span></div>
          <RouterLink class="notification-footer" to="/borrowings" @click="showNotifications = false">View my borrowings</RouterLink>
        </section>
      </div>
      <div class="avatar">{{ user.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase() }}</div>
      <button class="icon-button" aria-label="Log out" title="Log out" @click="emit('logout')"><LogOut :size="18" /></button>
    </div>
  </header>
</template>
