/* ── Verdant Siege – enemies.js ── */

class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, path, def, waveScale) {
    const start = path[0];
    const texKey = 'enemy_' + (def.id || 'crawler');
    super(scene, start.x, start.y, scene.textures.exists(texKey) ? texKey : 'circle');
    scene.add.existing(this);

    this.scene = scene;
    this.def = def;
    this.path = path;
    this.pathIndex = 0;
    this.pathT = 0;

    const s = waveScale || 1;
    this.maxHp = Math.round(def.hp * s);
    this.hp = this.maxHp;
    this.speed = def.speed;
    this.armor = def.armor;
    this.reward = def.reward;
    this.flying = !!def.flying;
    this.magicOnly = !!def.magicOnly;
    this.boss = !!def.boss;
    this.alive = true;
    this.slowTimer = 0;
    this.slowFactor = 1;
    this._wobble = 0;

    if (!scene.textures.exists(texKey)) {
      this.setTint(def.color);
    }
    this.setScale(def.scale || 1);
    this.setDepth(this.flying ? 8 : 5);

    /* hp bar */
    this.hpBar = scene.add.graphics().setDepth(this.flying ? 9 : 6);
    this._drawHpBar();

    /* flying indicator: subtle shadow offset */
    if (this.flying) {
      this.shadow = scene.add.circle(start.x, start.y + 8, 6 * (def.scale || 1), 0x000000, 0.2).setDepth(4);
    }

