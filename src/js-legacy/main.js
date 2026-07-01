import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  COLORS,
  SUNS_ORBITAL_PERIOD,
  PLANETS_DATA,
  SUN_DATA,
  CAMERA_CONFIG,
  CONTROLS_CONFIG,
  SATURN_DATA,
  MOONS_DATA
} from './constants.js';
import {
  createStarField,
  createGlowMesh
} from './cosmo/effects.js';
import {
  createSunMesh,
  createPlanetMesh,
  createOrbitRing,
  createSelectedRing
} from './cosmo/objects.js';
import {
  createSaturnMesh,
  createSaturnRings
} from './cosmo/saturn.js';
import {
  createMoons
} from './cosmo/moons.js';
import {
  createFirmamentCone
} from './cosmo/firmament.js';
import {
  declension,
  setCursorMode,
  startCameraAnimation,
  updateCameraAnimation
} from './utils.js';
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
let toggleOrbitsBtn, firmamentBtn, timeScaleValue, timeScaleUnit, infoPanel, closeInfoBtn;

// References to scene objects for cleanup
let scene, camera, renderer, controls, starField;
let yellowSunMesh, redSunMesh, yellowSunGlow, redSunGlow;
let sunsOrbit;
let planets = [];
let saturnPlanet = null;
let saturnRings = [];
let moons = [];

// firmament state
let cursorMode = 'moon-select'; // 'moon-select', 'point-select'
let selectedSpaceObject = null;
let selectedSpaceObjectIndicator = null;
let selectedFirmamentAngle = null;
let firmamentCone = null;
let pointOnMoonMarker = null;
let guideLineToSetFirmamentCone = null;
let firmamentConeSet = false;

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

/**
 * Clear all firmament visualization from scene.
 */
function clearFirmamentVisualization() {
  if (firmamentCone) {
    scene.remove(firmamentCone);
    firmamentCone.geometry.dispose();
    firmamentCone.material.dispose();
    firmamentCone = null;
  }
  if (pointOnMoonMarker) {
    scene.remove(pointOnMoonMarker);
    pointOnMoonMarker.geometry.dispose();
    pointOnMoonMarker.material.dispose();
    pointOnMoonMarker = null;
  }
  if (guideLineToSetFirmamentCone) {
    scene.remove(guideLineToSetFirmamentCone);
    guideLineToSetFirmamentCone.geometry.dispose();
    guideLineToSetFirmamentCone.material.dispose();
    guideLineToSetFirmamentCone = null;
  }
  firmamentConeSet = false;
  selectedFirmamentAngle = null;
  cursorMode = 'moon-select';
  setCursorMode(cursorMode);
}

