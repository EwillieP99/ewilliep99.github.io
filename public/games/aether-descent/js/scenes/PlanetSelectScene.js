/* ═══════════════════════════════════════════════════════
   Aether Descent — Planet Select Scene
   ═══════════════════════════════════════════════════════ */
class PlanetSelectScene extends Phaser.Scene {
  constructor() { super('PlanetSelect'); }

  create() {
    const unlocked = AD.Storage.getUnlocked();

    // Background
    this.cameras.main.setBackgroundColor(AD.COLORS.navy);

    this.add.text(AD.GAME_WIDTH / 2, 30, 'SELECT PLANET', {
      fontSize: '28px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5);

    // Grid: 4 columns x 3 rows
    const cols = 4, startX = 100, startY = 80, gapX = 180, gapY = 155;

    AD.Planets.forEach((planet, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * gapX;
      const y = startY + row * gapY;
      const isUnlocked = unlocked.includes(i);

      // Card background
      const card = this.add.rectangle(x, y + 50, 155, 130, isUnlocked ? 0x1e293b : 0x111827)
        .setStrokeStyle(2, isUnlocked ? AD.COLORS.cyan : 0x334155);

      // Planet name
      this.add.text(x, y + 10, isUnlocked ? planet.name : '???', {
        fontSize: '14px', fontFamily: 'monospace',
        color: isUnlocked ? AD.CSS.cyan : '#475569',
      }).setOrigin(0.5);

      if (isUnlocked) {
        // Info
        this.add.text(x, y + 32, 'Grav: ' + planet.gravity.toFixed(1), {
          fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8',
        }).setOrigin(0.5);
        this.add.text(x, y + 48, 'Wind: ' + planet.wind.toFixed(1), {
          fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8',
        }).setOrigin(0.5);

        const best = AD.Storage.getHighScores(i);
        if (best.length > 0) {
          this.add.text(x, y + 64, 'Best: ' + best[0], {
            fontSize: '11px', fontFamily: 'monospace', color: AD.CSS.yellow,
          }).setOrigin(0.5);
        }

        // Hazard icons
        if (planet.hazards.length > 0) {
          this.add.text(x, y + 80, planet.hazards.join(' '), {
            fontSize: '10px', fontFamily: 'monospace', color: AD.CSS.orange,
          }).setOrigin(0.5);
        }

        card.setInteractive({ useHandCursor: true });
        card.on('pointerover', () => {
          card.setStrokeStyle(2, AD.COLORS.purple);
          AD.Audio.menuHover();
        });
        card.on('pointerout', () => card.setStrokeStyle(2, AD.COLORS.cyan));
        card.on('pointerdown', () => {
          AD.Audio.menuClick();
          this.scene.start('Game', { planetIndex: i, endless: false });
        });
      } else {
        // Lock icon
        this.add.text(x, y + 50, '🔒', {
          fontSize: '24px',
        }).setOrigin(0.5);
      }
    });

    // Back button
    const back = this.add.text(60, AD.GAME_HEIGHT - 30, '← BACK', {
      fontSize: '16px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setColor(AD.CSS.white));
    back.on('pointerout', () => back.setColor(AD.CSS.cyan));
    back.on('pointerdown', () => {
      AD.Audio.menuClick();
      this.scene.start('MainMenu');
    });
  }
}
