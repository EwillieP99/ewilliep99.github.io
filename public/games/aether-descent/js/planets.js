/* ═══════════════════════════════════════════════════════
   Aether Descent — Planet Definitions
   ═══════════════════════════════════════════════════════ */
AD.Planets = [
  {
    id: 0, name: 'Luna Prime',
    gravity: 0.3, wind: 0, padWidth: 100, shardCount: 5, hazards: [],
    terrainColor: 0x4a5568, bgColor: 0x0a0f1e,
    desc: 'Training grounds. Low gravity, calm skies.',
    terrain: [0,480, 100,460, 200,470, 340,440, 380,440, 500,465, 600,450, 700,470, 800,480],
    pads: [{ x: 360, y: 438 }],
  },
  {
    id: 1, name: 'Dust Veil',
    gravity: 0.4, wind: 0, padWidth: 90, shardCount: 6, hazards: [],
    terrainColor: 0x78350f, bgColor: 0x1a0f0a,
    desc: 'Sandy craters. Watch the dunes.',
    terrain: [0,490, 80,470, 180,450, 260,470, 350,430, 420,430, 520,460, 620,440, 720,460, 800,490],
    pads: [{ x: 385, y: 428 }],
  },
  {
    id: 2, name: 'Frost Haven',
    gravity: 0.5, wind: 0.15, padWidth: 85, shardCount: 7, hazards: [],
    terrainColor: 0x7dd3fc, bgColor: 0x0c1524,
    desc: 'Icy plains. Slight crosswinds.',
    terrain: [0,485, 100,460, 200,445, 300,460, 400,425, 470,425, 570,450, 670,440, 770,465, 800,485],
    pads: [{ x: 435, y: 423 }],
  },
  {
    id: 3, name: 'Ember Rock',
    gravity: 0.6, wind: 0.2, padWidth: 80, shardCount: 8, hazards: ['geyser'],
    terrainColor: 0xdc2626, bgColor: 0x1a0505,
    desc: 'Volcanic surface. Geysers erupt unpredictably.',
    terrain: [0,490, 70,470, 140,440, 240,460, 330,420, 400,420, 490,455, 560,435, 650,450, 740,460, 800,490],
    pads: [{ x: 365, y: 418 }],
  },
  {
    id: 4, name: 'Aether Falls',
    gravity: 0.7, wind: 0.3, padWidth: 75, shardCount: 9, hazards: ['asteroid'],
    terrainColor: 0x6d28d9, bgColor: 0x0f0520,
    desc: 'Floating debris fields. Dodge the asteroids.',
    terrain: [0,495, 90,465, 180,450, 270,465, 370,415, 440,415, 530,445, 630,430, 730,460, 800,495],
    pads: [{ x: 405, y: 413 }],
  },
  {
    id: 5, name: 'Neon Drift',
    gravity: 0.8, wind: 0.35, padWidth: 70, shardCount: 10, hazards: ['asteroid'],
    terrainColor: 0x22d3ee, bgColor: 0x051520,
    desc: 'Luminous canyons. Strong crosswinds.',
    terrain: [0,490, 80,460, 160,435, 260,460, 360,405, 420,405, 510,440, 610,425, 710,455, 800,490],
    pads: [{ x: 390, y: 403 }],
  },
  {
    id: 6, name: 'Storm Gate',
    gravity: 0.85, wind: 0.4, padWidth: 70, shardCount: 11, hazards: ['lightning'],
    terrainColor: 0x334155, bgColor: 0x080c14,
    desc: 'Electrical storms. Watch for lightning zones.',
    terrain: [0,495, 100,460, 200,440, 300,455, 380,400, 440,400, 540,435, 640,420, 740,450, 800,495],
    pads: [{ x: 410, y: 398 }],
  },
  {
    id: 7, name: 'Coral Depths',
    gravity: 0.9, wind: 0.3, padWidth: 65, shardCount: 12, hazards: ['geyser', 'asteroid'],
    terrainColor: 0xf472b6, bgColor: 0x1a0515,
    desc: 'Organic terrain. Geysers and debris.',
    terrain: [0,490, 90,455, 180,440, 280,460, 370,395, 430,395, 530,430, 630,415, 730,445, 800,490],
    pads: [{ x: 400, y: 393 }],
  },
  {
    id: 8, name: 'Iron Maw',
    gravity: 1.0, wind: 0.45, padWidth: 60, shardCount: 13, hazards: ['magnetic', 'asteroid'],
    terrainColor: 0x78716c, bgColor: 0x0a0a08,
    desc: 'Heavy gravity. Magnetic interference.',
    terrain: [0,495, 80,460, 170,435, 270,455, 360,390, 415,390, 510,425, 610,410, 720,445, 800,495],
    pads: [{ x: 387, y: 388 }],
  },
  {
    id: 9, name: 'Phantom Ring',
    gravity: 1.2, wind: 0.5, padWidth: 55, shardCount: 14, hazards: ['lightning', 'asteroid'],
    terrainColor: 0x581c87, bgColor: 0x0a0318,
    desc: 'Gravity surges. Electrical storms rage.',
    terrain: [0,490, 90,450, 180,430, 280,450, 365,385, 415,385, 510,420, 620,405, 730,440, 800,490],
    pads: [{ x: 390, y: 383 }],
  },
  {
    id: 10, name: 'Void Cradle',
    gravity: 1.5, wind: 0.55, padWidth: 50, shardCount: 15, hazards: ['lightning', 'magnetic', 'geyser'],
    terrainColor: 0x1e1b4b, bgColor: 0x030308,
    desc: 'Crushing gravity. Every hazard known.',
    terrain: [0,495, 80,455, 170,430, 270,450, 360,380, 405,380, 500,415, 610,400, 720,435, 800,495],
    pads: [{ x: 382, y: 378 }],
  },
  {
    id: 11, name: 'Aether Core',
    gravity: 1.8, wind: 0.6, padWidth: 45, shardCount: 18, hazards: ['lightning', 'magnetic', 'geyser', 'asteroid'],
    terrainColor: 0xfbbf24, bgColor: 0x0a0800,
    desc: 'The final descent. Survive everything.',
    terrain: [0,490, 90,445, 180,425, 270,445, 355,375, 395,375, 490,410, 600,395, 720,430, 800,490],
    pads: [{ x: 375, y: 373 }],
  },
];

