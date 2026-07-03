// Visual constants
export const COLORS = {
  background: 0x0a0a1a,
  sunYellow: 0xFFD700,
  sunRed: 0xFF4500,
  orbitOrange: 0xFFA000,
};

// Sun system configuration
export const SPACE_OBJECTS = [
  {
    name: "Желтое Солнце",
    type: "Star",
    radius: 30,
    orbitalPeriod: 336,
    orbitRadius: 100,
    color: COLORS.sunYellow,
    startAngle: 2 * Math.PI,
    glowEnabled: true
  },
  {
    name: "Красное Солнце",
    type: "Star",
    radius: 30,
    orbitalPeriod: 336,
    orbitRadius: 100,
    color: COLORS.sunRed,
    startAngle: Math.PI,
    glowEnabled: true
  },
  {
    name: 'Внутренняя',
    type: "Planet",
    color: 0x888888,
    radius: 5,
    orbitRadius: 285,
    orbitalPeriod: 1416, // 59 Earth days
    description: 'Маленькая горячая планета, ближайшая к солнцам. (59 дней)'
  },
  {
    name: 'Вторая',
    type: "Planet",
    color: 0xAA7755,
    radius: 8,
    orbitRadius: 380,
    orbitalPeriod: 5400, // 225 Earth days
    description: 'Скалистая планета среднего размера. (225 дней)'
  },
  {
    name: 'Сатурн',
    type: "Planet",
    color: 0xD4A843,
    radius: 11,
    orbitRadius: 600,
    orbitalPeriod: 181440, // 22.5 Earth years
    description: 'Газовый гигант с кольцами — центральный объект системы. (22.5 лет)',
    isSaturn: true
  },
  {
    name: 'Четвёртая',
    type: "Planet",
    color: 0xCC8855,
    radius: 14,
    orbitRadius: 820,
    orbitalPeriod: 806400, // 100 Earth years
    description: 'Газовый гигант, поменьше Сатурна. (100 лет)'
  },
  {
    name: 'Пятая',
    type: "Planet",
    color: 0x88BBDD,
    radius: 12,
    orbitRadius: 950,
    orbitalPeriod: 1330560, // 165 Earth years
    description: 'Ледяной гигант. (165 лет)'
  },
  {
    name: 'Внешняя',
    type: "Planet",
    color: 0x666688,
    radius: 6,
    orbitRadius: 1180,
    orbitalPeriod: 63753984, // 7906 Earth years
    description: 'Далёкая маленькая планета. (7906 лет)'
  }
];

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
