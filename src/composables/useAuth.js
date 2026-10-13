import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { seedUsers } from '../data/seed'

const users = useLocalStorage('pageturn_users', seedUsers)
const session = useLocalStorage('pageturn_session', null)

export function useAuth() {
  const currentUser = computed(() => {
    if (!session.value?.userId) return null
    return users.value.find(user => user.id === session.value.userId) ?? null
  })
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function login(email, password) {
    const user = users.value.find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)
    if (!user) return { ok: false, message: 'Email or password is incorrect.' }
    session.value = { userId: user.id, signedInAt: new Date().toISOString() }
    return { ok: true, user }
  }

  function register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    if (users.value.some(user => user.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: 'An account with this email already exists.' }
    }
    const user = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'member',
      joinedAt: new Date().toISOString(),
    }
    users.value.push(user)
    session.value = { userId: user.id, signedInAt: new Date().toISOString() }
    return { ok: true, user }
  }

  function logout() {
    session.value = null
  }

  return { users, session, currentUser, isAdmin, login, register, logout }
}
