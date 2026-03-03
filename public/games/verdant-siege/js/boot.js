/* ── Verdant Siege – boot.js ── */

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    SFX.init();
    const g = this.make.graphics({ add: false });

    /* ── Helper: draw a detailed circle with shading ── */
    const shadedCircle = (cx, cy, r, color, dark) => {
      g.fillStyle(dark || colorDarker(color, 0.5), 1);
      g.fillCircle(cx, cy + 1, r);
      g.fillStyle(color, 1);
      g.fillCircle(cx, cy, r);
      g.fillStyle(colorBrighter(color, 1.5), 0.4);
      g.fillCircle(cx - r * 0.25, cy - r * 0.25, r * 0.4);
    };

    /* ── Generic circle (fallback) ── */
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 16, 14);
    g.generateTexture('circle', 32, 32);

    /* ── Particle (soft glow) ── */
    g.clear();
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(6, 6, 6);
    g.fillStyle(0xffffff, 0.4);
    g.fillCircle(6, 6, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(6, 6, 2);
    g.generateTexture('particle', 12, 12);

    /* ── Soft glow (for bloom-like effect) ── */
    g.clear();
    g.fillStyle(0xffffff, 0.15);
    g.fillCircle(16, 16, 16);
    g.fillStyle(0xffffff, 0.3);
    g.fillCircle(16, 16, 10);
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(16, 16, 5);
    g.generateTexture('glow', 32, 32);

    // POLISH ADD - Pollen particle (soft drifting organic)
    g.clear();
    g.fillStyle(0xffffff, 0.3);
    g.fillCircle(8, 8, 8);
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(8, 8, 5);
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(7, 7, 2);
    g.generateTexture('pollen', 16, 16);

    // POLISH ADD - Mana spark particle (bright magical)
    g.clear();
    g.fillStyle(0xffffff, 0.2);
    g.fillCircle(8, 8, 8);
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(8, 8, 4);
    g.fillStyle(0xffffff, 1.0);
    g.fillCircle(8, 8, 2);
    // little cross flare
    g.fillStyle(0xffffff, 0.4);
    g.fillRect(6, 0, 4, 16);
    g.fillRect(0, 6, 16, 4);
    g.generateTexture('manaSpark', 16, 16);

    // POLISH ADD - Confetti particle (small square + bright)
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillRect(1, 1, 6, 6);
    g.fillStyle(0xffffff, 0.5);
    g.fillRect(2, 2, 4, 4);
    g.generateTexture('confetti', 8, 8);

    // POLISH ADD - Debris particle (chunky fragment, 4 frame strip)
    g.clear();
    // frame 0: small triangle chunk
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(2, 10, 10, 10, 6, 2);
    // frame 1: rotated chunk
    g.fillTriangle(14, 10, 22, 10, 18, 2);
    // frame 2: diamond chunk
    g.fillTriangle(28, 2, 24, 6, 28, 10);
    g.fillTriangle(28, 2, 32, 6, 28, 10);
    // frame 3: irregular
    g.fillTriangle(36, 8, 42, 4, 44, 10);
    g.generateTexture('debris', 48, 12);

    // POLISH ADD - Large bloom glow (for tree/tower bloom aura)
    g.clear();
    g.fillStyle(0xffffff, 0.05);
    g.fillCircle(32, 32, 32);
    g.fillStyle(0xffffff, 0.1);
    g.fillCircle(32, 32, 22);
    g.fillStyle(0xffffff, 0.2);
    g.fillCircle(32, 32, 12);
    g.fillStyle(0xffffff, 0.4);
    g.fillCircle(32, 32, 5);
    g.generateTexture('bloomGlow', 64, 64);

    // POLISH ADD - Shockwave ring (for boss slam / wave start)
    g.clear();
    g.lineStyle(3, 0xffffff, 0.8);
    g.strokeCircle(32, 32, 28);
    g.lineStyle(1, 0xffffff, 0.3);
    g.strokeCircle(32, 32, 22);
    g.generateTexture('shockwave', 64, 64);

    // POLISH ADD - Mana seed (collectible drop from enemies)
    g.clear();
    g.fillStyle(0x2277cc, 1);
    g.fillTriangle(6, 2, 2, 10, 10, 10);
    g.fillStyle(0x44aaff, 0.8);
    g.fillTriangle(6, 3, 3, 9, 9, 9);
    g.fillStyle(0x88ddff, 0.5);
    g.fillCircle(6, 6, 2);
    g.generateTexture('manaSeed', 12, 12);

    // POLISH ADD - Upgrade star burst (radial lines)
    g.clear();
    g.lineStyle(2, 0xffffff, 0.9);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8;
      g.lineBetween(
        16 + Math.cos(a) * 4, 16 + Math.sin(a) * 4,
        16 + Math.cos(a) * 14, 16 + Math.sin(a) * 14
      );
    }
    g.fillStyle(0xffffff, 0.3);
    g.fillCircle(16, 16, 6);
    g.generateTexture('starBurst', 32, 32);

    /* ── Tile (placement grid) ── */
    g.clear();
    g.fillStyle(0x0f2214, 1);
    g.fillRect(0, 0, VS.TILE, VS.TILE);
    g.fillStyle(0x142a18, 1);
    g.fillRect(2, 2, VS.TILE - 4, VS.TILE - 4);
    g.lineStyle(1, 0x1a3a22, 0.4);
    g.strokeRect(1, 1, VS.TILE - 2, VS.TILE - 2);
    g.generateTexture('tile', VS.TILE, VS.TILE);

    /* ── Tile highlight ── */
    g.clear();
    g.fillStyle(0x2d7a3a, 0.3);
    g.fillRect(0, 0, VS.TILE, VS.TILE);
    g.lineStyle(2, 0x44cc55, 0.5);
    g.strokeRect(1, 1, VS.TILE - 2, VS.TILE - 2);
    g.generateTexture('tile_ok', VS.TILE, VS.TILE);

    /* ── Tile invalid ── */
    g.clear();
    g.fillStyle(0x7a2d2d, 0.3);
    g.fillRect(0, 0, VS.TILE, VS.TILE);
    g.lineStyle(2, 0xcc4444, 0.5);
    g.strokeRect(1, 1, VS.TILE - 2, VS.TILE - 2);
    g.generateTexture('tile_bad', VS.TILE, VS.TILE);

    /* ── Heart Tree (detailed) ── */
    g.clear();
    const tw = 64, th = 80;
    // trunk
    g.fillStyle(0x5a3a1a, 1);
    g.fillRect(24, 50, 16, 28);
    g.fillStyle(0x4a2a10, 1);
    g.fillRect(28, 50, 4, 28);
    // roots
    g.fillStyle(0x5a3a1a, 0.7);
    g.fillTriangle(18, 76, 24, 60, 30, 76);
    g.fillTriangle(34, 76, 40, 60, 46, 76);
    // canopy layers
    g.fillStyle(0x1a5a22, 1);
    g.fillTriangle(32, 4, 2, 55, 62, 55);
    g.fillStyle(0x228b22, 1);
    g.fillTriangle(32, 12, 8, 50, 56, 50);
    g.fillStyle(0x2d9a3a, 0.8);
    g.fillTriangle(32, 20, 14, 46, 50, 46);
    // highlight
    g.fillStyle(0x44cc55, 0.25);
    g.fillTriangle(28, 18, 16, 42, 34, 42);
    g.generateTexture('tree', tw, th);

    /* ── Heart icon ── */
    g.clear();
    g.fillStyle(0xff3344, 1);
    g.fillCircle(7, 6, 6);
    g.fillCircle(15, 6, 6);
    g.fillTriangle(1, 8, 21, 8, 11, 20);
    g.fillStyle(0xff6677, 0.5);
    g.fillCircle(7, 5, 3);
    g.generateTexture('heart', 22, 22);

    /* ── Mana orb ── */
    g.clear();
    g.fillStyle(0x2277cc, 1);
    g.fillCircle(10, 10, 9);
    g.fillStyle(0x44aaff, 0.8);
    g.fillCircle(10, 10, 6);
    g.fillStyle(0x88ccff, 0.6);
    g.fillCircle(8, 8, 3);
    g.fillStyle(0xccf0ff, 0.4);
    g.fillCircle(7, 7, 1);
    g.generateTexture('mana_orb', 20, 20);

    /* ── Star ── */
    g.clear();
    g.fillStyle(0xffd700, 1);
    const starPts = [];
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI / 5) - Math.PI / 2;
      const r = i % 2 === 0 ? 10 : 4;
      starPts.push(12 + Math.cos(a) * r);
      starPts.push(12 + Math.sin(a) * r);
    }
    g.beginPath();
    g.moveTo(starPts[0], starPts[1]);
    for (let i = 2; i < starPts.length; i += 2) g.lineTo(starPts[i], starPts[i + 1]);
    g.closePath();
    g.fillPath();
    g.generateTexture('star', 24, 24);

    /* ── Tower sprites (detailed procedural) ── */
    this._genTowerSprite(g, 'tower_thornspitter', 0x6b8e23, 'thorn');
    this._genTowerSprite(g, 'tower_vinetrapper',  0x228b22, 'vine');
    this._genTowerSprite(g, 'tower_bloombomber',  0xff69b4, 'bloom');
    this._genTowerSprite(g, 'tower_moonflower',   0x9370db, 'moon');
    this._genTowerSprite(g, 'tower_heartlily',    0xff6b6b, 'heart');

    /* ── Enemy sprites ── */
    this._genEnemySprite(g, 'enemy_wisp',       0x87ceeb, 0.7, 'wisp');
    this._genEnemySprite(g, 'enemy_crawler',     0x8b4513, 1.0, 'crawler');
    this._genEnemySprite(g, 'enemy_thornbeast',  0x556b2f, 1.2, 'thornbeast');
    this._genEnemySprite(g, 'enemy_specter',     0x9932cc, 0.9, 'specter');
    this._genEnemySprite(g, 'enemy_swarmer',     0xdaa520, 0.5, 'swarmer');
    this._genEnemySprite(g, 'enemy_blightlord',  0x8b0000, 1.8, 'boss');

    /* ── Projectile textures ── */
    this._genProjectile(g, 'proj_physical', 0xaacc33);
    this._genProjectile(g, 'proj_magic',    0xbb88ff);
    this._genProjectile(g, 'proj_bloom',    0xff88cc);
    this._genProjectile(g, 'proj_vine',     0x33aa55);

    /* ── AoE ring ── */
    g.clear();
    g.lineStyle(2, 0xffffff, 0.6);
    g.strokeCircle(32, 32, 30);
    g.lineStyle(1, 0xffffff, 0.2);
    g.strokeCircle(32, 32, 24);
    g.generateTexture('aoe_ring', 64, 64);

    /* ── Path tile ── */
    g.clear();
    g.fillStyle(0x3a2a1a, 1);
    g.fillRect(0, 0, VS.TILE, VS.TILE);
    g.fillStyle(0x2a1a10, 0.3);
    for (let i = 0; i < 4; i++) {
      g.fillCircle(Math.random() * VS.TILE, Math.random() * VS.TILE, 2 + Math.random() * 3);
    }
    g.generateTexture('path_tile', VS.TILE, VS.TILE);

    // POLISH ADD - Tower upgrade frame overlays (level 2 & 3 borders)
    this._genUpgradeFrame(g, 'upgrade_frame_2', 0x44cc55, 0.5);
    this._genUpgradeFrame(g, 'upgrade_frame_3', 0xffd700, 0.7);

    g.destroy();

    this.scene.start('PreloadScene');
  }

  _genTowerSprite(g, key, color, type) {
    const s = 40;
    g.clear();

    const dark = colorDarker(color, 0.5);
    const light = colorBrighter(color, 1.4);

    // base platform
    g.fillStyle(dark, 1);
    g.fillEllipse(s / 2, s * 0.78, s * 0.7, s * 0.22);

    // body
    g.fillStyle(color, 1);
    if (type === 'thorn') {
      // spiky barrel
      g.fillRect(s * 0.35, s * 0.2, s * 0.3, s * 0.55);
      g.fillStyle(light, 0.6);
      g.fillTriangle(s * 0.5, s * 0.05, s * 0.35, s * 0.25, s * 0.65, s * 0.25);
      g.fillStyle(dark, 0.5);
      g.fillRect(s * 0.42, s * 0.2, s * 0.06, s * 0.4);
    } else if (type === 'vine') {
      // vine coils
      g.fillCircle(s * 0.5, s * 0.45, s * 0.22);
      g.fillStyle(light, 0.4);
      g.fillCircle(s * 0.45, s * 0.4, s * 0.12);
      // tendrils
      g.lineStyle(2, color);
      g.beginPath();
      g.moveTo(s * 0.3, s * 0.5);
      g.lineTo(s * 0.15, s * 0.3);
      g.moveTo(s * 0.7, s * 0.5);
      g.lineTo(s * 0.85, s * 0.3);
      g.strokePath();
    } else if (type === 'bloom') {
      // flower bomb
      g.fillCircle(s * 0.5, s * 0.4, s * 0.2);
      // petals
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2 / 5) - Math.PI / 2;
        g.fillStyle(color, 0.7);
        g.fillCircle(s * 0.5 + Math.cos(a) * s * 0.18, s * 0.4 + Math.sin(a) * s * 0.18, s * 0.1);
      }
      g.fillStyle(0xffcc00, 0.8);
      g.fillCircle(s * 0.5, s * 0.4, s * 0.08);
    } else if (type === 'moon') {
      // crystal tower
      g.fillStyle(color, 0.9);
      g.fillTriangle(s * 0.5, s * 0.08, s * 0.3, s * 0.65, s * 0.7, s * 0.65);
      g.fillStyle(light, 0.5);
      g.fillTriangle(s * 0.5, s * 0.15, s * 0.38, s * 0.55, s * 0.55, s * 0.55);
      // glow
      g.fillStyle(0xccaaff, 0.2);
      g.fillCircle(s * 0.5, s * 0.35, s * 0.25);
    } else if (type === 'heart') {
      // healing flower
      g.fillStyle(color, 1);
      g.fillCircle(s * 0.5, s * 0.4, s * 0.2);
      g.fillStyle(0xff9999, 0.6);
      g.fillCircle(s * 0.5, s * 0.4, s * 0.13);
      // cross
      g.fillStyle(0xffffff, 0.6);
      g.fillRect(s * 0.46, s * 0.28, s * 0.08, s * 0.24);
      g.fillRect(s * 0.38, s * 0.36, s * 0.24, s * 0.08);
    }

    g.generateTexture(key, s, s);
  }

  _genEnemySprite(g, key, color, scale, type) {
    const s = Math.round(32 * clamp(scale, 0.6, 2));
    const cx = s / 2, cy = s / 2;
    g.clear();

    const dark = colorDarker(color, 0.5);
    const light = colorBrighter(color, 1.5);

    if (type === 'wisp') {
      // ghostly orb
      g.fillStyle(color, 0.6);
      g.fillCircle(cx, cy, s * 0.38);
      g.fillStyle(light, 0.4);
      g.fillCircle(cx - 2, cy - 2, s * 0.2);
      // trail wisps
      g.fillStyle(color, 0.25);
      g.fillCircle(cx - s * 0.2, cy + s * 0.2, s * 0.12);
      g.fillCircle(cx - s * 0.1, cy + s * 0.3, s * 0.08);
    } else if (type === 'crawler') {
      // armored beetle
      g.fillStyle(dark, 1);
      g.fillEllipse(cx, cy + 2, s * 0.7, s * 0.5);
      g.fillStyle(color, 1);
      g.fillEllipse(cx, cy, s * 0.65, s * 0.45);
      // shell lines
      g.lineStyle(1, dark, 0.6);
      g.lineBetween(cx, cy - s * 0.18, cx, cy + s * 0.18);
      // eyes
      g.fillStyle(0xffcc00, 1);
      g.fillCircle(cx - 4, cy - 4, 2);
      g.fillCircle(cx + 4, cy - 4, 2);
    } else if (type === 'thornbeast') {
      // large armored creature
      g.fillStyle(dark, 1);
      g.fillEllipse(cx, cy + 2, s * 0.75, s * 0.55);
      g.fillStyle(color, 1);
      g.fillEllipse(cx, cy, s * 0.7, s * 0.5);
      // spikes
      g.fillStyle(0x334422, 1);
      g.fillTriangle(cx - 6, cy - s * 0.22, cx - 3, cy - s * 0.38, cx, cy - s * 0.22);
      g.fillTriangle(cx, cy - s * 0.22, cx + 3, cy - s * 0.38, cx + 6, cy - s * 0.22);
      g.fillStyle(0xff4444, 0.8);
      g.fillCircle(cx - 5, cy - 2, 2);
      g.fillCircle(cx + 5, cy - 2, 2);
    } else if (type === 'specter') {
      // ghostly figure
      g.fillStyle(color, 0.4);
      g.fillCircle(cx, cy - 2, s * 0.35);
      g.fillStyle(color, 0.6);
      g.fillCircle(cx, cy, s * 0.25);
      // wispy bottom
      g.fillStyle(color, 0.2);
      g.fillTriangle(cx - s * 0.2, cy, cx + s * 0.2, cy, cx, cy + s * 0.35);
      // eyes
      g.fillStyle(0xeeddff, 0.9);
      g.fillCircle(cx - 3, cy - 3, 2);
      g.fillCircle(cx + 3, cy - 3, 2);
    } else if (type === 'swarmer') {
      // tiny bug
      g.fillStyle(color, 1);
      g.fillCircle(cx, cy, s * 0.35);
      g.fillStyle(dark, 0.6);
      g.fillCircle(cx, cy, s * 0.2);
    } else if (type === 'boss') {
      // massive blighted entity
      g.fillStyle(0x220000, 1);
      g.fillCircle(cx, cy + 3, s * 0.42);
      g.fillStyle(color, 1);
      g.fillCircle(cx, cy, s * 0.4);
      // face
      g.fillStyle(0xff2222, 0.9);
      g.fillCircle(cx - s * 0.12, cy - s * 0.08, s * 0.06);
      g.fillCircle(cx + s * 0.12, cy - s * 0.08, s * 0.06);
      // crown/horns
      g.fillStyle(0x440000, 1);
      g.fillTriangle(cx - s * 0.2, cy - s * 0.2, cx - s * 0.12, cy - s * 0.42, cx - s * 0.04, cy - s * 0.2);
      g.fillTriangle(cx + s * 0.04, cy - s * 0.2, cx + s * 0.12, cy - s * 0.42, cx + s * 0.2, cy - s * 0.2);
      // glow
      g.fillStyle(0xff0000, 0.15);
      g.fillCircle(cx, cy, s * 0.48);
    }

    g.generateTexture(key, s, s);
  }

  _genProjectile(g, key, color) {
    g.clear();
    g.fillStyle(color, 0.3);
    g.fillCircle(6, 6, 6);
    g.fillStyle(color, 0.7);
    g.fillCircle(6, 6, 4);
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(5, 5, 2);
    g.generateTexture(key, 12, 12);
  }

  // POLISH ADD - Generate tower upgrade level frame overlay
  _genUpgradeFrame(g, key, color, alpha) {
    const s = 44;
    g.clear();
    g.lineStyle(2, color, alpha);
    g.strokeRect(2, 2, s - 4, s - 4);
    // corner accents
    g.fillStyle(color, alpha * 0.8);
    g.fillRect(2, 2, 6, 2);
    g.fillRect(2, 2, 2, 6);
    g.fillRect(s - 8, 2, 6, 2);
    g.fillRect(s - 4, 2, 2, 6);
    g.fillRect(2, s - 4, 6, 2);
    g.fillRect(2, s - 8, 2, 6);
    g.fillRect(s - 8, s - 4, 6, 2);
    g.fillRect(s - 4, s - 8, 2, 6);
    g.generateTexture(key, s, s);
  }
}
