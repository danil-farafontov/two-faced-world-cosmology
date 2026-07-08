import * as THREE from 'three';
import GlowEffect from '../effects/GlowEffect';
import RingsEffect from '../effects/RingsEffect';
import { RENDER_ORDER } from '../constants/constants.js';

class SpaceObject {
  constructor(data, parentObject = null) {
    this.container = new THREE.Group();
    this.effects = [];

    this.name = data.name;
    this.type = data.type;

    this.color = data.color;
    this.textureGeneratorFunc = typeof data.textureGeneratorFunc === 'function' ? data.textureGeneratorFunc : null;
    this.textureGeneratorParams = data.textureGeneratorParams ?? null;

    this.radius = data.radius;
    this.orbitalPeriod = data.orbitalPeriod; // in simulation hours
    this.orbitRadius = data.orbitRadius;

    this.parentObject = parentObject;

    this.mesh = null;
    this.position = new THREE.Vector3(0, 0, 0);

    this.orbitMesh = null;
    this.showOrbit = data.showOrbit ?? true;

    this.glowEnabled = data.glowEnabled ?? false;
    this.glowColor = data.glowColor ?? data.color;
    this.glowScale = data.glowScale ?? 1.3;

    this.rings = data.rings ?? [];

    this.startAngle = data.startAngle ?? 0;
  }

  onClick() {
    console.log(`SpaceObject.onClick() - Clicked: ${this.type} - ${this.name}`);

    // Send global event
    window.dispatchEvent(new CustomEvent('space-object-selected', {
      detail: { name: this.name, type: this.type }
    }));
  }

  addEffect(effect) {
    this.effects.push(effect);
    effect.attachTo(this.container);
  }

  #createTextureFromFunction() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      this.textureGeneratorParams.ctx = ctx;
      this.textureGeneratorFunc(this.textureGeneratorParams);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      return texture;
  }

  build() {
    const geometry = new THREE.CircleGeometry(this.radius, 48);
    let material;
    if (this.textureGeneratorFunc == null) {
      material = new THREE.MeshBasicMaterial({ color: this.color });
      material.side = THREE.DoubleSide;
    } else {
      const generatedTexture = this.#createTextureFromFunction();
      material = new THREE.MeshBasicMaterial({
          map: generatedTexture
      });
      /*
      // Use this when enable light in future
      this.material = new THREE.MeshLambertMaterial({
          map: generatedTexture
      });
      */
    }

    this.mesh = new THREE.Mesh(geometry, material);
    if (this.type.includes('Star')) {
      this.mesh.renderOrder = RENDER_ORDER.STAR;
    } else if (this.type.includes('Planet')) {
      this.mesh.renderOrder = RENDER_ORDER.PLANET;
    } else if (this.type.includes('Moon')) {
      this.mesh.renderOrder = RENDER_ORDER.MOON;
    }

    const startX = Math.cos(this.startAngle) * this.orbitRadius;
    const startY = Math.sin(this.startAngle) * this.orbitRadius;

    // Set initial position to Z = 0
    this.position.set(startX, startY, 0);
    if (this.parentObject) {
      this.position.x += this.parentObject.position.x;
      this.position.y += this.parentObject.position.y;
    }
    this.container.position.copy(this.position);
    this.container.add(this.mesh);

    if (this.glowEnabled) {
      let glowEffect = new GlowEffect(this.radius, this.glowScale, this.glowColor);
      glowEffect.build();
      this.addEffect(glowEffect);
    }

    if (this.rings.length > 0) {
      let ringsEffect = new RingsEffect(this.rings);
      ringsEffect.build();
      this.addEffect(ringsEffect);
    }
  }

  _setOrbitMesh(orbitMesh) {
    this.orbitMesh = orbitMesh;
  }

  update(simTime) {
    if (this.orbitalPeriod > 0) {
      const angle = this.startAngle + ((simTime * 2 * Math.PI) / this.orbitalPeriod);

      const localX = Math.cos(angle) * this.orbitRadius;
      const localY = Math.sin(angle) * this.orbitRadius;
      this.position.x = localX;
      this.position.y = localY;

      if (this.parentObject) {
        this.position.x += this.parentObject.position.x;
        this.position.y += this.parentObject.position.y;
      }
      this.container.position.copy(this.position);

      if (this.orbitMesh) {
        this.orbitMesh.position.x = this.parentObject ? this.parentObject.position.x : 0;
        this.orbitMesh.position.y = this.parentObject ? this.parentObject.position.y : 0;
        this.orbitMesh.visible = this.showOrbit;
      }
    }
  }
}

export default SpaceObject;
