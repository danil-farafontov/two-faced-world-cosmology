<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import InfoPanel from './components/InfoPanel.vue';
import Loader from './components/Loader.vue';
import SpaceSimulation from './space-engine/core/SpaceSimulation.js';
import { LocalSpaceObjectsRepository } from './space-engine/repositories/LocalSpaceObjectsRepository.js';

const simulationInstance = ref(null);
const selectedObject = ref(null);
const isLoading = ref(true);

const handleResize = () => {
  if (simulationInstance.value) {
    simulationInstance.value.onWindowResize();
  }
};

const handleObjectSelect = (event) => {
  selectedObject.value = event.detail.objectInstance;
  console.log("catched click on space object: ");
  console.log(event);
};
const handleObjectUnselected = (event) => {
  selectedObject.value = null;
  console.log("catched click on empy space - object unselected");
  console.log(event);
};

onMounted(async () => {
  try {
    const repository = new LocalSpaceObjectsRepository();
    const spaceObjectsData = await repository.getSpaceObjects();

    const container = document.getElementById('canvas-container');
    const simulation = new SpaceSimulation(container, spaceObjectsData);
    simulation.start();

    simulationInstance.value = simulation;
  } finally {
    isLoading.value = false;
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('space-object-selected', handleObjectSelect);
  window.addEventListener('space-object-unselected', handleObjectUnselected);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('space-object-selected', handleObjectSelect);
  window.removeEventListener('space-object-unselected', handleObjectUnselected);
});
</script>

<template>
  <div class="app-layout">
    <div id="canvas-container" class="canvas-container"></div>

    <Loader v-if="isLoading" />

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
