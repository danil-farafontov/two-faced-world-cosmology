import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COLORS, ORBITAL_PERIODS, PLANETS_DATA, SUN_DATA, CAMERA_CONFIG, CONTROLS_CONFIG, SATURN_DATA } from './constants.js';
import { createSaturnMesh, createSaturnRings, createSaturnGlow } from './saturn.js';
import '../css/base.css';
import '../css/timeline.css';
import '../css/info-panel.css';
import '../css/legend.css';

// Simulation state
let simTime = 0;
let lastFrameTime = performance.now();
let isPlaying = true;
let speedMultiplier = 1;
let orbitsVisible = true;

// UI elements
let playPauseBtn, timeSlider, timeDisplay, speedSlider, speedDisplay;
let toggleOrbitsBtn, timeScaleValue, timeScaleUnit, infoPanel, closeInfoBtn;

// References to scene objects for cleanup
let scene, camera, renderer, controls, starField;
let yellowSunMesh, redSunMesh, yellowSunGlow, redSunGlow;
let yellowSunOrbit, redSunOrbit;
let planets = [];
let saturnRings = [];
let saturnGlow;

function declension(n, forms) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n100 >= 11 && n100 <= 19) return forms[2];
  if (n10 === 1) return forms[0];
  if (n10 >= 2 && n10 <= 4) return forms[1];
  return forms[2];
}

function updateTimeScaleDisplay() {
  const hours = speedMultiplier;
  const weeks = Math.floor(hours / 168);
  const days = Math.floor((hours % 168) / 24);
  const remainingHours = hours % 24;

  const parts = [];

  if (weeks > 0) {
    parts.push(`${weeks} ${declension(weeks, ['неделя', 'недели', 'недель'])}`);
  }
  if (days > 0) {
    parts.push(`${days} ${declension(days, ['день', 'дня', 'дней'])}`);
  }
  if (remainingHours > 0) {
    parts.push(`${remainingHours} ${declension(remainingHours, ['час', 'часа', 'часов'])}`);
  }

  timeScaleValue.textContent = parts.join(', ');
  timeScaleUnit.textContent = '';
}

function createStarField(count, spread, size) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = 0;
    const brightness = 0.5 + Math.random() * 0.5;
    colors[i * 3] = brightness;
    colors[i * 3 + 1] = brightness;
    colors[i * 3 + 2] = brightness + Math.random() * 0.2;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    sizeAttenuation: false,
  });
  return new THREE.Points(geometry, material);
}

function createSunMesh(radius, color) {
  const geometry = new THREE.CircleGeometry(radius, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

function createGlowMesh(radius, color) {
  const geometry = new THREE.CircleGeometry(radius * 1.5, 32);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
  });
  return new THREE.Mesh(geometry, material);
}

function createOrbitRing(radius, color) {
  const geometry = new THREE.RingGeometry(radius - 0.2, radius + 0.2, 64);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
}

function createPlanetOrbitRing(radius, color) {
  const geometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 128);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
}

