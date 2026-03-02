/* ═══════════════════════════════════════════════════════
   Aether Descent — Web Audio Sound Engine
   ═══════════════════════════════════════════════════════ */
AD.Audio = {
  ctx: null,

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  _osc(type, freq, dur, vol, detune) {
    if (!this.ctx) return;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    g.connect(this.ctx.destination);
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    if (detune) o.detune.value = detune;
    o.connect(g);
    o.start();
    o.stop(this.ctx.currentTime + dur);
  },

  _noise(dur, vol) {
    if (!this.ctx) return;
    const bufSize = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    g.connect(this.ctx.destination);
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 800;
    filt.Q.value = 0.5;
    src.connect(filt);
    filt.connect(g);
    src.start();
    src.stop(this.ctx.currentTime + dur);
  },

  thrust() {
    this._noise(0.08, 0.06);
    this._osc('sawtooth', 80, 0.08, 0.03);
  },

  collectShard() {
    this._osc('sine', 880, 0.12, 0.12);
    this._osc('sine', 1320, 0.12, 0.08, 5);
    setTimeout(() => this._osc('sine', 1100, 0.15, 0.1), 60);
  },

  crash() {
    this._noise(0.6, 0.2);
    this._osc('sawtooth', 60, 0.5, 0.15);
    this._osc('square', 40, 0.4, 0.1);
  },

  land() {
    this._osc('sine', 523, 0.15, 0.12);
    setTimeout(() => this._osc('sine', 659, 0.15, 0.12), 100);
    setTimeout(() => this._osc('sine', 784, 0.2, 0.14), 200);
  },

  perfectLand() {
    this._osc('sine', 523, 0.12, 0.12);
    setTimeout(() => this._osc('sine', 659, 0.12, 0.12), 80);
    setTimeout(() => this._osc('sine', 784, 0.12, 0.12), 160);
    setTimeout(() => this._osc('sine', 1047, 0.3, 0.15), 240);
  },

  menuClick() {
    this._osc('sine', 600, 0.06, 0.08);
  },

  menuHover() {
    this._osc('sine', 400, 0.04, 0.04);
  },

  upgrade() {
    this._osc('sine', 440, 0.1, 0.1);
    setTimeout(() => this._osc('sine', 660, 0.1, 0.1), 80);
    setTimeout(() => this._osc('sine', 880, 0.15, 0.12), 160);
  },

  warning() {
    this._osc('square', 200, 0.15, 0.08);
    setTimeout(() => this._osc('square', 200, 0.15, 0.08), 200);
  },
};
