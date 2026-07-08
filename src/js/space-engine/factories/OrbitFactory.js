import * as THREE from 'three';
import { RENDER_ORDER } from '../constants/constants.js';

class OrbitFactory {
  static create(radius, color) {
    if (radius <= 0) return null;

    const count = 64;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = radius * Math.sin(angle);
      positions[i * 3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({ color });

    const mesh = new THREE.LineLoop(geometry, material);
    mesh.renderOrder = RENDER_ORDER.ORBIT;

    return mesh;
  }
}

export default OrbitFactory;
