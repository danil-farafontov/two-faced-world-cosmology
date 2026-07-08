<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import InfoPanel from './components/InfoPanel.vue';
import SpaceSimulation from './space-engine/core/SpaceSimulation.js';

const simulationInstance = ref(null);
const selectedObject = ref(null);

const handleResize = () => {
  if (simulationInstance.value) {
    simulationInstance.value.onWindowResize();
  }
};

const handleObjectSelect = (event) => {
  selectedObject.value = event.detail;
  console.log("catched click on space object: ");
  console.log(event);
};

onMounted(() => {
  const container = document.getElementById('canvas-container');
  const simulation = new SpaceSimulation(container);
  simulation.start();

  // Save ref into react Vue var to control from UI
  simulationInstance.value = simulation;

  window.addEventListener('resize', handleResize);
  // Catch click on space object events
  window.addEventListener('space-object-selected', handleObjectSelect);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('space-object-selected', handleObjectSelect);
});
</script>

<template>
  <div class="app-layout">
    <div id="canvas-container" class="canvas-container"></div>

    <div class="ui-container">
      <!-- UI -->
      <div id="info-panel" v-if="selectedObject" class="ui-panel">
        <InfoPanel :selected-object="selectedObject" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Css styles */
#info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}
</style>
