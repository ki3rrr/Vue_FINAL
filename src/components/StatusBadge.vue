<script>
export default {
  name: 'StatusBadge',
  props: {
    status: { type: String, required: true },
  },
  computed: {
    normalizedStatus() {
      return String(this.status || '').toLowerCase()
    },
    label() {
      const labels = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', returned: 'Returned', cancelled: 'Cancelled' }
      return labels[this.normalizedStatus] || this.status
    },
  },
}
</script>

<template>
  <span class="status-badge" :class="`status-${normalizedStatus}`">
    <span class="status-dot"></span>{{ label }}
  </span>
</template>
