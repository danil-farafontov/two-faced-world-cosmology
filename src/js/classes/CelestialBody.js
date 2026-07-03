import * as THREE from 'three';

class CelestialBody {
  constructor(data, parentBody = null) {
    this.name = data.name;
    this.type = data.type;
    this.radius = data.radius;
    this.color = data.color;
    this.orbitalPeriod = data.orbitalPeriod; // in simulation hours
    this.orbitRadius = data.orbitRadius;
    this.parentBody = parentBody;
    this.mesh = null;
    this.position = new THREE.Vector3(0, 0, 0);
    this.orbitMesh = null;
    this.showOrbit = data.showOrbit ?? true; // Flag for toggling visibility via UI

    this.startAngle = data.startAngle || 0;
  }

  createMesh() {
    const geometry = new THREE.CircleGeometry(this.radius, 32);
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    material.side = THREE.DoubleSide;

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
    if (this.parentBody) {
      this.position.x += this.parentBody.position.x;
      this.position.y += this.parentBody.position.y;
    }
    this.mesh.position.copy(this.position);
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

    if (this.parentBody) {
      this.orbitMesh.position.x += this.parentBody.position.x;
      this.orbitMesh.position.y += this.parentBody.position.y;
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

      if (this.parentBody) {
        this.position.x += this.parentBody.position.x;
        this.position.y += this.parentBody.position.y;
      }
      this.mesh.position.copy(this.position);

      if (this.orbitMesh) {
        this.orbitMesh.position.x = this.parentBody ? this.parentBody.position.x : 0;
        this.orbitMesh.position.y = this.parentBody ? this.parentBody.position.y : 0;
        this.orbitMesh.visible = this.showOrbit;
      }
    }
  }
}

export default CelestialBody;
