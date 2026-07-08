// Visual constants
export const COLORS = {
  background: 0x0a0a1a,
  sunYellow: 0xFFD700,
  sunRed: 0xFF4500,
  orbitOrange: 0xFFA000,
};

// Camera configuration
export const CAMERA_CONFIG = {
  frustumSize: 1500,
  near: 1,
  far: 10000,
  position: { x: 0, y: 0, z: 1 },
};

// Controls configuration
export const CONTROLS_CONFIG = {
  enableRotate: false,
  enableZoom: true,
  enablePan: true,
  minZoom: 0.1,
  maxZoom: 10,
};

// Render order
export const RENDER_ORDER = {
  ORBIT: 1,
  PLANET: 2,
  STAR: 3,
  MOON: 4,
};
