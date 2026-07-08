<script setup>
  const props = defineProps({
    selectedObject: Object,
  });
</script>

<template>
  <div class="ui-panel info-panel">
    <button class="rune-btn close-btn">✕</button>
    <div class="info-content">
      <h2 id="info-title">{{ selectedObject.name }}</h2>
      <div id="info-details"></div>
      <p id="info-description">{{ selectedObject.description }}</p>
      <div id="firmament-section">
        <button id="firmament-btn" class="rune-btn">◐ Небосвод</button>
        <div id="firmament-prompt" class="firmament-prompt">
          Выберите точку на поверхности спутника.<br />
          Тот, кто находится в этой точке может наблюдать на небосводе объекты попадающие в конус.
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
  }
</style>