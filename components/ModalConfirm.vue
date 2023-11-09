<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps(['title', 'message', 'cancelText', 'confirmText', 'type'])
const { title, message } = toRefs(props)
defineEmits(['confirm', 'close'])
</script>
<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <section class="modal-card-body">
      {{ message }}
    </section>
    <footer class="modal-card-foot">
      <o-button :label="cancelText || 'Cancel'" @click="$emit('close')" rounded />
      <o-button :variant="type || 'primary'" :label="confirmText || 'OK'" type="is-primary"
        @click="$emit('confirm'); $emit('close');" rounded />
    </footer>
  </div>
</template>
