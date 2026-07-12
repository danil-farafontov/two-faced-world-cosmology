<script setup>
  import { inject, ref } from 'vue';
  const spaceSimulation = inject('spaceSimulation');
  const isPlalying = ref(false);
  const playBtnClicked = () => {
    isPlalying.value = !isPlalying.value;
    spaceSimulation.value?.toggleSimulationIsPlaying();
  };
</script>

<template>
  <div id="timeline-panel">
    <div class="timeline-controls">
      <button
        id="play-pause-btn"
        class="rune-btn"
        title="Pause/Play"
        @click="playBtnClicked"
      >
        {{ isPlalying ? "⏸" : "▶" }}
      </button>
      <div class="slider-group">
        <div class="slider-row">
          <input type="range" id="time-slider" min="0" max="1000" value="0" step="1">
          <span id="time-display">0</span>
        </div>
        <div class="time-scale-info-inline placeholder"></div>
      </div>
      <div class="slider-group">
        <div class="slider-row">
          <input type="range" id="speed-slider" min="1" max="336" value="1" step="1">
          <span id="speed-display">x1</span>
        </div>
        <div class="time-scale-info-inline"><span id="time-scale-value">1</span> <span id="time-scale-unit">ЧАС</span> / СЕК</div>
      </div>
      <button id="toggle-orbits-btn" class="rune-btn" title="Орбиты">⊕</button>
    </div>
  </div>
</template>

<style scoped>
/* Timeline Panel */
#timeline-panel {
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid #cd7f32;
  border-radius: 8px;
  padding: 12px 20px;
  width: 100%;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
}

.slider-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 100px;
  min-height: 44px;
  gap: 4px;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.slider-row input[type="range"] {
  flex: 1;
  accent-color: #cd7f32;
}

.slider-row span {
  font-size: 14px;
  min-width: 30px;
  text-align: center;
  flex-shrink: 0;
}

.time-scale-info-inline {
  font-size: 12px;
  color: #b8860b;
  text-align: center;
  white-space: nowrap;
  min-height: 16px;
  line-height: 16px;
}

.time-scale-info-inline.placeholder {
  visibility: hidden;
}

.timeline-controls input[type="range"] {
  flex: 1;
  min-width: 80px;
  accent-color: #cd7f32;
}

.timeline-controls span {
  font-size: 14px;
  min-width: 30px;
  text-align: center;
}

@media (max-width: 767px) {
  #timeline-panel {
    padding: 8px 12px;
  }
  .timeline-controls {
    gap: 8px;
  }
}

</style>