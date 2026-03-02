/* ═══════════════════════════════════════════════════════
   Aether Descent — Boot Scene
   ═══════════════════════════════════════════════════════ */
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    AD.Audio.init();
    this.scene.start('Preload');
  }
}
