/* ── Verdant Siege – towers.js ── */

/* ── Projectile ── */
class Projectile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, target, damage, speed, type, aoe, color) {
    // POLISH ADD - Use Kenney ammo sprites if available
    let texKey;
    const kenney = scene.registry.get('kenneyLoaded');
    if (kenney) {
      if (aoe > 0) texKey = 'k_ammo_cannonball';
      else if (type === 'magic') texKey = 'k_ammo_bullet';
      else texKey = 'k_ammo_arrow';
    } else {
      texKey = type === 'magic' ? 'proj_magic' : aoe > 0 ? 'proj_bloom' : 'proj_physical';
    }
    super(scene, x, y, scene.textures.exists(texKey) ? texKey : 'circle');
    scene.add.existing(this);
    this.setDepth(7);
    // POLISH ADD - Scale Kenney ammo to fit
    if (kenney && texKey.startsWith('k_')) {
      this.setScale(0.25);
    } else if (!scene.textures.exists(texKey)) {
      this.setTint(color || 0xccff44);
    }
    this.target = target;
    this.damage = damage;
    this.speed = speed || 6;
    this.type = type;
    this.aoe = aoe || 0;
    this.alive = true;
    this._trail = [];
    this._age = 0;
  }

  update(dt) {
    if (!this.alive) return;
    if (!this.target || !this.target.alive) { this.kill(); return; }

    this._age += dt;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
    const spd = this.speed * (dt / 16);
    this.x += Math.cos(angle) * spd;
    this.y += Math.sin(angle) * spd;
    this.rotation = angle;

    /* trail particles (every few frames) */
    if (this._age % 3 < 1 && this.scene.projTrailEmitter) {
      this.scene.projTrailEmitter.emitParticleAt(this.x, this.y);
    }

    if (dist(this, this.target) < 14) {
      this.hit();
    }

    /* timeout safety */
    if (this._age > 5000) this.kill();
  }

  hit() {
    if (this.aoe > 0) {
      /* splash damage */
      for (const e of this.scene.enemies) {
        if (e.alive && dist(e, this) < this.aoe) {
          e.takeDamage(this.damage, this.type);
        }
      }
      /* AoE visual ring */
      const ring = this.scene.add.circle(this.x, this.y, this.aoe, 0xff88cc, 0.2).setDepth(7);
      this.scene.tweens.add({
        targets: ring,
        alpha: 0,
        scale: 1.5,
        duration: 300,
        onComplete: () => ring.destroy(),
      });
      // POLISH ADD - Shockwave on AoE impact
      if (this.scene._spawnShockwave) {
        this.scene._spawnShockwave(this.x, this.y, 0xff88cc, 1.5, 300);
      }
      SFX.explosion();
    } else {
      this.target.takeDamage(this.damage, this.type);
    }
    /* impact flash */
    const flash = this.scene.add.circle(this.x, this.y, 6, 0xffffff, 0.5).setDepth(8);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 150,
      onComplete: () => flash.destroy(),
    });
    this.kill();
  }

  kill() {
    this.alive = false;
    this.destroy();
  }
}

