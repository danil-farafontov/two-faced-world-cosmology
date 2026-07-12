import * as THREE from 'three';
class SelectedSpaceObjectEffect {
  constructor(objectRadius) {
    this.objectRadius = objectRadius;
    this.mesh = null;
    this.material = null;
  }

  build() {
    const geometry = new THREE.RingGeometry(this.objectRadius - 0.5, this.objectRadius + 0.5, 64);
    const color = 0xFFFFFF;
    this.material = new THREE.MeshBasicMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  attachTo(parentContainer) {
    if (this.mesh == null) {
      console.error("❌ SelectedSpaceObjectEffect: Attempted to attach a null mesh. Did you forget to call build()?");
    }
    parentContainer.add(this.mesh);
  }

  destroy() {
    if (this.mesh && this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.material.dispose();
    }
  }
}

export default SelectedSpaceObjectEffect;