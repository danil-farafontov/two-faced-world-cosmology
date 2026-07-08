import * as THREE from 'three';
class GlowEffect {
  constructor(objectRadius, glowScale, glowColor) {
    this.objectRadius = objectRadius;
    this.glowScale = glowScale;
    this.glowColor = glowColor;
    this.mesh = null;
  }

  build() {
    const glowRadius = this.objectRadius * this.glowScale * 2;
    const geometry = new THREE.RingGeometry(this.objectRadius, glowRadius, 32);
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
          float dist = length(vUv - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist);
          gl_FragColor = vec4(glowColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  attachTo(parentContainer) {
    if (this.mesh == null) {
      console.error("❌ GlowEffect: Attempted to attach a null mesh. Did you forget to call build()?");
    }
    parentContainer.add(this.mesh);
  }
}

export default GlowEffect;