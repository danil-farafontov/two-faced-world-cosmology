import * as THREE from 'three';
class FirmamentConePlacementEffect {
  constructor(radius, angle) {
    this.radius = radius;
    this.angle = angle;
    this.mesh = null;
    this.material = null;
  }

  build() {
    let startX = 300 * Math.cos(this.angle);
    let startY = 300 * Math.sin(this.angle);
    const linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(startX, startY, 0),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    this.material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    this.angle = Math.atan2(startY, startX);
    this.mesh = new THREE.Line(lineGeo, this.material);
  }

  update(simTime, currentMouseWorldPosition) {
    const parentGlobalPos = new THREE.Vector3();
    this.mesh.parent.getWorldPosition(parentGlobalPos);

    const positionAttribute = this.mesh.geometry.attributes.position;
    const newX = currentMouseWorldPosition.x - parentGlobalPos.x;
    const newY = currentMouseWorldPosition.y - parentGlobalPos.y;
    positionAttribute.setX(1, newX);
    positionAttribute.setY(1, newY);
    this.angle = Math.atan2(newY, newX);
    positionAttribute.needsUpdate = true;
 }

  attachTo(parentContainer) {
    if (this.mesh == null) {
      console.error("❌ FirmamentConePlacementEffect: Attempted to attach a null mesh. Did you forget to call build()?");
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

export default FirmamentConePlacementEffect;