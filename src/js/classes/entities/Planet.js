import * as THREE from 'three';
import SpaceObject from './SpaceObject.js';

class Planet extends SpaceObject {
  constructor(data, parentObject = null) {
    super(data, parentObject);
    this.rings = data.rings ?? [];
    this.ringsMeshes = [];
  }

  createMesh() {
    super.createMesh();
    if (this.rings.length > 0) {
      this.createRingsMeshes();
    }
  }

  createRingsMeshes() {
    for (const ringData of this.rings) {
      const innerRadius = ringData.innerRadius;
      const outerRadius = ringData.outerRadius;
      const ringColor = ringData.color;
      // opacity - the ring opacity will be from opacity to 1.0.
      // 1.0 on the edges and opacity value in the center of a ring.
      const opacity = ringData.opacity;

      const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          ringColor: { value: new THREE.Color(ringColor) },
          innerRadius: { value: innerRadius },
          outerRadius: { value: outerRadius },
          ringOpacity: { value: opacity },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 ringColor;
          uniform float innerRadius;
          uniform float outerRadius;
          uniform float ringOpacity;
          varying vec2 vUv;
          void main() {
            // Calculate distance from square center (0.5, 0.5)
            float dist = length(vUv - vec2(0.5));

            // If dist > circle's radius then do not handel this pixel
            if (dist > 0.5) discard;

            // dist = 0.5 = outerRadius
            float minDist = 0.5 / outerRadius * innerRadius;

            // if dist < ring's inner radius
            if (dist < minDist) discard;

            float middleRadius = minDist + (0.5 - minDist)/2.0;

            float alpha = 0.0;
            if (dist > middleRadius) {
              alpha = smoothstep(middleRadius, 0.5, dist);
            } else {
              alpha = smoothstep(middleRadius, minDist, dist);
            }
            alpha = ringOpacity + (alpha / (1.0 / (1.0 - ringOpacity)));

            // Invert and smooth: in the center (dist=0) alpha = 1.0, at the edge (dist=0.5) alpha = 0.0
            // Soft fading from the center to the edges
            //float alpha = smoothstep(0.5, 0.0, dist);

            // For intensity effect, you can raise it to a power (e.g. pow(alpha, 2.0))
            gl_FragColor = vec4(ringColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(geometry, material);
      this.ringsMeshes.push(ringMesh);
      this.mesh.add(ringMesh);
    }

  }
}

export default Planet;
