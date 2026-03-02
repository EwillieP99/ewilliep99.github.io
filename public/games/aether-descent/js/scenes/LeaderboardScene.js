/* ═══════════════════════════════════════════════════════
   Aether Descent — Leaderboard Scene
   ═══════════════════════════════════════════════════════ */
class LeaderboardScene extends Phaser.Scene {
  constructor() { super('Leaderboard'); }

  create() {
    this.cameras.main.setBackgroundColor(AD.COLORS.navy);
    const cx = AD.GAME_WIDTH / 2;

    this.add.text(cx, 30, 'LEADERBOARD', {
      fontSize: '28px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5);

    // Planet tabs
    this.selectedPlanet = 0;
    this.tabTexts = [];
    this.scoreTexts = [];

    const tabY = 65;
    const tabLabels = AD.Planets.map((p, i) => (i + 1).toString());
    tabLabels.push('∞');

    const tabStartX = cx - (tabLabels.length * 28) / 2;
    tabLabels.forEach((label, i) => {
      const tx = tabStartX + i * 28 + 14;
      const txt = this.add.text(tx, tabY, label, {
        fontSize: '14px', fontFamily: 'monospace',
        color: i === 0 ? AD.CSS.cyan : '#475569',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      txt.on('pointerdown', () => {
        AD.Audio.menuClick();
        this.selectedPlanet = i;
        this._refreshTabs();
        this._refreshScores();
      });
      this.tabTexts.push(txt);
    });

    // Scores area
    for (let i = 0; i < 10; i++) {
      const y = 100 + i * 28;
      const rank = this.add.text(cx - 120, y, '', {
        fontSize: '14px', fontFamily: 'monospace', color: '#475569',
      });
      const score = this.add.text(cx + 120, y, '', {
        fontSize: '14px', fontFamily: 'monospace', color: AD.CSS.white,
      }).setOrigin(1, 0);
      this.scoreTexts.push({ rank, score });
    }

    this._refreshScores();

    // Endless high
    this.add.text(cx, AD.GAME_HEIGHT - 70, 'Endless Best: ' + AD.Storage.getEndlessHigh(), {
      fontSize: '14px', fontFamily: 'monospace', color: AD.CSS.purple,
    }).setOrigin(0.5);

    // Back
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

  _refreshTabs() {
    this.tabTexts.forEach((txt, i) => {
      txt.setColor(i === this.selectedPlanet ? AD.CSS.cyan : '#475569');
    });
  }

  _refreshScores() {
    const isEndless = this.selectedPlanet >= AD.Planets.length;
    const scores = isEndless ? [] : AD.Storage.getHighScores(this.selectedPlanet);

    this.scoreTexts.forEach((pair, i) => {
      if (i < scores.length) {
        pair.rank.setText('#' + (i + 1));
        pair.score.setText(String(scores[i]));
        pair.rank.setColor(i === 0 ? AD.CSS.yellow : '#94a3b8');
        pair.score.setColor(i === 0 ? AD.CSS.yellow : AD.CSS.white);
      } else {
        pair.rank.setText('#' + (i + 1));
        pair.score.setText('---');
        pair.rank.setColor('#334155');
        pair.score.setColor('#334155');
      }
    });
  }
}