/* ── Tower base ── */
class Tower extends Phaser.GameObjects.Sprite {
  constructor(scene, tileX, tileY, def) {
    // POLISH ADD - Use Kenney tower sprites if available
    const kenney = scene.registry.get('kenneyLoaded');
    const kKey = 'k_tower_' + def.id;
    const texKey = kenney && scene.textures.exists(kKey) ? kKey : 'tower_' + def.id;
    super(scene, tileX, tileY, scene.textures.exists(texKey) ? texKey : 'circle');
    scene.add.existing(this);

    this.scene = scene;
    this.def = { ...def };
    this.tileX = tileX;
    this.tileY = tileY;
    this.level = 1;
    this.maxLevel = 3;
    this.fireTimer = 0;
    this.type = def.type;
    this.kills = 0;
    this._useKenney = kenney && scene.textures.exists(kKey); // POLISH ADD

    this.range = def.range;
    this.damage = def.damage;
    this.rate = def.rate;

    // POLISH ADD - Scale and tint for Kenney vs procedural
    if (this._useKenney) {
      this.setScale(0.55);
    } else if (!scene.textures.exists('tower_' + def.id)) {
      this.setTint(def.color);
      this.setScale(1.0);
    } else {
      this.setScale(1.0);
    }
    this.setDepth(4);
    this.setInteractive();

    /* range indicator */
    this.rangeCircle = scene.add.graphics().setDepth(3).setVisible(false);
    this._drawRange();

    // POLISH ADD - Enhanced glow under tower using bloomGlow texture
    this.glowSprite = scene.add.image(tileX, tileY, 'bloomGlow')
      .setTint(def.color).setScale(2.2).setAlpha(0.18).setDepth(3)
      .setBlendMode(Phaser.BlendModes.ADD);

    // POLISH ADD - Upgrade frame overlay (hidden until level 2+)
    this.upgradeFrame = null;

    this.on('pointerdown', (ptr) => {
      if (!scene.dragGhost) {
        scene.selectTower(this);
      }
    });

    /* idle sway */
    scene.tweens.add({
      targets: this,
      angle: { from: -2, to: 2 },
      duration: 1200 + Math.random() * 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    /* place pop animation */
    const targetScale = this._useKenney ? 0.55 : 1;
    this.setScale(0.05);
    scene.tweens.add({
      targets: this,
      scaleX: targetScale,
      scaleY: targetScale,
      duration: 300,
      ease: 'Back.easeOut',
    });
  }

  _drawRange() {
    this.rangeCircle.clear();
    this.rangeCircle.lineStyle(1, 0x44ff44, 0.3);
    this.rangeCircle.strokeCircle(this.tileX, this.tileY, this.range);
    this.rangeCircle.fillStyle(0x44ff44, 0.04);
    this.rangeCircle.fillCircle(this.tileX, this.tileY, this.range);
  }

  showRange(show) {
    this.rangeCircle.setVisible(show);
    if (show) this._drawRange();
  }

  upgrade() {
    if (this.level >= this.maxLevel) return false;
    const cost = VS.UPGRADE_COSTS[this.level];
    if (this.scene.mana < cost) return false;
    this.scene.spendMana(cost);
    this.level++;
    this.range *= 1.15;
    this.damage = Math.round(this.damage * 1.3);
    this.rate = Math.round(this.rate * 0.85);
    this._drawRange();
    SFX.upgrade();

    // POLISH ADD - Enhanced upgrade pop animation (bigger bounce)
    const targetScale = this._useKenney ? 0.55 : 1;
    this.scene.tweens.add({
      targets: this,
      scaleX: targetScale * 1.5,
      scaleY: targetScale * 1.5,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut',
      onComplete: () => this.setScale(targetScale),
    });

    /* upgrade sparkle */
    if (this.scene.upgradeEmitter) {
      this.scene.upgradeEmitter.explode(12, this.x, this.y);
    }

    // POLISH ADD - Level glow pulse (enhanced with bloomGlow)
    this.glowSprite.setScale(4);
    this.glowSprite.setAlpha(0.5);
    this.scene.tweens.add({
      targets: this.glowSprite,
      scale: 2.2,
      alpha: 0.18,
      duration: 600,
      ease: 'Power2',
    });

    // POLISH ADD - Add/update upgrade frame overlay
    if (this.upgradeFrame) this.upgradeFrame.destroy();
    const frameKey = this.level >= 3 ? 'upgrade_frame_3' : 'upgrade_frame_2';
    if (this.scene.textures.exists(frameKey)) {
      this.upgradeFrame = this.scene.add.image(this.x, this.y, frameKey)
        .setDepth(5).setAlpha(0.7).setScale(this._useKenney ? 0.6 : 1);
      // POLISH ADD - Frame pulse in
      this.upgradeFrame.setScale(0.1);
      this.scene.tweens.add({
        targets: this.upgradeFrame,
        scale: this._useKenney ? 0.6 : 1,
        duration: 300,
        ease: 'Back.easeOut',
      });
    }

    floatingText(this.scene, this.x, this.y - 20, 'Lv ' + this.level, '#44ff88', 14);
    return true;
  }

  sell() {
    const refund = Math.round(this.def.cost * (0.6 + (this.scene.bonuses ? this.scene.bonuses.sellBonus : 0)));
    this.scene.addMana(refund);
    SFX.sell();
    floatingText(this.scene, this.x, this.y - 10, '+' + refund + 'm', '#ffd700', 13);

    /* sell poof animation */
    const poof = this.scene.add.circle(this.x, this.y, 20, this.def.color, 0.4).setDepth(10);
    this.scene.tweens.add({
      targets: poof,
      scale: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => poof.destroy(),
    });

    // POLISH ADD - Debris on sell
    if (this.scene.debrisExplode) {
      this.scene.debrisExplode(this.x, this.y, this.def.color, 5);
    }

    this.rangeCircle.destroy();
    this.glowSprite.destroy();
    // POLISH ADD - Clean up upgrade frame
    if (this.upgradeFrame) this.upgradeFrame.destroy();
    this.scene.removeTower(this);
    this.destroy();
  }

  findTarget() {
    let best = null;
    let bestProgress = -1;
    for (const e of this.scene.enemies) {
      if (!e.alive) continue;
      if (!this.canTarget(e)) continue;
      const d = dist(this, e);
      if (d > this.range) continue;
      const progress = e.pathIndex + e.pathT;
      if (progress > bestProgress) {
        bestProgress = progress;
        best = e;
      }
    }
    return best;
  }

  canTarget(enemy) {
    if (enemy.flying && this.type !== 'magic') return false;
    return true;
  }

  fire(target) {
    const proj = new Projectile(
      this.scene, this.x, this.y, target,
      this.damage, this.def.projSpeed || 6,
      this.type, this.getAoe(),
      this.def.projColor
    );
    this.scene.projectiles.push(proj);
    SFX.shoot(this.type);

    /* fire recoil */
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    this.rotation = angle;

    /* muzzle flash */
    const flashX = this.x + Math.cos(angle) * 15;
    const flashY = this.y + Math.sin(angle) * 15;
    const flash = this.scene.add.circle(flashX, flashY, 5, this.def.projColor || 0xffffff, 0.6).setDepth(7);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 0.1,
      duration: 100,
      onComplete: () => flash.destroy(),
    });

    // POLISH ADD - Fire recoil squash on tower
    const targetScale = this._useKenney ? 0.55 : 1;
    this.scene.tweens.add({
      targets: this,
      scaleX: targetScale * 0.9,
      scaleY: targetScale * 1.1,
      duration: 50,
      yoyo: true,
      ease: 'Sine.easeOut',
    });
  }

