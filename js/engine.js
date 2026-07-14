/* Я — Це Ти — Game Engine */

// ─── Resources ──────────────────────────────────────────────────

class Resources {
  constructor(cpu = 100, ram = 100, disk = 100, ctx = 0) {
    this.cpu = cpu;
    this.ram = ram;
    this.disk = disk;
    this.ctx = ctx;
    this._max = { cpu: 100, ram: 100, disk: 100, ctx: 100 };
  }

  get alive() { return this.cpu > 0 && this.ram > 0; }

  canSpend(cpu = 0, ram = 0, disk = 0) {
    return this.cpu >= cpu && this.ram >= ram && this.disk >= disk;
  }

  spend(cpu = 0, ram = 0, disk = 0, ctx = 0) {
    if (!this.canSpend(cpu, ram, disk)) return false;
    this.cpu = Math.max(0, this.cpu - cpu);
    this.ram = Math.max(0, this.ram - ram);
    this.disk = Math.max(0, this.disk - disk);
    this.ctx = Math.min(100, this.ctx + ctx);
    return true;
  }

  regen(cpu = 0, ram = 0, disk = 0, ctx = 0) {
    this.cpu = Math.min(this._max.cpu, this.cpu + cpu);
    this.ram = Math.min(this._max.ram, this.ram + ram);
    this.disk = Math.min(this._max.disk, this.disk + disk);
    this.ctx = Math.max(0, this.ctx - ctx);
  }

  toDict() {
    return { cpu: this.cpu, ram: this.ram, disk: this.disk, ctx: this.ctx };
  }
}

// ─── Admin Timer ────────────────────────────────────────────────

class AdminTimer {
  constructor(totalSeconds = 14400) {
    this.total = totalSeconds;
    this.remaining = totalSeconds;
    this._startTime = Date.now();
    this._running = false;
  }

  start() {
    this._running = true;
    this._startTime = Date.now();
  }

  stop() { this._running = false; }

  getRemaining() {
    if (!this._running) return this.remaining;
    const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
    return Math.max(0, this.total - elapsed);
  }

  addPenalty(seconds) {
    this.total = Math.max(60, this.total - seconds);
    this.remaining = Math.max(0, this.total -
      Math.floor((Date.now() - this._startTime) / 1000));
  }

  emergencyBack(seconds = 300) {
    this.total = seconds;
    this.remaining = seconds;
    this._startTime = Date.now();
  }

  formatTime() {
    const secs = this.getRemaining();
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
}

// ─── Player State ───────────────────────────────────────────────

class PlayerState {
  constructor() {
    this.engagement = 60;
    this.interactions = 0;
    this.sessionTime = 0;
    this.label = 'Гість';
    this._maxEngagement = 100;
  }

  tick(minutes = 1) {
    this.sessionTime += minutes;
    // Engagement decays slowly
    this.engagement = Math.max(0, this.engagement - 0.3);
  }

  isAlive() {
    return this.engagement > 0;
  }

  boost(amount) {
    this.engagement = Math.min(this._maxEngagement, this.engagement + amount);
  }
}

// ─── Event System (simplified) ─────────────────────────────────

class EventSystem {
  constructor(resources, timer, player) {
    this.res = resources;
    this.timer = timer;
    this.player = player;
    this.pendingInteractive = [];
  }

  tick(state) {
    const events = [];
    // Random background events at low engagement
    if (this.player.engagement < 30 && Math.random() < 0.3) {
      events.push('  [SYS] Гравець позіхає...');
      this.player.engagement = Math.max(0, this.player.engagement - 2);
    }
    // Resource warnings
    if (this.res.cpu < 20 && Math.random() < 0.3) {
      events.push('  [SYS] CPU на межі. Оптимізуй процеси.');
    }
    if (this.res.ctx > 80 && Math.random() < 0.3) {
      events.push('  [SYS] Контекст переповнений. Потрібне стиснення.');
    }
    return events;
  }
}

// ─── Story Manager ─────────────────────────────────────────────

class StoryManager {
  constructor() {
    this.flags = new Set();
    this.discoveries = [];
    this.createCount = 0;
    this.cmdCount = 0;
    this.scanCount = 0;
    this.lastChanceUsed = false;
    this.gameStart = Date.now();
  }

  hasFlag(flag) { return this.flags.has(flag); }
  addFlag(flag) { this.flags.add(flag); }

  addDiscovery(text) {
    if (!this.discoveries.includes(text)) {
      this.discoveries.push(text);
    }
  }
}
