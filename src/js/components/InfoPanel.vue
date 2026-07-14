<script setup>
  import { inject } from 'vue';
  const spaceSimulation = inject('spaceSimulation');
  const props = defineProps({
    selectedObject: Object,
    isLoading: {
      type: Boolean,
      default: false,
    },
  });
  const handleFirmamentBtnClicked = () => {
    spaceSimulation.value?.startAddingFirmamentCone();
  };
</script>

<template>
  <div class="ui-panel info-panel">
    <button class="rune-btn close-btn">✕</button>

    <div v-if="isLoading" class="info-panel-loader">
      <div class="info-panel-spinner"></div>
      <p class="info-panel-text">{{ $t('loaders.infoPanelLoaderText') }}</p>
    </div>

    <div v-else class="info-content">
      <h2 id="info-title">{{ selectedObject.name }}</h2>
      <div id="info-details"></div>
      <p id="info-description">{{ selectedObject.description }}</p>
      <div v-if="selectedObject.type == 'Moon'" id="firmament-section">
        <button
          id="firmament-btn"
          class="rune-btn"
          @click="handleFirmamentBtnClicked"
        >◐ {{ $t('buttons.firmamentBtn.text') }}</button>
        <div id="firmament-prompt" class="firmament-prompt">
          {{ $t('buttons.firmamentBtn.prompt') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .info-panel {
    background: rgba(10, 10, 26, 0.9);
    border: 1px solid #cd7f32;
    border-radius: 8px;
    padding: 20px;
    width: 280px;
    max-height: 80vh;
    overflow-y: auto;
    transition: opacity 0.3s, transform 0.3s;
  }

  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 14px;
    padding: 2px 6px;
  }

  .info-content h2 {
    font-size: 18px;
    color: #b8860b;
    margin-bottom: 12px;
    border-bottom: 1px solid #cd7f32;
    padding-bottom: 8px;
  }

  #info-details {
    font-size: 13px;
    margin-bottom: 12px;
    line-height: 1.6;
  }

  #info-details div {
    margin-bottom: 4px;
  }

  #info-description {
    font-size: 13px;
    line-height: 1.5;
    color: #d4b896;
  }

  #firmament-section {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #cd7f32;
  }

  #firmament-btn {
    width: 100%;
    padding: 8px;
  }

  .firmament-prompt {
    font-size: 14px;
    color: #b8860b;
    text-align: center;
    margin-top: 8px;
    font-style: italic;
    white-space: pre-line;
  }

  .info-panel-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 0;
  }

  .info-panel-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid rgba(205, 127, 50, 0.3);
    border-top-color: #cd7f32;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .info-panel-text {
    margin-top: 12px;
    color: #d4b896;
    font-family: 'Georgia', serif;
    font-size: 13px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>