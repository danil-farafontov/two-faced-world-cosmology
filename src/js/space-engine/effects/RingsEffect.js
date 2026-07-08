import * as THREE from 'three';

class RingsEffect {
  constructor(rings) {
    this.rings = rings;
    this.meshes = [];
  }

  build() {
    for (let ringData of this.rings) {
      const innerRadius = ringData.innerRadius;
      const outerRadius = ringData.outerRadius;
      const ringColor = new THREE.Color(ringData.color);
      // opacity - the ring opacity will be from opacity to 1.0.
      // 1.0 on the edges and opacity value in the center of a ring.
      const opacity = ringData.opacity;

      const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
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
            float xCoord = vUv.x;
            float yCoord = vUv.y;
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

            // alpha: min=ringOpacity; max=ringOpacity+ 20% of (1.0-ringOpacity);
            // ringOpacity in the center of the ring; ringOpacity+  on the edges;
            float maxAvailableOpacity = 1.0 - ringOpacity;
            alpha = ringOpacity + 0.2 * maxAvailableOpacity * alpha;

            float alphaForGlare = 0.0;
            if (yCoord > 0.5) {
              alphaForGlare = smoothstep(0.5, 1.0, yCoord);
            } else {
              alphaForGlare = smoothstep(0.5, 0.0, yCoord);
            }
            //alphaForGlare = smoothstep(0.0, 1.0, yCoord);
            alphaForGlare = alphaForGlare * 0.8 * maxAvailableOpacity;

            alpha = alpha - alphaForGlare;
            // Invert and smooth: in the center (dist=0) alpha = 1.0, at the edge (dist=0.5) alpha = 0.0
            // Soft fading from the center to the edges
            //float alpha = smoothstep(0.5, 0.0, dist);

            // For intensity effect, you can raise it to a power (e.g. pow(alpha, 2.0))
            // 1.0 / 2.2 - makes midtones brighter
            // gamma correction
            gl_FragColor = vec4(pow(ringColor, vec3(1.0 / 2.2)), alpha);

          }
        `,
        transparent: true,
      });
      const ringMesh = new THREE.Mesh(geometry, material);
      this.meshes.push(ringMesh);
    }
  }

  attachTo(parentContainer) {
    for (let mesh of this.meshes) {
      parentContainer.add(mesh);
    }
  }
}

export default RingsEffect;
