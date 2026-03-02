/* ═══════════════════════════════════════════════════════
   Aether Descent — Preload Scene
   ═══════════════════════════════════════════════════════ */
class PreloadScene extends Phaser.Scene {
  constructor() { super('Preload'); }

  create() {
    AD.Assets.generate(this);

    const cx = AD.GAME_WIDTH / 2;
    const cy = AD.GAME_HEIGHT / 2;

    this.add.text(cx, cy - 20, 'AETHER DESCENT', {
      fontSize: '28px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5);

    this.add.text(cx, cy + 20, 'Initializing systems...', {
      fontSize: '14px', fontFamily: 'monospace', color: AD.CSS.purple,
    }).setOrigin(0.5);

    this.time.delayedCall(800, () => this.scene.start('MainMenu'));
  }
}
