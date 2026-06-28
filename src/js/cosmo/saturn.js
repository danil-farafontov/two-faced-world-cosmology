import * as THREE from 'three';

/**
 * Creates a banded texture for a gas giant (Saturn).
 */
function createGasGiantTexture(baseColor, radius) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Base tones from the main color
  const r = (baseColor >> 16) & 0xff;
  const g = (baseColor >> 8) & 0xff;
  const b = baseColor & 0xff;

  // Band gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 128);
  const shade = (v, f) => Math.min(255, Math.floor(v * f));
  const shadeDark = (v, f) => Math.max(0, Math.floor(v * f));

  gradient.addColorStop(0, `rgb(${shade(r, 0.7)},${shade(g, 0.7)},${shade(b, 0.7)})`);
  gradient.addColorStop(0.15, `rgb(${shade(r, 0.85)},${shade(g, 0.85)},${shade(b, 0.85)})`);
  gradient.addColorStop(0.3, `rgb(${shadeDark(r, 0.6)},${shadeDark(g, 0.6)},${shadeDark(b, 0.6)})`);
  gradient.addColorStop(0.45, `rgb(${shade(r, 1.05)},${shade(g, 1.05)},${shade(b, 1.05)})`);
  gradient.addColorStop(0.5, `rgb(${shade(r, 0.85)},${shade(g, 0.85)},${shade(b, 0.85)})`);
  gradient.addColorStop(0.65, `rgb(${shade(r, 0.75)},${shade(g, 0.75)},${shade(b, 0.75)})`);
  gradient.addColorStop(0.8, `rgb(${shadeDark(r, 0.65)},${shadeDark(g, 0.65)},${shadeDark(b, 0.65)})`);
  gradient.addColorStop(1, `rgb(${shadeDark(r, 0.55)},${shadeDark(g, 0.55)},${shadeDark(b, 0.55)})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 128);

  // Noise across bands
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 256; x += 4) {
      const noise = Math.random() * 20 - 10;
      ctx.fillStyle = `rgba(${noise > 0 ? 255 : 0},${noise > 0 ? 255 : 0},${noise > 0 ? 255 : 0},${Math.abs(noise) / 255})`;
      ctx.fillRect(x, y, 4, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates a Saturn mesh (gas giant with banded texture).
 */
export function createSaturnMesh(radius, baseColor) {
  const texture = createGasGiantTexture(baseColor, radius);
  const geometry = new THREE.CircleGeometry(radius, 48);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  return new THREE.Mesh(geometry, material);
}

/**
 * Creates a single Saturn ring.
 */
export function createSaturnRing(innerRadius, outerRadius, color, opacity) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * Creates all Saturn rings and returns an array of meshes.
 * Rings are created without planet binding — their positions must be updated manually.
 */
export function createSaturnRings(ringConfigs) {
  return ringConfigs.map((config) => {
    const ring = createSaturnRing(
      config.innerRadius,
      config.outerRadius,
      config.color,
      config.opacity
    );
    return ring;
  });
}
