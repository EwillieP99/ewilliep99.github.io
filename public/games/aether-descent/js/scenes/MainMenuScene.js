/* ═══════════════════════════════════════════════════════
   Aether Descent — Main Menu Scene
   ═══════════════════════════════════════════════════════ */
class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenu'); }

  create() {
    AD.Audio.resume();
    const cx = AD.GAME_WIDTH / 2;

    // Starfield background
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, AD.GAME_WIDTH);
      const y = Phaser.Math.Between(0, AD.GAME_HEIGHT);
      const a = Phaser.Math.FloatBetween(0.2, 0.8);
      this.add.image(x, y, 'star').setAlpha(a).setScale(Phaser.Math.FloatBetween(0.5, 1.5));
    }

    // Title
    this.add.text(cx, 120, 'AETHER', {
      fontSize: '52px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5);
    this.add.text(cx, 170, 'DESCENT', {
      fontSize: '36px', fontFamily: 'monospace', color: AD.CSS.purple,
    }).setOrigin(0.5);
    this.add.text(cx, 210, 'Precision Lander', {
      fontSize: '14px', fontFamily: 'monospace', color: '#94a3b8',
    }).setOrigin(0.5);

    // Probe icon
    this.add.image(cx, 280, 'probe').setScale(2.5);

    // Buttons
    this._btn(cx, 360, 'START CAMPAIGN', () => {
      AD.Audio.menuClick();
      this.scene.start('PlanetSelect');
    });

    const endlessUnlocked = AD.Storage.getEndlessUnlocked();
    this._btn(cx, 410, endlessUnlocked ? 'ENDLESS MODE' : 'ENDLESS [LOCKED]', () => {
      if (!endlessUnlocked) return;
      AD.Audio.menuClick();
      this.scene.start('Game', { planetIndex: -1, endless: true, depth: 0 });
    }, !endlessUnlocked);

    this._btn(cx, 460, 'UPGRADES', () => {
      AD.Audio.menuClick();
      this.scene.start('UpgradeShop');
    });

    this._btn(cx, 510, 'LEADERBOARD', () => {
      AD.Audio.menuClick();
      this.scene.start('Leaderboard');
    });

    // Shards display
    this.add.text(cx, 560, '◆ ' + AD.Storage.getShards() + ' shards', {
      fontSize: '16px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5);
  }

  _btn(x, y, label, cb, locked) {
    const color = locked ? '#475569' : AD.CSS.cyan;
    const txt = this.add.text(x, y, label, {
      fontSize: '20px', fontFamily: 'monospace', color: color,
    }).setOrigin(0.5).setInteractive({ useHandCursor: !locked });

    if (!locked) {
      txt.on('pointerover', () => { txt.setColor(AD.CSS.white); AD.Audio.menuHover(); });
      txt.on('pointerout', () => txt.setColor(AD.CSS.cyan));
      txt.on('pointerdown', cb);
    }
    return txt;
  }
}
