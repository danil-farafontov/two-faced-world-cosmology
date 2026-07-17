<script setup>
import { provide, ref, shallowRef, onMounted, onUnmounted } from 'vue';
import InfoPanel from './components/InfoPanel.vue';
import TimeControls from './components/TimeControls.vue';
import Loader from './components/Loader.vue';
import SpaceSimulation from './space-engine/core/SpaceSimulation.js';
import { LocalSpaceObjectsRepository } from './space-engine/repositories/LocalSpaceObjectsRepository.js';
import { SIMULATION_CONFIG } from './config/simulation.config.js';

const spaceSimulation = shallowRef(null);
provide('spaceSimulation', spaceSimulation);
const selectedObject = ref(null);
const isInfoLoading = ref(false); // Info Panel loader
const isLoading = ref(true); // General loader
const repository = ref(null);

const handleResize = () => {
  spaceSimulation.value?.onWindowResize();
};

const handleObjectSelect = async (event) => {
  const objectId = event.detail.objectInstance.id;
  isInfoLoading.value = true;
  try {
    selectedObject.value = await repository.value.getSpaceObjectById(objectId);
  } finally {
    isInfoLoading.value = false;
  }
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
    repository.value = new LocalSpaceObjectsRepository();
    const spaceObjectsData = await repository.value.getSpaceObjects();

    const container = document.getElementById('canvas-container');
    spaceSimulation.value = new SpaceSimulation(container, spaceObjectsData, SIMULATION_CONFIG);
    spaceSimulation.value.start();
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
      <div id="info-panel" v-if="selectedObject !== null" class="ui-panel">
        <InfoPanel :selected-object="selectedObject" :is-loading="isInfoLoading" />
      </div>
    </div>

    <div id="time-controls" class="ui-panel">
      <TimeControls />
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

#time-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: calc(100% - 40px);
  max-width: 600px;
}
@media (max-width: 767px) {
  #time-controls {
    bottom: 10px;
  }
}
</style>
