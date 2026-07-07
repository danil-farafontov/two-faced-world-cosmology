import * as THREE from 'three';

/**
 * Creates a firmament cone (triangle sector) from a point on moon surface.
 */
export function createFirmamentCone(radius, center, angle, color = 0xffbf00, opacity = 0.2) {
  const segments = 32;
  const thetaLength = Math.PI*2 / 3;
  const thetaStart = angle - thetaLength/2;

  const geometry = new THREE.CircleGeometry(
    radius,
    segments,
    thetaStart,
    thetaLength
  );

  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = center.x;
  mesh.position.y = center.y;
  return mesh;
}