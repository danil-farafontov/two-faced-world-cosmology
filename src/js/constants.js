const onethousandkm = 0.005098919;
// Visual constants
export const COLORS = {
  background: 0x0a0a1a,
  sunYellow: 0xFFD700,
  sunRed: 0xFF4500,
  orbitYellow: 0xFFD700,
  orbitRed: 0xFF4500,
  orbitPlanet: 0x6666AA,
};

// Sun system configuration
// -------------------- Good scale for Suns
// "Real" distance between suns should be 19 612 000
// 19 612 000 = 100px
// 1px = 196 120
//
// The closest gravitationally safe orbit for a P-type planet 
// around these 14-day twin stars is 55,894,000 kilometers.
// A single year on a closest planet would last exactly 59 Earth days.
// 55 894 000 / 196 120 = 285px
//
// Saturn:
// 1 550 000 000 / 196 120 = 7903px
//
// -------------------- Good scale for Saturn
//
// Saturn
// 1 550 000 000 / 3 000 000 = 516,666666667px - Saturn orbit
// then the closest 55,894,000 kilometers
// 55,894,000 / 3 000 000 = 18,631333333px - the closest planet... 
//
//----------------- Conclusion:
// We can't display realistic scale to fit all planets and suns on the screen in such way that they will be visible
// We set orbitRadius



export const SUN_DATA = {
  yellow: {
    radius: 30,
    orbitRadius: 100,
    color: COLORS.sunYellow,
  },
  red: {
    radius: 30,
    orbitRadius: 100,
    color: COLORS.sunRed,
  },
};

// Orbital periods in hours (time for one full revolution)
export const ORBITAL_PERIODS = {
  binarySystem: 336, // Both suns complete a revolution in 336 hours (14 days)
  planets: [
    1416,    // Внутренняя (59 days)
    5400,    // Вторая (225 days)
    181440,    // Сатурн (22.5 years)
    806400,    // Четвёртая (100 years)
    1330560,   // Пятая (165 years)
    63753984,   // Внешняя (7906 years)
  ],
};

// Planet data
export const PLANETS_DATA = [
  { name: 'Внутренняя', color: 0x888888, radius: 5,   orbitRadius: 285, description: 'Маленькая горячая планета, ближайшая к солнцам.' },
  { name: 'Вторая',     color: 0xAA7755, radius: 8,   orbitRadius: 380, description: 'Скалистая планета среднего размера.' },
  { name: 'Сатурн',     color: 0xD4A843, radius: 11,  orbitRadius: 600, description: 'Газовый гигант с кольцами — центральный объект системы.', isSaturn: true },
  { name: 'Четвёртая',  color: 0xCC8855, radius: 14,  orbitRadius: 720, description: 'Газовый гигант, поменьше Сатурна.' },
  { name: 'Пятая',      color: 0x88BBDD, radius: 12,  orbitRadius: 850, description: 'Ледяной гигант.' },
  { name: 'Внешняя',    color: 0x666688, radius: 6,   orbitRadius: 1080, description: 'Далёкая маленькая планета.' },
];

// Camera configuration
export const CAMERA_CONFIG = {
  frustumSize: 1000,
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
