import * as THREE from 'three';
class FirmamentConeEffect {
  constructor(radius, angle = 0, color = 0xffbf00, opacity = 0.2) {
    this.radius = radius;
    this.angle = angle;
    this.color = color;
    this.opacity = opacity;
    this.mesh = null;
    this.material = null;
  }

  build() {
    const segments = 32;
    const thetaLength = Math.PI*2 / 2;
    const thetaStart = this.angle - thetaLength/2;

    const geometry = new THREE.CircleGeometry(
      this.radius,
      segments,
      thetaStart,
      thetaLength
    );

    this.material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  attachTo(parentContainer) {
    if (this.mesh == null) {
      console.error("❌ FirmamentConeEffect: Attempted to attach a null mesh. Did you forget to call build()?");
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

export default FirmamentConeEffect;