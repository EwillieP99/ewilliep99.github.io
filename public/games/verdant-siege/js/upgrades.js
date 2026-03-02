/* ── Verdant Siege – upgrades.js ── */

const UPGRADE_TREE = [
  { id: 'mana_start',   name: 'Mana Spring',   desc: '+30 starting mana',    maxLvl: 3, costPer: 50,  apply: (lvl) => ({ startMana: 30 * lvl }) },
  { id: 'mana_kill',    name: 'Soul Reap',     desc: '+2 mana per kill',     maxLvl: 3, costPer: 60,  apply: (lvl) => ({ killMana: 2 * lvl }) },
  { id: 'tower_dmg',    name: 'Thorn Edge',    desc: '+8% tower damage',     maxLvl: 3, costPer: 80,  apply: (lvl) => ({ towerDmg: 0.08 * lvl }) },
  { id: 'tower_range',  name: 'Long Root',     desc: '+6% tower range',      maxLvl: 3, costPer: 70,  apply: (lvl) => ({ towerRange: 0.06 * lvl }) },
  { id: 'tower_rate',   name: 'Quick Bloom',   desc: '+5% fire rate',        maxLvl: 3, costPer: 75,  apply: (lvl) => ({ towerRate: 0.05 * lvl }) },
  { id: 'tree_hp',      name: 'Ironbark',      desc: '+3 tree lives',        maxLvl: 3, costPer: 90,  apply: (lvl) => ({ extraLives: 3 * lvl }) },
  { id: 'sell_bonus',   name: 'Reclaim',       desc: '+10% sell refund',     maxLvl: 2, costPer: 60,  apply: (lvl) => ({ sellBonus: 0.1 * lvl }) },
  { id: 'slow_power',   name: 'Briar Grip',    desc: '+10% slow strength',   maxLvl: 2, costPer: 70,  apply: (lvl) => ({ slowPower: 0.1 * lvl }) },
  { id: 'aoe_size',     name: 'Pollen Burst',  desc: '+12% AoE radius',      maxLvl: 2, costPer: 80,  apply: (lvl) => ({ aoeSize: 0.12 * lvl }) },
  { id: 'passive_mana', name: 'Verdant Flow',  desc: '+2 passive mana/wave', maxLvl: 3, costPer: 65,  apply: (lvl) => ({ passiveMana: 2 * lvl }) },
  { id: 'crit_chance',  name: 'Lucky Thorn',   desc: '+5% crit chance',      maxLvl: 2, costPer: 100, apply: (lvl) => ({ critChance: 0.05 * lvl }) },
  { id: 'boss_dmg',     name: 'Blight Bane',   desc: '+10% boss damage',     maxLvl: 2, costPer: 120, apply: (lvl) => ({ bossDmg: 0.1 * lvl }) },
];

function getUpgradeBonuses(save) {
  const bonuses = {
    startMana: 0, killMana: 0, towerDmg: 0, towerRange: 0, towerRate: 0,
    extraLives: 0, sellBonus: 0, slowPower: 0, aoeSize: 0, passiveMana: 0,
    critChance: 0, bossDmg: 0,
  };
  for (const u of UPGRADE_TREE) {
    const lvl = (save.upgradeLevels && save.upgradeLevels[u.id]) || 0;
    if (lvl > 0) {
      const b = u.apply(lvl);
      for (const k in b) bonuses[k] += b[k];
    }
  }
  return bonuses;
}

/* ── UpgradeTree Scene ── */
class UpgradeTreeScene extends Phaser.Scene {
  constructor() { super('UpgradeTreeScene'); }

  create() {
    this.save = SaveManager.load();
    this.cameras.main.setBackgroundColor(0x060e08);

    /* bg particles */
    this._particles = [];
    for (let i = 0; i < 20; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(0, 1280),
        Phaser.Math.Between(0, 720),
        Phaser.Math.Between(1, 2),
        0x2d7a3a, 0.2
      );
      this._particles.push({ obj: p, vy: Phaser.Math.FloatBetween(-0.4, -0.1) });
    }

