/* ═══════════════════════════════════════════════════════
   Aether Descent — Game Scene (Core Gameplay)
   ═══════════════════════════════════════════════════════ */
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.planetIndex = data.planetIndex;
    this.endless = data.endless || false;
    this.depth = data.depth || 0;
    this.carryShards = data.carryShards || 0;

    if (this.endless && this.planetIndex < 0) {
      this.planet = AD.generateEndlessPlanet(this.depth);
    } else {
      this.planet = AD.Planets[this.planetIndex];
    }
  }

  create() {
    AD.Audio.resume();
    const P = this.planet;
    const upgrades = AD.Storage.getUpgrades();

    // ─── State ───
    this.fuel = AD.Upgrades.fuel.effect(upgrades.fuel);
    this.maxFuel = this.fuel;
    this.burnRate = AD.Upgrades.thrust.effect(upgrades.thrust);
    this.maxLandSpeed = AD.Upgrades.armor.effect(upgrades.armor);
    this.shardRadius = AD.Upgrades.scanner.effect(upgrades.scanner);
    this.thrustPower = AD.Upgrades.brake.effect(upgrades.brake);
    this.shardsCollected = this.carryShards;
    this.landed = false;
    this.crashed = false;
    this.elapsed = 0;
    this.thrusting = false;
    this.paused = false;

    this.cameras.main.setBackgroundColor(P.bgColor);

    // ─── Stars ───
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, AD.GAME_WIDTH);
      const y = Phaser.Math.Between(0, AD.GAME_HEIGHT - 150);
      this.add.image(x, y, 'star')
        .setAlpha(Phaser.Math.FloatBetween(0.15, 0.6))
        .setScale(Phaser.Math.FloatBetween(0.5, 1.2));
    }

    // ─── Terrain ───
    this._buildTerrain(P);

    // ─── Landing Pad ───
    this.pads = [];
    P.pads.forEach(padDef => {
      const padW = P.padWidth;
      const pad = this.matter.add.rectangle(padDef.x, padDef.y, padW, 6, {
        isStatic: true,
        label: 'pad',
        isSensor: true,
      });
      this.pads.push(pad);

      // Visual pad
      const padGfx = this.add.graphics();
      padGfx.fillStyle(AD.COLORS.green, 1);
      padGfx.fillRect(padDef.x - padW / 2, padDef.y - 3, padW, 6);
      // Pulsing markers
      padGfx.fillStyle(0xffffff, 0.8);
      padGfx.fillRect(padDef.x - padW / 2 + 3, padDef.y - 1, 6, 2);
      padGfx.fillRect(padDef.x + padW / 2 - 9, padDef.y - 1, 6, 2);

      // Glow pulse
      const glow = this.add.rectangle(padDef.x, padDef.y, padW + 10, 12)
        .setStrokeStyle(1, AD.COLORS.green, 0.3);
      this.tweens.add({
        targets: glow, alpha: { from: 0.3, to: 0.8 },
        duration: 800, yoyo: true, repeat: -1,
      });
    });

    // ─── Shards ───
    this.shards = [];
    for (let i = 0; i < P.shardCount; i++) {
      const sx = Phaser.Math.Between(40, AD.GAME_WIDTH - 40);
      const sy = Phaser.Math.Between(60, 350);
      const shard = this.matter.add.image(sx, sy, 'shard', null, {
        isSensor: true, isStatic: true, label: 'shard',
      });
      shard.setScale(1.2);
      this.tweens.add({
        targets: shard, y: sy - 6, duration: 1200 + Math.random() * 600,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
      this.shards.push(shard);
    }

    // ─── Hazards ───
    this.hazardObjects = [];
    this._spawnHazards(P);

    // ─── Probe ───
    this.probe = this.matter.add.image(AD.GAME_WIDTH / 2, 60, 'probe', null, {
      friction: 0.05,
      frictionAir: 0.02,
      restitution: 0.1,
      density: 0.002,
      label: 'probe',
    });
    this.probe.setFixedRotation();
    this.probe.setScale(1);

    // Flame visual (child)
    this.flame = this.add.image(0, 0, 'flame').setVisible(false).setScale(1.2);

    // ─── Gravity + Wind ───
    this.gravityScale = P.gravity;
    this.windForce = P.wind;
    this.windDir = Math.random() > 0.5 ? 1 : -1;
    // Wind shifts occasionally
    this.time.addEvent({
      delay: 4000 + Math.random() * 3000,
      callback: () => { this.windDir *= -1; },
      loop: true,
    });

    // ─── Controls ───
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D',
    });
    this.escKey = this.input.keyboard.addKey('ESC');

    // ─── HUD ───
    this._createHUD();

    // ─── Pause overlay ───
    this.pauseOverlay = this.add.rectangle(
      AD.GAME_WIDTH / 2, AD.GAME_HEIGHT / 2,
      AD.GAME_WIDTH, AD.GAME_HEIGHT, 0x000000, 0.7
    ).setVisible(false).setDepth(100);
    this.pauseText = this.add.text(AD.GAME_WIDTH / 2, AD.GAME_HEIGHT / 2 - 30, 'PAUSED', {
      fontSize: '36px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5).setVisible(false).setDepth(101);
    this.pauseHint = this.add.text(AD.GAME_WIDTH / 2, AD.GAME_HEIGHT / 2 + 20, 'Press ESC to resume · Q to quit', {
      fontSize: '14px', fontFamily: 'monospace', color: '#94a3b8',
    }).setOrigin(0.5).setVisible(false).setDepth(101);
    this.qKey = this.input.keyboard.addKey('Q');

    // ─── Collision Detection ───
    this.matter.world.on('collisionstart', (event) => {
      if (this.landed || this.crashed) return;
      event.pairs.forEach(pair => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes('probe')) {
          if (labels.includes('pad')) {
            this._handleLanding();
          } else if (labels.includes('shard')) {
            // Handled in update via distance check for better radius
          } else if (labels.includes('terrain')) {
            this._handleCrash('Terrain impact');
          } else if (labels.includes('asteroid')) {
            this._handleCrash('Asteroid collision');
          }
        }
      });
    });

    // Planet name flash
    const nameText = this.add.text(AD.GAME_WIDTH / 2, AD.GAME_HEIGHT / 2, P.name, {
      fontSize: '32px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5).setAlpha(0.8).setDepth(50);
    const descText = this.add.text(AD.GAME_WIDTH / 2, AD.GAME_HEIGHT / 2 + 35, P.desc, {
      fontSize: '14px', fontFamily: 'monospace', color: '#94a3b8',
    }).setOrigin(0.5).setAlpha(0.7).setDepth(50);
    this.tweens.add({
      targets: [nameText, descText], alpha: 0, delay: 1500, duration: 800,
      onComplete: () => { nameText.destroy(); descText.destroy(); },
    });
  }

  update(time, delta) {
    if (this.landed || this.crashed) return;

    // Pause toggle
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.paused = !this.paused;
      this.pauseOverlay.setVisible(this.paused);
      this.pauseText.setVisible(this.paused);
      this.pauseHint.setVisible(this.paused);
      if (this.paused) {
        this.matter.world.pause();
      } else {
        this.matter.world.resume();
      }
    }
    if (this.paused) {
      if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
        this.matter.world.resume();
        this.scene.start('MainMenu');
      }
      return;
    }

    this.elapsed += delta / 1000;

    const body = this.probe.body;
    const dt = delta / 16.667; // normalize to 60fps

    // ─── Gravity ───
    const gForce = AD.PHYSICS.baseGravity * this.gravityScale * dt;
    this.matter.body.applyForce(body, body.position, { x: 0, y: gForce });

    // ─── Wind ───
    if (this.windForce > 0) {
      const wForce = this.windForce * 0.00008 * this.windDir * dt;
      this.matter.body.applyForce(body, body.position, { x: wForce, y: 0 });
    }

    // ─── Thrust Controls ───
    this.thrusting = false;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    if (this.fuel > 0) {
      if (up) {
        this.matter.body.applyForce(body, body.position, { x: 0, y: -this.thrustPower * dt });
        this.fuel -= this.burnRate * dt;
        this.thrusting = true;
      }
      if (down) {
        this.matter.body.applyForce(body, body.position, { x: 0, y: this.thrustPower * 0.5 * dt });
        this.fuel -= this.burnRate * 0.5 * dt;
        this.thrusting = true;
      }
      if (left) {
        this.matter.body.applyForce(body, body.position, { x: -this.thrustPower * 0.6 * dt, y: 0 });
        this.fuel -= this.burnRate * 0.4 * dt;
        this.thrusting = true;
      }
      if (right) {
        this.matter.body.applyForce(body, body.position, { x: this.thrustPower * 0.6 * dt, y: 0 });
        this.fuel -= this.burnRate * 0.4 * dt;
        this.thrusting = true;
      }
      this.fuel = Math.max(0, this.fuel);
    }

    if (this.thrusting && this.fuel > 0) {
      AD.Audio.thrust();
    }

    // ─── Flame visual ───
    this.flame.setVisible(this.thrusting && this.fuel > 0);
    if (this.flame.visible) {
      this.flame.setPosition(this.probe.x, this.probe.y + 20);
      this.flame.setScale(1 + Math.random() * 0.4, 1 + Math.random() * 0.3);
    }

    // ─── Velocity cap ───
    const vx = Phaser.Math.Clamp(body.velocity.x, -AD.PHYSICS.maxVelocity, AD.PHYSICS.maxVelocity);
    const vy = Phaser.Math.Clamp(body.velocity.y, -AD.PHYSICS.maxVelocity, AD.PHYSICS.maxVelocity);
    this.matter.body.setVelocity(body, { x: vx, y: vy });

    // ─── Wrap horizontal ───
    if (this.probe.x < -10) this.probe.x = AD.GAME_WIDTH + 10;
    if (this.probe.x > AD.GAME_WIDTH + 10) this.probe.x = -10;

    // ─── Shard collection ───
    this.shards.forEach(shard => {
      if (!shard.active) return;
      const dist = Phaser.Math.Distance.Between(this.probe.x, this.probe.y, shard.x, shard.y);
      if (dist < this.shardRadius) {
        shard.setActive(false).setVisible(false);
        this.shardsCollected++;
        AD.Audio.collectShard();
        // Sparkle effect
        for (let i = 0; i < 6; i++) {
          const p = this.add.image(shard.x, shard.y, 'particle')
            .setTint(AD.COLORS.cyan).setScale(0.5).setAlpha(0.8);
          this.tweens.add({
            targets: p,
            x: shard.x + Phaser.Math.Between(-30, 30),
            y: shard.y + Phaser.Math.Between(-30, 30),
            alpha: 0, scale: 0, duration: 400,
            onComplete: () => p.destroy(),
          });
        }
      }
    });

    // ─── Hazard effects ───
    this._updateHazards(dt);

    // ─── Fuel warning ───
    if (this.fuel > 0 && this.fuel < 20 && Math.floor(time / 500) % 2 === 0) {
      this.fuelBar.fillColor = AD.COLORS.red;
    }

    // ─── HUD Update ───
    this._updateHUD();

    // ─── Out of bounds (top/bottom) ───
    if (this.probe.y > AD.GAME_HEIGHT + 20) {
      this._handleCrash('Fell into the void');
    }
  }

  // ═══════════════════════════════════════════════════════
  // Terrain
  // ═══════════════════════════════════════════════════════
  _buildTerrain(P) {
    const t = P.terrain;
    const gfx = this.add.graphics();
    gfx.fillStyle(P.terrainColor, 1);
    gfx.beginPath();
    gfx.moveTo(t[0], t[1]);
    for (let i = 2; i < t.length; i += 2) {
      gfx.lineTo(t[i], t[i + 1]);
    }
    gfx.lineTo(AD.GAME_WIDTH, AD.GAME_HEIGHT);
    gfx.lineTo(0, AD.GAME_HEIGHT);
    gfx.closePath();
    gfx.fillPath();

    // Terrain surface highlight
    const tc = Phaser.Display.Color.ValueToColor(P.terrainColor);
    const bright = Phaser.Display.Color.GetColor(
      Math.min(255, tc.red + 50),
      Math.min(255, tc.green + 50),
      Math.min(255, tc.blue + 50)
    );
    gfx.lineStyle(2, bright, 0.6);
    gfx.beginPath();
    gfx.moveTo(t[0], t[1]);
    for (let i = 2; i < t.length; i += 2) {
      gfx.lineTo(t[i], t[i + 1]);
    }
    gfx.strokePath();

    // Build terrain collision bodies as line segments
    for (let i = 0; i < t.length - 2; i += 2) {
      const x1 = t[i], y1 = t[i + 1];
      const x2 = t[i + 2], y2 = t[i + 3];

      // Skip segments under the pad
      let underPad = false;
      P.pads.forEach(pad => {
        const padW = P.padWidth;
        const mx = (x1 + x2) / 2;
        if (mx > pad.x - padW / 2 - 5 && mx < pad.x + padW / 2 + 5) underPad = true;
      });
      if (underPad) continue;

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Phaser.Math.Distance.Between(x1, y1, x2, y2);
      const angle = Math.atan2(y2 - y1, x2 - x1);

      this.matter.add.rectangle(mx, my, len, 4, {
        isStatic: true,
        angle: angle,
        label: 'terrain',
        friction: 0.8,
      });
    }

    // Bottom wall
    this.matter.add.rectangle(AD.GAME_WIDTH / 2, AD.GAME_HEIGHT + 10, AD.GAME_WIDTH, 20, {
      isStatic: true, label: 'terrain',
    });
  }

  // ═══════════════════════════════════════════════════════
  // Hazards
  // ═══════════════════════════════════════════════════════
  _spawnHazards(P) {
    if (P.hazards.includes('asteroid')) {
      for (let i = 0; i < 2 + this.depth; i++) {
        const ax = Phaser.Math.Between(50, AD.GAME_WIDTH - 50);
        const ay = Phaser.Math.Between(80, 300);
        const asteroid = this.matter.add.image(ax, ay, 'asteroid', null, {
          label: 'asteroid',
          frictionAir: 0,
          friction: 0,
          restitution: 1,
          density: 0.01,
        });
        asteroid.setScale(Phaser.Math.FloatBetween(0.8, 1.5));
        const vx = Phaser.Math.FloatBetween(-0.5, 0.5);
        const vy = Phaser.Math.FloatBetween(-0.3, 0.3);
        this.matter.body.setVelocity(asteroid.body, { x: vx, y: vy });
        this.hazardObjects.push({ type: 'asteroid', obj: asteroid });
      }
    }

    if (P.hazards.includes('geyser')) {
      const gx = Phaser.Math.Between(100, AD.GAME_WIDTH - 100);
      const gy = this._getTerrainYAt(gx, P) - 5;
      const gfx = this.add.graphics();
      gfx.fillStyle(AD.COLORS.orange, 0.3);
      gfx.fillRect(gx - 15, gy - 120, 30, 120);
      this.hazardObjects.push({
        type: 'geyser', x: gx, y: gy, gfx,
        timer: 0, active: false, interval: 3000 + Math.random() * 2000,
      });
    }

    if (P.hazards.includes('lightning')) {
      const lx = Phaser.Math.Between(100, AD.GAME_WIDTH - 100);
      const ly = Phaser.Math.Between(100, 300);
      const zone = this.add.rectangle(lx, ly, 80, 80)
        .setStrokeStyle(1, AD.COLORS.yellow, 0.3);
      this.tweens.add({
        targets: zone, alpha: { from: 0.2, to: 0.6 },
        duration: 600, yoyo: true, repeat: -1,
      });
      this.hazardObjects.push({
        type: 'lightning', x: lx, y: ly, zone,
        timer: 0, interval: 2500 + Math.random() * 2000,
      });
    }

    if (P.hazards.includes('magnetic')) {
      const mx = Phaser.Math.Between(150, AD.GAME_WIDTH - 150);
      const my = Phaser.Math.Between(150, 350);
      const field = this.add.circle(mx, my, 60)
        .setStrokeStyle(2, AD.COLORS.purple, 0.4);
      this.tweens.add({
        targets: field, scaleX: { from: 0.9, to: 1.1 }, scaleY: { from: 0.9, to: 1.1 },
        duration: 1000, yoyo: true, repeat: -1,
      });
      this.hazardObjects.push({ type: 'magnetic', x: mx, y: my, field });
    }
  }

  _getTerrainYAt(x, P) {
    const t = P.terrain;
    for (let i = 0; i < t.length - 2; i += 2) {
      if (x >= t[i] && x <= t[i + 2]) {
        const frac = (x - t[i]) / (t[i + 2] - t[i]);
        return t[i + 1] + frac * (t[i + 3] - t[i + 1]);
      }
    }
    return 480;
  }

  _updateHazards(dt) {
    this.hazardObjects.forEach(h => {
      if (h.type === 'geyser') {
        h.timer += dt * 16.667;
        if (h.timer > h.interval) {
          h.timer = 0;
          h.active = true;
          // Geyser burst — apply upward force if probe is near
          const dist = Phaser.Math.Distance.Between(this.probe.x, this.probe.y, h.x, h.y);
          if (dist < 50 && this.probe.y < h.y && this.probe.y > h.y - 130) {
            this.matter.body.applyForce(this.probe.body, this.probe.body.position, { x: 0, y: -0.008 });
          }
          // Visual burst
          h.gfx.clear();
          h.gfx.fillStyle(AD.COLORS.orange, 0.5);
          h.gfx.fillRect(h.x - 15, h.y - 120, 30, 120);
          this.time.delayedCall(500, () => {
            if (h.gfx) {
              h.gfx.clear();
              h.gfx.fillStyle(AD.COLORS.orange, 0.2);
              h.gfx.fillRect(h.x - 15, h.y - 120, 30, 120);
              h.active = false;
            }
          });
        }
      }

      if (h.type === 'lightning') {
        h.timer += dt * 16.667;
        if (h.timer > h.interval) {
          h.timer = 0;
          const dist = Phaser.Math.Distance.Between(this.probe.x, this.probe.y, h.x, h.y);
          if (dist < 50) {
            // Random impulse
            this.matter.body.applyForce(this.probe.body, this.probe.body.position, {
              x: Phaser.Math.FloatBetween(-0.005, 0.005),
              y: Phaser.Math.FloatBetween(-0.005, 0.005),
            });
            AD.Audio.warning();
          }
          // Flash
          h.zone.setFillStyle(AD.COLORS.yellow, 0.4);
          this.time.delayedCall(200, () => {
            if (h.zone) h.zone.setFillStyle(0x000000, 0);
          });
        }
      }

      if (h.type === 'magnetic') {
        const dist = Phaser.Math.Distance.Between(this.probe.x, this.probe.y, h.x, h.y);
        if (dist < 80 && dist > 5) {
          const angle = Math.atan2(h.y - this.probe.y, h.x - this.probe.x);
          const strength = 0.0003 * (1 - dist / 80) * dt;
          this.matter.body.applyForce(this.probe.body, this.probe.body.position, {
            x: Math.cos(angle) * strength,
            y: Math.sin(angle) * strength,
          });
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════
  // HUD
  // ═══════════════════════════════════════════════════════
  _createHUD() {
    const style = { fontSize: '13px', fontFamily: 'monospace', color: AD.CSS.white };

    // Fuel bar background
    this.add.rectangle(70, 18, 104, 14, 0x1e293b).setStrokeStyle(1, 0x475569);
    this.fuelBar = this.add.rectangle(19, 12, 100, 10, AD.COLORS.cyan).setOrigin(0, 0);
    this.add.text(5, 30, 'FUEL', style);

    this.speedText = this.add.text(AD.GAME_WIDTH - 10, 10, '', style).setOrigin(1, 0);
    this.altText = this.add.text(AD.GAME_WIDTH - 10, 28, '', style).setOrigin(1, 0);
    this.shardText = this.add.text(AD.GAME_WIDTH - 10, 46, '', { ...style, color: AD.CSS.cyan }).setOrigin(1, 0);
    this.timeText = this.add.text(AD.GAME_WIDTH / 2, 10, '', style).setOrigin(0.5, 0);

    // Wind indicator
    this.windText = this.add.text(5, 48, '', { fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' });
  }

  _updateHUD() {
    const body = this.probe.body;
    const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
    const alt = Math.max(0, Math.floor(AD.GAME_HEIGHT - this.probe.y - 100));
    const fuelPct = Math.max(0, this.fuel / this.maxFuel);

    this.fuelBar.scaleX = fuelPct;
    this.fuelBar.fillColor = fuelPct < 0.2 ? AD.COLORS.red : (fuelPct < 0.4 ? AD.COLORS.orange : AD.COLORS.cyan);

    this.speedText.setText('SPD: ' + speed.toFixed(2));
    this.speedText.setColor(speed > this.maxLandSpeed ? AD.CSS.red : AD.CSS.white);
    this.altText.setText('ALT: ' + alt);
    this.shardText.setText('◆ ' + this.shardsCollected);

    const timeLeft = Math.max(0, AD.SCORING.timeLimit - this.elapsed);
    this.timeText.setText('TIME: ' + Math.floor(timeLeft));
    this.timeText.setColor(timeLeft < 15 ? AD.CSS.red : AD.CSS.white);

    // Wind
    if (this.windForce > 0) {
      const arrow = this.windDir > 0 ? '→' : '←';
      this.windText.setText('WIND ' + arrow + ' ' + this.windForce.toFixed(2));
    }
  }

  // ═══════════════════════════════════════════════════════
  // Landing & Crash
  // ═══════════════════════════════════════════════════════
  _handleLanding() {
    if (this.landed || this.crashed) return;
    const body = this.probe.body;
    const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
    const angle = Math.abs(body.angle % (Math.PI * 2));
    const normalAngle = Math.min(angle, Math.PI * 2 - angle);

    if (speed > this.maxLandSpeed || normalAngle > AD.PHYSICS.maxLandAngle) {
      this._handleCrash(speed > this.maxLandSpeed ? 'Too fast' : 'Bad angle');
      return;
    }

    this.landed = true;
    this.matter.body.setVelocity(body, { x: 0, y: 0 });
    this.matter.body.setStatic(body, true);

    const perfect = speed < AD.PHYSICS.perfectSpeed && normalAngle < AD.PHYSICS.perfectAngle;
    const multiplier = perfect ? AD.SCORING.perfectMultiplier :
      (speed < AD.PHYSICS.maxLandSpeed * 0.5 ? AD.SCORING.goodMultiplier : AD.SCORING.okMultiplier);

    if (perfect) {
      AD.Audio.perfectLand();
      this.cameras.main.flash(500, 74, 222, 128, false, null, this);
    } else {
      AD.Audio.land();
    }

    const timeBonus = Math.max(0, Math.floor((AD.SCORING.timeLimit - this.elapsed) * AD.SCORING.timeValue));
    const fuelLeft = this.fuel;
    const totalScore = Math.floor(
      (this.shardsCollected * AD.SCORING.shardValue) +
      (fuelLeft * AD.SCORING.fuelValue) +
      timeBonus
    ) * multiplier;

    this.time.delayedCall(1500, () => {
      this.scene.start('GameOver', {
        landed: true,
        perfect,
        shards: this.shardsCollected,
        fuelLeft,
        landingMultiplier: multiplier,
        timeBonus,
        totalScore,
        planetIndex: this.planetIndex,
        planetName: this.planet.name,
        endless: this.endless,
        depth: this.depth,
      });
    });
  }

  _handleCrash(reason) {
    if (this.landed || this.crashed) return;
    this.crashed = true;
    AD.Audio.crash();

    // Explosion particles
    for (let i = 0; i < 20; i++) {
      const colors = [AD.COLORS.orange, AD.COLORS.red, AD.COLORS.yellow, 0xffffff];
      const p = this.add.image(this.probe.x, this.probe.y, 'particle')
        .setTint(Phaser.Utils.Array.GetRandom(colors))
        .setScale(Phaser.Math.FloatBetween(0.3, 1));
      this.tweens.add({
        targets: p,
        x: this.probe.x + Phaser.Math.Between(-60, 60),
        y: this.probe.y + Phaser.Math.Between(-60, 60),
        alpha: 0, scale: 0, duration: 600 + Math.random() * 400,
        onComplete: () => p.destroy(),
      });
    }

    // Screen shake
    this.cameras.main.shake(300, 0.015);
    this.probe.setVisible(false);
    this.flame.setVisible(false);

    this.time.delayedCall(1500, () => {
      this.scene.start('GameOver', {
        landed: false,
        shards: this.shardsCollected,
        crashReason: reason,
        planetIndex: this.planetIndex,
        planetName: this.planet.name,
        endless: this.endless,
        depth: this.depth,
      });
    });
  }
}
