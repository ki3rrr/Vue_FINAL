// Small Options API mixin example for teaching. In larger Vue 3 projects,
// composables are usually easier to trace and reuse than mixins.
export const auditMixin = {
  data() {
    return { lastAction: 'No action yet' }
  },
  methods: {
    recordAction(action) {
      this.lastAction = `${action} · ${new Date().toLocaleTimeString()}`
    },
  },
}
