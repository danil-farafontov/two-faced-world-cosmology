<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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
      <div v-if="selectedObject" class="ui-panel">
        <h3>{{ selectedObject.name }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Css styles */
</style>
