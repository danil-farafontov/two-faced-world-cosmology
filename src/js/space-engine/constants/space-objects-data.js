import { COLORS } from './constants.js';
import { createGasGiantTexture } from '../utils/texture-generators.js';

// Sun system configuration
export const SPACE_OBJECTS = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    name: 'Внутренняя',
    type: "Planet",
    radius: 5,
    orbitalPeriod: 1416, // 59 Earth days
    orbitRadius: 275,
    color: 0x888888,
    description: 'Маленькая горячая планета, ближайшая к солнцам. (59 дней)'
  },
  {
    id: 4,
    name: 'Вторая',
    type: "Planet",
    radius: 8,
    orbitalPeriod: 5400, // 225 Earth days
    orbitRadius: 370,
    color: 0xAA7755,
    description: 'Скалистая планета среднего размера. (225 дней)'
  },
  {
    id: 5,
    name: 'Сатурн',
    type: "Planet",
    radius: 11,
    orbitalPeriod: 181440, // 22.5 Earth years
    orbitRadius: 600,
    color: 0xD4A843,
    textureGeneratorFunc: createGasGiantTexture,
    textureGeneratorParams: {baseColor: 0xD4A843},
    description: 'Газовый гигант с кольцами — его спутники населенные. (22.5 лет)',
    rings: [
      // opacity - the ring opacity will be from opacity to 1.0. 1.0 on the edges and opacity value in the center of a ring.
      { innerRadius: 16, outerRadius: 19, color: 0xC8A868, opacity: 0.7 },  // Inner
      { innerRadius: 20, outerRadius: 25, color: 0xD4B878, opacity: 0.85 }, // Middle
      { innerRadius: 26, outerRadius: 30, color: 0xB89858, opacity: 0.6 },  // Outer
    ],
    moons: [
        {
          id: 6,
          name: 'Мимас',
          type: 'Moon',
          radius: 3,
          orbitalPeriod: 24, // 1.0 Earth days
          orbitRadius: 39,
          color: 0x8B0000,
          description: 'Мир Императора. Мир с развитой цивилизацией. Сатуриновый Трон.',
          isInhabited: true
        },
        {
          id: 7,
          name: 'Энцелад',
          type: 'Moon',
          radius: 3.5,
          orbitalPeriod: 48.0024, // 2.0001 Earth days
          orbitRadius: 49,
          color: 0xF4A460,
          description: 'Спутник - разумное существо, огромный океан живой субстанции. Весь мир — один организм.',
          isInhabited: true
        },
        {
          id: 8,
          name: 'Тефия',
          type: 'Moon',
          radius: 3.2,
          orbitalPeriod: 96.0048, // 4.0002 Earth days
          orbitRadius: 59,
          color: 0x6495ED,
          description: 'Полузатопленный мир, портовые города на островах и побережьях.',
          isInhabited: true
        },
        {
          id: 9,
          name: 'Диона',
          type: 'Moon',
          radius: 3.8,
          orbitalPeriod: 192.0096, // 8.0004 Earth days
          orbitRadius: 69,
          color: 0xBBAA99,
          description: 'TBD',
          isInhabited: true
        },
        {
          id: 10,
          name: 'Рея',
          type: 'Moon',
          radius: 4,
          orbitalPeriod: 384.0192, // 16.0008 Earth days
          orbitRadius: 79,
          color: 0x228B22,
          description: 'Мир Песнопевцев и Слепцов. Зелёный мир с растительностью, джунгли, грибы, споры.',
          isInhabited: true
        },
        {
          id: 11,
          name: 'Титан',
          type: 'Moon',
          radius: 4.5,
          orbitalPeriod: 768.0384, // 32.0016 Earth days
          orbitRadius: 89,
          color: 0xFFF0F5,
          description: 'Скалистый мир алмазов и суровых воинов.',
          isInhabited: true
        },
        {
          id: 12,
          name: 'Япет',
          type: 'Moon',
          radius: 3.5,
          orbitalPeriod: 1536.0768, // 64.0032 Earth days
          orbitRadius: 99,
          color: 0x8B008B,
          description: 'Мир Сумерек и Рассвета. Тёмный и ледяной мир с биолюминесценцией ночью; пылающая огнём пустыня днём.',
          isInhabited: true
        },
    ]
  },
  {
    id: 13,
    name: 'Четвёртая',
    type: "Planet",
    radius: 14,
    orbitalPeriod: 806400, // 100 Earth years
    orbitRadius: 850,
    color: 0xCC8855,
    description: 'Газовый гигант, поменьше Сатурна. (100 лет)'
  },
  {
    id: 14,
    name: 'Пятая',
    type: "Planet",
    radius: 12,
    orbitalPeriod: 1330560, // 165 Earth years
    orbitRadius: 990,
    color: 0x88BBDD,
    description: 'Ледяной гигант. (165 лет)'
  },
  {
    id: 15,
    name: 'Внешняя',
    type: "Planet",
    radius: 6,
    orbitalPeriod: 63753984, // 7906 Earth years
    orbitRadius: 1180,
    color: 0x666688,
    description: 'Далёкая маленькая планета. (7906 лет)'
  }
];
