// Visual constants
export const COLORS = {
  background: 0x0a0a1a,
  sunYellow: 0xFFD700,
  sunRed: 0xFF4500,
  orbitOrange: 0xFFA000,
  orbitPlanet: 0x6666AA,
  firmamentCone: 0xFFBF00
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

// Binary system orbital period in hours (14 days)
export const SUNS_ORBITAL_PERIOD = 336;

// Sun system configuration
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

// Planet data with orbital periods in hours
export const PLANETS_DATA = [
  {
    name: 'Внутренняя',
    color: 0x888888,
    radius: 5,
    orbitRadius: 285,
    period: 1416, // 59 Earth days
    description: 'Маленькая горячая планета, ближайшая к солнцам. (59 дней)'
  },
  {
    name: 'Вторая',
    color: 0xAA7755,
    radius: 8,
    orbitRadius: 380,
    period: 5400, // 225 Earth days
    description: 'Скалистая планета среднего размера. (225 дней)'
  },
  {
    name: 'Сатурн',
    color: 0xD4A843,
    radius: 11,
    orbitRadius: 600,
    period: 181440, // 22.5 Earth years
    description: 'Газовый гигант с кольцами — центральный объект системы. (22.5 лет)',
    isSaturn: true
  },
  {
    name: 'Четвёртая',
    color: 0xCC8855,
    radius: 14,
    orbitRadius: 820,
    period: 806400, // 100 Earth years
    description: 'Газовый гигант, поменьше Сатурна. (100 лет)'
  },
  {
    name: 'Пятая',
    color: 0x88BBDD,
    radius: 12,
    orbitRadius: 950,
    period: 1330560, // 165 Earth years
    description: 'Ледяной гигант. (165 лет)'
  },
  {
    name: 'Внешняя',
    color: 0x666688,
    radius: 6,
    orbitRadius: 1180,
    period: 63753984, // 7906 Earth years
    description: 'Далёкая маленькая планета. (7906 лет)'
  },
];

// Saturn-specific data
export const SATURN_DATA = {
  rings: [
    { innerRadius: 16, outerRadius: 19, color: 0xC8A868, opacity: 0.7 },  // Inner
    { innerRadius: 20, outerRadius: 25, color: 0xD4B878, opacity: 0.85 }, // Middle
    { innerRadius: 26, outerRadius: 30, color: 0xB89858, opacity: 0.6 },  // Outer
  ],
  ringColors: [0xC8A868, 0xD4B878, 0xB89858],
};

// Saturn moons data (periods in hours, based on real Saturn moons)
export const MOONS_DATA = [
  {
    name: 'Мимас',
    color: 0x8B0000,
    radius: 3,
    orbitRadius: 38,
    period: 23, // 0.94 Earth days
    description: 'Мир Императора. Мир с развитой цивилизацией, имперский город-государство.',
    isInhabited: true
  },
  {
    name: 'Энцелад',
    color: 0xF4A460,
    radius: 3.5,
    orbitRadius: 47,
    period: 33, // 1.37 Earth days
    description: 'Планета разумного существа, огромный океан живой субстанции. Весь мир — один организм.',
    isInhabited: true
  },
  {
    name: 'Тефия',
    color: 0x6495ED,
    radius: 3.2,
    orbitRadius: 56,
    period: 45, // 1.89 Earth days
    description: 'Полузатопленный мир, портовые города на островах и побережьях.',
    isInhabited: true
  },
  {
    name: 'Диона',
    color: 0xBBAA99,
    radius: 3.8,
    orbitRadius: 65,
    period: 66, // 2.74 Earth days
    description: 'TBD',
    isInhabited: true
  },
  {
    name: 'Рея',
    color: 0x228B22,
    radius: 4,
    orbitRadius: 75,
    period: 108, // 4.52 Earth days
    description: 'Мир Песнопевцев и Слепцов. Зелёный мир с растительностью, джунгли, грибы, споры.',
    isInhabited: true
  },
  {
    name: 'Титан',
    color: 0xFFF0F5,
    radius: 4.5,
    orbitRadius: 85,
    period: 383, // 15.95 Earth days
    description: 'Скалистый мир алмазов и суровых воинов.',
    isInhabited: true
  },
  {
    name: 'Япет',
    color: 0x8B008B,
    radius: 3.5,
    orbitRadius: 96,
    period: 1904, // 79.32 Earth days
    description: 'Мир Сумерек и Рассвета. Тёмный и ледяной мир с биолюминесценцией ночью; пылающая огнём пустыня днём.',
    isInhabited: true
  },
];

// Camera configuration
export const CAMERA_CONFIG = {
  frustumSize: 1500, // Increased from 1000 to fit Saturn's orbit (radius 600, diameter 1200) + Saturn's moons
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
