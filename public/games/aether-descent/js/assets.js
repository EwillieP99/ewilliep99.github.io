/* ═══════════════════════════════════════════════════════
   Aether Descent — Programmatic Asset Generation
   ═══════════════════════════════════════════════════════ */
AD.Assets = {
  generate(scene) {
    this.makeProbe(scene);
    this.makeFlame(scene);
    this.makeShard(scene);
    this.makePad(scene);
    this.makeExplosionParticle(scene);
    this.makeStar(scene);
    this.makeAsteroid(scene);
  },

  makeProbe(scene) {
    const g = scene.make.graphics({ add: false });
    // Probe body — sleek triangle
    g.fillStyle(0xd1d5db);
    g.beginPath();
    g.moveTo(16, 0);
    g.lineTo(28, 30);
    g.lineTo(4, 30);
    g.closePath();
    g.fillPath();
    // Cockpit glow
    g.fillStyle(AD.COLORS.cyan);
    g.fillCircle(16, 12, 4);
    // Wings
    g.fillStyle(0x9ca3af);
    g.fillTriangle(4, 30, 0, 32, 10, 24);
    g.fillTriangle(28, 30, 32, 32, 22, 24);
    g.generateTexture('probe', 32, 34);
    g.destroy();
  },

  makeFlame(scene) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xff6b00);
    g.fillTriangle(8, 0, 14, 16, 2, 16);
    g.fillStyle(0xffdd00);
    g.fillTriangle(8, 2, 12, 12, 4, 12);
    g.generateTexture('flame', 16, 16);
    g.destroy();
  },

  makeShard(scene) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(AD.COLORS.cyan);
    g.beginPath();
    g.moveTo(8, 0);
    g.lineTo(16, 8);
    g.lineTo(8, 16);
    g.lineTo(0, 8);
    g.closePath();
    g.fillPath();
    g.fillStyle(0xffffff);
    g.fillCircle(8, 8, 2);
    g.generateTexture('shard', 16, 16);
    g.destroy();
  },

  makePad(scene) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(AD.COLORS.green);
    g.fillRect(0, 0, 64, 8);
    g.fillStyle(0xffffff);
    g.fillRect(2, 2, 8, 4);
    g.fillRect(54, 2, 8, 4);
    g.generateTexture('pad', 64, 8);
    g.destroy();
  },

  makeExplosionParticle(scene) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xffffff);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8);
    g.destroy();
  },

  makeStar(scene) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xffffff);
    g.fillCircle(1, 1, 1);
    g.generateTexture('star', 3, 3);
    g.destroy();
  },

  makeAsteroid(scene) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0x78716c);
    g.beginPath();
    g.moveTo(10, 0);
    g.lineTo(18, 3);
    g.lineTo(20, 10);
    g.lineTo(17, 18);
    g.lineTo(8, 20);
    g.lineTo(2, 15);
    g.lineTo(0, 8);
    g.lineTo(3, 2);
    g.closePath();
    g.fillPath();
    g.fillStyle(0x57534e);
    g.fillCircle(10, 8, 3);
    g.fillCircle(6, 14, 2);
    g.generateTexture('asteroid', 20, 20);
    g.destroy();
  },
};
