import * as THREE from 'three';

export function createSunMesh(radius, color) {
  const geometry = new THREE.CircleGeometry(radius, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

export function createPlanetMesh(radius, color) {
  const geometry = new THREE.CircleGeometry(radius, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

export function createOrbitRing(radius, color, thetaSegments = 64) {
  const geometry = new THREE.RingGeometry(radius - 0.5, radius + 0.5, thetaSegments);
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}