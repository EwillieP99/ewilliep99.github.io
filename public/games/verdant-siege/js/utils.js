/* ── Verdant Siege – utils.js ── */

const VS = {
  WIDTH: 1280,
  HEIGHT: 720,
  SIDEBAR_W: 105,
  HUD_H: 44,
  TILE: 40,
  START_MANA: 200,
  START_LIVES: 20,
  PASSIVE_MANA: 5,
  SPEEDS: [1, 2, 3],

  /* colours */
  C_BG:       0x060e08,
  C_GREEN:    0x2d7a3a,
  C_DARK:     0x0a1a0f,
  C_LIGHT:    0x5aaf6a,
  C_GOLD:     0xffd700,
  C_RED:      0xcc3333,
  C_WHITE:    0xffffff,
  C_PANEL:    0x0c1a10,
  C_PANEL_LT: 0x142a18,
  C_TILE_OK:  0x2d7a3a,
  C_TILE_BAD: 0x7a2d2d,
  C_MANA:     0x44aaff,
  C_PATH:     0x3a2a1a,

  /* tower defs */
  TOWER_DEFS: [
    { id: 'thornspitter', name: 'Thorn',  cost: 50,  range: 140, damage: 8,  rate: 400,  color: 0x6b8e23, desc: 'Fast single-target',  type: 'physical', projColor: 0xaacc33, projSpeed: 7 },
    { id: 'vinetrapper',  name: 'Vine',   cost: 75,  range: 120, damage: 5,  rate: 1200, color: 0x228b22, desc: 'Slow + damage',        type: 'physical', projColor: 0x33aa55, projSpeed: 5 },
    { id: 'bloombomber',  name: 'Bloom',  cost: 100, range: 130, damage: 15, rate: 1500, color: 0xff69b4, desc: 'AoE splash',           type: 'physical', projColor: 0xff88cc, projSpeed: 4 },
    { id: 'moonflower',   name: 'Moon',   cost: 120, range: 160, damage: 12, rate: 800,  color: 0x9370db, desc: 'Magic + anti-air',     type: 'magic',    projColor: 0xbb88ff, projSpeed: 8 },
    { id: 'heartlily',    name: 'Heart',  cost: 90,  range: 100, damage: 0,  rate: 2000, color: 0xff6b6b, desc: 'Heal tree + buff',     type: 'support',  projColor: 0xff8888, projSpeed: 0 },
  ],

  /* enemy defs */
  ENEMY_DEFS: {
    wisp:       { id: 'wisp',       name: 'Wisp',       hp: 30,   speed: 2.5, armor: 0, reward: 8,  flying: true,  color: 0x87ceeb, scale: 0.7 },
    crawler:    { id: 'crawler',    name: 'Crawler',    hp: 120,  speed: 1.0, armor: 3, reward: 15, flying: false, color: 0x8b4513, scale: 1.0 },
    thornbeast: { id: 'thornbeast', name: 'Thornbeast', hp: 200,  speed: 0.8, armor: 5, reward: 25, flying: false, color: 0x556b2f, scale: 1.2 },
    specter:    { id: 'specter',    name: 'Specter',    hp: 80,   speed: 1.8, armor: 0, reward: 20, flying: false, color: 0x9932cc, scale: 0.9, magicOnly: true },
    swarmer:    { id: 'swarmer',    name: 'Swarmer',    hp: 15,   speed: 2.2, armor: 0, reward: 3,  flying: false, color: 0xdaa520, scale: 0.5 },
    blightlord: { id: 'blightlord', name: 'BlightLord', hp: 1500, speed: 0.5, armor: 8, reward: 100,flying: false, color: 0x8b0000, scale: 1.8, boss: true },
  },

  /* upgrade cost per tower level */
  UPGRADE_COSTS: [0, 40, 80, 150],
};

/* ── Save / Load ── */
const SaveManager = {
  KEY: 'verdant_siege_save',

  defaults() {
    return {
      highScores: {},
      stars: {},
      totalEssence: 0,
      unlockedMaps: [0],
      upgradeLevels: {},
      achievements: {},
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) {
        const d = this.defaults();
        const parsed = JSON.parse(raw);
        return { ...d, ...parsed };
      }
    } catch (e) { /* ignore */ }
    return this.defaults();
  },

  save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  },

  clear() { localStorage.removeItem(this.KEY); },
};

