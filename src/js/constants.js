import { createGasGiantTexture } from './textureGenerators.js';
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
    radius: 5,
    orbitalPeriod: 1416, // 59 Earth days
    orbitRadius: 285,
    color: 0x888888,
    description: 'Маленькая горячая планета, ближайшая к солнцам. (59 дней)'
  },
  {
    name: 'Вторая',
    type: "Planet",
    radius: 8,
    orbitalPeriod: 5400, // 225 Earth days
    orbitRadius: 380,
    color: 0xAA7755,
    description: 'Скалистая планета среднего размера. (225 дней)'
  },
  {
    name: 'Сатурн',
    type: "Planet",
    radius: 11,
    orbitalPeriod: 181440, // 22.5 Earth years
    orbitRadius: 600,
    color: 0xD4A843,
    textureGeneratorFunc: createGasGiantTexture,
    textureGeneratorParams: {baseColor: 0xD4A843},
    description: 'Газовый гигант с кольцами — центральный объект системы. (22.5 лет)',
    rings: [
      // opacity - the ring opacity will be from opacity to 1.0. 1.0 on the edges and opacity value in the center of a ring.
      { innerRadius: 16, outerRadius: 19, color: 0xC8A868, opacity: 0.7 },  // Inner
      { innerRadius: 20, outerRadius: 25, color: 0xD4B878, opacity: 0.85 }, // Middle
      { innerRadius: 26, outerRadius: 30, color: 0xB89858, opacity: 0.6 },  // Outer
    ],
    moons: [
        {
          name: 'Мимас',
          type: 'Moon',
          radius: 3,
          orbitalPeriod: 24, // 1.0 Earth days
          orbitRadius: 38,
          color: 0x8B0000,
          description: 'Мир Императора. Мир с развитой цивилизацией, имперский город-государство.',
          isInhabited: true
        },
        {
          name: 'Энцелад',
          type: 'Moon',
          radius: 3.5,
          orbitalPeriod: 48.0024, // 2.0001 Earth days
          orbitRadius: 47,
          color: 0xF4A460,
          description: 'Планета разумного существа, огромный океан живой субстанции. Весь мир — один организм.',
          isInhabited: true
        },
        {
          name: 'Тефия',
          type: 'Moon',
          radius: 3.2,
          orbitalPeriod: 96.0048, // 4.0002 Earth days
          orbitRadius: 56,
          color: 0x6495ED,
          description: 'Полузатопленный мир, портовые города на островах и побережьях.',
          isInhabited: true
        },
        {
          name: 'Диона',
          type: 'Moon',
          radius: 3.8,
          orbitalPeriod: 192.0096, // 8.0004 Earth days
          orbitRadius: 65,
          color: 0xBBAA99,
          description: 'TBD',
          isInhabited: true
        },
        {
          name: 'Рея',
          type: 'Moon',
          radius: 4,
          orbitalPeriod: 384.0192, // 16.0008 Earth days
          orbitRadius: 75,
          color: 0x228B22,
          description: 'Мир Песнопевцев и Слепцов. Зелёный мир с растительностью, джунгли, грибы, споры.',
          isInhabited: true
        },
        {
          name: 'Титан',
          type: 'Moon',
          radius: 4.5,
          orbitalPeriod: 768.0384, // 32.0016 Earth days
          orbitRadius: 85,
          color: 0xFFF0F5,
          description: 'Скалистый мир алмазов и суровых воинов.',
          isInhabited: true
        },
        {
          name: 'Япет',
          type: 'Moon',
          radius: 3.5,
          orbitalPeriod: 1536.0768, // 64.0032 Earth days
          orbitRadius: 96,
          color: 0x8B008B,
          description: 'Мир Сумерек и Рассвета. Тёмный и ледяной мир с биолюминесценцией ночью; пылающая огнём пустыня днём.',
          isInhabited: true
        },
    ]
  },
  {
    name: 'Четвёртая',
    type: "Planet",
    radius: 14,
    orbitalPeriod: 806400, // 100 Earth years
    orbitRadius: 820,
    color: 0xCC8855,
    description: 'Газовый гигант, поменьше Сатурна. (100 лет)'
  },
  {
    name: 'Пятая',
    type: "Planet",
    radius: 12,
    orbitalPeriod: 1330560, // 165 Earth years
    orbitRadius: 950,
    color: 0x88BBDD,
    description: 'Ледяной гигант. (165 лет)'
  },
  {
    name: 'Внешняя',
    type: "Planet",
    radius: 6,
    orbitalPeriod: 63753984, // 7906 Earth years
    orbitRadius: 1180,
    color: 0x666688,
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
