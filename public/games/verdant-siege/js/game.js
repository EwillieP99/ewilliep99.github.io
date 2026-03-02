/* ── Verdant Siege – game.js (main Game scene) ── */

class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.mapIndex = data.mapIndex || 0;
  }

  create() {
    SFX.resume();
    this.cameras.main.setBackgroundColor(0x060e08);
    this.cameras.main.fadeIn(200, 0, 0, 0);

    const save = SaveManager.load();
    const bonuses = getUpgradeBonuses(save);
    this.bonuses = bonuses;
    const maps = this.registry.get('maps');
    this.mapData = maps[this.mapIndex];

    /* ── State ── */
    this.mana = VS.START_MANA + bonuses.startMana;
    this.lives = VS.START_LIVES + bonuses.extraLives;
    this.maxLives = this.lives;
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    this.waveIndex = 0;
    this.waveActive = false;
    this.waveSpawnQueue = [];
    this.spawnTimer = 0;
    this._nextSpawnDelay = 0;
    this.kills = 0;
    this.score = 0;
    this.speedIdx = 0;
    this.paused = false;
    this.gameOver = false;
    this.selectedTower = null;
    this.dragGhost = null;
    this.dragRange = null;
    this.dragIdx = -1;
    this._slowMoTimer = 0;
    this._slowMoFactor = 1;

    /* ── Draw ── */
    this._drawMap();
    this._buildSidebar();
    this._buildHUD();
    this._buildTowerPopup();
    this._buildParticles();

    /* ── Input ── */
    this.input.on('pointermove', (ptr) => this._onPointerMove(ptr));
    this.input.on('pointerup', (ptr) => this._onPointerUp(ptr));

    /* keyboard */
    this.input.keyboard.on('keydown-P', () => this.togglePause());
    this.input.keyboard.on('keydown-SPACE', () => this.cycleSpeed());
    this.input.keyboard.on('keydown-ESC', () => this.deselectTower());
    for (let i = 1; i <= 5; i++) {
      this.input.keyboard.on('keydown-' + i, () => this.startDragFromKey(i - 1));
    }

    this._showWaveMessage('Place towers, then START!');
  }

  /* ── Particles ── */
  _buildParticles() {
    /* death burst */
    this.deathEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 40, max: 100 },
      scale: { start: 1, end: 0 },
      lifespan: 400,
      tint: 0x5aaf6a,
      emitting: false,
    });

    /* mana sparkle */
    this.manaEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 20, max: 60 },
      scale: { start: 0.6, end: 0 },
      lifespan: 500,
      tint: 0x44aaff,
      emitting: false,
      gravityY: -30,
    });

    /* upgrade confetti */
    this.upgradeEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 60, max: 120 },
      scale: { start: 0.8, end: 0 },
      lifespan: 600,
      tint: [0xffd700, 0x44ff44, 0xffffff],
      emitting: false,
      gravityY: 80,
    });

    /* heal pulse */
    this.healEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 15, max: 40 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      tint: 0xff6b6b,
      emitting: false,
    });

    /* projectile trail */
    this.projTrailEmitter = this.add.particles(0, 0, 'particle', {
      speed: 5,
      scale: { start: 0.3, end: 0 },
      lifespan: 150,
      tint: 0xaacc33,
      emitting: false,
    });
  }

  /* ── Map Drawing ── */
  _drawMap() {
    const path = this.mapData.path;

    /* background */
    const bg = this.add.graphics().setDepth(0);
    bg.fillStyle(0x081510, 1);
    bg.fillRect(VS.SIDEBAR_W, 0, 1280 - VS.SIDEBAR_W, 720);

    /* subtle grid lines */
    bg.lineStyle(1, 0x0d1f14, 0.4);
    for (let x = VS.SIDEBAR_W; x < 1280; x += VS.TILE + 4) {
      bg.lineBetween(x, VS.HUD_H, x, 720);
    }
    for (let y = VS.HUD_H; y < 720; y += VS.TILE + 4) {
      bg.lineBetween(VS.SIDEBAR_W, y, 1280, y);
    }

    /* path: outer glow */
    const pathGlow = this.add.graphics().setDepth(1);
    pathGlow.lineStyle(36, 0x2a1a0a, 0.15);
    pathGlow.beginPath();
    pathGlow.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) pathGlow.lineTo(path[i].x, path[i].y);
    pathGlow.strokePath();

    /* path: main */
    const pathGfx = this.add.graphics().setDepth(1);
    pathGfx.lineStyle(26, 0x3a2a1a, 0.7);
    pathGfx.beginPath();
    pathGfx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) pathGfx.lineTo(path[i].x, path[i].y);
    pathGfx.strokePath();

    /* path: inner highlight */
    pathGfx.lineStyle(8, 0x4a3a2a, 0.25);
    pathGfx.beginPath();
    pathGfx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) pathGfx.lineTo(path[i].x, path[i].y);
    pathGfx.strokePath();

    /* placement tiles */
    this.tileSprites = [];
    for (const t of this.mapData.placementTiles) {
      const ts = this.add.image(t.x, t.y, 'tile').setDepth(1).setAlpha(0.4);
      ts.tileData = t;
      this.tileSprites.push(ts);
    }

    /* tree at end */
    const end = path[path.length - 1];
    this.treeSprite = this.add.image(end.x, end.y, 'tree').setScale(1.8).setDepth(3);

    /* tree glow */
    this.treeGlow = this.add.image(end.x, end.y, 'glow')
      .setScale(4).setAlpha(0.1).setTint(0x44ff44).setDepth(2);
    this.tweens.add({
      targets: this.treeGlow,
      alpha: { from: 0.06, to: 0.15 },
      scale: { from: 3.5, to: 4.5 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    /* tree sway */
    this.tweens.add({
      targets: this.treeSprite,
      angle: { from: -1, to: 1 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    /* spawn portal */
    const start = path[0];
    const portal = this.add.circle(start.x, start.y, 14, 0xcc4444, 0.2).setDepth(2);
    this.tweens.add({
      targets: portal,
      scale: { from: 0.8, to: 1.3 },
      alpha: { from: 0.1, to: 0.3 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
    this.add.text(start.x, start.y - 22, 'SPAWN', {
      fontSize: '8px', fill: '#aa4444', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(2);
  }

  /* ── Sidebar ── */
  _buildSidebar() {
    const sb = this.add.graphics().setDepth(10);
    sb.fillStyle(0x080f0a, 0.95);
    sb.fillRect(0, 0, VS.SIDEBAR_W, 720);
    sb.lineStyle(1, 0x1a3a22, 0.5);
    sb.lineBetween(VS.SIDEBAR_W, 0, VS.SIDEBAR_W, 720);

    this.add.text(VS.SIDEBAR_W / 2, 12, 'TOWERS', {
      fontSize: '10px', fill: '#3a6a40', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(11);

    this.shopSlots = [];
    VS.TOWER_DEFS.forEach((def, i) => {
      const y = 55 + i * 125;
      const cx = VS.SIDEBAR_W / 2;

      /* tower icon using generated sprite */
      const texKey = 'tower_' + def.id;
      const icon = this.add.image(cx, y, this.textures.exists(texKey) ? texKey : 'circle')
        .setDepth(11).setScale(0.9);
      if (!this.textures.exists(texKey)) icon.setTint(def.color);

      /* interactive area */
      const hitArea = this.add.rectangle(cx, y, 50, 50, 0x000000, 0)
        .setInteractive({ useHandCursor: true }).setDepth(12);

      /* name */
      this.add.text(cx, y + 28, def.name, {
        fontSize: '10px', fill: '#88aa88', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(11);

      /* cost */
      const costText = this.add.text(cx, y + 42, `${def.cost}m`, {
        fontSize: '10px', fill: '#ffd700', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(11);

      /* hotkey */
      this.add.text(cx + 22, y - 22, `${i + 1}`, {
        fontSize: '8px', fill: '#2a4a2e', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(11);

      /* desc */
      this.add.text(cx, y + 54, def.desc, {
        fontSize: '7px', fill: '#446644', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(11);

      hitArea.on('pointerdown', (ptr) => {
        this.startDrag(i, ptr);
      });

      this.shopSlots.push({ icon, costText, def, hitArea });
    });
  }

  /* ── HUD ── */
  _buildHUD() {
    const hudBg = this.add.graphics().setDepth(10);
    hudBg.fillStyle(0x080f0a, 0.92);
    hudBg.fillRect(VS.SIDEBAR_W, 0, 1280 - VS.SIDEBAR_W, VS.HUD_H);
    hudBg.lineStyle(1, 0x1a3a22, 0.4);
    hudBg.lineBetween(VS.SIDEBAR_W, VS.HUD_H, 1280, VS.HUD_H);

    this.hud = {};

    /* mana with icon */
    this.add.image(VS.SIDEBAR_W + 18, VS.HUD_H / 2, 'mana_orb').setScale(0.8).setDepth(11);
    this.hud.mana = this.add.text(VS.SIDEBAR_W + 34, VS.HUD_H / 2, '', {
      fontSize: '15px', fill: '#44aaff', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0, 0.5).setDepth(11);

    /* wave */
    this.hud.wave = this.add.text(360, VS.HUD_H / 2, '', {
      fontSize: '14px', fill: '#5aaf6a', fontFamily: 'monospace'
    }).setOrigin(0, 0.5).setDepth(11);

    /* speed button */
    this.hud.speedBg = this.add.rectangle(580, VS.HUD_H / 2, 50, 26, 0x0c1a10)
      .setStrokeStyle(1, 0x2d4a33).setInteractive({ useHandCursor: true }).setDepth(11);
    this.hud.speedText = this.add.text(580, VS.HUD_H / 2, '1x', {
      fontSize: '13px', fill: '#aacc88', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(12);
    this.hud.speedBg.on('pointerdown', () => this.cycleSpeed());

    /* start wave button */
    this.hud.startBg = this.add.rectangle(730, VS.HUD_H / 2, 140, 28, 0x1a2a10)
      .setStrokeStyle(1, 0x4a6a33).setInteractive({ useHandCursor: true }).setDepth(11);
    this.hud.startText = this.add.text(730, VS.HUD_H / 2, 'START WAVE', {
      fontSize: '13px', fill: '#ffd700', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(12);
    this.hud.startBg.on('pointerover', () => this.hud.startBg.setFillStyle(0x2a3a18));
    this.hud.startBg.on('pointerout', () => this.hud.startBg.setFillStyle(0x1a2a10));
    this.hud.startBg.on('pointerdown', () => this.startNextWave());

    /* pause */
    this.hud.pauseBg = this.add.rectangle(880, VS.HUD_H / 2, 60, 26, 0x0c1a10)
      .setStrokeStyle(1, 0x2d4a33).setInteractive({ useHandCursor: true }).setDepth(11);
    this.hud.pauseText = this.add.text(880, VS.HUD_H / 2, 'PAUSE', {
      fontSize: '11px', fill: '#88aa88', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(12);
    this.hud.pauseBg.on('pointerdown', () => this.togglePause());

    /* menu button */
    this.hud.menuBg = this.add.rectangle(960, VS.HUD_H / 2, 56, 26, 0x0c1a10)
      .setStrokeStyle(1, 0x2d4a33).setInteractive({ useHandCursor: true }).setDepth(11);
    this.hud.menuText = this.add.text(960, VS.HUD_H / 2, 'MENU', {
      fontSize: '11px', fill: '#668866', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(12);
    this.hud.menuBg.on('pointerdown', () => this.scene.start('MainMenuScene'));

    /* lives */
    this.hud.lives = this.add.text(1220, 688, '', {
      fontSize: '16px', fill: '#ff6666', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(1, 1).setDepth(11);

    /* score */
    this.hud.score = this.add.text(1220, 665, '', {
      fontSize: '11px', fill: '#668866', fontFamily: 'monospace'
    }).setOrigin(1, 1).setDepth(11);

    /* wave message (center) */
    this.hud.waveMsg = this.add.text(690, 360, '', {
      fontSize: '22px', fill: '#5aaf6a', fontFamily: 'monospace', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(25).setAlpha(0);

    /* pause overlay */
    this.pauseOverlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.5)
      .setDepth(30).setVisible(false);
    this.pauseText = this.add.text(640, 360, 'PAUSED\n\nPress P to resume', {
      fontSize: '28px', fill: '#5aaf6a', fontFamily: 'monospace', fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5).setDepth(31).setVisible(false);

    this.updateHUD();
  }

  /* ── Tower Popup ── */
  _buildTowerPopup() {
    this.popup = {};
    this.popup.container = this.add.container(0, 0).setDepth(20).setVisible(false);

    const bg = this.add.rectangle(0, 0, 170, 100, 0x0c1a10, 0.95)
      .setStrokeStyle(1, 0x2d4a33);
    this.popup.container.add(bg);

    this.popup.nameText = this.add.text(0, -36, '', {
      fontSize: '13px', fill: '#5aaf6a', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.popup.container.add(this.popup.nameText);

    this.popup.statsText = this.add.text(0, -18, '', {
      fontSize: '9px', fill: '#668866', fontFamily: 'monospace'
    }).setOrigin(0.5);
    this.popup.container.add(this.popup.statsText);

    /* upgrade button */
    const upgBg = this.add.rectangle(-42, 14, 76, 30, 0x142a18)
      .setStrokeStyle(1, 0x44cc55).setInteractive({ useHandCursor: true });
    this.popup.upgText = this.add.text(-42, 14, 'Upgrade', {
      fontSize: '11px', fill: '#44cc55', fontFamily: 'monospace'
    }).setOrigin(0.5);
    this.popup.container.add(upgBg);
    this.popup.container.add(this.popup.upgText);
    upgBg.on('pointerover', () => upgBg.setFillStyle(0x1a3a22));
    upgBg.on('pointerout', () => upgBg.setFillStyle(0x142a18));
    upgBg.on('pointerdown', () => this._upgradeTower());

    /* sell button */
    const sellBg = this.add.rectangle(42, 14, 76, 30, 0x1a0808)
      .setStrokeStyle(1, 0xcc4444).setInteractive({ useHandCursor: true });
    this.popup.sellText = this.add.text(42, 14, 'Sell', {
      fontSize: '11px', fill: '#cc4444', fontFamily: 'monospace'
    }).setOrigin(0.5);
    this.popup.container.add(sellBg);
    this.popup.container.add(this.popup.sellText);
    sellBg.on('pointerover', () => sellBg.setFillStyle(0x2a0f0f));
    sellBg.on('pointerout', () => sellBg.setFillStyle(0x1a0808));
    sellBg.on('pointerdown', () => this._sellTower());

    /* close on bg click */
    bg.setInteractive();
  }

  /* ── HUD update ── */
  updateHUD() {
    this.hud.mana.setText(String(this.mana));
    this.hud.wave.setText(`Wave ${this.waveIndex}/${this.mapData.waves.length}`);
    this.hud.lives.setText(`♥ ${this.lives}`);
    this.hud.score.setText(`Score: ${this.score}`);
    const spd = VS.SPEEDS[this.speedIdx];
    this.hud.speedText.setText(spd + 'x');

    if (this.waveActive) {
      this.hud.startText.setText('FIGHTING...').setColor('#cc6644');
      this.hud.startBg.setFillStyle(0x1a1508);
    } else if (this.waveIndex >= this.mapData.waves.length) {
      this.hud.startText.setText('COMPLETE').setColor('#44cc55');
      this.hud.startBg.setFillStyle(0x0a1a0a);
    } else {
      this.hud.startText.setText('START WAVE').setColor('#ffd700');
      this.hud.startBg.setFillStyle(0x1a2a10);
    }

    /* shop affordability */
    for (const slot of this.shopSlots) {
      const canAfford = this.mana >= slot.def.cost;
      slot.icon.setAlpha(canAfford ? 1 : 0.3);
      slot.costText.setColor(canAfford ? '#ffd700' : '#443300');
    }
  }

  _showWaveMessage(msg) {
    this.hud.waveMsg.setText(msg).setAlpha(1).setScale(0.8);
    this.tweens.add({
      targets: this.hud.waveMsg,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: this.hud.waveMsg,
      alpha: 0,
      duration: 2000,
      delay: 1200,
    });
  }

  /* ── Tower Drag & Drop ── */
  startDrag(idx, ptr) {
    const def = VS.TOWER_DEFS[idx];
    if (this.mana < def.cost) return;
    this.deselectTower();
    this.dragIdx = idx;

    const texKey = 'tower_' + def.id;
    this.dragGhost = this.add.image(ptr.x, ptr.y,
      this.textures.exists(texKey) ? texKey : 'circle')
      .setAlpha(0.6).setDepth(15);
    if (!this.textures.exists(texKey)) this.dragGhost.setTint(def.color);

    this.dragRange = this.add.graphics().setDepth(14);
    this._drawDragRange(ptr.x, ptr.y, def.range);
  }

  _drawDragRange(x, y, range) {
    if (!this.dragRange) return;
    this.dragRange.clear();
    this.dragRange.lineStyle(1, 0x44ff44, 0.3);
    this.dragRange.strokeCircle(x, y, range);
    this.dragRange.fillStyle(0x44ff44, 0.03);
    this.dragRange.fillCircle(x, y, range);
  }

  startDragFromKey(idx) {
    if (idx < 0 || idx >= VS.TOWER_DEFS.length) return;
    const ptr = this.input.activePointer;
    this.startDrag(idx, ptr);
  }

  _onPointerMove(ptr) {
    if (this.dragGhost) {
      this.dragGhost.setPosition(ptr.x, ptr.y);
      const def = VS.TOWER_DEFS[this.dragIdx];
      this._drawDragRange(ptr.x, ptr.y, def.range);

      const tile = this._findNearestTile(ptr.x, ptr.y);
      const valid = tile && !this._tileOccupied(tile);
      this.dragGhost.setAlpha(valid ? 0.8 : 0.3);

      /* highlight nearest tile */
      for (const ts of this.tileSprites) {
        if (tile && Math.abs(ts.tileData.x - tile.x) < 5 && Math.abs(ts.tileData.y - tile.y) < 5) {
          ts.setTexture(valid ? 'tile_ok' : 'tile_bad').setAlpha(0.7);
        } else {
          ts.setTexture('tile').setAlpha(0.4);
        }
      }
    }
  }

  _onPointerUp(ptr) {
    if (this.dragGhost) {
      const tile = this._findNearestTile(ptr.x, ptr.y);
      if (tile && !this._tileOccupied(tile)) {
        this._placeTower(this.dragIdx, tile);
      }
      this.dragGhost.destroy();
      this.dragRange.destroy();
      this.dragGhost = null;
      this.dragRange = null;
      this.dragIdx = -1;

      /* reset tile highlights */
      for (const ts of this.tileSprites) {
        ts.setTexture('tile').setAlpha(0.4);
      }
    } else {
      /* click on empty area = deselect */
      if (ptr.x > VS.SIDEBAR_W && ptr.y > VS.HUD_H) {
        this.deselectTower();
      }
    }
  }

  _findNearestTile(px, py) {
    let best = null, bestDist = 28;
    for (const t of this.mapData.placementTiles) {
      const d = dist({ x: px, y: py }, t);
      if (d < bestDist) { bestDist = d; best = t; }
    }
    return best;
  }

  _tileOccupied(tile) {
    for (const t of this.towers) {
      if (Math.abs(t.tileX - tile.x) < 10 && Math.abs(t.tileY - tile.y) < 10) return true;
    }
    return false;
  }

  _placeTower(idx, tile) {
    const def = VS.TOWER_DEFS[idx];
    if (this.mana < def.cost) return;
    this.spendMana(def.cost);
    SFX.place();

    const TowerClass = TOWER_CLASSES[idx];
    const tower = new TowerClass(this, tile.x, tile.y);

    /* apply permanent upgrade bonuses */
    tower.damage = Math.round(tower.damage * (1 + this.bonuses.towerDmg));
    tower.range = tower.range * (1 + this.bonuses.towerRange);
    tower.rate = Math.round(tower.rate * (1 - this.bonuses.towerRate));

    this.towers.push(tower);
    this.updateHUD();
  }

  /* ── Tower Selection ── */
  selectTower(tower) {
    this.deselectTower();
    this.selectedTower = tower;
    tower.showRange(true);

    const py = tower.y < 200 ? tower.y + 75 : tower.y - 75;
    const px = clamp(tower.x, VS.SIDEBAR_W + 90, 1190);
    this.popup.container.setPosition(px, py).setVisible(true).setScale(0.5).setAlpha(0);
    this.tweens.add({
      targets: this.popup.container,
      scale: 1, alpha: 1,
      duration: 150,
      ease: 'Back.easeOut',
    });

    this.popup.nameText.setText(`${tower.def.name} Lv${tower.level}`);

    if (tower.level >= tower.maxLevel) {
      this.popup.statsText.setText('MAX LEVEL');
      this.popup.upgText.setText('Maxed');
    } else {
      const cost = VS.UPGRADE_COSTS[tower.level];
      this.popup.statsText.setText(`DMG:${tower.damage} RNG:${Math.round(tower.range)} SPD:${tower.rate}ms`);
      this.popup.upgText.setText(`Up (${cost}m)`);
    }
    const refund = Math.round(tower.def.cost * (0.6 + this.bonuses.sellBonus));
    this.popup.sellText.setText(`Sell ${refund}m`);
  }

  deselectTower() {
    if (this.selectedTower) {
      this.selectedTower.showRange(false);
      this.selectedTower = null;
    }
    this.popup.container.setVisible(false);
  }

  _upgradeTower() {
    if (!this.selectedTower) return;
    if (this.selectedTower.upgrade()) {
      this.selectTower(this.selectedTower);
      this.updateHUD();
    }
  }

  _sellTower() {
    if (!this.selectedTower) return;
    const t = this.selectedTower;
    this.deselectTower();
    t.sell();
    this.updateHUD();
  }

  removeTower(tower) {
    const idx = this.towers.indexOf(tower);
    if (idx >= 0) this.towers.splice(idx, 1);
  }

  /* ── Mana ── */
  spendMana(amount) {
    this.mana -= amount;
    this.updateHUD();
  }

  addMana(amount) {
    this.mana += amount;
    this.updateHUD();
  }

  /* ── Waves ── */
  startNextWave() {
    if (this.waveActive || this.gameOver) return;
    if (this.waveIndex >= this.mapData.waves.length) return;
    SFX.waveStart();

    /* passive mana */
    this.addMana(VS.PASSIVE_MANA + this.bonuses.passiveMana);

    this.waveActive = true;
    const waveData = this.mapData.waves[this.waveIndex];
    this.waveIndex++;

    /* build spawn queue */
    this.waveSpawnQueue = [];
    const waveScale = 1 + (this.waveIndex - 1) * 0.08;
    for (const group of waveData) {
      for (let i = 0; i < group.count; i++) {
        this.waveSpawnQueue.push({ type: group.type, delay: group.delay, scale: waveScale });
      }
    }
    this.spawnTimer = 0;
    this._nextSpawnDelay = 500;

    this._showWaveMessage(`Wave ${this.waveIndex}`);

    /* camera zoom for boss waves */
    const hasBoss = waveData.some(g => g.type === 'blightlord');
    if (hasBoss) {
      this._showWaveMessage(`BOSS WAVE ${this.waveIndex}!`);
      this.cameras.main.zoomTo(1.02, 500);
      this.time.delayedCall(3000, () => {
        if (!this.gameOver) this.cameras.main.zoomTo(1, 1000);
      });
    }

    this.updateHUD();
  }

  _spawnEnemy(type, scale) {
    const EClass = ENEMY_CLASSES[type];
    if (!EClass) return;
    const enemy = new EClass(this, [...this.mapData.path], scale);
    this.enemies.push(enemy);
  }

  /* ── Enemy Events ── */
  onEnemyKilled(enemy) {
    this.kills++;
    const bonus = enemy.reward + this.bonuses.killMana;
    this.addMana(bonus);
    this.score += 10;
    SFX.manaPickup();
    this.updateHUD();
  }

  onEnemyReachEnd(enemy) {
    const dmg = enemy.boss ? 5 : 1;
    this.lives -= dmg;

    /* camera effects */
    this.cameras.main.shake(200 + (enemy.boss ? 200 : 0), enemy.boss ? 0.012 : 0.005);

    if (this.lives <= 0) {
      this.lives = 0;
      this._triggerGameOver();
    }
    this.updateHUD();
  }

  /* ── Speed & Pause ── */
  cycleSpeed() {
    this.speedIdx = (this.speedIdx + 1) % VS.SPEEDS.length;
    SFX.click();
    this.updateHUD();
  }

  togglePause() {
    this.paused = !this.paused;
    SFX.click();
    if (this.paused) {
      this.pauseOverlay.setVisible(true);
      this.pauseText.setVisible(true);
    } else {
      this.pauseOverlay.setVisible(false);
      this.pauseText.setVisible(false);
    }
  }

  /* ── Slow-Mo effect ── */
  _triggerSlowMo(duration) {
    this._slowMoTimer = duration;
    this._slowMoFactor = 0.3;
  }

  /* ── Game Over / Victory ── */
  _triggerGameOver() {
    this.gameOver = true;
    /* red flash */
    const flash = this.add.rectangle(640, 360, 1280, 720, 0xff0000, 0.2).setDepth(30);
    this.tweens.add({ targets: flash, alpha: 0, duration: 500 });

    this.cameras.main.shake(500, 0.02);

    this.time.delayedCall(1200, () => {
      this.scene.start('GameOverScene', {
        score: this.score,
        kills: this.kills,
        wavesCleared: this.waveIndex,
        mapIndex: this.mapIndex,
      });
    });
  }

  _checkVictory() {
    if (this.waveIndex >= this.mapData.waves.length && !this.waveActive && !this.gameOver) {
      this.score += this.waveIndex * 100 + this.mana * 2 + this.lives * 50;
      this.gameOver = true;

      /* victory flash */
      const flash = this.add.rectangle(640, 360, 1280, 720, 0x44ff44, 0.1).setDepth(30);
      this.tweens.add({ targets: flash, alpha: 0, duration: 800 });

      this._showWaveMessage('ALL WAVES CLEARED!');
      this._triggerSlowMo(800);

      this.time.delayedCall(2000, () => {
        this.scene.start('VictoryScene', {
          score: this.score,
          kills: this.kills,
          wavesCleared: this.waveIndex,
          livesLeft: this.lives,
          manaLeft: this.mana,
          mapIndex: this.mapIndex,
        });
      });
    }
  }

  /* ── Main Update ── */
  update(time, delta) {
    if (this.paused || this.gameOver) return;

    /* slow-mo decay */
    if (this._slowMoTimer > 0) {
      this._slowMoTimer -= delta;
      if (this._slowMoTimer <= 0) this._slowMoFactor = 1;
    }

    const spd = VS.SPEEDS[this.speedIdx] * this._slowMoFactor;
    const dt = delta * spd;

    /* spawn queue */
    if (this.waveSpawnQueue.length > 0) {
      this.spawnTimer += dt;
      if (this.spawnTimer >= this._nextSpawnDelay) {
        this.spawnTimer = 0;
        const next = this.waveSpawnQueue.shift();
        this._spawnEnemy(next.type, next.scale);
        this._nextSpawnDelay = next.delay;
      }
    }

    /* update enemies */
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.alive) {
        e.update(dt);
      } else {
        this.enemies.splice(i, 1);
      }
    }

    /* update towers */
    for (const t of this.towers) {
      t.update(dt);
    }

    /* update projectiles */
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.alive) {
        p.update(dt);
      } else {
        this.projectiles.splice(i, 1);
      }
    }

    /* wave end check */
    if (this.waveActive && this.waveSpawnQueue.length === 0 && this.enemies.length === 0) {
      this.waveActive = false;
      this.updateHUD();
      this._checkVictory();
      if (!this.gameOver) {
        this._showWaveMessage('Wave cleared!');
      }
    }
  }
}