function getMouseWorldPos(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const ndc = new THREE.Vector2(
    (mouseX / window.innerWidth) * 2 - 1,
    -(mouseY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(ndc, camera);
  return raycaster.ray.at(0, new THREE.Vector3());
}

function selectSpaceObject(object) {
  selectedSpaceObject = object;
  if (selectedSpaceObjectIndicator == null) {
    // create new and add to the scene
    selectedSpaceObjectIndicator = createSelectedRing(object.data.radius);
    scene.add(selectedSpaceObjectIndicator);
  } else {
    // remove current and add new to the scene
    scene.remove(selectedSpaceObjectIndicator);
    selectedSpaceObjectIndicator = createSelectedRing(object.data.radius);
    scene.add(selectedSpaceObjectIndicator);
  }
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

  // Suns orbit
  sunsOrbit = createOrbitRing(SUN_DATA.yellow.orbitRadius, COLORS.orbitOrange);
  scene.add(sunsOrbit);

  // Suns
  yellowSunMesh = createSunMesh(SUN_DATA.yellow.radius, COLORS.sunYellow);
  redSunMesh = createSunMesh(SUN_DATA.red.radius, COLORS.sunRed);
  scene.add(yellowSunMesh);
  scene.add(redSunMesh);

  // Suns glows
  yellowSunGlow = createGlowMesh(SUN_DATA.yellow.radius, COLORS.sunYellow);
  redSunGlow = createGlowMesh(SUN_DATA.red.radius, COLORS.sunRed);
  scene.add(yellowSunGlow);
  scene.add(redSunGlow);

  // Planets
  planets = PLANETS_DATA.map((data, i) => {
    const orbit = createOrbitRing(data.orbitRadius, data.color, 128);
    scene.add(orbit);

    let mesh;
    if (data.isSaturn) {
      // Special Saturn with rings
      mesh = createSaturnMesh(data.radius, data.color);
    } else {
      mesh = createPlanetMesh(data.radius, data.color);
    }
    scene.add(mesh);

    return {
      mesh,
      orbit,
      data,
      angle: Math.random() * Math.PI * 2,
    };
  });

  // Saturn rings (added after planets array is created)
  saturnPlanet = planets.find((p) => p.data.isSaturn);
  if (saturnPlanet) {
    saturnRings = createSaturnRings(SATURN_DATA.rings);
    saturnRings.forEach((ring) => scene.add(ring));
  }

  // Saturn's moons (added after Saturn)
  moons = createMoons(MOONS_DATA);
  moons.forEach((moon) => {
    scene.add(moon.orbit);
    scene.add(moon.mesh);
  });

  // UI elements
  playPauseBtn = document.getElementById('play-pause-btn');
  timeSlider = document.getElementById('time-slider');
  timeDisplay = document.getElementById('time-display');
  speedSlider = document.getElementById('speed-slider');
  speedDisplay = document.getElementById('speed-display');
  toggleOrbitsBtn = document.getElementById('toggle-orbits-btn');
  firmamentBtn = document.getElementById('firmament-btn');
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
    sunsOrbit.visible = orbitsVisible;
    planets.forEach((planet) => {
      planet.orbit.visible = orbitsVisible;
    });
    moons.forEach((moon) => {
      moon.orbit.visible = orbitsVisible;
    });
    toggleOrbitsBtn.textContent = orbitsVisible ? '⊕' : '⊗';
  });

  firmamentBtn.addEventListener('click', () => {
    if (cursorMode === 'moon-select') {
      clearFirmamentVisualization();
      // Start point selection
      cursorMode = 'point-select';
      setCursorMode(cursorMode);
    } else if (cursorMode === 'point-select') {
      // Cancel point selection
      cursorMode = 'moon-select';
      setCursorMode(cursorMode);
    }
  });

  closeInfoBtn.addEventListener('click', () => {
    infoPanel.classList.add('hidden');
    clearFirmamentVisualization();
    cursorMode = 'moon-select';
    setCursorMode(cursorMode);
    firmamentConeSet = false;
  });

  // Mouse move - track cursor position for guide line
  let mouseWorldPos = null;

  renderer.domElement.addEventListener('mousemove', (event) => {
    if (cursorMode !== 'point-select') return; // we need to track mouse position only in point-select mode
    mouseWorldPos = getMouseWorldPos(event);
  });

  // Click handler for moon-select mode
  renderer.domElement.addEventListener('click', (event) => {

    const worldPoint = getMouseWorldPos(event);

    if (cursorMode === 'moon-select') {
      // Clear old cone when selecting a new moon
      clearFirmamentVisualization();

      for (const moon of moons) {
        const dx = worldPoint.x - moon.mesh.position.x;
        const dy = worldPoint.y - moon.mesh.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= moon.data.radius + 5) {
          selectSpaceObject(moon);

          startCameraAnimation(camera, controls, saturnPlanet.mesh.position);

          document.getElementById('info-title').textContent = moon.data.name;
          document.getElementById('info-details').innerHTML = '';
          document.getElementById('info-description').textContent = moon.data.description;
          infoPanel.classList.remove('hidden');
          break;
        }
      }
    } else if (cursorMode === 'point-select' && selectedSpaceObject) {
      const moonPos = selectedSpaceObject.mesh.position;
      const moonRadius = selectedSpaceObject.data.radius;

      const dx = worldPoint.x - moonPos.x; //diff between cursor.x and moon.x
      const dy = worldPoint.y - moonPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy); // dist between click and moon

      if (dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        const surfaceX = moonPos.x + nx * moonRadius;
        const surfaceY = moonPos.y + ny * moonRadius;
        selectedFirmamentAngle = Math.atan2(ny, nx);

        firmamentCone = createFirmamentCone(
          300,
          { x: surfaceX, y: surfaceY },
          selectedFirmamentAngle,
          COLORS.firmamentCone,
          0.2
        );
        scene.add(firmamentCone);
        firmamentConeSet = true;

        scene.remove(guideLineToSetFirmamentCone);
        guideLineToSetFirmamentCone = null;

        // Switch back to moon-select mode
        cursorMode = 'moon-select';
        setCursorMode(cursorMode);
      }
    }
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
    const binaryAngle = (simTime * 2 * Math.PI) / SUNS_ORBITAL_PERIOD;
    
    yellowSunMesh.position.x = Math.cos(binaryAngle) * SUN_DATA.yellow.orbitRadius;
    yellowSunMesh.position.y = Math.sin(binaryAngle) * SUN_DATA.yellow.orbitRadius;
    yellowSunGlow.position.copy(yellowSunMesh.position);

    redSunMesh.position.x = Math.cos(binaryAngle + Math.PI) * SUN_DATA.red.orbitRadius;
    redSunMesh.position.y = Math.sin(binaryAngle + Math.PI) * SUN_DATA.red.orbitRadius;
    redSunGlow.position.copy(redSunMesh.position);

    // Update planet positions
    planets.forEach((planet) => {
      const planetAngle = (simTime * 2 * Math.PI) / planet.data.period + planet.angle;
      planet.mesh.position.x = Math.cos(planetAngle) * planet.data.orbitRadius;
      planet.mesh.position.y = Math.sin(planetAngle) * planet.data.orbitRadius;
    });

    // Sync Saturn rings position with Saturn
    if (saturnPlanet) {
      saturnRings.forEach((ring) => {
        ring.position.copy(saturnPlanet.mesh.position);
      });

      // Sync moons orbit position with Saturn
      moons.forEach((moon) => {
        moon.orbit.position.copy(saturnPlanet.mesh.position);
      });

      // Update moon positions (orbit around Saturn)
      moons.forEach((moon, i) => {
        const moonAngle = (simTime * 2 * Math.PI) / moon.data.period + moon.angle;
        moon.mesh.position.x = saturnPlanet.mesh.position.x + Math.cos(moonAngle) * moon.data.orbitRadius;
        moon.mesh.position.y = saturnPlanet.mesh.position.y + Math.sin(moonAngle) * moon.data.orbitRadius;
      });
    }

    // Update selected object indicator position
    if (selectedSpaceObjectIndicator != null && isPlaying) {
      //selectedSpaceObject.mesh.rotateZ(((dt * speedMultiplier) * 2 * Math.PI) / selectedSpaceObject.data.period);
      selectedSpaceObjectIndicator.position.x = selectedSpaceObject.mesh.position.x;
      selectedSpaceObjectIndicator.position.y = selectedSpaceObject.mesh.position.y;

      // Update firmamentCode position
      if (firmamentConeSet === true) {
        selectedFirmamentAngle += ((dt * speedMultiplier) * 2 * Math.PI) / selectedSpaceObject.data.period;
        const xnew
          = selectedSpaceObject.mesh.position.x
            + selectedSpaceObject.data.radius * Math.cos(selectedFirmamentAngle);
        const ynew
          = selectedSpaceObject.mesh.position.y
            + selectedSpaceObject.data.radius * Math.sin(selectedFirmamentAngle);
        firmamentCone.position.x = xnew;
        firmamentCone.position.y = ynew;
        firmamentCone.rotateZ(((dt * speedMultiplier) * 2 * Math.PI) / selectedSpaceObject.data.period);

        pointOnMoonMarker.position.set(xnew, ynew, 0);
      }
    }

    // Update guide line and point marker in point-select mode (before cone is set)
    if (cursorMode === 'point-select' && selectedSpaceObject && !firmamentConeSet) {
      const moonPos = selectedSpaceObject.mesh.position;
      const moonRadius = selectedSpaceObject.data.radius;

      if (mouseWorldPos) {
        const dx = mouseWorldPos.x - moonPos.x;
        const dy = mouseWorldPos.y - moonPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (guideLineToSetFirmamentCone) {
          scene.remove(guideLineToSetFirmamentCone);
          guideLineToSetFirmamentCone.geometry.dispose();
          guideLineToSetFirmamentCone.material.dispose();
        }
        const linePoints = [
          new THREE.Vector3(moonPos.x, moonPos.y, 0),
          new THREE.Vector3(mouseWorldPos.x, mouseWorldPos.y, 0),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.5,
        });
        guideLineToSetFirmamentCone = new THREE.Line(lineGeo, lineMat);
        scene.add(guideLineToSetFirmamentCone);

        if (dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const surfaceX = moonPos.x + nx * moonRadius;
          const surfaceY = moonPos.y + ny * moonRadius;

          if (pointOnMoonMarker) {
            scene.remove(pointOnMoonMarker);
            pointOnMoonMarker.geometry.dispose();
            pointOnMoonMarker.material.dispose();
          }
          pointOnMoonMarker = new THREE.Mesh(
            new THREE.CircleGeometry(2, 16),
            new THREE.MeshBasicMaterial({ color: 0xffbf00, depthTest: false })
          );
          pointOnMoonMarker.position.set(surfaceX, surfaceY, 0);
          scene.add(pointOnMoonMarker);
        }
      }
    }

    controls.update();
    updateCameraAnimation(camera, controls);
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
