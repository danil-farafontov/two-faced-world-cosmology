// Visual constants
export const COLORS = {
  background: 0x0a0a1a,
  sunYellow: 0xFFD700,
  sunRed: 0xFF4500,
  orbitOrange: 0xFFA000,
};

// Sun system configuration
export const SUN_DATA = {
  yellow: {
    name: "Желтое Солнце",
    type: "Star",
    radius: 30,
    orbitalPeriod: 336,
    orbitRadius: 100,
    color: COLORS.sunYellow,
    startAngle: 2 * Math.PI
  },
  red: {
    name: "Красное Солнце",
    type: "Star",
    radius: 30,
    orbitalPeriod: 336,
    orbitRadius: 100,
    color: COLORS.sunRed,
    startAngle: Math.PI
  },
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
