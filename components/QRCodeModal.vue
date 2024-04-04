<template>
  <UModal v-model="isOpen" class="">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }" class="text-center">
      <div class="font-title mb-4">Connect to your wallet</div>
      <div class="flex justify-center">
        <img :src="qrCodeSrc" alt="QR Code (click to copy)" class="rounded-md" @click="onImageClick()">
      </div>
      <div class="font-title mt-4">
        <p>Scan with Xaman or click the image to copy code manually.</p>
      </div>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const router = useRouter()
const props = defineProps(['isOpen', 'qrCodeSrc', 'isConnection', 'mobileUrl', 'uuid'])
const {
  isOpen,
  qrCodeSrc,
  isConnection,
  mobileUrl,
  uuid
} = toRefs(props)

const closeModal = () => {
  this.$emit('close');
}
const onImageClick = async () => {
  if (mobileUrl.value) {
    window.open(mobileUrl.value, '_blank')
  } else {
    try {
      await navigator.clipboard.writeText(value)
      console.log('Text copied to clipboard')
      alert("Copied to clipboard. Paste in Xaman to continue.")
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Optionally, fallback to another copy method or show an error message.
    }
  }
}
</script>

<!-- <style scoped>
.modal-overlay {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  text-align: center;
  width: 300px;
  /* Adjust as needed */
}

.modal-header {
  position: relative;
}

.modal-header h2 {
  margin: 0;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  color: #aaaaaa;
  font-size: 28px;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
}

.qr-code-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  /* Adjust as needed */
  margin-top: 20px;
  margin-bottom: 10px;
}

.modal-body p {
  /* margin-top: 10px; */
  margin-bottom: 20px;
}

.verification-logo {
  font-size: 24px;
  margin-top: 20px;
}

.modal-body p,
.modal-header h2 {
  color: black;
}

.link-style {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}

.link-style:hover {
  color: darkblue;
}
</style> -->
