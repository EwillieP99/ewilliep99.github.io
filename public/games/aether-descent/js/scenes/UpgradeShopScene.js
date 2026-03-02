/* ═══════════════════════════════════════════════════════
   Aether Descent — Upgrade Shop Scene
   ═══════════════════════════════════════════════════════ */
class UpgradeShopScene extends Phaser.Scene {
  constructor() { super('UpgradeShop'); }

  create() {
    this.cameras.main.setBackgroundColor(AD.COLORS.navy);
    const cx = AD.GAME_WIDTH / 2;

    this.add.text(cx, 30, 'UPGRADE SHOP', {
      fontSize: '28px', fontFamily: 'monospace', color: AD.CSS.cyan,
    }).setOrigin(0.5);

    this.shardsText = this.add.text(cx, 60, '', {
      fontSize: '16px', fontFamily: 'monospace', color: AD.CSS.yellow,
    }).setOrigin(0.5);

    this.cards = [];
    const keys = Object.keys(AD.Upgrades);
    const startY = 110;
    const gap = 90;

    keys.forEach((key, i) => {
      const upg = AD.Upgrades[key];
      const y = startY + i * gap;
      this._createCard(key, upg, cx, y);
    });

    this._refresh();

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

  _createCard(key, upg, cx, y) {
    const card = { key };

    // Background
    this.add.rectangle(cx, y + 15, 600, 75, 0x1e293b).setStrokeStyle(1, 0x334155);

    // Name + desc
    this.add.text(cx - 270, y - 8, upg.icon + ' ' + upg.name, {
      fontSize: '16px', fontFamily: 'monospace', color: AD.CSS.white,
    });
    this.add.text(cx - 270, y + 12, upg.desc, {
      fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8',
    });

    // Level pips
    card.pips = [];
    for (let l = 0; l < AD.MAX_UPGRADE_LEVEL; l++) {
      const pip = this.add.rectangle(cx + 80 + l * 20, y + 5, 14, 14, 0x334155)
        .setStrokeStyle(1, 0x475569);
      card.pips.push(pip);
    }

    // Effect label
    card.effectText = this.add.text(cx - 270, y + 30, '', {
      fontSize: '11px', fontFamily: 'monospace', color: AD.CSS.green,
    });

    // Buy button
    card.buyText = this.add.text(cx + 230, y + 5, '', {
      fontSize: '14px', fontFamily: 'monospace', color: AD.CSS.cyan,
      backgroundColor: '#1e293b', padding: { x: 10, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    card.buyText.on('pointerdown', () => this._buy(key));
    card.buyText.on('pointerover', () => card.buyText.setColor(AD.CSS.white));
    card.buyText.on('pointerout', () => card.buyText.setColor(AD.CSS.cyan));

    this.cards.push(card);
  }

  _buy(key) {
    const upgrades = AD.Storage.getUpgrades();
    const level = upgrades[key] || 0;
    const cost = AD.getUpgradeCost(level);
    const shards = AD.Storage.getShards();
    if (level >= AD.MAX_UPGRADE_LEVEL || shards < cost) return;

    AD.Storage.setShards(shards - cost);
    upgrades[key] = level + 1;
    AD.Storage.setUpgrades(upgrades);
    AD.Audio.upgrade();
    this._refresh();
  }

  _refresh() {
    const shards = AD.Storage.getShards();
    const upgrades = AD.Storage.getUpgrades();
    this.shardsText.setText('◆ ' + shards + ' shards');

    this.cards.forEach(card => {
      const upg = AD.Upgrades[card.key];
      const level = upgrades[card.key] || 0;

      // Update pips
      card.pips.forEach((pip, i) => {
        pip.setFillStyle(i < level ? AD.COLORS.cyan : 0x334155);
      });

      // Effect text
      card.effectText.setText(upg.label(level));

      // Buy button
      if (level >= AD.MAX_UPGRADE_LEVEL) {
        card.buyText.setText('MAXED');
        card.buyText.setColor('#475569');
        card.buyText.disableInteractive();
      } else {
        const cost = AD.getUpgradeCost(level);
        card.buyText.setText('◆ ' + cost);
        card.buyText.setColor(shards >= cost ? AD.CSS.cyan : '#ef4444');
      }
    });
  }
}
