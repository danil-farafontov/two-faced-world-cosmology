import * as THREE from 'three';

export function createStarField(count, spread, size) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = 0;
    const brightness = 0.5 + Math.random() * 0.5;
    colors[i * 3] = brightness;
    colors[i * 3 + 1] = brightness;
    colors[i * 3 + 2] = brightness + Math.random() * 0.2;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    sizeAttenuation: false,
  });
  return new THREE.Points(geometry, material);
}

export function createGlowMesh(radius, color) {
  const geometry = new THREE.CircleGeometry(radius * 1.5, 32);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
  });
  return new THREE.Mesh(geometry, material);
}