<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { BookOpen, ArrowRight, LibraryBig } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const email = ref('admin@pageturn.local')
const password = ref('admin123')
const error = ref('')
const busy = ref(false)
const router = useRouter()
const route = useRoute()
const { login } = useAuth()

function submitLogin() {
  error.value = ''
  busy.value = true
  const result = login(email.value, password.value)
  busy.value = false
  if (!result.ok) {
    error.value = result.message
    return
  }
  router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard')
}
function useDemo(role) {
  email.value = role === 'admin' ? 'admin@pageturn.local' : 'member@pageturn.local'
  password.value = role === 'admin' ? 'admin123' : 'member123'
}
</script>

<template>
  <div class="auth-layout">
    <section class="auth-visual">
      <RouterLink to="/login" class="brand brand-light"><span class="brand-mark"><BookOpen :size="22" /></span><span>Book<small>LIBRARY SYSTEM</small></span></RouterLink>
      <div class="auth-visual-content">
        <div class="visual-tag"><LibraryBig :size="15" /> YOUR NEXT CHAPTER STARTS HERE</div>
        <h1>A world of stories.<br /><em>One library.</em></h1>
        <p>Discover your next favorite read, keep track of your borrowing, and make every page count.</p>
        <div class="visual-book-stack"><div class="stack-book stack-one"></div><div class="stack-book stack-two"></div><div class="stack-book stack-three"></div><div class="stack-book stack-four"></div></div>
        <div class="visual-quote">“A library is not a luxury but one of the necessities of life.”<small>— Kier Marvin Gwapo</small></div>
      </div>
      <div class="visual-footer">A thoughtful reading experience.</div>
    </section>
    <section class="auth-form-side">
      <div class="auth-form-wrap">
        <p class="eyebrow">WELCOME BACK</p>
        <h2>Sign in to Book Library System</h2>
        <p class="muted auth-subtitle">Enter your details to access your library workspace.</p>
        <form class="stack-form" @submit.prevent="submitLogin">
          <label class="field">Email address<input v-model.trim="email" type="email" autocomplete="username" required placeholder="you@example.com" /></label>
          <label class="field">Password<input v-model="password" type="password" autocomplete="current-password" required placeholder="Enter your password" /></label>
          <p v-if="error" class="form-error" role="alert">{{ error }}</p>
          <button class="button button-primary button-full" type="submit" :disabled="busy">Sign in <ArrowRight :size="17" /></button>
        </form>
        <div class="demo-box">
          <strong>Quick demo access</strong>
          <p>Choose a sample role to fill in the credentials.</p>
          <div class="demo-buttons">
            <button class="button button-secondary" @click="useDemo('admin')">Admin demo</button>
            <button class="button button-secondary" @click="useDemo('member')">Member demo</button>
          </div>
        </div>
        <p class="auth-switch">New to the library? <RouterLink to="/register">Create an account</RouterLink></p>
        <p class="security-note">Classroom demo only: credentials are stored in this browser, not securely on a server.</p>
      </div>
    </section>
  </div>
</template>
