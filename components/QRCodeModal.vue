<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="close" @click="closeModal">&times;</span>
                    <h2>Scan to connect</h2>
                </div>
                <div class="modal-body">
                    <img :src="qrCodeSrc" alt="QR Code" class="qr-code-img">
                    <p v-if="isConnection">Open Xaman wallet app and scan this QR code or open the <a :href="mobileUrl" target="_blank" class="link-style">mobile app</a></p>
                    <p v-if="!isConnection">Open Xaman wallet app and scan this QR code or wait for a notification</p>
                </div>
            </div>
        </div> 
    </div>        
</template>
  
<script>
export default {
props: ['visible', 'qrCodeSrc', 'isConnection', 'mobileUrl'],
methods: {
    closeModal() {
        this.$emit('close');
    }
}
}
</script>
  
<style scoped>
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
  width: 300px; /* Adjust as needed */
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
  width: 80%; /* Adjust as needed */
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

.modal-body p, .modal-header h2 {
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
</style>
