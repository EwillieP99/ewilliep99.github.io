/* ═══════════════════════════════════════════════════════
   Aether Descent — localStorage Wrapper
   ═══════════════════════════════════════════════════════ */
AD.Storage = {
  _key(k) { return AD.KEYS.STORAGE_PREFIX + k; },

  get(k, fallback) {
    try { return localStorage.getItem(this._key(k)) ?? fallback; }
    catch { return fallback; }
  },
  set(k, v) {
    try { localStorage.setItem(this._key(k), v); } catch {}
  },
  getJSON(k, fallback) {
    try {
      const raw = localStorage.getItem(this._key(k));
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  setJSON(k, v) {
    try { localStorage.setItem(this._key(k), JSON.stringify(v)); } catch {}
  },
  remove(k) {
    try { localStorage.removeItem(this._key(k)); } catch {}
  },

  // Game state helpers
  getShards()       { return parseInt(this.get('shards', '0'), 10); },
  setShards(n)      { this.set('shards', String(n)); },
  addShards(n)      { this.setShards(this.getShards() + n); },

  getUnlocked()     { return this.getJSON('unlocked', [0]); },
  unlockPlanet(i)   {
    const arr = this.getUnlocked();
    if (!arr.includes(i)) { arr.push(i); this.setJSON('unlocked', arr); }
  },

  getUpgrades() {
    return this.getJSON('upgrades', { fuel: 0, thrust: 0, armor: 0, scanner: 0, brake: 0 });
  },
  setUpgrades(obj)  { this.setJSON('upgrades', obj); },

  getHighScores(planet) {
    return this.getJSON('scores_' + planet, []);
  },
  addHighScore(planet, score) {
    const scores = this.getHighScores(planet);
    scores.push(score);
    scores.sort((a, b) => b - a);
    this.setJSON('scores_' + planet, scores.slice(0, 10));
  },

  getEndlessHigh()  { return parseInt(this.get('endless_high', '0'), 10); },
  setEndlessHigh(n) { if (n > this.getEndlessHigh()) this.set('endless_high', String(n)); },

  getEndlessUnlocked() { return this.get('endless_unlocked', '0') === '1'; },
  setEndlessUnlocked() { this.set('endless_unlocked', '1'); },
};
