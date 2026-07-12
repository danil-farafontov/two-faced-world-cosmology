<script setup>
defineProps({
  message: {
    type: String,
    default: 'loaders.mainLoaderText'
  }
});
</script>

<template>
  <div class="loader-overlay">
    <div class="loader-spinner"></div>
    <p class="loader-text">{{ $t(message) }}</p>
  </div>
</template>

<style scoped>
.loader-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 100;
}

.loader-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(205, 127, 50, 0.3);
  border-top-color: #cd7f32;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loader-text {
  margin-top: 16px;
  color: #d4b896;
  font-family: 'Georgia', serif;
  font-size: 14px;
  letter-spacing: 0.5px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