function createPlanetMesh(radius, color) {
  const geometry = new THREE.CircleGeometry(radius, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

function init() {
  // Prevent double initialization (HMR fix)
  if (window.__tfwInitialized) return;
  window.__tfwInitialized = true;

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.background);

  // Camera (orthographic, top-down view)
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    -CAMERA_CONFIG.frustumSize * aspect / 2,
    CAMERA_CONFIG.frustumSize * aspect / 2,
    CAMERA_CONFIG.frustumSize / 2,
    -CAMERA_CONFIG.frustumSize / 2,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far
  );
  camera.position.set(CAMERA_CONFIG.position.x, CAMERA_CONFIG.position.y, CAMERA_CONFIG.position.z);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = CONTROLS_CONFIG.enableRotate;
  controls.enableZoom = CONTROLS_CONFIG.enableZoom;
  controls.enablePan = CONTROLS_CONFIG.enablePan;
  controls.minZoom = CONTROLS_CONFIG.minZoom;
  controls.maxZoom = CONTROLS_CONFIG.maxZoom;

  // Star field
  starField = createStarField(2000, 4000, 2);
  scene.add(starField);

  // Suns
  yellowSunMesh = createSunMesh(SUN_DATA.yellow.radius, COLORS.sunYellow);
  redSunMesh = createSunMesh(SUN_DATA.red.radius, COLORS.sunRed);
  scene.add(yellowSunMesh);
  scene.add(redSunMesh);

  yellowSunGlow = createGlowMesh(SUN_DATA.yellow.radius, COLORS.sunYellow);
  redSunGlow = createGlowMesh(SUN_DATA.red.radius, COLORS.sunRed);
  scene.add(yellowSunGlow);
  scene.add(redSunGlow);

  // Sun orbits
  yellowSunOrbit = createOrbitRing(SUN_DATA.yellow.orbitRadius, COLORS.orbitYellow);
  redSunOrbit = createOrbitRing(SUN_DATA.red.orbitRadius, COLORS.orbitRed);
  scene.add(yellowSunOrbit);
  scene.add(redSunOrbit);

  // Planets
  planets = PLANETS_DATA.map((data, i) => {
    let mesh;
    if (data.isSaturn) {
      // Special Saturn with rings
      mesh = createSaturnMesh(data.radius, data.color);
      saturnGlow = createSaturnGlow(data.radius, data.color);
      scene.add(saturnGlow);
    } else {
      mesh = createPlanetMesh(data.radius, data.color);
    }
    const orbit = createPlanetOrbitRing(data.orbitRadius, data.color);
    scene.add(orbit);
    scene.add(mesh);

    return {
      mesh,
      orbit,
      data,
      angle: Math.random() * Math.PI * 2,
    };
  });

  // Saturn rings (added after planets array is created)
  const saturnPlanet = planets.find((p) => p.data.isSaturn);
  if (saturnPlanet) {
    saturnRings = createSaturnRings(SATURN_DATA.rings);
    saturnRings.forEach((ring) => scene.add(ring));
  }

  // UI elements
  playPauseBtn = document.getElementById('play-pause-btn');
  timeSlider = document.getElementById('time-slider');
  timeDisplay = document.getElementById('time-display');
  speedSlider = document.getElementById('speed-slider');
  speedDisplay = document.getElementById('speed-display');
  toggleOrbitsBtn = document.getElementById('toggle-orbits-btn');
  timeScaleValue = document.getElementById('time-scale-value');
  timeScaleUnit = document.getElementById('time-scale-unit');
  infoPanel = document.getElementById('info-panel');
  closeInfoBtn = document.getElementById('close-info-btn');

  updateTimeScaleDisplay();

  // UI event listeners
  playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
    playPauseBtn.title = isPlaying ? 'Pause' : 'Play';
  });

  timeSlider.addEventListener('input', () => {
    timeValue = parseInt(timeSlider.value);
    timeDisplay.textContent = timeValue;
  });

  speedSlider.addEventListener('input', () => {
    speedMultiplier = parseInt(speedSlider.value);
    speedDisplay.textContent = `x${speedMultiplier}`;
    updateTimeScaleDisplay();
  });

  toggleOrbitsBtn.addEventListener('click', () => {
    orbitsVisible = !orbitsVisible;
    yellowSunOrbit.visible = orbitsVisible;
    redSunOrbit.visible = orbitsVisible;
    planets.forEach((planet) => {
      planet.orbit.visible = orbitsVisible;
    });
    toggleOrbitsBtn.textContent = orbitsVisible ? '⊕' : '⊗';
  });

  closeInfoBtn.addEventListener('click', () => {
    infoPanel.classList.add('hidden');
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const dt = (now - lastFrameTime) / 1000; // Delta time in seconds
    lastFrameTime = now;

    // Update simulation time
    if (isPlaying) {
      simTime += dt * speedMultiplier;
    }

    // Calculate angles directly from simTime (frame-rate independent)
    const binaryAngle = (simTime * 2 * Math.PI) / ORBITAL_PERIODS.binarySystem;
    
    yellowSunMesh.position.x = Math.cos(binaryAngle) * SUN_DATA.yellow.orbitRadius;
    yellowSunMesh.position.y = Math.sin(binaryAngle) * SUN_DATA.yellow.orbitRadius;
    yellowSunGlow.position.copy(yellowSunMesh.position);

    redSunMesh.position.x = Math.cos(binaryAngle + Math.PI) * SUN_DATA.red.orbitRadius;
    redSunMesh.position.y = Math.sin(binaryAngle + Math.PI) * SUN_DATA.red.orbitRadius;
    redSunGlow.position.copy(redSunMesh.position);

    // Update planet positions
    planets.forEach((planet, i) => {
      const planetAngle = (simTime * 2 * Math.PI) / ORBITAL_PERIODS.planets[i] + planet.angle;
      planet.mesh.position.x = Math.cos(planetAngle) * planet.data.orbitRadius;
      planet.mesh.position.y = Math.sin(planetAngle) * planet.data.orbitRadius;
    });

    // Sync Saturn rings position with Saturn
    if (saturnPlanet) {
      saturnRings.forEach((ring) => {
        ring.position.copy(saturnPlanet.mesh.position);
      });
      if (saturnGlow) {
        saturnGlow.position.copy(saturnPlanet.mesh.position);
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -CAMERA_CONFIG.frustumSize * aspect / 2;
    camera.right = CAMERA_CONFIG.frustumSize * aspect / 2;
    camera.top = CAMERA_CONFIG.frustumSize / 2;
    camera.bottom = -CAMERA_CONFIG.frustumSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

init();
