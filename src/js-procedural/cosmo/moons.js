import * as THREE from 'three';
import { createOrbitRing } from './objects.js';

/**
 * Creates a moon mesh.
 */
export function createMoonMesh(radius, color) {
  const geometry = new THREE.CircleGeometry(radius, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

/**
 * Creates all moons and returns an array of objects with mesh, orbit, data, angle.
 * Uses createOrbitRing for orbit rings to avoid duplication.
 */
export function createMoons(moonsData) {
  return moonsData.map((data) => {
    const mesh = createMoonMesh(data.radius, data.color);
    const orbit = createOrbitRing(data.orbitRadius, data.color, 64);
    return {
      mesh,
      orbit,
      data,
      angle: Math.random() * Math.PI * 2,
    };
  });
}
