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

    this.startAngle = data.startAngle || 0;
  }

  createMesh() {
    const geometry = new THREE.CircleGeometry(this.radius, 32);
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    material.side = THREE.DoubleSide;

    // Add a subtle Z-offset to avoid Z-fighting
    let zOffset = 0;
    if (this.type.includes('Star')) {
      zOffset = 0;
    } else if (this.type.includes('Planet')) {
      zOffset = 0.1;
    } else if (this.type.includes('Moon')) {
      zOffset = 0.2;
    }
    this.mesh = new THREE.Mesh(geometry, material);

    const startX = Math.cos(this.startAngle) * this.orbitRadius;
    const startY = Math.sin(this.startAngle) * this.orbitRadius;

    this.mesh.position.set(startX, startY, zOffset);
  }

  update(simTime) {
    if (this.orbitalPeriod > 0) {
      const angle = this.startAngle + ((simTime * 2 * Math.PI) / this.orbitalPeriod);

      const localX = Math.cos(angle) * this.orbitRadius;
      const localY = Math.sin(angle) * this.orbitRadius;
      this.position.set(localX, localY, this.mesh.position.z);

      if (this.parentBody) {
        this.position.add(this.parentBody.position);
      }
      this.mesh.position.copy(this.position);
    }
  }
}

export default CelestialBody;
