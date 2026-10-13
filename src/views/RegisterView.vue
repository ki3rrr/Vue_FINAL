<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { BookOpen, ArrowRight } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const router = useRouter()
const { register } = useAuth()

function submitRegistration() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  const result = register({ name: name.value, email: email.value, password: password.value })
  if (!result.ok) {
    error.value = result.message
    return
  }
  router.push('/dashboard')
}
</script>

<template>
  <div class="register-layout">
    <RouterLink class="brand register-brand" to="/login"><span class="brand-mark"><BookOpen :size="22" /></span><span>PageTurn<small>LIBRARY SYSTEM</small></span></RouterLink>
    <section class="register-card">
      <p class="eyebrow">JOIN OUR COMMUNITY</p>
      <h1>Create your member account</h1>
      <p class="muted">Register to browse the catalog and request books from your library.</p>
      <form class="stack-form register-form" @submit.prevent="submitRegistration">
        <label class="field">Full name<input v-model.trim="name" required minlength="2" maxlength="80" autocomplete="name" placeholder="Your full name" /></label>
        <label class="field">Email address<input v-model.trim="email" type="email" required autocomplete="email" placeholder="you@example.com" /></label>
        <label class="field">Password<input v-model="password" type="password" required minlength="6" autocomplete="new-password" placeholder="At least 6 characters" /></label>
        <label class="field">Confirm password<input v-model="confirmPassword" type="password" required autocomplete="new-password" placeholder="Enter password again" /></label>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="button button-primary button-full" type="submit">Create account <ArrowRight :size="17" /></button>
      </form>
      <p class="auth-switch">Already have an account? <RouterLink to="/login">Sign in</RouterLink></p>
    </section>
    <p class="security-note register-note">For classroom practice. Use a backend and secure password hashing before real deployment.</p>
  </div>
</template>
