/* ── Verdant Siege – mainmenu.js ── */

class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }

  create() {
    SFX.resume();
    this.cameras.main.setBackgroundColor(0x060e08);

    /* ambient floating particles */
    this._parts = [];
    for (let i = 0; i < 40; i++) {
      const c = Phaser.Math.Between(0, 1) ? 0x2d7a3a : 0x1a5a22;
      const p = this.add.circle(
        Phaser.Math.Between(0, 1280),
        Phaser.Math.Between(0, 720),
        Phaser.Math.Between(1, 3),
        c, Phaser.Math.FloatBetween(0.1, 0.3)
      );
      this._parts.push({
        obj: p,
        vx: Phaser.Math.FloatBetween(-0.3, 0.3),
        vy: Phaser.Math.FloatBetween(-0.6, -0.15)
      });
    }

    /* vignette overlay */
    const vig = this.add.graphics().setDepth(20);
    vig.fillStyle(0x000000, 0.4);
    vig.fillRect(0, 0, 1280, 80);
    vig.fillRect(0, 640, 1280, 80);

    /* title with glow effect */
    const titleShadow = this.add.text(642, 142, 'VERDANT SIEGE', {
      fontSize: '52px', fill: '#0a2a0f', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    const title = this.add.text(640, 140, 'VERDANT SIEGE', {
      fontSize: '52px', fill: '#2d7a3a', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    /* title pulse */
    this.tweens.add({
      targets: title,
      alpha: { from: 0.85, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add.text(640, 200, 'Wave Tower Defense', {
      fontSize: '16px', fill: '#3a6a40', fontFamily: 'monospace'
    }).setOrigin(0.5);

    /* tree visual (animated sway) */
    const tree = this.add.image(640, 300, 'tree').setScale(2.5).setAlpha(0.5);
    this.tweens.add({
      targets: tree,
      angle: { from: -1.5, to: 1.5 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    /* tree glow */
    const glow = this.add.image(640, 300, 'glow').setScale(5).setAlpha(0.08).setTint(0x44ff44);
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.05, to: 0.12 },
      scale: { from: 4.5, to: 5.5 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    /* menu buttons */
    const btns = [
      { label: 'PLAY', scene: 'MapSelectScene' },
      { label: 'UPGRADES', scene: 'UpgradeTreeScene' },
      { label: 'LEADERBOARD', scene: 'LeaderboardScene' },
    ];

    btns.forEach((b, i) => {
      const y = 410 + i * 52;
      const bg = this.add.rectangle(640, y, 220, 38, 0x0c1a10, 0.9)
        .setStrokeStyle(1, 0x2d4a33)
        .setInteractive({ useHandCursor: true });
      const txt = this.add.text(640, y, b.label, {
        fontSize: '18px', fill: '#5aaf6a', fontFamily: 'monospace', fontStyle: 'bold'
      }).setOrigin(0.5);

      /* entrance animation */
      bg.setAlpha(0).setScale(0.8);
      txt.setAlpha(0);
      this.tweens.add({
        targets: [bg, txt],
        alpha: 1,
        delay: 200 + i * 100,
        duration: 300,
        ease: 'Power2',
      });
      this.tweens.add({
        targets: bg,
        scaleX: 1, scaleY: 1,
        delay: 200 + i * 100,
        duration: 300,
        ease: 'Back.easeOut',
      });

      bg.on('pointerover', () => {
        bg.setFillStyle(0x142a18);
        bg.setStrokeStyle(2, 0x44cc55);
        txt.setColor('#88ff88');
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(0x0c1a10);
        bg.setStrokeStyle(1, 0x2d4a33);
        txt.setColor('#5aaf6a');
      });
      bg.on('pointerdown', () => {
        SFX.click();
        this.cameras.main.fade(200, 0, 0, 0, false, (cam, progress) => {
          if (progress >= 1) this.scene.start(b.scene);
        });
      });
    });

    /* essence */
    const save = SaveManager.load();
    this.add.text(640, 590, `Verdant Essence: ${save.totalEssence}`, {
      fontSize: '13px', fill: '#ffd700', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(640, 690, 'v2.0 — Defend the Ancient Tree', {
      fontSize: '10px', fill: '#1a2a1e', fontFamily: 'monospace'
    }).setOrigin(0.5);

    /* fade in */
    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  update() {
    for (const p of this._parts) {
      p.obj.x += p.vx;
      p.obj.y += p.vy;
      if (p.obj.y < -10) { p.obj.y = 730; p.obj.x = Phaser.Math.Between(0, 1280); }
      if (p.obj.x < -10) p.obj.x = 1290;
      if (p.obj.x > 1290) p.obj.x = -10;
    }
  }
}
