/* ═══════════════════════════════════════════════════════
   Aether Descent — Upgrade Definitions
   ═══════════════════════════════════════════════════════ */
AD.Upgrades = {
  fuel: {
    name: 'Fuel Tanks',
    desc: 'Increase starting fuel capacity',
    icon: '⛽',
    effect(level) { return AD.PHYSICS.startFuel + level * 15; },
    label(level) { return 'Fuel: ' + this.effect(level); },
  },
  thrust: {
    name: 'Thrust Efficiency',
    desc: 'Reduce fuel burn rate while thrusting',
    icon: '🔥',
    effect(level) { return AD.PHYSICS.fuelBurnRate * (1 - level * 0.12); },
    label(level) { return 'Burn rate: ' + this.effect(level).toFixed(2) + '/f'; },
  },
  armor: {
    name: 'Hull Armor',
    desc: 'Increase max safe landing speed',
    icon: '🛡',
    effect(level) { return AD.PHYSICS.maxLandSpeed + level * 0.3; },
    label(level) { return 'Max speed: ' + this.effect(level).toFixed(1); },
  },
  scanner: {
    name: 'Shard Scanner',
    desc: 'Increase shard collection radius',
    icon: '📡',
    effect(level) { return 30 + level * 10; },
    label(level) { return 'Radius: ' + this.effect(level) + 'px'; },
  },
  brake: {
    name: 'Retro Brakes',
    desc: 'Increase thrust power for finer control',
    icon: '⚡',
    effect(level) { return AD.PHYSICS.thrustPower * (1 + level * 0.15); },
    label(level) { return 'Thrust: ' + this.effect(level).toFixed(4); },
  },
};

AD.getUpgradeCost = function(level) {
  if (level >= AD.MAX_UPGRADE_LEVEL) return Infinity;
  return AD.UPGRADE_COSTS[level];
};
