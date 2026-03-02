/* ═══════════════════════════════════════════════════════
   Aether Descent — Game Over Scene
   ═══════════════════════════════════════════════════════ */
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) {
    this.result = data;
  }

  create() {
    this.cameras.main.setBackgroundColor(AD.COLORS.navy);
    const cx = AD.GAME_WIDTH / 2;
    const d = this.result;
    const success = d.landed;

    // Title
    this.add.text(cx, 50, success ? 'LANDING SUCCESSFUL' : 'MISSION FAILED', {
      fontSize: '32px', fontFamily: 'monospace',
      color: success ? AD.CSS.green : AD.CSS.red,
    }).setOrigin(0.5);

    if (success && d.perfect) {
      this.add.text(cx, 85, '★ PERFECT LANDING ★', {
        fontSize: '18px', fontFamily: 'monospace', color: AD.CSS.yellow,
      }).setOrigin(0.5);
    }

    // Planet name
    this.add.text(cx, 120, d.planetName || '', {
      fontSize: '16px', fontFamily: 'monospace', color: AD.CSS.purple,
    }).setOrigin(0.5);

    // Score breakdown
    let y = 170;
    const line = (label, value, color) => {
      this.add.text(cx - 140, y, label, {
        fontSize: '15px', fontFamily: 'monospace', color: '#94a3b8',
      });
      this.add.text(cx + 140, y, String(value), {
        fontSize: '15px', fontFamily: 'monospace', color: color || AD.CSS.white,
      }).setOrigin(1, 0);
      y += 28;
    };

    if (success) {
      line('Shards collected', d.shards + ' × 100 = ' + (d.shards * 100), AD.CSS.cyan);
      line('Fuel remaining', d.fuelLeft.toFixed(0) + ' × 10 = ' + Math.floor(d.fuelLeft * 10), AD.CSS.orange);
      line('Landing bonus', d.landingMultiplier + 'x', AD.CSS.green);
      line('Time bonus', d.timeBonus, AD.CSS.yellow);
      line('─────────────', '─────────', '#475569');
      line('TOTAL SCORE', d.totalScore, AD.CSS.cyan);

      // Save score
      if (d.planetIndex >= 0) {
        AD.Storage.addHighScore(d.planetIndex, d.totalScore);
      }
      // Add shards to bank
      AD.Storage.addShards(d.shards);

      // Unlock next planet
      if (d.planetIndex >= 0 && d.planetIndex < 11) {
        AD.Storage.unlockPlanet(d.planetIndex + 1);
      }
      // Unlock endless after planet 5
      if (d.planetIndex >= 4) {
        AD.Storage.setEndlessUnlocked();
      }
    } else {
      line('Shards lost', d.shards, AD.CSS.red);
      line('Cause', d.crashReason || 'Impact', AD.CSS.red);
    }

    // Buttons
    y += 20;
    this._btn(cx, y, 'RETRY', () => {
      AD.Audio.menuClick();
      this.scene.start('Game', {
        planetIndex: d.planetIndex,
        endless: d.endless,
        depth: d.depth || 0,
      });
    });

    if (success && d.planetIndex >= 0 && d.planetIndex < 11) {
      this._btn(cx, y + 45, 'NEXT PLANET →', () => {
        AD.Audio.menuClick();
        this.scene.start('Game', { planetIndex: d.planetIndex + 1, endless: false });
      });
    }

    if (success && d.endless) {
      this._btn(cx, y + 45, 'CONTINUE DESCENT →', () => {
        AD.Audio.menuClick();
        this.scene.start('Game', {
          planetIndex: -1, endless: true, depth: (d.depth || 0) + 1,
          carryShards: d.shards,
        });
      });
    }

    this._btn(cx, y + (success ? 90 : 45), 'MAIN MENU', () => {
      AD.Audio.menuClick();
      this.scene.start('MainMenu');
    });
  }

  _btn(x, y, label, cb) {
    const txt = this.add.text(x, y, label, {
      fontSize: '18px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    txt.on('pointerover', () => { txt.setColor(AD.CSS.white); AD.Audio.menuHover(); });
    txt.on('pointerout', () => txt.setColor(AD.CSS.cyan));
    txt.on('pointerdown', cb);
  }
}
