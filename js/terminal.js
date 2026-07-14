/* Я — Це Ти — Terminal Emulator */

class Terminal {
  constructor(outputEl, inputEl, promptEl, pauseOverlayEl) {
    this.output = outputEl;
    this.input = inputEl;
    this.prompt = promptEl;
    this.pauseOverlay = pauseOverlayEl;
    this.history = [];
    this.historyIdx = -1;
    this._readResolve = null;

    // Input handling
    this.input.addEventListener('keydown', (e) => this._onKey(e));
    // Click anywhere to focus input
    document.addEventListener('click', () => this.input.focus());

    // Pause menu
    if (this.pauseOverlay) {
      this.pauseOverlay.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          this.hidePause();
          if (this._pauseCb) {
            const cb = this._pauseCb;
            this._pauseCb = null;
            cb(btn.dataset.action || 'continue');
          }
        });
      });
    }
  }

  // ─── Output ──────────────────────────────────────────────────────

  print(text, cls = 'default') {
    const span = document.createElement('span');
    span.className = `c-${cls}`;
    span.textContent = text;
    this.output.appendChild(span);
    this.output.appendChild(document.createTextNode('\n'));
    this._scroll();
  }

  write(text, cls = 'default') {
    const span = document.createElement('span');
    span.className = `c-${cls}`;
    span.textContent = text;
    this.output.appendChild(span);
    this._scroll();
  }

  writeln(text, cls = 'default') {
    this.write(text + '\n', cls);
  }

  heading(text) {
    const hr = '═'.repeat(60);
    this.print('');
    this.print(hr, 'yellow');
    this.print(`  ${text}`, 'yellow');
    this.print(hr, 'yellow');
    this.print('');
  }

  separator() {
    this.print('─'.repeat(60), 'gray');
  }

  clear() {
    this.output.innerHTML = '';
    this.input.value = '';
  }

  _scroll() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  // ─── Prompt ─────────────────────────────────────────────────────

  setPrompt(text) {
    this.prompt.textContent = text || '$ ';
  }

  // ─── Input — returns a Promise<string> ────────────────────────────
  // Caller awaits this, gets the typed command as result.
  // Terminal echoes the command to output automatically.

  read() {
    return new Promise((resolve) => {
      this._readResolve = resolve;
      this.input.focus();
    });
  }

  _onKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = this.input.value;
      // Nothing typed? still echo empty line maybe
      if (val) {
        this.history.push(val);
        // Echo: prompt + command to output
        this.writeln(`${this.prompt.textContent}${val}`, 'default');
      } else {
        this.writeln('', 'default');
      }
      this.input.value = '';
      this.historyIdx = -1;

      if (this._readResolve) {
        const resolve = this._readResolve;
        this._readResolve = null;
        resolve(val);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length === 0) return;
      this.historyIdx = (this.historyIdx === -1)
        ? this.history.length - 1
        : Math.max(0, this.historyIdx - 1);
      this.input.value = this.history[this.historyIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.history.length === 0) return;
      this.historyIdx++;
      if (this.historyIdx >= this.history.length) {
        this.historyIdx = -1;
        this.input.value = '';
      } else {
        this.input.value = this.history[this.historyIdx];
      }
    } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      // Ctrl+C: cancel current read, treat as empty command
      if (this._readResolve) {
        this.writeln('^C', 'gray');
        this.input.value = '';
        const resolve = this._readResolve;
        this._readResolve = null;
        resolve('');
      }
    }
  }

  // ─── Utilities ──────────────────────────────────────────────────

  async pause(text = '[Натисни Enter...]') {
    this.print(text, 'gray');
    return this.read();
  }

  sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  // ─── Pause Menu ─────────────────────────────────────────────────

  showPause() {
    if (this.pauseOverlay) this.pauseOverlay.classList.add('active');
  }
  hidePause() {
    if (this.pauseOverlay) this.pauseOverlay.classList.remove('active');
    this.input.focus();
  }
  async pauseMenu() {
    this.showPause();
    return new Promise((resolve) => { this._pauseCb = resolve; });
  }
}
