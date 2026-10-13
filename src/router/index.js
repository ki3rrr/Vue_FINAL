import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/catalog', name: 'catalog', component: () => import('../views/CatalogView.vue'), meta: { requiresAuth: true } },
  { path: '/admin/books', name: 'books', component: () => import('../views/BookManagementView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/borrowings', name: 'borrowings', component: () => import('../views/BorrowingsView.vue'), meta: { requiresAuth: true } },
  { path: '/admin/members', name: 'members', component: () => import('../views/MembersView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const { currentUser, isAdmin } = useAuth()
  if (to.meta.requiresAuth && !currentUser.value) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.requiresAdmin && !isAdmin.value) return { name: 'dashboard' }
  if (to.meta.guestOnly && currentUser.value) return { name: 'dashboard' }
  return true
})

export default router