AD.generateEndlessPlanet = function(depth) {
  const grav = 0.4 + depth * 0.15;
  const wind = Math.min(depth * 0.08, 0.8);
  const padW = Math.max(90 - depth * 5, 30);
  const hazardPool = ['asteroid', 'lightning', 'geyser', 'magnetic'];
  const hazards = hazardPool.slice(0, Math.min(Math.floor(depth / 2) + 1, 4));
  const baseY = 480;
  const terrain = [0, baseY];
  const padX = 200 + Math.random() * 400;
  const padY = 370 + Math.random() * 60;
  for (let x = 60; x < 800; x += 60 + Math.random() * 40) {
    const nearPad = Math.abs(x - padX) < padW;
    const y = nearPad ? padY : baseY - 20 - Math.random() * 80;
    terrain.push(x, y);
  }
  terrain.push(800, baseY);
  return {
    id: 100 + depth, name: 'Depth ' + (depth + 1),
    gravity: grav, wind: wind, padWidth: padW,
    shardCount: 8 + depth * 2, hazards: hazards,
    terrainColor: Phaser.Display.Color.HSVToRGB(Math.random(), 0.6, 0.5).color,
    bgColor: 0x060a14,
    desc: 'Endless descent — depth ' + (depth + 1),
    terrain: terrain,
    pads: [{ x: padX, y: padY - 2 }],
  };
};
