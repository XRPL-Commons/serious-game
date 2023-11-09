<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps(['title', 'message', 'cancelText', 'confirmText', 'type'])
const { title, message } = toRefs(props)
defineEmits(['confirm', 'close'])
const value = ref('')
</script>
<template>
  <form @submit.prevent="$emit('confirm', { value }); $emit('close');">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <div>{{ message }}</div>
        <o-input v-model="value" />
      </section>
      <footer class="modal-card-foot">
        <o-button :label="cancelText || 'Cancel'" @click="$emit('close')" rounded />
        <o-button :variant="type || 'primary'" :label="confirmText || 'OK'" type="is-primary"
          @click="$emit('confirm', { value }); $emit('close');" rounded />
      </footer>
    </div>
  </form>
</template>
