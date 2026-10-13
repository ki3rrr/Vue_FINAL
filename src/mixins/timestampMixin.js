/**
 * Options API mixin demonstration.
 * Adds shared date formatting to components that include this mixin.
 */
export default {
  methods: {
    formatDate(value) {
      if (!value) return '—'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return '—'
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      }).format(date)
    },
  },
}
