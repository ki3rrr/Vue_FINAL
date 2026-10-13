import { ref } from 'vue'

const message = ref('')
const kind = ref('success')
let timeoutId

export function useToast() {
  function showToast(text, type = 'success') {
    message.value = text
    kind.value = type
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => { message.value = '' }, 2800)
  }
  function clearToast() { message.value = '' }
  return { message, kind, showToast, clearToast }
}
