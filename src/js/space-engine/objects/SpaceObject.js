import * as THREE from 'three';

class SpaceObject {
  constructor(data, parentObject = null) {
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
    this.showOrbit = data.showOrbit ?? true; // Flag for toggling visibility via UI

    this.glowEnabled = data.glowEnabled ?? false;
    this.glowColor = data.glowColor ?? data.color;
    this.glowScale = data.glowScale ?? 1.3;
    this.glowMesh = null;

    this.startAngle = data.startAngle ?? 0;
  }

  onClick() {
    console.log(`SpaceObject.onClick() - Clicked: ${this.type} - ${this.name}`);

    // Send global event
    window.dispatchEvent(new CustomEvent('space-object-selected', {
      detail: { name: this.name, type: this.type }
    }));
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

  createMesh() {
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
      this.mesh.renderOrder = 3; // Stars on top
    } else if (this.type.includes('Planet')) {
      this.mesh.renderOrder = 2; // Planets in the middle
    } else if (this.type.includes('Moon')) {
      this.mesh.renderOrder = 4; // Moons on top of planets
    }

    const startX = Math.cos(this.startAngle) * this.orbitRadius;
    const startY = Math.sin(this.startAngle) * this.orbitRadius;

    // Set initial position to Z = 0
    this.position.set(startX, startY, 0);
    if (this.parentObject) {
      this.position.x += this.parentObject.position.x;
      this.position.y += this.parentObject.position.y;
    }
    this.mesh.position.copy(this.position);
    if (this.glowEnabled) {
      this.createGlowMesh();
    }
  }

  createGlowMesh() {
    const glowRadius = this.radius * this.glowScale * 2;
    const geometry = new THREE.RingGeometry(this.radius, glowRadius, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(this.glowColor) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec2 vUv;
        void main() {
          // Вычисляем расстояние от центра квадрата (0.5, 0.5)
          float dist = length(vUv - vec2(0.5));

          // Если вышли за пределы радиуса круга (0.5), отсекаем пиксели
          if (dist > 0.5) discard;

          // Инвертируем и сглаживаем: в центре (dist=0) alpha = 1.0, на краю (dist=0.5) alpha = 0.0
          // Мягкое затухание от центра к краям
          float alpha = smoothstep(0.5, 0.0, dist);

          // Для эффекта интенсивности можно возвести в степень (например, pow(alpha, 2.0))
          gl_FragColor = vec4(glowColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    this.glowMesh = new THREE.Mesh(geometry, material);
    this.mesh.add(this.glowMesh);
  }

  createOrbitLine() {
    if (this.orbitRadius <= 0) return;

    const points = [];
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const x = this.orbitRadius * Math.cos(angle);
      const y = this.orbitRadius * Math.sin(angle);
      points.push(new THREE.Vector3(x, y, 0));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: this.color });
    material.side = THREE.DoubleSide;

    this.orbitMesh = new THREE.LineLoop(geometry, material);
    this.orbitMesh.position.set(0, 0, 0);

    if (this.parentObject) {
      this.orbitMesh.position.x += this.parentObject.position.x;
      this.orbitMesh.position.y += this.parentObject.position.y;
    }

    // Set orbit mesh to render at the very bottom layer
    this.orbitMesh.renderOrder = 1; // Orbits always underneath everything
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
      this.mesh.position.copy(this.position);

      if (this.orbitMesh) {
        this.orbitMesh.position.x = this.parentObject ? this.parentObject.position.x : 0;
        this.orbitMesh.position.y = this.parentObject ? this.parentObject.position.y : 0;
        this.orbitMesh.visible = this.showOrbit;
      }
    }
  }
}

export default SpaceObject;