    /* spawn pop animation */
    this.setScale(0.1);
    scene.tweens.add({
      targets: this,
      scaleX: def.scale || 1,
      scaleY: def.scale || 1,
      duration: 200,
      ease: 'Back.easeOut',
    });
  }

  _drawHpBar() {
    this.hpBar.clear();
    if (this.hp >= this.maxHp) return; /* don't show full hp */
    const w = 22 * (this.def.scale || 1);
    const pct = clamp(this.hp / this.maxHp, 0, 1);
    const bx = this.x - w / 2, by = this.y - 14 * (this.def.scale || 1);

    this.hpBar.fillStyle(0x000000, 0.6);
    this.hpBar.fillRect(bx - 1, by - 1, w + 2, 5);
    const col = pct > 0.5 ? 0x44cc44 : pct > 0.25 ? 0xcccc44 : 0xcc4444;
    this.hpBar.fillStyle(col, 1);
    this.hpBar.fillRect(bx, by, w * pct, 3);
  }

  takeDamage(amount, type) {
    if (!this.alive) return;
    if (this.magicOnly && type !== 'magic') return;

    let dmg = amount;
    if (type === 'physical') dmg = Math.max(1, amount - this.armor);

    // POLISH ADD - Critical hit bonus damage (from upgrades)
    const critChance = this.scene.bonuses ? this.scene.bonuses.critChance : 0;
    let isCrit = false;
    if (critChance > 0 && Math.random() < critChance) {
      dmg = Math.round(dmg * 1.5);
      isCrit = true;
    }

    this.hp -= dmg;

    // POLISH ADD - Enhanced floating damage with crit indicator
    if (isCrit) {
      floatingText(this.scene, this.x + (Math.random() - 0.5) * 10, this.y - 14,
        'CRIT -' + dmg, '#ff4444', 14);
      // POLISH ADD - Screen micro-shake on crit
      this.scene.cameras.main.shake(60, 0.002);
    } else {
      floatingText(this.scene, this.x + (Math.random() - 0.5) * 10, this.y - 10,
        '-' + dmg, type === 'magic' ? '#bb88ff' : '#ffcc44', 11);
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
      return;
    }
    this._drawHpBar();

    /* damage flash */
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(50, () => {
      if (this.alive && this.scene) {
        this.clearTint();
        if (!this.scene.textures.exists('enemy_' + this.def.id)) {
          this.setTint(this.def.color);
        }
      }
    });

    // POLISH ADD - Enhanced squash on damage (more dramatic)
    if (!this._squashing) {
      this._squashing = true;
      const baseScale = this.def.scale || 1;
      this.scene.tweens.add({
        targets: this,
        scaleX: baseScale * 0.8,
        scaleY: baseScale * 1.2,
        duration: 60,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this._squashing = false;
          if (this.alive) this.setScale(baseScale);
        }
      });
    }
  }

  applySlow(factor, duration) {
    this.slowFactor = Math.min(this.slowFactor, factor);
    this.slowTimer = Math.max(this.slowTimer, duration);
    /* visual slow indicator */
    if (!this._slowTint) {
      this._slowTint = true;
      this.setTint(0x88ccff);
    }
  }

  die() {
    this.alive = false;
    this.scene.onEnemyKilled(this);
    SFX.enemyDeath();

    // POLISH ADD - Enhanced death burst with debris + mana seeds (called from game.js onEnemyKilled)

    /* death burst particles */
    if (this.scene.deathEmitter) {
      const count = this.boss ? 25 : 10; // POLISH ADD - More particles
      this.scene.deathEmitter.setParticleTint(this.def.color);
      this.scene.deathEmitter.explode(count, this.x, this.y);
    }

    /* mana sparkle particles */
    if (this.scene.manaEmitter) {
      this.scene.manaEmitter.explode(this.boss ? 8 : 3, this.x, this.y); // POLISH ADD - More for boss
    }

    /* mana pickup text */
    floatingText(this.scene, this.x, this.y - 5, '+' + this.reward + 'm', '#44aaff', 12);

    // POLISH ADD - Enhanced death pop animation (squash then explode)
    const baseScale = this.def.scale || 1;
    const deathSprite = this.scene.add.circle(this.x, this.y, 10 * baseScale, this.def.color, 0.7).setDepth(10);
    this.scene.tweens.add({
      targets: deathSprite,
      scaleX: 0.3,
      scaleY: 2,
      duration: 80,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.scene.tweens.add({
          targets: deathSprite,
          scale: 3,
          alpha: 0,
          duration: 250,
          ease: 'Power2',
          onComplete: () => deathSprite.destroy(),
        });
      },
    });

    // POLISH ADD - Bloom glow flash on death position
    const deathGlow = this.scene.add.image(this.x, this.y, 'bloomGlow')
      .setTint(this.def.color).setScale(1).setAlpha(0.4).setDepth(9)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({
      targets: deathGlow,
      scale: 2.5,
      alpha: 0,
      duration: 350,
      ease: 'Power2',
      onComplete: () => deathGlow.destroy(),
    });

    this.hpBar.destroy();
    if (this.shadow) this.shadow.destroy();
    this.destroy();
  }

  reachEnd() {
    this.alive = false;
    this.scene.onEnemyReachEnd(this);
    SFX.treeDamage();

    /* red flash on tree */
    if (this.scene.treeSprite) {
      this.scene.treeSprite.setTintFill(0xff4444);
      this.scene.time.delayedCall(150, () => {
        if (this.scene.treeSprite) this.scene.treeSprite.clearTint();
      });
    }

    // POLISH ADD - Tree damage glow flash
    if (this.scene.treeGlow) {
      this.scene.treeGlow.setTint(0xff4444);
      this.scene.time.delayedCall(300, () => {
        if (this.scene.treeGlow) this.scene.treeGlow.setTint(0x44ff44);
      });
    }

    this.hpBar.destroy();
    if (this.shadow) this.shadow.destroy();
    this.destroy();
  }

  update(dt) {
    if (!this.alive) return;

    /* slow decay */
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) {
        this.slowFactor = 1;
        this._slowTint = false;
        this.clearTint();
        if (!this.scene.textures.exists('enemy_' + this.def.id)) {
          this.setTint(this.def.color);
        }
      }
    }

    /* move along path */
    const spd = this.speed * this.slowFactor * (dt / 16);

    if (this.pathIndex >= this.path.length - 1) {
      this.reachEnd();
      return;
    }

    const a = this.path[this.pathIndex];
    const b = this.path[this.pathIndex + 1];
    const segLen = dist(a, b);
    const travel = spd * 1.5;

    this.pathT += travel / Math.max(segLen, 1);

    while (this.pathT >= 1) {
      this.pathT -= 1;
      this.pathIndex++;
      if (this.pathIndex >= this.path.length - 1) {
        this.reachEnd();
        return;
      }
    }

    const p1 = this.path[this.pathIndex];
    const p2 = this.path[Math.min(this.pathIndex + 1, this.path.length - 1)];
    const pos = lerpPos(p1, p2, this.pathT);

    /* wobble for organic movement */
    this._wobble += dt * 0.008;
    const wobbleX = this.flying ? Math.sin(this._wobble * 3) * 3 : Math.sin(this._wobble * 2) * 1;
    const wobbleY = this.flying ? Math.cos(this._wobble * 2.5) * 4 : 0;

    this.setPosition(pos.x + wobbleX, pos.y + wobbleY);
    this._drawHpBar();

    /* shadow follow */
    if (this.shadow) {
      this.shadow.setPosition(pos.x + wobbleX, pos.y + 10);
    }

    /* rotation toward next point */
    this.rotation = Phaser.Math.Angle.Between(p1.x, p1.y, p2.x, p2.y);
  }
}