/* ── Math Helpers ── */
function dist(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function lerpPos(p1, p2, t) {
  return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

/* ── Easing helpers for polish ── */
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeOutElastic(t) {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
}

/* ── Color utilities ── */
function colorBrighter(hex, factor) {
  const r = Math.min(255, ((hex >> 16) & 0xff) * factor) | 0;
  const g = Math.min(255, ((hex >> 8) & 0xff) * factor) | 0;
  const b = Math.min(255, (hex & 0xff) * factor) | 0;
  return (r << 16) | (g << 8) | b;
}

function colorDarker(hex, factor) {
  const r = ((hex >> 16) & 0xff) * factor | 0;
  const g = ((hex >> 8) & 0xff) * factor | 0;
  const b = (hex & 0xff) * factor | 0;
  return (r << 16) | (g << 8) | b;
}

function hexToStr(hex) {
  return '#' + hex.toString(16).padStart(6, '0');
}

/* ── Procedural Audio (WebAudio) ── */
const SFX = {
  _ctx: null,
  _vol: null,
  _enabled: true,

  init() {
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._vol = this._ctx.createGain();
      this._vol.gain.value = 0.3;
      this._vol.connect(this._ctx.destination);
    } catch (e) { this._enabled = false; }
  },

  resume() {
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
  },

  _tone(freq, dur, type, vol, detune) {
    if (!this._enabled || !this._ctx) return;
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    g.gain.setValueAtTime(vol || 0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(g);
    g.connect(this._vol);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  },

  _noise(dur, vol) {
    if (!this._enabled || !this._ctx) return;
    const ctx = this._ctx;
    const bufSize = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol || 0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(g);
    g.connect(this._vol);
    src.start(ctx.currentTime);
  },

  shoot(type) {
    if (type === 'magic') {
      this._tone(600, 0.12, 'sine', 0.08);
      this._tone(900, 0.08, 'sine', 0.05, 10);
    } else if (type === 'support') {
      this._tone(440, 0.2, 'sine', 0.06);
      this._tone(660, 0.15, 'sine', 0.04);
    } else {
      this._tone(200 + Math.random() * 100, 0.08, 'square', 0.06);
    }
  },

  explosion() {
    this._noise(0.25, 0.12);
    this._tone(80, 0.2, 'sine', 0.1);
  },

  enemyDeath() {
    this._tone(400 + Math.random() * 200, 0.1, 'sine', 0.07);
    this._noise(0.06, 0.04);
  },

  bossDeath() {
    this._noise(0.4, 0.15);
    this._tone(60, 0.4, 'sine', 0.12);
    this._tone(120, 0.3, 'triangle', 0.08);
  },

  place() {
    this._tone(330, 0.08, 'sine', 0.08);
    this._tone(440, 0.06, 'sine', 0.06);
  },

  upgrade() {
    this._tone(440, 0.1, 'sine', 0.08);
    this._tone(550, 0.1, 'sine', 0.07);
    this._tone(660, 0.12, 'sine', 0.09);
  },

  sell() {
    this._tone(300, 0.1, 'sawtooth', 0.06);
    this._tone(200, 0.12, 'sawtooth', 0.04);
  },

  waveStart() {
    this._tone(220, 0.15, 'triangle', 0.1);
    this._tone(330, 0.1, 'triangle', 0.08);
    this._tone(440, 0.12, 'triangle', 0.1);
  },

  victory() {
    const notes = [440, 550, 660, 880];
    notes.forEach((f, i) => {
      setTimeout(() => this._tone(f, 0.3, 'sine', 0.1), i * 150);
    });
  },

  defeat() {
    this._tone(220, 0.4, 'sawtooth', 0.08);
    setTimeout(() => this._tone(180, 0.5, 'sawtooth', 0.06), 200);
    setTimeout(() => this._tone(140, 0.6, 'sawtooth', 0.04), 400);
  },

  click() {
    this._tone(800, 0.04, 'sine', 0.05);
  },

  manaPickup() {
    this._tone(600 + Math.random() * 200, 0.06, 'sine', 0.04);
  },

  treeDamage() {
    this._tone(150, 0.15, 'sawtooth', 0.08);
    this._noise(0.1, 0.06);
  },
};

/* ── Floating Text (damage numbers, mana pickups, etc.) ── */
function floatingText(scene, x, y, text, color, size) {
  const t = scene.add.text(x, y, text, {
    fontSize: (size || 14) + 'px',
    fill: color || '#ffffff',
    fontFamily: 'monospace',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2,
  }).setOrigin(0.5).setDepth(25);

  scene.tweens.add({
    targets: t,
    y: y - 30 - Math.random() * 15,
    alpha: 0,
    scale: 1.3,
    duration: 700,
    ease: 'Power2',
    onComplete: () => t.destroy(),
  });
}
