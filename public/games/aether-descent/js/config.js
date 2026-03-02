/* ═══════════════════════════════════════════════════════
   Aether Descent — Config & Constants
   ═══════════════════════════════════════════════════════ */
window.AD = window.AD || {};

AD.COLORS = {
  cyan:       0x00f5ff,
  purple:     0xa855f7,
  navy:       0x0a0f1e,
  darkNavy:   0x060a14,
  white:      0xffffff,
  green:      0x4ade80,
  red:        0xef4444,
  orange:     0xf59e0b,
  yellow:     0xfde047,
  pink:       0xf472b6,
  darkGray:   0x1e293b,
  midGray:    0x334155,
  lightGray:  0x94a3b8,
};

AD.CSS = {
  cyan:      '#00f5ff',
  purple:    '#a855f7',
  navy:      '#0a0f1e',
  green:     '#4ade80',
  red:       '#ef4444',
  orange:    '#f59e0b',
  yellow:    '#fde047',
  white:     '#ffffff',
  darkGray:  '#1e293b',
};

AD.GAME_WIDTH  = 800;
AD.GAME_HEIGHT = 600;

AD.PHYSICS = {
  baseGravity:      0.0005,
  thrustPower:       0.0028,
  rotationSpeed:     0.04,
  maxVelocity:       8,
  fuelBurnRate:      0.8,
  startFuel:         100,
  maxLandSpeed:      2.0,
  maxLandAngle:      0.26,   // ~15 degrees in radians
  perfectSpeed:      0.7,
  perfectAngle:      0.087,  // ~5 degrees
};

AD.SCORING = {
  shardValue:        100,
  fuelValue:         10,
  timeValue:         5,
  timeLimit:         90,     // seconds
  perfectMultiplier: 5,
  goodMultiplier:    3,
  okMultiplier:      1,
};

AD.UPGRADE_COSTS = [100, 250, 500, 1000, 2000];
AD.MAX_UPGRADE_LEVEL = 5;

AD.KEYS = {
  STORAGE_PREFIX: 'ad_',
};
