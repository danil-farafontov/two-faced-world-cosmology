import * as THREE from 'three';
import GlowEffect from '../effects/GlowEffect';
import RingsEffect from '../effects/RingsEffect';
import SelectedSpaceObjectEffect from '../effects/SelectedSpaceObjectEffect';
import FirmamentConeEffect from '../effects/FirmamentConeEffect';
import FirmamentConePlacementEffect from '../effects/FirmamentConePlacementEffect';

class SpaceObject {
  #showOrbit = true;
  #selected = false;

  constructor(data, parentObject = null) {
    this.container = new THREE.Group();

    this.effects = []; // GlowEffect, RingsEffect
    this.selectedEffect = null; // SelectedSpaceObjectEffect stored separately because we need to switch it on and off actively
    this.firmamentConeEffect = null;
    this.firmamentConePlacementEffect = null;

    this.id = data.id;
    this.name = data.name;
    this.type = data.type;

    this.color = data.color;
    this.textureGeneratorFunc = typeof data.textureGeneratorFunc === 'function' ? data.textureGeneratorFunc : null;
    this.textureGeneratorParams = data.textureGeneratorParams ?? null;

    this.radius = data.radius;
    this.orbitalPeriod = data.orbitalPeriod; // in simulation hours
    this.orbitRadius = data.orbitRadius;

    this.parentObject = parentObject;

    this.material = null;
    this.mesh = null;
    this.position = new THREE.Vector3(0, 0, 0);
    this.castShadow = data.castShadow; // do not set default, set it in child classes
    this.receiveShadow = data.receiveShadow; // do not set default, set it in child classes

    this.orbitMesh = null;
    this.#showOrbit = data.showOrbit ?? true;

    this.glowEnabled = data.glowEnabled ?? false;
    this.glowColor = data.glowColor ?? data.color;
    this.glowScale = data.glowScale ?? 1.3;

    this.rings = data.rings ?? [];

    this.startAngle = data.startAngle ?? 0;
  }

  onClick() {
    console.log(`SpaceObject.onClick() - Clicked: ${this.type} - ${this.name}`);

    this.selected = true;
    // Send global event
    window.dispatchEvent(new CustomEvent('space-object-selected', {
      detail: { objectInstance: this }
    }));
  }

  addEffect(effect) {
    this.effects.push(effect);
    effect.attachTo(this.container);
  }

  addFirmamentConePlacementEffect() {
    this.clearFirmamentConeEffect();
    const firmamentConePlacementEffect = new FirmamentConePlacementEffect(this.radius, 0);
    firmamentConePlacementEffect.build();
    this.firmamentConePlacementEffect = firmamentConePlacementEffect;
    firmamentConePlacementEffect.attachTo(this.container);
  }

  addFirmamentConeEffect() {
    const fcEffect = new FirmamentConeEffect(200, this.firmamentConePlacementEffect.angle);
    fcEffect.build();
    this.firmamentConeEffect = fcEffect;
    fcEffect.attachTo(this.container);

    this.firmamentConePlacementEffect.destroy();
    this.firmamentConePlacementEffect = null;
  }
  clearFirmamentConeEffect() {
    if (this.firmamentConeEffect != null) {
      this.firmamentConeEffect.destroy();
      this.firmamentConeEffect = null;
    }
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
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    if (this.type.includes('Star')) {
      if (this.textureGeneratorFunc != null) {
        const generatedTexture = this.#createTextureFromFunction();
        this.material = new THREE.MeshBasicMaterial({
          map: generatedTexture
        });
      } else {
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
      }
    } else {
      if (this.textureGeneratorFunc != null) {
        const generatedTexture = this.#createTextureFromFunction();
        this.material = new THREE.MeshPhongMaterial({
            map: generatedTexture,
            color: 0xffffff
        });
      } else {
        this.material = new THREE.MeshPhongMaterial({
          color: this.color,
          shininess: 10
        });
      }
    }

    this.material.side = THREE.DoubleSide;
    this.mesh = new THREE.Mesh(geometry, this.material);
    if (this.castShadow === undefined) {
      this.castShadow = false;
    }
    this.mesh.castShadow = this.castShadow;
    if (this.receiveShadow === undefined) {
      this.receiveShadow = false;
    }
    this.mesh.receiveShadow = this.receiveShadow;

    const startX = Math.cos(this.startAngle) * this.orbitRadius;
    const startY = Math.sin(this.startAngle) * this.orbitRadius;

    this.position.x = startX;
    this.position.y = startY;
    // z position set in child classes

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

  update(simTime, currentMouseWorldPosition) {
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
      this.container.rotation.z = angle;


      if (this.orbitMesh) {
        this.orbitMesh.position.x = this.parentObject ? this.parentObject.position.x : 0;
        this.orbitMesh.position.y = this.parentObject ? this.parentObject.position.y : 0;
        this.orbitMesh.visible = this.#showOrbit;
      }

      if (this.firmamentConePlacementEffect != null) {
        this.firmamentConePlacementEffect.update(simTime, currentMouseWorldPosition)
      }
    }
  }

  set showOrbit(value) {
    this.#showOrbit = value;
  }

  set selected(value) {
    this.#selected = value;
    if (this.#selected) {
      this.selectedEffect = new SelectedSpaceObjectEffect(this.radius);
      this.selectedEffect.build();
      this.selectedEffect.attachTo(this.container);
    } else {
      if (this.selectedEffect != null) {
        this.selectedEffect.destroy();
        this.selectedEffect = null;
      }
      this.clearFirmamentConeEffect();
      if (this.firmamentConePlacementEffect != null) {
        this.firmamentConePlacementEffect.destroy();
        this.firmamentConePlacementEffect = null;
      }
    }
  }
}

export default SpaceObject;