    this.add.text(640, 32, 'VERDANT UPGRADES', {
      fontSize: '26px', fill: '#5aaf6a', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    this._essText = this.add.text(640, 64, '', {
      fontSize: '15px', fill: '#ffd700', fontFamily: 'monospace'
    }).setOrigin(0.5);
    this._updateEssence();

    const cols = 4;
    const startX = 200, startY = 115, gapX = 225, gapY = 125;

    UPGRADE_TREE.forEach((u, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * gapX, y = startY + row * gapY;
      const lvl = (this.save.upgradeLevels[u.id]) || 0;
      const maxed = lvl >= u.maxLvl;
      const cost = maxed ? 0 : u.costPer * (lvl + 1);
      const canAfford = !maxed && this.save.totalEssence >= cost;

      const bg = this.add.rectangle(x, y, 195, 95,
        maxed ? 0x1a3a1f : canAfford ? 0x142a18 : 0x0c1810, 0.9)
        .setStrokeStyle(2, maxed ? 0x5aaf6a : canAfford ? 0x2d7a3a : 0x1a2a1a);

      this.add.text(x, y - 28, u.name, {
        fontSize: '13px', fill: maxed ? '#5aaf6a' : '#88aa88', fontFamily: 'monospace', fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(x, y - 8, u.desc, {
        fontSize: '10px', fill: '#668866', fontFamily: 'monospace'
      }).setOrigin(0.5);

      /* level dots */
      const dotY = y + 12;
      for (let d = 0; d < u.maxLvl; d++) {
        const dotX = x + (d - (u.maxLvl - 1) / 2) * 14;
        this.add.circle(dotX, dotY, 4, d < lvl ? 0x5aaf6a : 0x1a2a1a, 1)
          .setStrokeStyle(1, 0x2d4a33);
      }

      const costStr = maxed ? 'MAXED' : `${cost} Essence`;
      this.add.text(x, y + 30, costStr, {
        fontSize: '11px', fill: maxed ? '#5aaf6a' : canAfford ? '#ffd700' : '#554400', fontFamily: 'monospace'
      }).setOrigin(0.5);

      if (!maxed) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => {
          if (!maxed) bg.setStrokeStyle(2, canAfford ? 0x44cc55 : 0x553322);
        });
        bg.on('pointerout', () => {
          bg.setStrokeStyle(2, canAfford ? 0x2d7a3a : 0x1a2a1a);
        });
        bg.on('pointerdown', () => {
          const curLvl = (this.save.upgradeLevels[u.id]) || 0;
          const c = u.costPer * (curLvl + 1);
          if (this.save.totalEssence >= c && curLvl < u.maxLvl) {
            this.save.totalEssence -= c;
            this.save.upgradeLevels[u.id] = curLvl + 1;
            SaveManager.save(this.save);
            SFX.upgrade();
            this.scene.restart();
          } else {
            SFX.click();
          }
        });
      }
    });

    /* back */
    this._makeButton(640, 660, '[ BACK ]', '#5aaf6a', () => this.scene.start('MainMenuScene'));
  }

  _makeButton(x, y, label, color, cb) {
    const t = this.add.text(x, y, label, {
      fontSize: '18px', fill: color, fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    t.on('pointerover', () => t.setColor('#88ff88'));
    t.on('pointerout', () => t.setColor(color));
    t.on('pointerdown', () => { SFX.click(); cb(); });
    return t;
  }

  _updateEssence() {
    this._essText.setText(`Verdant Essence: ${this.save.totalEssence}`);
  }

  update() {
    for (const p of this._particles) {
      p.obj.y += p.vy;
      if (p.obj.y < -10) { p.obj.y = 730; p.obj.x = Phaser.Math.Between(0, 1280); }
    }
  }
}

/* ── Victory Scene ── */
class VictoryScene extends Phaser.Scene {
  constructor() { super('VictoryScene'); }

  create(data) {
    this.cameras.main.setBackgroundColor(0x060e08);
    const { score, kills, wavesCleared, livesLeft, manaLeft, mapIndex } = data;
    SFX.victory();

    const stars = livesLeft >= 18 ? 3 : livesLeft >= 10 ? 2 : 1;
    const essence = Math.round(score / 10) + stars * 5;

    /* save */
    const save = SaveManager.load();
    const mapKey = 'map_' + mapIndex;
    if (!save.highScores[mapKey] || score > save.highScores[mapKey]) save.highScores[mapKey] = score;
    if (!save.stars[mapKey] || stars > save.stars[mapKey]) save.stars[mapKey] = stars;
    save.totalEssence += essence;
    if (!save.unlockedMaps.includes(mapIndex + 1) && mapIndex + 1 < 12) save.unlockedMaps.push(mapIndex + 1);
    SaveManager.save(save);

    /* bg particles */
    for (let i = 0; i < 40; i++) {
      const c = this.add.circle(
        Phaser.Math.Between(0, 1280), Phaser.Math.Between(0, 720),
        Phaser.Math.Between(1, 3), 0x2d7a3a, 0.3
      );
      this.tweens.add({
        targets: c,
        y: c.y - Phaser.Math.Between(100, 400),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 5000),
        repeat: -1,
      });
    }

    /* title */
    const title = this.add.text(640, 100, 'VICTORY!', {
      fontSize: '52px', fill: '#5aaf6a', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5).setScale(0.1);
    this.tweens.add({ targets: title, scale: 1, duration: 500, ease: 'Back.easeOut' });

    /* stars (animated) */
    for (let i = 0; i < 3; i++) {
      const sx = 580 + i * 60;
      const filled = i < stars;
      const s = this.add.text(sx, 180, filled ? '★' : '☆', {
        fontSize: '44px', fill: filled ? '#ffd700' : '#333333', fontFamily: 'monospace'
      }).setOrigin(0.5).setScale(0).setAlpha(0);
      this.tweens.add({
        targets: s, scale: 1, alpha: 1,
        delay: 500 + i * 300, duration: 400, ease: 'Back.easeOut',
      });
    }

    /* stats */
    const lines = [
      `Score: ${score}`,
      `Kills: ${kills}`,
      `Waves: ${wavesCleared}`,
      `Lives: ${livesLeft}`,
      `Essence: +${essence}`,
    ];
    lines.forEach((l, i) => {
      const t = this.add.text(640, 260 + i * 30, l, {
        fontSize: '17px', fill: '#aaccaa', fontFamily: 'monospace'
      }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: t, alpha: 1, delay: 1600 + i * 100, duration: 300 });
    });

    /* buttons */
    this.time.delayedCall(2200, () => {
      this._btn(540, 490, '[ NEXT MAP ]', '#5aaf6a', () => this.scene.start('MapSelectScene'));
      this._btn(740, 490, '[ MENU ]', '#88aa88', () => this.scene.start('MainMenuScene'));
    });
  }

  _btn(x, y, label, color, cb) {
    const bg = this.add.rectangle(x, y, 150, 36, 0x112218, 0.9)
      .setStrokeStyle(1, 0x2d7a3a).setInteractive({ useHandCursor: true });
    const t = this.add.text(x, y, label, {
      fontSize: '16px', fill: color, fontFamily: 'monospace'
    }).setOrigin(0.5);
    bg.on('pointerover', () => { bg.setFillStyle(0x1a3a1f); t.setColor('#88ff88'); });
    bg.on('pointerout', () => { bg.setFillStyle(0x112218); t.setColor(color); });
    bg.on('pointerdown', () => { SFX.click(); cb(); });
  }
}

/* ── GameOver Scene ── */
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  create(data) {
    this.cameras.main.setBackgroundColor(0x0a0505);
    const { score, kills, wavesCleared, mapIndex } = data;
    SFX.defeat();

    /* red particles */
    for (let i = 0; i < 20; i++) {
      const c = this.add.circle(
        Phaser.Math.Between(0, 1280), 720 + Phaser.Math.Between(0, 50),
        Phaser.Math.Between(1, 3), 0x442222, 0.4
      );
      this.tweens.add({
        targets: c,
        y: c.y - Phaser.Math.Between(200, 700),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
      });
    }

    const title = this.add.text(640, 160, 'THE TREE HAS FALLEN', {
      fontSize: '34px', fill: '#cc4444', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    /* screen flash */
    const flash = this.add.rectangle(640, 360, 1280, 720, 0xff0000, 0.15);
    this.tweens.add({ targets: flash, alpha: 0, duration: 800 });

    this.add.text(640, 240, `Score: ${score}`, {
      fontSize: '22px', fill: '#aa8888', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(640, 280, `Kills: ${kills}  |  Waves: ${wavesCleared}`, {
      fontSize: '15px', fill: '#886666', fontFamily: 'monospace'
    }).setOrigin(0.5);

    /* salvage essence */
    const essence = Math.round(score / 20);
    if (essence > 0) {
      const save = SaveManager.load();
      save.totalEssence += essence;
      SaveManager.save(save);
      this.add.text(640, 330, `+${essence} Essence salvaged`, {
        fontSize: '14px', fill: '#ffd700', fontFamily: 'monospace'
      }).setOrigin(0.5);
    }

    this.time.delayedCall(800, () => {
      this._btn(500, 430, '[ RETRY ]', '#cc6644', () => this.scene.start('GameScene', { mapIndex }));
      this._btn(700, 430, '[ MENU ]', '#886666', () => this.scene.start('MainMenuScene'));
    });
  }

  _btn(x, y, label, color, cb) {
    const bg = this.add.rectangle(x, y, 140, 36, 0x1a0808, 0.9)
      .setStrokeStyle(1, 0x442222).setInteractive({ useHandCursor: true });
    const t = this.add.text(x, y, label, {
      fontSize: '18px', fill: color, fontFamily: 'monospace'
    }).setOrigin(0.5);
    bg.on('pointerover', () => t.setColor('#ffaa88'));
    bg.on('pointerout', () => t.setColor(color));
    bg.on('pointerdown', () => { SFX.click(); cb(); });
  }
}

/* ── Leaderboard Scene ── */
class LeaderboardScene extends Phaser.Scene {
  constructor() { super('LeaderboardScene'); }

  create() {
    this.cameras.main.setBackgroundColor(0x060e08);
    const save = SaveManager.load();
    const maps = this.registry.get('maps');

    this.add.text(640, 44, 'LEADERBOARD', {
      fontSize: '26px', fill: '#5aaf6a', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    const entries = Object.entries(save.highScores).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
      this.add.text(640, 300, 'No scores yet. Play a map!', {
        fontSize: '17px', fill: '#3a5a3f', fontFamily: 'monospace'
      }).setOrigin(0.5);
    } else {
      /* header */
      this.add.text(300, 100, 'MAP', { fontSize: '12px', fill: '#3a5a3f', fontFamily: 'monospace' }).setOrigin(0.5);
      this.add.text(640, 100, 'STARS', { fontSize: '12px', fill: '#3a5a3f', fontFamily: 'monospace' }).setOrigin(0.5);
      this.add.text(900, 100, 'SCORE', { fontSize: '12px', fill: '#3a5a3f', fontFamily: 'monospace' }).setOrigin(0.5);

      entries.forEach(([mapKey, sc], i) => {
        const y = 135 + i * 34;
        const stars = save.stars[mapKey] || 0;
        const mapIdx = parseInt(mapKey.replace('map_', ''));
        const mapName = maps && maps[mapIdx] ? maps[mapIdx].name : mapKey;

        this.add.text(300, y, mapName, {
          fontSize: '14px', fill: '#aaccaa', fontFamily: 'monospace'
        }).setOrigin(0.5);

        const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        this.add.text(640, y, starStr, {
          fontSize: '16px', fill: '#ffd700', fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.add.text(900, y, String(sc), {
          fontSize: '14px', fill: '#aaccaa', fontFamily: 'monospace'
        }).setOrigin(0.5);
      });
    }

    /* total essence */
    this.add.text(640, 600, `Total Essence: ${save.totalEssence}`, {
      fontSize: '14px', fill: '#ffd700', fontFamily: 'monospace'
    }).setOrigin(0.5);

    /* back */
    const back = this.add.text(640, 660, '[ BACK ]', {
      fontSize: '18px', fill: '#5aaf6a', fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setColor('#88ff88'));
    back.on('pointerout', () => back.setColor('#5aaf6a'));
    back.on('pointerdown', () => { SFX.click(); this.scene.start('MainMenuScene'); });
  }
}
