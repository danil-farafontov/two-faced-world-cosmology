import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COLORS, CAMERA_CONFIG, CONTROLS_CONFIG } from '../constants/constants.js';
import { SPACE_OBJECTS } from '../constants/space-objects-data.js';
import { TimeManager } from './TimeManager.js';
import { InteractionManager } from './InteractionManager.js';
import OrbitFactory from '../factories/OrbitFactory';
import Star from '../objects/Star';
import Planet from '../objects/Planet';
import Moon from '../objects/Moon';
import CameraManager from './CameraManager';

class SpaceSimulation {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(COLORS.background);

    this.camera = this._createCamera();
    this.scene.add(this.camera);
    this.renderer = this._createRenderer(container);
    this.controls = this._createControls();
    this.cameraManager = new CameraManager(this.camera, this.controls);

    this.timeManager = new TimeManager();
    this.starField = null;
    this.spaceObjects = [];

    this._createStarField();
    this.initEntities();

    this.interactionManager = new InteractionManager(
      this.camera,
      this.renderer.domElement, // pass canvas
      this.spaceObjects
    );

    this._animate = this._animate.bind(this);
  }

  _createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -CAMERA_CONFIG.frustumSize * aspect / 2,
      CAMERA_CONFIG.frustumSize * aspect / 2,
      CAMERA_CONFIG.frustumSize / 2,
      -CAMERA_CONFIG.frustumSize / 2,
      CAMERA_CONFIG.near,
      CAMERA_CONFIG.far
    );
    camera.position.set(CAMERA_CONFIG.position.x, CAMERA_CONFIG.position.y, CAMERA_CONFIG.position.z);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  _createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    return renderer;
  }

  _createControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableRotate = CONTROLS_CONFIG.enableRotate;
    controls.enableZoom = CONTROLS_CONFIG.enableZoom;
    controls.enablePan = CONTROLS_CONFIG.enablePan;
    controls.minZoom = CONTROLS_CONFIG.minZoom;
    controls.maxZoom = CONTROLS_CONFIG.maxZoom;
    return controls;
  }

  _createStarField() {
    const count = 2000;
    const spread = 4000;
    const size = 2;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = -5;

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

    this.starField = new THREE.Points(geometry, material);
    this.camera.add(this.starField);
  }

  initEntities() {
    for (const spaceObjectData of SPACE_OBJECTS) {
      let spaceObject = null;
      if (spaceObjectData.type === "Star") {
        spaceObject = new Star(spaceObjectData);
      }
      if (spaceObjectData.type === "Planet") {
        spaceObject = new Planet(spaceObjectData);
        if (
          typeof spaceObjectData.moons !== "undefined"
          && spaceObjectData.moons.length > 0
        ) {
          for (const moonData of spaceObjectData.moons) {
            let moonObject = new Moon(moonData, spaceObject);
            moonObject.build();
            this.scene.add(moonObject.container);
            this.spaceObjects.push(moonObject);
          }
        }
      }
      if (spaceObject != null) {
        spaceObject.build();
        this.scene.add(spaceObject.container);
        this.spaceObjects.push(spaceObject);
      }
    }

    // Create orbits after all objects are built
    for (const spaceObject of this.spaceObjects) {
      const orbitMesh = OrbitFactory.create(spaceObject.orbitRadius, spaceObject.color);
      if (orbitMesh) {
        spaceObject._setOrbitMesh(orbitMesh);
        this.scene.add(orbitMesh);
      }
    }
  }

  _animate() {
    requestAnimationFrame(this._animate);

    this.timeManager.update();

    for (const entity of this.spaceObjects) {
      entity.update(this.timeManager.simTime);
    }
    this.cameraManager.update();

    // Prevent star field from zooming
    if (this.starField) {
        // Calculate reverse zoom (for example if zoom = 2 then scale = 0.5)
        const inverseZoom = 1 / this.camera.zoom;
        this.starField.scale.set(inverseZoom, inverseZoom, 1);
    }


    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this._animate();
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.left = -CAMERA_CONFIG.frustumSize * aspect / 2;
    this.camera.right = CAMERA_CONFIG.frustumSize * aspect / 2;
    this.camera.top = CAMERA_CONFIG.frustumSize / 2;
    this.camera.bottom = -CAMERA_CONFIG.frustumSize / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default SpaceSimulation;