  getAoe() { return 0; }

  update(dt) {
    this.fireTimer += dt;
    if (this.fireTimer >= this.rate) {
      const target = this.findTarget();
      if (target) {
        this.fireTimer = 0;
        this.fire(target);
      }
    }
  }
}

/* ── Tower subclasses ── */

class ThornSpitter extends Tower {
  constructor(scene, tx, ty) {
    super(scene, tx, ty, VS.TOWER_DEFS[0]);
  }
}

class VineTrapper extends Tower {
  constructor(scene, tx, ty) {
    super(scene, tx, ty, VS.TOWER_DEFS[1]);
  }

  fire(target) {
    super.fire(target);
    const slowPower = 0.5 - (this.scene.bonuses ? this.scene.bonuses.slowPower : 0);
    target.applySlow(Math.max(0.2, slowPower), 2000);
  }
}

class BloomBomber extends Tower {
  constructor(scene, tx, ty) {
    super(scene, tx, ty, VS.TOWER_DEFS[2]);
  }

  getAoe() {
    const base = 55 + this.level * 12;
    const bonus = this.scene.bonuses ? this.scene.bonuses.aoeSize : 0;
    return Math.round(base * (1 + bonus));
  }
}

class Moonflower extends Tower {
  constructor(scene, tx, ty) {
    super(scene, tx, ty, VS.TOWER_DEFS[3]);
  }

  canTarget(enemy) { return true; /* magic hits everything incl flying */ }
}

class HeartLily extends Tower {
  constructor(scene, tx, ty) {
    super(scene, tx, ty, VS.TOWER_DEFS[4]);
    this.healTimer = 0;
  }

  update(dt) {
    this.healTimer += dt;
    if (this.healTimer >= this.rate) {
      this.healTimer = 0;

      /* heal tree */
      const maxLives = VS.START_LIVES + (this.scene.bonuses ? this.scene.bonuses.extraLives : 0);
      if (this.scene.lives < maxLives) {
        this.scene.lives = Math.min(maxLives, this.scene.lives + 1);
        this.scene.updateHUD();
        floatingText(this.scene, this.scene.treeSprite.x, this.scene.treeSprite.y - 20, '+1 \u2665', '#ff6666', 12);

        /* heal pulse on tree */
        if (this.scene.healEmitter) {
          this.scene.healEmitter.explode(5, this.scene.treeSprite.x, this.scene.treeSprite.y);
        }
        SFX.shoot('support');
      }

      /* buff nearby towers */
      for (const t of this.scene.towers) {
        if (t !== this && dist(this, t) < this.range) {
          t.fireTimer += 80; /* small rate bonus */
        }
      }

      /* pulse animation */
      const pulse = this.scene.add.circle(this.x, this.y, this.range, 0xff6b6b, 0.08).setDepth(3);
      this.scene.tweens.add({
        targets: pulse,
        alpha: 0,
        scale: 1.3,
        duration: 600,
        onComplete: () => pulse.destroy(),
      });

      // POLISH ADD - Mana spark particles on heal
      if (this.scene.manaSeedEmitter) {
        this.scene.manaSeedEmitter.setParticleTint(0xff6b6b);
        this.scene.manaSeedEmitter.explode(2, this.x, this.y);
      }
    }
  }

  findTarget() { return null; }
  fire() { /* no projectiles */ }
}

const TOWER_CLASSES = [ThornSpitter, VineTrapper, BloomBomber, Moonflower, HeartLily];
