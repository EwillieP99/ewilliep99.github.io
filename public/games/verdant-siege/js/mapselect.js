/* ── Verdant Siege – mapselect.js ── */

class MapSelectScene extends Phaser.Scene {
  constructor() { super('MapSelectScene'); }

  create() {
    this.cameras.main.setBackgroundColor(0x060e08);
    this.cameras.main.fadeIn(200, 0, 0, 0);
    const save = SaveManager.load();
    const maps = this.registry.get('maps');

    this.add.text(640, 36, 'SELECT MAP', {
      fontSize: '26px', fill: '#5aaf6a', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    const cols = 4;
    const startX = 200, startY = 115, gapX = 225, gapY = 140;

    maps.forEach((m, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * gapX, y = startY + row * gapY;
      const unlocked = save.unlockedMaps.includes(i);
      const highScore = save.highScores['map_' + i] || 0;
      const stars = save.stars['map_' + i] || 0;

      const bgColor = unlocked ? 0x0c1a10 : 0x080c08;
      const borderColor = unlocked ? 0x2d4a33 : 0x141a14;

      const bg = this.add.rectangle(x, y, 200, 115, bgColor, 0.9)
        .setStrokeStyle(2, borderColor);

      /* entrance animation */
      bg.setAlpha(0).setScale(0.9);
      this.tweens.add({
        targets: bg, alpha: 1, scaleX: 1, scaleY: 1,
        delay: i * 40, duration: 250, ease: 'Back.easeOut',
      });

      /* mini path preview */
      if (unlocked) {
        const preview = this.add.graphics().setDepth(1);
        preview.lineStyle(2, 0x3a5a3a, 0.3);
        preview.beginPath();
        const scale = 0.12;
        const ox = x - 90, oy = y - 35;
        const path = m.path;
        preview.moveTo(ox + (path[0].x - VS.SIDEBAR_W) * scale, oy + path[0].y * scale);
        for (let p = 1; p < path.length; p++) {
          preview.lineTo(ox + (path[p].x - VS.SIDEBAR_W) * scale, oy + path[p].y * scale);
        }
        preview.strokePath();
        preview.setAlpha(0);
        this.tweens.add({ targets: preview, alpha: 1, delay: i * 40 + 100, duration: 300 });
      }

      /* map label */
      const numText = this.add.text(x, y - 38, `Map ${i + 1}`, {
        fontSize: '13px', fill: unlocked ? '#5aaf6a' : '#1a2a1e', fontFamily: 'monospace', fontStyle: 'bold'
      }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: numText, alpha: 1, delay: i * 40 + 50, duration: 200 });

      this.add.text(x, y - 20, m.name, {
        fontSize: '11px', fill: unlocked ? '#668866' : '#141a14', fontFamily: 'monospace'
      }).setOrigin(0.5);

      /* difficulty */
      const tierNames = ['Easy', 'Medium', 'Hard', 'Extreme'];
      const tierColors = ['#44aa44', '#aaaa44', '#cc6644', '#cc3333'];
      this.add.text(x, y + 0, tierNames[m.tier] || 'Hard', {
        fontSize: '10px', fill: unlocked ? tierColors[m.tier] : '#141a14', fontFamily: 'monospace'
      }).setOrigin(0.5);

      if (unlocked) {
        /* stars */
        if (stars > 0) {
          const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
          this.add.text(x, y + 18, starStr, {
            fontSize: '14px', fill: '#ffd700', fontFamily: 'monospace'
          }).setOrigin(0.5);
        }

        /* high score */
        if (highScore > 0) {
          this.add.text(x, y + 36, `Best: ${highScore}`, {
            fontSize: '10px', fill: '#556b55', fontFamily: 'monospace'
          }).setOrigin(0.5);
        }

        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => {
          bg.setStrokeStyle(2, 0x44cc55);
          bg.setFillStyle(0x142a18);
        });
        bg.on('pointerout', () => {
          bg.setStrokeStyle(2, borderColor);
          bg.setFillStyle(bgColor);
        });
        bg.on('pointerdown', () => {
          SFX.click();
          this.cameras.main.fade(150, 0, 0, 0, false, (cam, progress) => {
            if (progress >= 1) this.scene.start('GameScene', { mapIndex: i });
          });
        });
      } else {
        this.add.text(x, y + 22, 'LOCKED', {
          fontSize: '12px', fill: '#1a2a1e', fontFamily: 'monospace'
        }).setOrigin(0.5);
      }
    });

    /* back */
    const back = this.add.text(640, 675, '[ BACK ]', {
      fontSize: '18px', fill: '#5aaf6a', fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setColor('#88ff88'));
    back.on('pointerout', () => back.setColor('#5aaf6a'));
    back.on('pointerdown', () => {
      SFX.click();
      this.scene.start('MainMenuScene');
    });
  }
}
