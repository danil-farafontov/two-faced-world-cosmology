import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COLORS, SUNS_ORBITAL_PERIOD, SUN_DATA, CAMERA_CONFIG, CONTROLS_CONFIG } from '../constants.js';
import { TimeManager } from './TimeManager.js';

class SpaceSimulation {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(COLORS.background);

    this.camera = this._createCamera();
    this.renderer = this._createRenderer(container);
    this.controls = this._createControls();

    this.timeManager = new TimeManager();
    this.starField = null;
    this.sunMeshes = [];
    this.glowMeshes = [];
    this.sunsOrbit = null;

    this._createStarField();
    this._createSunsOrbit();
    this._createSuns();

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

    this.starField = new THREE.Points(geometry, material);
    this.scene.add(this.starField);
  }

  _createSunsOrbit() {
    const geometry = new THREE.RingGeometry(SUN_DATA.yellow.orbitRadius - 0.5, SUN_DATA.yellow.orbitRadius + 0.5, 64);
    const material = new THREE.MeshBasicMaterial({ color: COLORS.orbitOrange });
    this.sunsOrbit = new THREE.Mesh(geometry, material);
    this.scene.add(this.sunsOrbit);
  }

  _createSuns() {
    const sunConfigs = [
      { data: SUN_DATA.yellow, angleOffset: 0 },
      { data: SUN_DATA.red, angleOffset: Math.PI },
    ];

    sunConfigs.forEach(({ data, angleOffset }) => {
      // Sun mesh
      const geometry = new THREE.CircleGeometry(data.radius, 32);
      const material = new THREE.MeshBasicMaterial({ color: data.color });
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
      this.sunMeshes.push(mesh);

      // Glow mesh
      const glowGeometry = new THREE.CircleGeometry(data.radius * 1.5, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.15,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      this.scene.add(glowMesh);
      this.glowMeshes.push(glowMesh);
    });
  }

  _updateSuns(simTime) {
    const binaryAngle = (simTime * 2 * Math.PI) / SUNS_ORBITAL_PERIOD;

    this.sunMeshes.forEach((mesh, i) => {
      const angle = binaryAngle + (i === 0 ? 0 : Math.PI);
      const radius = SUN_DATA.yellow.orbitRadius;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius;
    });

    this.glowMeshes.forEach((glow, i) => {
      glow.position.copy(this.sunMeshes[i].position);
    });
  }

  _animate() {
    requestAnimationFrame(this._animate);

    this.timeManager.update();

    this._updateSuns(this.timeManager.simTime);

    this.controls.update();
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