/* ── Subclasses ── */

class Wisp extends Enemy {
  constructor(scene, path, waveScale) {
    super(scene, path, VS.ENEMY_DEFS.wisp, waveScale);
  }
}

class Crawler extends Enemy {
  constructor(scene, path, waveScale) {
    super(scene, path, VS.ENEMY_DEFS.crawler, waveScale);
  }
}

class Thornbeast extends Enemy {
  constructor(scene, path, waveScale) {
    super(scene, path, VS.ENEMY_DEFS.thornbeast, waveScale);
    this.hasSplit = false;
  }

  die() {
    if (!this.hasSplit) {
      this.hasSplit = true;
      // POLISH ADD - Shockwave on thornbeast split
      if (this.scene._spawnShockwave) {
        this.scene._spawnShockwave(this.x, this.y, 0x556b2f, 1.5, 300);
      }
      for (let i = 0; i < 2; i++) {
        const remainPath = this.path.slice(this.pathIndex);
        if (remainPath.length < 2) continue;
        const s = new Swarmer(this.scene, remainPath, 1);
        s.setPosition(this.x + (i - 0.5) * 16, this.y);
        s.pathT = this.pathT;
        this.scene.enemies.push(s);
      }
      floatingText(this.scene, this.x, this.y - 20, 'SPLIT!', '#aacc44', 13);
    }
    super.die();
  }
}

class Specter extends Enemy {
  constructor(scene, path, waveScale) {
    super(scene, path, VS.ENEMY_DEFS.specter, waveScale);
    this.setAlpha(0.55);
  }

  update(dt) {
    super.update(dt);
    if (this.alive) {
      /* phase flicker */
      this.setAlpha(0.45 + Math.sin(Date.now() * 0.005) * 0.15);
    }
  }
}

class Swarmer extends Enemy {
  constructor(scene, path, waveScale) {
    super(scene, path, VS.ENEMY_DEFS.swarmer, waveScale);
  }
}

class BlightLord extends Enemy {
  constructor(scene, path, waveScale) {
    super(scene, path, VS.ENEMY_DEFS.blightlord, waveScale);
    this.spawnTimer = 0;
    this.spawnInterval = 5000;
    this.spawned = 0;
    this.maxSpawns = 8;
  }

  die() {
    SFX.bossDeath();
    /* screen shake on boss death */
    if (this.scene.cameras && this.scene.cameras.main) {
      // POLISH ADD - Enhanced boss death shake
      this.scene.cameras.main.shake(500, 0.02);
    }
    /* brief slow-mo effect */
    this.scene._triggerSlowMo(600);
    floatingText(this.scene, this.x, this.y - 30, 'BOSS SLAIN!', '#ff4444', 20);

    // POLISH ADD - Massive shockwave on boss death
    if (this.scene._spawnShockwave) {
      this.scene._spawnShockwave(this.x, this.y, 0xff2222, 5, 800);
      this.scene.time.delayedCall(150, () => {
        this.scene._spawnShockwave(this.x, this.y, 0xffaa00, 3.5, 600);
      });
    }

    // POLISH ADD - Boss death confetti
    if (this.scene.confettiExplode) {
      this.scene.confettiExplode(this.x, this.y, 50);
    }

    // POLISH ADD - Camera zoom punch on boss kill
    this.scene.cameras.main.zoomTo(1.12, 200);
    this.scene.time.delayedCall(400, () => {
      if (!this.scene.gameOver) this.scene.cameras.main.zoomTo(1, 800);
    });

    super.die();
  }

  update(dt) {
    super.update(dt);
    if (!this.alive) return;

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval && this.spawned < this.maxSpawns) {
      this.spawnTimer = 0;
      this.spawned++;
      const remainPath = this.path.slice(this.pathIndex);
      if (remainPath.length >= 2) {
        const s = new Swarmer(this.scene, remainPath, 1);
        s.setPosition(this.x + (Math.random() - 0.5) * 20, this.y + (Math.random() - 0.5) * 20);
        s.pathT = this.pathT;
        this.scene.enemies.push(s);
        floatingText(this.scene, this.x, this.y - 20, 'SPAWN', '#cc4444', 10);
        // POLISH ADD - Mini shockwave on boss swarmer spawn
        if (this.scene._spawnShockwave) {
          this.scene._spawnShockwave(this.x, this.y, 0xcc4444, 1, 250);
        }
      }
    }
  }
}

const ENEMY_CLASSES = {
  wisp: Wisp,
  crawler: Crawler,
  thornbeast: Thornbeast,
  specter: Specter,
  swarmer: Swarmer,
  blightlord: BlightLord,
};
