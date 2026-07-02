import SpaceSimulation from './classes/SpaceSimulation.js';
import '../css/base.css';

// HMR guard
if (!window.__tfwInitialized) {
  window.__tfwInitialized = true;

  const container = document.getElementById('canvas-container');
  const simulation = new SpaceSimulation(container);
  simulation.start();

  window.addEventListener('resize', () => simulation.onWindowResize());
}
