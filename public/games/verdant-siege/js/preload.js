/* ── Verdant Siege – preload.js ── */

class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  // POLISH ADD - Load Kenney tower defense kit assets
  preload() {
    const K = 'assets/kenney/';

    /* Kenney tower sprites (replace procedural with HD isometric) */
    this.load.image('k_tower_thornspitter', K + 'tower-thornspitter.png');
    this.load.image('k_tower_vinetrapper',  K + 'tower-vinetrapper.png');
    this.load.image('k_tower_bloombomber',  K + 'tower-bloombomber.png');
    this.load.image('k_tower_moonflower',   K + 'tower-moonflower.png');
    this.load.image('k_tower_heartlily',    K + 'tower-heartlily.png');

    /* Kenney tree, spawn, selection */
    this.load.image('k_tree',       K + 'heart-tree.png');
    this.load.image('k_spawn',      K + 'spawn-portal.png');
    this.load.image('k_selection',  K + 'selection.png');

    /* Kenney projectiles */
    this.load.image('k_ammo_arrow',      K + 'ammo-arrow.png');
    this.load.image('k_ammo_boulder',    K + 'ammo-boulder.png');
    this.load.image('k_ammo_cannonball', K + 'ammo-cannonball.png');
    this.load.image('k_ammo_bullet',     K + 'ammo-bullet.png');

    /* Kenney decorations */
    this.load.image('k_deco_crystal',       K + 'deco-crystal.png');
    this.load.image('k_deco_crystal_large', K + 'deco-crystal-large.png');
    this.load.image('k_deco_rocks',         K + 'deco-rocks.png');
    this.load.image('k_deco_tree',          K + 'deco-tree.png');
  }

  create() {
    this.cameras.main.setBackgroundColor(0x060e08);

    /* loading bar */
    const barBg = this.add.rectangle(640, 400, 404, 18, 0x0a1a0f).setStrokeStyle(1, 0x1a3a22);
    const bar = this.add.rectangle(438, 400, 0, 14, 0x2d7a3a).setOrigin(0, 0.5);

    const text = this.add.text(640, 365, 'Seeding the verdant realm...', {
      fontSize: '16px', fill: '#3a6a40', fontFamily: 'monospace'
    }).setOrigin(0.5);

    /* tree icon */
    this.add.image(640, 280, 'tree').setScale(1.5).setAlpha(0.3);

    // POLISH ADD - Verify all procedural polish textures exist
    const polishTextures = [
      'pollen', 'manaSpark', 'confetti', 'debris',
      'bloomGlow', 'shockwave', 'manaSeed', 'starBurst',
      'upgrade_frame_2', 'upgrade_frame_3'
    ];
    let missingCount = 0;
    for (const tex of polishTextures) {
      if (!this.textures.exists(tex)) {
        console.warn('[VS Polish] Missing procedural texture:', tex);
        missingCount++;
      }
    }
    if (missingCount === 0) {
      console.log('[VS Polish] All', polishTextures.length, 'procedural polish textures OK');
    }

    // POLISH ADD - Verify Kenney assets loaded
    const kenneyKeys = [
      'k_tower_thornspitter', 'k_tower_vinetrapper', 'k_tower_bloombomber',
      'k_tower_moonflower', 'k_tower_heartlily', 'k_tree', 'k_spawn',
      'k_selection', 'k_ammo_arrow', 'k_ammo_boulder', 'k_ammo_cannonball',
      'k_ammo_bullet', 'k_deco_crystal', 'k_deco_rocks', 'k_deco_tree'
    ];
    let kenneyOk = 0;
    for (const key of kenneyKeys) {
      if (this.textures.exists(key)) kenneyOk++;
      else console.warn('[VS Kenney] Missing asset:', key);
    }
    console.log('[VS Kenney]', kenneyOk + '/' + kenneyKeys.length, 'assets loaded');

    // POLISH ADD - Store Kenney availability flag for other scenes
    this.registry.set('kenneyLoaded', kenneyOk >= 5);

    /* Generate maps */
    this.registry.set('maps', generateMaps());

    /* Animate loading */
    this.tweens.add({
      targets: bar,
      width: 400,
      duration: 900,
      ease: 'Power2',
      onComplete: () => {
        text.setText('Ready.');
        text.setColor('#5aaf6a');
        this.time.delayedCall(300, () => this.scene.start('MainMenuScene'));
      }
    });
  }
}

