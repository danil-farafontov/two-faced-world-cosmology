import * as THREE from 'three';

class PointLightEffect {
  constructor(options = {}) {
    const rawColor = new THREE.Color(options.color || 0xffffff);

    // Dilute the color with white
    // 0.75 means: 75% white and 25% object's color.
    rawColor.lerp(new THREE.Color(0xffffff), 0.15);
    this.color = rawColor;

    //this.color = options.color || 0xffffff;
    this.intensity = options.intensity !== undefined ? options.intensity : 3.0;
    this.distance = options.distance || 0;
    this.decay = options.decay !== undefined ? options.decay : 0;
    this.castShadow = options.castShadow !== undefined ? options.castShadow : true;

    this.mesh = null;
  }

  build() {
    this.mesh = new THREE.PointLight(this.color, this.intensity, this.distance, this.decay);

    if (this.castShadow) {
      this.mesh.castShadow = true;
      this.mesh.shadow.mapSize.width = 2048;
      this.mesh.shadow.mapSize.height = 2048;
      this.mesh.shadow.camera.near = 31; // 30 is radius of Stars
      this.mesh.shadow.camera.far = 1500; // It should be greater than orbit radius of the last planet
      this.mesh.shadow.bias = -0.005;
    }
  }

  attachTo(parentContainer) {
    if (this.mesh == null) {
      console.error("❌ GlowEffect: Attempted to attach a null mesh. Did you forget to call build()?");
    }
    parentContainer.add(this.mesh);
  }

  // Метод для динамического включения/выключения самого источника света
  toggle(visible) {
    if (this.light) {
      this.light.visible = visible;
    }
  }
}

export default PointLightEffect;