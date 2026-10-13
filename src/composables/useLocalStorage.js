import { ref, watch } from 'vue'

/**
 * Composition API composable: reactive state backed by localStorage.
 * This is browser-local persistence, not a secure database.
 */
export function useLocalStorage(key, initialValue) {
  const readValue = () => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? structuredClone(initialValue) : JSON.parse(stored)
    } catch (error) {
      console.warn(`Could not read localStorage key "${key}".`, error)
      return structuredClone(initialValue)
    }
  }

  const state = ref(readValue())

  watch(state, (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Could not save localStorage key "${key}".`, error)
    }
  }, { deep: true, flush: 'sync' })

  return state
}