/* ── Procedural map generation ── */
function generateMaps() {
  const maps = [];
  const SB = VS.SIDEBAR_W;

  function makePath(points) {
    return points.map(p => ({ x: p[0] + SB, y: p[1] }));
  }

  function makeTiles(path, cols, rows, offsetX, offsetY) {
    const tiles = [];
    const gap = VS.TILE + 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetX + c * gap + VS.TILE / 2;
        const y = offsetY + r * gap + VS.TILE / 2;
        let tooClose = false;
        for (const p of path) {
          if (Math.abs(p.x - x) < 32 && Math.abs(p.y - y) < 32) { tooClose = true; break; }
        }
        /* also check interpolated path segments */
        if (!tooClose) {
          for (let i = 0; i < path.length - 1; i++) {
            const a = path[i], b = path[i + 1];
            const steps = Math.ceil(dist(a, b) / 20);
            for (let s = 0; s <= steps; s++) {
              const pt = lerpPos(a, b, s / steps);
              if (Math.abs(pt.x - x) < 28 && Math.abs(pt.y - y) < 28) { tooClose = true; break; }
            }
            if (tooClose) break;
          }
        }
        if (!tooClose && x > SB + 25 && x < 1260 && y > VS.HUD_H + 20 && y < 700) {
          tiles.push({ x, y });
        }
      }
    }
    return tiles;
  }

  function makeWaves(tier) {
    const waves = [];
    const count = 10 + Math.min(tier, 2);
    for (let w = 0; w < count; w++) {
      const wave = [];
      const base = 3 + w + tier;
      if (w < 3) {
        wave.push({ type: 'swarmer', count: base + 2, delay: 600 });
        wave.push({ type: 'crawler', count: Math.ceil(base / 2), delay: 1200 });
      } else if (w < 6) {
        wave.push({ type: 'crawler', count: base, delay: 800 });
        if (tier >= 1) wave.push({ type: 'wisp', count: Math.ceil(base / 2), delay: 700 });
        wave.push({ type: 'swarmer', count: base, delay: 500 });
      } else if (w < 9) {
        wave.push({ type: 'thornbeast', count: Math.ceil(base / 3), delay: 1500 });
        wave.push({ type: 'specter', count: Math.ceil(base / 2), delay: 900 });
        wave.push({ type: 'crawler', count: base, delay: 700 });
        if (tier >= 2) wave.push({ type: 'wisp', count: base, delay: 600 });
      } else {
        wave.push({ type: 'thornbeast', count: Math.ceil(base / 2), delay: 1200 });
        wave.push({ type: 'specter', count: base, delay: 700 });
        wave.push({ type: 'swarmer', count: base * 2, delay: 300 });
        if (w === count - 1) {
          wave.push({ type: 'blightlord', count: 1, delay: 3000 });
        }
      }
      waves.push(wave);
    }
    return waves;
  }

  /* ── 12 Maps ── */
  const mapDefs = [
    { id: 'gentle_path', name: 'Gentle Path', tier: 0,
      pts: [[0,360],[200,360],[300,200],[500,200],[600,400],[800,400],[900,250],[1100,250],[1160,360]] },
    { id: 'winding_trail', name: 'Winding Trail', tier: 0,
      pts: [[0,150],[250,150],[250,400],[500,400],[500,150],[750,150],[750,500],[1000,500],[1160,350]] },
    { id: 'forest_edge', name: 'Forest Edge', tier: 0,
      pts: [[0,600],[200,600],[300,300],[400,100],[600,100],[700,300],[800,550],[1000,550],[1160,400]] },
    { id: 'forked_glade', name: 'Forked Glade', tier: 1,
      pts: [[0,360],[200,360],[350,180],[500,180],[550,360],[700,500],[850,360],[1000,250],[1160,360]] },
    { id: 'thorned_crossing', name: 'Thorned Crossing', tier: 1,
      pts: [[0,200],[200,200],[300,400],[500,400],[600,200],[800,200],[900,500],[1100,500],[1160,350]] },
    { id: 'moonlit_marsh', name: 'Moonlit Marsh', tier: 1,
      pts: [[0,500],[150,350],[300,500],[450,300],[600,500],[750,300],[900,500],[1050,300],[1160,400]] },
    { id: 'briar_maze', name: 'Briar Maze', tier: 1,
      pts: [[0,100],[180,100],[180,350],[360,350],[360,100],[540,100],[540,450],[720,450],[720,200],[900,200],[900,500],[1100,500],[1160,360]] },
    { id: 'twin_rivers', name: 'Twin Rivers', tier: 2,
      pts: [[0,250],[250,250],[400,150],[600,150],[750,300],[900,300],[1050,200],[1160,300]] },
    { id: 'blight_hollow', name: 'Blight Hollow', tier: 2,
      pts: [[0,400],[200,500],[350,300],[500,550],[650,300],[800,500],[950,250],[1100,400],[1160,360]] },
    { id: 'verdant_siege', name: 'Verdant Siege', tier: 2,
      pts: [[0,360],[150,200],[300,400],[450,150],[600,450],[750,200],[900,400],[1050,250],[1160,360]] },
    { id: 'doomroot_depths', name: 'Doomroot Depths', tier: 2,
      pts: [[0,600],[150,450],[250,600],[400,350],[550,550],[700,300],[850,500],[1000,250],[1100,400],[1160,360]] },
    { id: 'heart_of_blight', name: 'Heart of Blight', tier: 3,
      pts: [[0,200],[120,100],[240,300],[360,100],[480,350],[600,100],[720,400],[840,150],[960,400],[1080,200],[1160,360]] },
  ];

  for (const md of mapDefs) {
    const path = makePath(md.pts);
    maps.push({
      id: md.id,
      name: md.name,
      path,
      placementTiles: makeTiles(path, 24, 14, SB + 15, VS.HUD_H + 10),
      tier: md.tier,
      waves: makeWaves(md.tier),
    });
  }

  return maps;
}
