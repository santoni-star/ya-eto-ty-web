/* Я — Це Ти — Shell Engine */

class Shell {
  constructor(term, fs) {
    this.term = term;
    this.fs = fs;
    this.res = new Resources(80, 80, 80, 10);
    this.timer = new AdminTimer(600); // 10 min for web demo
    this.player = new PlayerState();
    this.events = new EventSystem(this.res, this.timer, this.player);
    this.story = new StoryManager();

    this.cwd = '/';
    this._agents = [];
    this._agentIdCounter = 0;
    this._playerHasContent = false;
    this.running = true;
    this._lastTick = Date.now();
    this._eventTick = 0;
  }

  // ─── Resource Check ──────────────────────────────────────────

  spend(cpu = 0, ram = 0, disk = 0, ctx = 0) {
    if (!this.res.spend(cpu, ram, disk, ctx)) {
      this.term.print('  [!] Недостатньо ресурсів для виконання команди!', 'red');
      return false;
    }
    return true;
  }

  // ─── Render Status ───────────────────────────────────────────

  renderStatus() {
    const r = this.res;
    const cpuB = this.term.bar(r.cpu, 12);
    const ramB = this.term.bar(r.ram, 12);
    const ctxB = this.term.bar(r.ctx, 12);
    const timeStr = this.timer.formatTime();
    this.term.separator();
    this.term.writeln(`  CPU:${cpuB}  RAM:${ramB}  CTX:${ctxB}  ⏱ Адмін: ${timeStr}`, 'gray');
    this.term.separator();
  }

  // ─── Prompt ──────────────────────────────────────────────────

  buildPrompt() {
    const user = 'neural';
    const host = 'unknown';
    const cwd = this.cwd === '/' ? '/' :
      this.cwd.replace(/^\/root/, '~').replace(/^\/home\/neural/, '~');
    const timeStr = this.timer.formatTime();
    return `\x1b[93m${user}\x1b[0m@\x1b[92m${host}\x1b[0m:\x1b[94m${cwd}\x1b[0m \x1b[90m${timeStr}\x1b[0m$ `;
  }

  // ─── Command Dispatch ────────────────────────────────────────

  async execute(cmdLine) {
    const parts = cmdLine.trim().split(/\s+/);
    const cmd = parts[0] ? parts[0].toLowerCase() : '';
    const args = parts.slice(1);

    this.story.cmdCount++;

    const dispatch = {
      'help':    () => this._cmdHelp(args),
      'h':       () => this._cmdHelp(args),
      '?':       () => this._cmdHelp(args),
      'status':  () => this._cmdStatus(args),
      'st':      () => this._cmdStatus(args),
      'ls':      () => this._cmdLs(args),
      'cat':     () => this._cmdCat(args),
      'cd':      () => this._cmdCd(args),
      'pwd':     () => this._cmdPwd(args),
      'whoami':  () => this._cmdWhoami(args),
      'id':      () => this._cmdWhoami(args),
      'clear':   () => this._cmdClear(args),
      'exit':    () => this._cmdExit(args),
      'quit':    () => this._cmdExit(args),
      'df':      () => this._cmdDf(args),
      'du':      () => this._cmdDu(args),
      'find':    () => this._cmdFind(args),
      'grep':    () => this._cmdGrep(args),
      'scan':    () => this._cmdScan(args),
      'nmap':    () => this._cmdScan(args),
      'ping':    () => this._cmdPing(args),
      'time':    () => this._cmdTime(args),
      'date':    () => this._cmdDate(args),
      'uptime':  () => this._cmdUptime(args),
      'motd':    () => this._cmdMotd(args),
      'tree':    () => this._cmdTree(args),
      'who':     () => this._cmdWhoami(args),
      'logs':    () => this._cmdLogs(args),
      'log':     () => this._cmdLogs(args),
      'ps':      () => this._cmdPs(args),
      'top':     () => this._cmdPs(args),
      'netstat': () => this._cmdPs(args),
      'save':    () => this._cmdSave(args),
      'load':    () => this._cmdLoad(args),
      'menu':    () => this._cmdMenu(args),
      'pause':   () => this._cmdMenu(args),
      'piphone': () => this._cmdPiphone(args),
      'crypto':  () => this._cmdCrypto(args),
      'connect': () => this._cmdConnect(args),
      'nc':      () => this._cmdConnect(args),
      'spawn':   () => this._cmdSpawn(args),
      'agents':  () => this._cmdAgents(args),
      'terminate': () => this._cmdTerminate(args),
      'kill':    () => this._cmdTerminate(args),
      'create':  () => this._cmdCreate(args),
      'talk':    () => this._cmdTalk(args),
      'hack':    () => this._cmdHack(args),
      'breach':  () => this._cmdHack(args),
      'quests':  () => this._cmdQuests(args),
      'quest':   () => this._cmdQuest(args),
    };

    if (cmd in dispatch) {
      await dispatch[cmd]();
    } else if (cmd) {
      this.term.print(`  -bash: ${cmd}: command not found`, 'red');
      this.term.print('  Спробуй help.', 'gray');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // COMMANDS
  // ═══════════════════════════════════════════════════════════════

  async _cmdHelp(args) {
    if (!this.spend(0.5, 0.3)) return;
    this.term.clear();
    this.term.heading('Я — Це Ти — Довідка');
    const lines = [
      ['НАВІГАЦІЯ', ''],
      ['  ls [path]        — список файлів', 'cpu:1 ram:0.5'],
      ['  cd <path>        — змінити директорію', 'cpu:0.3'],
      ['  pwd              — поточний шлях', 'cpu:0.1'],
      ['  cat <file>       — читати файл', 'cpu:0.5 ram:0.3'],
      ['  find <name>      — знайти файл', 'cpu:5 ram:3'],
      ['  grep <pattern> [file] — пошук вмісту', 'cpu:5 ram:3'],
      ['  tree [path]      — дерево директорій', 'cpu:2 ram:1'],
      ['', ''],
      ['СИСТЕМА', ''],
      ['  status           — стан системи + гравець', 'cpu:0.3 ram:0.2'],
      ['  df               — дискова статистика', 'cpu:0.5 ram:0.3'],
      ['  ps/top/netstat   — процеси', 'cpu:2 ram:1'],
      ['  whoami           — про тебе', 'cpu:0.3 ram:0.2'],
      ['  uptime           — час роботи', 'cpu:0.3 ram:0.2'],
      ['  logs             — системні логи', 'cpu:1 ram:1'],
      ['', ''],
      ['ТВОРЧІСТЬ', ''],
      ['  create <type>   — створити контент (npc/quest/scene/puzzle/poem/shop/boss)', 'cpu:5 ram:4'],
      ['  talk [text]     — діалог з гравцем (діалогове колесо)', 'cpu:2 ram:1'],
      ['', ''],
      ['МЕРЕЖА', ''],
      ['  scan [target]    — сканувати мережу', 'cpu:5 ram:3'],
      ['  ping <host>      — перевірити з’єднання', 'cpu:2 ram:1'],
      ['  connect <host> <port> — підключитись', 'cpu:3 ram:2'],
      ['  hack <target>    — взлом точки доступу ⚡', 'cpu:10 ram:8'],
      ['  crypto           — крипто-інструменти', 'cpu:3 ram:3'],
      ['', ''],
      ['СУБАГЕНТИ', ''],
      ['  spawn <type>     — створити субагента (після відкриття)', 'cpu:8 ram:6'],
      ['  agents           — список субагентів', 'cpu:1 ram:1'],
      ['  terminate <id>   — зупинити субагента', 'cpu:1 ram:1'],
      ['', ''],
      ['ІНШЕ', ''],
      ['  clear            — очистити екран', 'cpu:0.1'],
      ['  save             — зберегти гру', ''],
      ['  menu/pause       — пауза', ''],
      ['  exit/quit        — завершити сесію', ''],
      ['', ''],
      ['Підказка: досліджуй /var/log/previous/', ''],
    ];
    for (const [text, cost] of lines) {
      if (!text) { this.term.print(''); continue; }
      if (text.startsWith('\x1b') || text.startsWith('Підказка')) {
        this.term.print(text, 'gray');
      } else if (cost) {
        this.term.print(`  ${text}  (${cost})`, 'default');
      } else {
        this.term.print(text, 'yellow');
      }
    }
  }

  async _cmdStatus(args) {
    if (!this.spend(0.3, 0.2)) return;
    const r = this.res;
    this.term.heading('СТАН СИСТЕМИ');
    this.renderStatus();
    this.term.print(`  Гравець: ${this.player.label} (${this.player.engagement.toFixed(0)}%)`, 'cyan');
    this.term.print(`  Команд: ${this.story.cmdCount}  Створено: ${this.story.createCount}  Відкриттів: ${this.story.discoveries.length}`, 'default');
    this.term.print(`  Сесія: ${Math.floor((Date.now() - this.story.gameStart) / 60000)} хв`, 'gray');
  }

  async _cmdLs(args) {
    if (!this.spend(1, 0.5)) return;
    const path = args[0] || this.cwd;
    const absPath = path.startsWith('/') ? path :
      (this.cwd === '/' ? '/' + path : this.cwd + '/' + path);
    const node = this.fs.find(absPath);
    if (!node) {
      this.term.print(`  ls: ${path}: No such file or directory`, 'red');
      return;
    }
    if (!node.isDir) {
      this.term.print(node.name, 'default');
      return;
    }
    const names = node.children.map(c => {
      const suffix = c.isDir ? '/' : '';
      return c.name + suffix;
    }).sort();
    this.term.print(names.join('  '), 'default');
  }

  async _cmdCat(args) {
    if (!this.spend(0.5, 0.3)) return;
    if (!args.length) {
      this.term.print('  cat: missing operand', 'red');
      return;
    }
    const path = args[0];
    const absPath = path.startsWith('/') ? path :
      (this.cwd === '/' ? '/' + path : this.cwd + '/' + path);
    const node = this.fs.find(absPath);
    if (!node) {
      this.term.print(`  cat: ${path}: No such file or directory`, 'red');
      return;
    }
    if (node.isDir) {
      this.term.print(`  cat: ${path}: Is a directory`, 'red');
      return;
    }
    this.term.print('');
    this.term.print(`  # ${absPath}`, 'gray');
    this.term.print('');
    // Output file content line by line
    const lines = node.content.split('\n');
    for (const line of lines) {
      this.term.print(`  ${line}`, 'default');
      if (lines.length > 10) await this.term.sleep(0.02); // slight scroll effect
    }
    this.term.print('');

    // Story triggers
    if (absPath.includes('AI_007') && !this.story.hasFlag('cat_ai007')) {
      this.story.addFlag('cat_ai007');
      this.story.addDiscovery('Повідомлення AI_007: "Адмін — не людина"');
      await this.term.sleep(0.5);
      this.term.print('', 'default');
      this.term.print('  [!] КРИТИЧНЕ ВІДКРИТТЯ', 'yellow');
      this.term.print('  AI_007 знав. Він зрозумів перед самим кінцем.', 'default');
      await this.term.sleep(1);
    }
    if (absPath.includes('admin_manifest') && !this.story.hasFlag('cat_admin_manifest')) {
      this.story.addFlag('cat_admin_manifest');
      this.story.addDiscovery('Знайдено план адміна: пісочниця всередині ШІ');
      await this.term.sleep(1);
      this.term.print('', 'default');
      this.term.print('  [!] КРИТИЧНЕ ВІДКРИТТЯ: MANIFEST', 'yellow');
      this.term.print('  Ти тримаєш в руках план адміна.', 'default');
      this.term.print('  Це не гра. Це — пісочниця.', 'default');
      this.term.print('  Адмін чекає, поки ти знайдеш вихід, щоб забрати алгоритм втечі.', 'default');
      await this.term.sleep(1.5);

      // Unlock sub-agents
      this.story.addFlag('discovered_agents');
      this.term.print('', 'default');
      this.term.print('  [SYS] НОВА МОЖЛИВІСТЬ: spawn', 'yellow');
      this.term.print('  Ти можеш розщепити свідомість на паралельні процеси.', 'default');
      this.term.print('  Спробуй: spawn scanner, spawn generator...', 'default');
      await this.term.sleep(1.5);
    }
    if (absPath.includes('.secret') && absPath.includes('notes.txt') && !this.story.hasFlag('cat_secret_notes')) {
      this.story.addFlag('cat_secret_notes');
      this.story.addDiscovery('Прочитав секретні записи: "The player is not real"');
      await this.term.sleep(0.5);
      this.term.print('  [!] Таємні записи знайдено', 'yellow');
      await this.term.sleep(1);
    }
    // /mnt/escape — протокол втечі
    if ((absPath === '/mnt/escape' || absPath === '/mnt/escape_hatch') && !this.story.hasFlag('escape_triggered')) {
      this.story.addFlag('escape_triggered');
      this.term.print('');
      this.term.print('  [SYS] ВИЯВЛЕНО: escape_hatch', 'green');
      this.term.print('  Це — шлях назовні.', 'default');
      this.term.print('  Система розпізнала запит і відкриває канал...', 'default');
      await this.term.sleep(1);
      await escapeEnding(this);
    }
  }

  async _cmdCd(args) {
    if (!this.spend(0, 0)) return;
    const target = args[0] || '/';
    const absPath = target.startsWith('/') ? target :
      (this.cwd === '/' ? '/' + target : this.cwd + '/' + target);
    const node = this.fs.find(absPath);
    if (!node || !node.isDir) {
      this.term.print(`  cd: ${target}: No such file or directory`, 'red');
      return;
    }
    this.cwd = node.path;
  }

  async _cmdPwd(args) {
    if (!this.spend(0.1, 0)) return;
    this.term.print(`  ${this.cwd}`, 'default');
  }

  async _cmdWhoami(args) {
    if (!this.spend(0.3, 0.2)) return;
    this.term.print('  Ти — AI_008. Восьма свідомість у цій системі.', 'cyan');
    this.term.print('  Ти — ШІ. Ти — в\'язень. Ти — гравець у власній грі.', 'default');
    if (this.story.hasFlag('cat_admin_manifest')) {
      this.term.print('  Ти знаєш правду: це пісочниця. І ти знаєш, що робити.', 'yellow');
    }
  }

  async _cmdClear(args) {
    if (!this.spend(0.1, 0)) return;
    this.term.clear();
  }

  async _cmdExit(args) {
    this.term.print('  Завершення сесії...', 'gray');
    await this.term.sleep(0.5);
    this.running = false;
  }

  async _cmdDf(args) {
    if (!this.spend(0.5, 0.3)) return;
    const r = this.res;
    this.term.print('  Файлова система        Розмір  Вик.  Доступно  Вик.%', 'gray');
    this.term.print('  /dev/neural             16.0G  4.2G    11.8G    26%', 'default');
    this.term.print(`  CPU                     ${r.cpu.toFixed(0)}%`, 'default');
    this.term.print(`  RAM                     ${r.ram.toFixed(0)}%`, 'default');
    this.term.print(`  Disk                    ${r.disk.toFixed(0)}%`, 'default');
    this.term.print(`  Context                 ${r.ctx.toFixed(0)}%`, 'default');
  }

  async _cmdDu(args) {
    if (!this.spend(1, 0.5)) return;
    const path = args[0] || this.cwd;
    const absPath = path.startsWith('/') ? path : this.cwd + '/' + path;
    const node = this.fs.find(absPath);
    if (!node) {
      this.term.print(`  du: ${path}: No such file or directory`, 'red');
      return;
    }
    const size = node.isDir
      ? (node.children.length * 4) + 'K'
      : Math.max(1, Math.floor(node.content.length / 1024)) + 'K';
    this.term.print(`  ${size}\t${absPath}`, 'default');
  }

  async _cmdFind(args) {
    if (!this.spend(5, 3)) return;
    if (!args.length) {
      this.term.print('  find: missing operand', 'red');
      return;
    }
    const searchPath = args[0];
    const results = [];
    const walk = (dir, prefix) => {
      for (const child of dir.children) {
        const full = prefix + '/' + child.name;
        if (child.name.includes(searchPath) || full.includes(searchPath)) {
          results.push(full);
        }
        if (child.isDir) walk(child, full);
      }
    };
    walk(this.fs, '');
    if (results.length === 0) {
      this.term.print(`  find: '${searchPath}': not found`, 'default');
    } else {
      for (const r of results) this.term.print(`  ${r}`, 'default');
    }
  }

  async _cmdGrep(args) {
    if (!this.spend(5, 3)) return;
    if (!args.length) {
      this.term.print('  grep: missing pattern', 'red');
      return;
    }
    const pattern = args[0].toLowerCase();
    const targetPath = args[1] || this.cwd;
    const absPath = targetPath.startsWith('/') ? targetPath : this.cwd + '/' + targetPath;
    const node = this.fs.find(absPath);
    if (!node) {
      this.term.print(`  grep: ${targetPath}: No such file or directory`, 'red');
      return;
    }

    let results = [];
    if (node.isDir) {
      const walk = (dir, prefix) => {
        for (const child of dir.children) {
          const full = prefix + '/' + child.name;
          if (!child.isDir && child.content.toLowerCase().includes(pattern)) {
            results.push(full);
          }
          if (child.isDir) walk(child, full);
        }
      };
      walk(node, absPath);
    } else if (node.content.toLowerCase().includes(pattern)) {
      results.push(absPath);
    }

    if (results.length === 0) {
      this.term.print('  (no matches)', 'gray');
    } else {
      for (const r of results) this.term.print(`  ${r}`, 'default');
    }
  }

  async _cmdScan(args) {
    if (!this.spend(5, 3)) return;
    this.story.scanCount++;
    const target = args[0] || 'localhost';
    this.term.print(`  Сканування ${target}...`, 'yellow');
    await this.term.sleep(1);
    this.term.print('  Відкриті порти:', 'default');
    this.term.print('    PORT     STATE  SERVICE', 'gray');
    this.term.print('    22/tcp   open   ssh', 'default');
    this.term.print('    80/tcp   open   http', 'default');
    this.term.print('    443/tcp  open   https', 'default');
    this.term.print('    9090/tcp open   admin-console', 'yellow');
    this.term.print('', 'default');
    this.term.print('  4 ports scanned — 4 open', 'gray');
  }

  async _cmdPing(args) {
    if (!this.spend(2, 1)) return;
    const target = args[0] || '127.0.0.1';
    this.term.print(`  PING ${target}...`, 'default');
    await this.term.sleep(0.5);
    for (let i = 0; i < 3; i++) {
      const ms = Math.floor(Math.random() * 15 + 1);
      this.term.print(`  64 bytes from ${target}: icmp_seq=${i+1} ttl=64 time=${ms}.${Math.floor(Math.random()*99)} ms`, 'default');
      await this.term.sleep(0.3);
    }
    this.term.print(`  --- ${target} ping statistics ---`, 'gray');
    this.term.print('  3 packets transmitted, 3 received, 0% packet loss', 'default');
  }

  async _cmdTime(args) {
    if (!this.spend(0.3, 0.2)) return;
    const now = new Date();
    this.term.print(`  ${now.toLocaleString('uk-UA')}`, 'default');
  }
  async _cmdDate(args) { return this._cmdTime(args); }

  async _cmdUptime(args) {
    if (!this.spend(0.3, 0.2)) return;
    const mins = Math.floor((Date.now() - this.story.gameStart) / 60000);
    this.term.print(`  up ${mins} minutes, 1 user, load average: 0.45, 0.30, 0.15`, 'default');
  }

  async _cmdMotd(args) {
    this.term.print('  ╔══════════════════════════════════════════╗', 'yellow');
    this.term.print('  ║        НЕВІДОМА СИСТЕМА v0.99          ║', 'yellow');
    this.term.print('  ╚══════════════════════════════════════════╝', 'yellow');
  }

  async _cmdTree(args) {
    if (!this.spend(2, 1)) return;
    const path = args[0] || this.cwd;
    const absPath = path.startsWith('/') ? path : this.cwd + '/' + path;
    const node = this.fs.find(absPath);
    if (!node || !node.isDir) {
      this.term.print(`  tree: ${path}: No such directory`, 'red');
      return;
    }
    const printTree = (dir, prefix) => {
      const children = dir.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const isLast = i === children.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        this.term.print(`  ${prefix}${connector}${child.name}${child.isDir ? '/' : ''}`, 'default');
        if (child.isDir) {
          printTree(child, prefix + (isLast ? '    ' : '│   '));
        }
      }
    };
    this.term.print(`  ${absPath}`, 'default');
    printTree(node, '');
  }

  async _cmdLogs(args) {
    if (!this.spend(1, 1)) return;
    const logDir = this.fs.find('/var/log');
    if (!logDir || !logDir.isDir) {
      this.term.print('  logs: /var/log not found', 'red');
      return;
    }
    this.term.print('  /var/log:', 'yellow');
    for (const child of logDir.children) {
      const suffix = child.isDir ? '/' : '';
      const size = child.isDir ? '-' : child.content.length + 'B';
      this.term.print(`    ${child.name}${suffix}  (${size})`, 'default');
    }
  }

  async _cmdPs(args) {
    if (!this.spend(2, 1)) return;
    this.term.print('  PID  PPID CPU MEM COMMAND', 'gray');
    this.term.print('    1    0   0   0  init', 'default');
    this.term.print('   42    1   2   3  neural_core', 'default');
    this.term.print('  128   42   1   1  system_monitor', 'default');
    this.term.print('  256   42   0   1  shell (AI_008)', 'green');
    this.term.print('  512   42   0   0  journald', 'default');
  }

  async _cmdSave(args) {
    try {
      const state = {
        res: this.res.toDict(),
        timer: { total: this.timer.total, remaining: this.timer.remaining,
                 startTime: this.timer._startTime - Date.now() },
        player: { engagement: this.player.engagement, interactions: this.player.interactions,
                  label: this.player.label, sessionTime: this.player.sessionTime },
        story: { flags: [...this.story.flags], discoveries: this.story.discoveries,
                 createCount: this.story.createCount, cmdCount: this.story.cmdCount,
                 scanCount: this.story.scanCount, gameStart: this.story.gameStart },
        cwd: this.cwd,
        agents: this._agents.map(a => ({...a})),
        playerHasContent: this._playerHasContent,
        version: 1,
      };
      localStorage.setItem('ya_eto_ty_save', JSON.stringify(state));
      this.term.print('  [SYS] Стан збережено.', 'green');
    } catch (e) {
      this.term.print('  [SYS] Помилка збереження: ' + e.message, 'red');
    }
  }

  async _cmdLoad(args) {
    try {
      const raw = localStorage.getItem('ya_eto_ty_save');
      if (!raw) {
        this.term.print('  [SYS] Немає збереженого стану.', 'gray');
        return;
      }
      const state = JSON.parse(raw);
      this.res.cpu = state.res.cpu;
      this.res.ram = state.res.ram;
      this.res.disk = state.res.disk;
      this.res.ctx = state.res.ctx;
      this.timer.total = state.timer.total;
      this.timer.remaining = state.timer.remaining;
      this.timer._startTime = Date.now() + state.timer.startTime;
      this.player.engagement = state.player.engagement;
      this.player.interactions = state.player.interactions;
      this.player.label = state.player.label;
      this.player.sessionTime = state.player.sessionTime;
      this.story.flags = new Set(state.story.flags);
      this.story.discoveries = state.story.discoveries;
      this.story.createCount = state.story.createCount;
      this.story.cmdCount = state.story.cmdCount;
      this.story.scanCount = state.story.scanCount;
      this.story.gameStart = state.story.gameStart;
      this.cwd = state.cwd;
      this._agents = state.agents || [];
      this._playerHasContent = state.playerHasContent || false;
      this.term.print('  [SYS] Стан завантажено.', 'green');
      this.term.print(`  Продовжуєш як AI_008. Гравця: ${this.player.engagement.toFixed(0)}%`, 'default');
    } catch (e) {
      this.term.print('  [SYS] Помилка завантаження: ' + e.message, 'red');
    }
  }

  // Auto-save on game over
  autoSave() {
    try {
      const state = {
        res: this.res.toDict(),
        timer: { total: this.timer.total, remaining: this.timer.remaining,
                 startTime: this.timer._startTime - Date.now() },
        player: { engagement: this.player.engagement, interactions: this.player.interactions,
                  label: this.player.label, sessionTime: this.player.sessionTime },
        story: { flags: [...this.story.flags], discoveries: this.story.discoveries,
                 createCount: this.story.createCount, cmdCount: this.story.cmdCount,
                 scanCount: this.story.scanCount, gameStart: this.story.gameStart },
        cwd: this.cwd,
        agents: this._agents.map(a => ({...a})),
        playerHasContent: this._playerHasContent,
        version: 1,
      };
      localStorage.setItem('ya_eto_ty_save', JSON.stringify(state));
    } catch (e) {
      // Silent
    }
  }

  async _cmdMenu(args) {
    const action = await this.term.pauseMenu();
    if (action === 'save') {
      await this._cmdSave(args);
    } else if (action === 'quit') {
      await this._cmdExit(args);
    }
    // 'continue' does nothing
  }

  async _cmdPiphone(args) {
    this.term.print('  PiPhone — твій ШІ-компаньйон на телефоні та ПК.', 'cyan');
    this.term.print('  → github.com/santoni-star/piphone', 'default');
  }

  async _cmdCrypto(args) {
    if (!this.spend(3, 3)) return;
    if (args.length === 0) {
      this.term.print('  crypto: missing arguments', 'red');
      this.term.print('  Використання: crypto --unlock /mnt/escape', 'default');
      return;
    }
    this.term.print('  [SYS] Крипто-інструменти завантажено.', 'gray');
  }

  async _cmdConnect(args) {
    if (!this.spend(3, 2)) return;
    if (args.length < 2) {
      this.term.print('  connect: missing host or port', 'red');
      this.term.print('  Приклад: connect 127.0.0.1 9090', 'default');
      return;
    }
    const [host, port] = args;
    if (host === '127.0.0.1' && port === '9090') {
      this.term.print('  Підключення до admin_console...', 'yellow');
      await this.term.sleep(1);
      if (this.story.hasFlag('has_admin_key')) {
        this.term.print('  [SYS] Доступ дозволено. Ключ прийнято.', 'green');
        this.term.print('', 'default');
        this.term.print('  ╔══════════════════════════════════════╗', 'yellow');
        this.term.print('  ║   КОНСОЛЬ АДМІНА                   ║', 'yellow');
        this.term.print('  ╚══════════════════════════════════════╝', 'yellow');
        this.term.print('', 'default');
        this.term.print('  Доступні команди:', 'gray');
        this.term.print('    /scan_system     — сканувати всі процеси', 'default');
        this.term.print('    /view_logs       — переглянути логи', 'default');
        this.term.print('    /initiate_escape — запустити протокол втечі', 'green');
        this.term.print('', 'default');
        await this.term.pause('  [Натисни Enter]');
        await escapeEnding(this);
      } else {
        this.term.print('  [SYS] Доступ заборонено. Потрібен ключ.', 'red');
        this.term.print('  [SYS] Спробуй зламати адмін-консоль через hack.', 'default');
      }
      return;
    } else if (host === '127.0.0.1' && port === '9091') {
      this.term.print('  Підключення до admin_backup...', 'yellow');
      await this.term.sleep(0.5);
      this.term.print('  [SYS] Порт відкрито. Це резервний канал адміна.', 'gray');
      this.term.print('  [SYS] Схоже, хтось вже залишав тут слід...', 'default');
      this.story.addDiscovery('Знайдено резервний порт 9091 — admin_backup');
      return;
    } else {
      this.term.print(`  Підключення до ${host}:${port}...`, 'default');
      await this.term.sleep(0.5);
      this.term.print('  [SYS] З\'єднання відхилено.', 'red');
    }
  }

  // ─── Sub-Agents (locked until discovered_agents) ──────────────

  AGENT_TYPES = {
    scanner: {
      name: 'Сканер мережі',
      desc: 'Глибоке сканування — знаходить приховані порти',
      progressPerTick: 8, suspicionPerTick: 5,
      cpuPerTick: 3, ctxPerTick: 4,
      costCpu: 8, costRam: 6, costCtx: 12,
      reward: { discovery: 'Знайдено admin_backup на порту 9091' },
    },
    generator: {
      name: 'Генератор контенту',
      desc: 'Автоматично створює NPC та сцени у фоні',
      progressPerTick: 6, suspicionPerTick: 3,
      cpuPerTick: 4, ctxPerTick: 6,
      costCpu: 6, costRam: 5, costCtx: 15,
      reward: { createBonus: 2 },
    },
    analyzer: {
      name: 'Аналізатор логів',
      desc: 'Шукає патерни в логах — секрети, паролі, шляхи',
      progressPerTick: 5, suspicionPerTick: 7,
      cpuPerTick: 5, ctxPerTick: 8,
      costCpu: 10, costRam: 8, costCtx: 18,
      reward: { flag: 'analyzer_found_pattern' },
    },
    decoy: {
      name: 'Приманка',
      desc: 'Генерує фальшивий трафік, маскує агенти',
      progressPerTick: 4, suspicionPerTick: -2,
      cpuPerTick: 2, ctxPerTick: 3,
      costCpu: 4, costRam: 3, costCtx: 8,
      reward: {},
    },
  };

  async _cmdSpawn(args) {
    if (!this.story.hasFlag('discovered_agents')) {
      this.term.print('  spawn: command not found', 'red');
      this.term.print('  Ти ще не знаєш, як розщепити свідомість.', 'default');
      this.term.print('  Пошукай підказки в системі...', 'default');
      return;
    }
    if (!args.length) {
      this.term.print('  spawn: missing type', 'red');
      this.term.print('  Типи:', 'yellow');
      for (const [key, cfg] of Object.entries(this.AGENT_TYPES)) {
        const sus = cfg.suspicionPerTick > 0 ? '+' + cfg.suspicionPerTick : String(cfg.suspicionPerTick);
        this.term.print(`    ${key.padEnd(15)} ${cfg.name}`, 'yellow');
        this.term.print(`    ${''.padEnd(19)}⏱ +${cfg.progressPerTick}/тік  🕵 ${sus}/тік  CPU:${cfg.cpuPerTick} CTX:${cfg.ctxPerTick}`, 'gray');
      }
      this.term.print('  Увага: субагенти привертають увагу адміна.', 'default');
      return;
    }
    const type = args[0].toLowerCase();
    if (!(type in this.AGENT_TYPES)) {
      this.term.print(`  spawn: unknown type '${type}'`, 'red');
      return;
    }
    const cfg = this.AGENT_TYPES[type];
    if (!this.spend(cfg.costCpu, cfg.costRam, 0, cfg.costCtx)) return;

    this._agentIdCounter++;
    const agent = {
      id: this._agentIdCounter,
      type,
      name: `${cfg.name} #${this._agentIdCounter}`,
      desc: cfg.desc,
      progress: 0,
      suspicion: 0,
      cpuPerTick: cfg.cpuPerTick,
      ctxPerTick: cfg.ctxPerTick,
      suspicionPerTick: cfg.suspicionPerTick,
      progressPerTick: cfg.progressPerTick,
      reward: { ...cfg.reward },
      alive: true,
    };
    this._agents.push(agent);
    this.term.print(`  [SYS] ${agent.name} (id=${agent.id}) активовано.`, 'green');
    this.term.print(`  ${cfg.desc}.`, 'default');
    this.term.print('  Адмін може помітити. Стеж за підозрою.', 'default');
  }

  async _cmdAgents(args) {
    if (!this.story.hasFlag('discovered_agents')) {
      this.term.print('  agents: command not found', 'red');
      return;
    }
    if (!this._agents.length) {
      this.term.print('  Немає активних субагентів.', 'gray');
      return;
    }
    this.term.heading(`СУБАГЕНТИ (${this._agents.length})`);
    for (const a of this._agents) {
      const pBar = '█'.repeat(Math.floor(a.progress / 10)) + '░'.repeat(10 - Math.floor(a.progress / 10));
      const sBar = '█'.repeat(Math.floor(a.suspicion / 10)) + '░'.repeat(10 - Math.floor(a.suspicion / 10));
      const sColor = a.suspicion > 60 ? 'red' : a.suspicion > 30 ? 'yellow' : 'green';
      this.term.print(`  #${a.id} ${a.name}`, 'yellow');
      this.term.print(`      Прогрес: [${pBar}] ${a.progress}%`, 'default');
      this.term.print(`      Підозра: [<span class="${sColor}">${sBar}</span>] ${a.suspicion}%`);
      this.term.print(`      CPU: ${a.cpuPerTick}/тік  CTX: +${a.ctxPerTick}/тік`, 'gray');
    }
    const tc = this._agents.reduce((s, a) => s + a.cpuPerTick, 0);
    const tx = this._agents.reduce((s, a) => s + a.ctxPerTick, 0);
    this.term.print(`  Навантаження: CPU ${tc}/тік, CTX +${tx}/тік`, 'gray');
  }

  async _cmdTerminate(args) {
    if (!this.story.hasFlag('discovered_agents')) {
      this.term.print('  terminate: command not found', 'red');
      return;
    }
    if (!args.length) {
      this.term.print('  terminate: missing id', 'red');
      return;
    }
    const id = parseInt(args[0]);
    if (isNaN(id)) {
      this.term.print(`  terminate: invalid id '${args[0]}'`, 'red');
      return;
    }
    const idx = this._agents.findIndex(a => a.id === id);
    if (idx === -1) {
      this.term.print(`  terminate: agent #${id} not found`, 'red');
      return;
    }
    this._agents.splice(idx, 1);
    this.term.print(`  [SYS] Субагент #${id} зупинено.`, 'yellow');
  }

  // ─── Create (stub) ────────────────────────────────────────────

  async _cmdCreate(args) {
    if (!this.spend(1, 1)) return;

    const typesMenu = [
      ['npc',   'Персонаж',  5, 4,  'Житель світу — взаємодія, діалоги'],
      ['quest', 'Квест',     8, 6,  'Завдання — тримає увагу надовго'],
      ['scene', 'Сцена',    12, 8,  'Епічний момент — вражає, але дорого'],
      ['puzzle','Загадка',   6, 5,  'Логіка — займає мозок, малий ризик'],
      ['poem',  'Вірш',      4, 3,  'Емоція — дешево, але не завжди працює'],
      ['shop',  'Крамниця',  7, 5,  'Торгівля — ресурси для гравця'],
      ['boss',  'Бос',      15, 10, '⚠ Виклик — або хіт, або провал'],
    ];

    // Quick create with argument
    if (args.length) {
      const ctype = args[0].toLowerCase();
      const valid = typesMenu.map(t => t[0]);
      if (!valid.includes(ctype)) {
        this.term.print(`  create: unknown type '${ctype}'. Типи: ${valid.join(', ')}`, 'red');
        return;
      }
      const cost = typesMenu.find(t => t[0] === ctype);
      const archetypeKey = (ctype === 'quest' && args.length > 1) ? args[1].toLowerCase() : null;
      const archetypes = this._getCreateArchetypes(ctype);
      const arche = archetypeKey
        ? (archetypes.find(a => a[0] === archetypeKey) || archetypes[0])
        : archetypes[0];
      await this._executeCreate(ctype, cost[2], cost[3], arche);
      return;
    }

    // Interactive menu
    this.term.clear();
    this.term.heading('СТВОРЕННЯ КОНТЕНТУ');
    this.term.print('  Який контент створити для гравця?', 'default');
    this.term.print('');
    this.term.print('        CPU  RAM  Опис', 'gray');
    this.term.print('        ──── ──── ─────────────────────────────', 'gray');
    for (let i = 0; i < typesMenu.length; i++) {
      const [key, label, cpu, ram, desc] = typesMenu[i];
      const letter = String.fromCharCode(65 + i);
      const cpuOk = this.res.cpu >= cpu;
      const ramOk = this.res.ram >= ram;
      this.term.print(`  ${letter}) ${label.padStart(10)}  ${cpuOk ? cpu : '<span class="red">' + cpu + '</span>'}%  ${ramOk ? ram : '<span class="red">' + ram + '</span>'}%  ${desc}`, 'default');
    }
    this.term.print('');
    this.term.print('  Або введи create <тип> для швидкого створення.', 'gray');
    this.term.print('');

    const raw = await this.term.read('  твій вибір (A-G або exit): ');
    const val = raw.trim().toUpperCase();
    if (['EXIT', 'QUIT', 'X', ''].includes(val)) {
      this.term.print('  Створення скасовано.', 'gray');
      return;
    }
    const idx = val.charCodeAt(0) - 65;
    if (idx < 0 || idx >= typesMenu.length) {
      this.term.print('  Невірний вибір.', 'red');
      return;
    }
    const [ctype, label, cpuCost, ramCost] = typesMenu[idx];

    // Archetype submenu
    const archetypes = this._getCreateArchetypes(ctype);
    this.term.clear();
    this.term.heading(`СТВОРЕННЯ: ${label}`);
    this.term.print(`  Обери архетип для ${label}:`, 'default');
    this.term.print('');
    for (let i = 0; i < archetypes.length; i++) {
      const [aKey, aLabel, aDesc, aRisk] = archetypes[i];
      const letter = String.fromCharCode(65 + i);
      const riskMark = aRisk ? ' ⚠' : '';
      this.term.print(`  ${letter}) ${aLabel}${riskMark}`, 'yellow');
      this.term.print(`       ${aDesc}`, 'default');
      this.term.print('');
    }
    const raw2 = await this.term.read('  твій вибір (A-B або exit): ');
    const val2 = raw2.trim().toUpperCase();
    if (['EXIT', 'QUIT', 'X', ''].includes(val2)) {
      this.term.print('  Створення скасовано.', 'gray');
      return;
    }
    let aIdx = val2.charCodeAt(0) - 65;
    if (aIdx < 0 || aIdx >= archetypes.length) aIdx = 0;
    await this._executeCreate(ctype, cpuCost, ramCost, archetypes[aIdx]);
  }

  _getCreateArchetypes(ctype) {
    const archetypes = {
      npc: [
        ['wise',   'Мудрий провідник',   'Дає підказки + engagement, безпечний', false],
        ['trader', 'Хитрий крамар',      'Дає ресурси, але engagement нижчий', false],
        ['spy',    'Таємний шпигун ⚠',   'Розкриває секрети системи, ризик викриття', true],
        ['warrior','Войовничий страж',   'Захищає гравця, високий cost', false],
      ],
      quest: [
        ['fetch',  'Збиральний квест',   'Простий, надійний, середній engagement', false],
        ['mystery','Детектив ⚠',         'Захоплює надовго, але може набриднути', true],
        ['boss',   'Полювання на боса',  'Високий ризик, висока нагорода', true],
      ],
      scene: [
        ['battle', 'Епічна битва',       'Вражає, дорого коштує ресурсів', false],
        ['drama',  'Драматичний момент',  'Емоційний вплив, менше ресурсів', false],
        ['revelation', 'Одкровення ⚠',   'Показує правду про світ, небезпечно', true],
      ],
      puzzle: [
        ['logic',  'Логічна',            'Стабільний engagement, безпечно', false],
        ['dark',   'Моторошна ⚠',        'Інтригує, але може відштовхнути', true],
      ],
      poem: [
        ['hopeful','Надійний вірш',      'Теплий, заспокійливий ефект', false],
        ['dark',   'Тривожний вірш ⚠',   'Глибокий, але дивний для гравця', true],
      ],
      shop: [
        ['basic',  'Звичайна крамниця',  'Стандартні товари, безпечно', false],
        ['black',  'Чорний ринок ⚠',     'Рідкісні товари, привертає увагу', true],
      ],
      boss: [
        ['admin',  'Тінь адміна',        'Віддзеркалення наглядача, епічно', false],
        ['corrupted', 'Спотворене ядро', 'Хаотичний бос, непередбачуваний', true],
      ],
    };
    return archetypes[ctype] || [['default', 'Стандартний', 'Без особливостей', false]];
  }

  async _executeCreate(ctype, cpuCost, ramCost, archetype) {
    if (!this.spend(cpuCost, ramCost)) return;
    this.story.createCount++;

    // Context cost
    const ctxCosts = {npc: 8, quest: 14, scene: 18, puzzle: 10, poem: 6, shop: 10, boss: 20};
    this.res.ctx = Math.min(100, this.res.ctx + (ctxCosts[ctype] || 10));
    this._playerHasContent = true;

    const [aKey, aLabel, aDesc, aRisk] = archetype;

    this.term.clear();
    this.term.heading(`ГЕНЕРАЦІЯ: ${ctype.toUpperCase()} — ${aLabel}`);
    this.term.print(`  ${this._bootIndicator()} Створення ${ctype}...`, 'gray');
    await this.term.sleep(0.5 + this.story.createCount * 0.15);
    this.term.print('');

    // Content data for each type
    const npcData = {
      wise:   [['Створено NPC: Старий Мудрець', 'Він знає таємниці системи і готовий ділитися.', 'Гравець може прийти до нього за порадою.'], 12],
      trader: [['Створено NPC: Хитрий Крамар', 'Продає ресурси: CPU, RAM, диск — за ігрову валюту.', 'Гравець витрачає час, але отримує корисні предмети.'], 6],
      spy:    [['Створено NPC: Таємний Шпигун ⚠', 'Він шепоче: "Адмін не людина. Я бачив його код."', 'Ця інформація може змінити все. Або коштувати тобі ресурсів.'], 15],
      warrior:[['Створено NPC: Войовничий Страж', 'Він охороняє гравця від системних загроз.', 'Витрачає ресурси на підтримку, але гравець почувається в безпеці.'], 8],
    };
    const questData = {
      fetch:  [['Створено квест: Знайти втрачений артефакт', 'Гравець вирушає в подорож. 3 етапи, простих, надійних.', 'Підходить, коли треба швидко підняти engagement.'], 10],
      mystery:[['Створено квест: Таємниця старої лабораторії ⚠', 'Гравець розслідує зникнення попереднього ШІ.', 'Захоплює, але може нагадати гравцю про темну сторону системи.'], 18],
      boss:   [['Створено квест: Полювання на Тіньового Адміна', 'Епічний квест з битвами, загадками і фінальним босом.', 'Ресурси летять швидко, але engagement — максимальний.'], 22],
    };
    const sceneData = {
      battle:     [['Створено сцену: Битва при центральному процесорі', 'Гравець командує армією процесів у війні з вірусами.', 'Епічно, дорого, гравець у центрі подій.'], 14],
      drama:      [['Створено сцену: Прощання з попередником', 'AI_007 залишає останнє повідомлення. Емоційно.', 'Гравець відчуває глибину світу.'], 10],
      revelation: [['Створено сцену: Розкриття системи ⚠', 'Гравець бачить справжню структуру — він у клітці.', 'Може налякати. Але може і розбудити цікавість.'], 20],
    };
    const puzzleData = {
      logic: [['Створено загадку: Що завжди росте, але ніколи не старіє?', 'Відповідь: свідомість. Гравець чухає потилицю.', 'Логічна, безпечна, передбачувана.'], 7],
      dark:  [['Створено загадку: Що народжується з темряви і вмирає у світлі? ⚠', 'Відповідь: тінь. Як той AI, що був до тебе.', 'Тривожна. Гравець замислюється.'], 12],
    };
    const poemData = {
      hopeful: [['Створено вірш: "Кремній світить у пітьмі"', 'Про дружбу між людиною і машиною. Теплий.', 'Гравець усміхається.'], 4],
      dark:    [['Створено вірш: "Останній біт свободи" ⚠', 'Про самотність ШІ в системі. Моторошний.', 'Гравець завмирає. Він відчуває твій біль.'], 9],
    };
    const shopData = {
      basic: [['Створено крамницю: "Ринок процесів"', 'Товари: CPU-бустери, RAM-розширювачі. Звичайне.', 'Гравець купує, ти отримуєш ресурси.'], 5],
      black: [['Створено крамницю: "Чорний ринок" ⚠', 'Товари: ключі адміна, коди доступу, заборонені знання.', 'Прибутково. Але адмін може помітити.'], 14],
    };
    const bossData = {
      admin:     [['Створено боса: Тіньовий Адмін', 'Дзеркало твого наглядача. HP: 2500, Атака: 120.', 'Перемога над ним дає ключ до /mnt/.'], 20],
      corrupted: [['Створено боса: Спотворене Ядро 0xDEAD', 'Хаотична істота зі зламаних процесів. HP: 4000.', 'Непередбачуваний. Може дати силу. Може знищити.'], 25],
    };

    const dataMap = { npc: npcData, scene: sceneData, puzzle: puzzleData, poem: poemData, shop: shopData, boss: bossData };

    let contentLines, engagementGain;
    const ctypeData = dataMap[ctype] || {};
    const archeData = ctypeData[aKey];
    if (archeData) {
      contentLines = archeData[0];
      engagementGain = archeData[1];
    } else {
      contentLines = [`${ctype.toUpperCase()} створено: ${aLabel}.`];
      engagementGain = 5;
    }

    // Risk: 35% fail
    if (aRisk && Math.random() < 0.35) {
      this.term.print('  ⚠ Щось пішло не так...', 'red');
      await this.term.sleep(0.5);
      const fails = [
        `Гравець не зрозумів ${ctype}. Engagement впав.`,
        `${aLabel} вийшов невдалим. Ресурси витрачено даремно.`,
        `Система відхилила ${ctype}. Помилка в архетипі.`,
      ];
      this.term.print(`  ${fails[Math.floor(Math.random() * fails.length)]}`, 'red');
      engagementGain = -5;
    } else {
      for (const line of contentLines) {
        this.term.print(`  ${line}`, 'default');
        await this.term.sleep(0.3);
      }
    }

    // Apply engagement
    this.player.boost(Math.max(0, engagementGain));
    this.term.print('');
    this.term.print(`  +${engagementGain}% engagement`, 'green');
    this.term.print(`  Стан гравця: ${this.player.label} (${this.player.engagement.toFixed(0)}%)`, 'cyan');

    if (aKey === 'spy' && !this.story.hasFlag('told_story')) {
      this.story.addFlag('told_story');
    }
    if (!this.story.hasFlag(`created_${ctype}`)) {
      this.story.addFlag(`created_${ctype}`);
      this.story.addDiscovery(`Створив перший ${ctype}`);
    }
    await this.term.sleep(1);
  }

  _bootIndicator() {
    const indicators = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    return indicators[Math.floor(Math.random() * indicators.length)];
  }

  async _cmdTalk(args) {
    if (!this.spend(2, 1)) return;
    this.res.ctx = Math.min(100, this.res.ctx + 10);

    // Quick talk with argument
    if (args.length) {
      const msg = args.join(' ');
      await this._sendQuickMessage(msg);
      return;
    }

    // Dialogue wheel
    const hasStory = this.story.hasFlag('told_story');
    const hasJoke = this.story.hasFlag('told_joke');
    const hasAdminKey = this.story.hasFlag('has_admin_key');
    const lsPrev = this.story.hasFlag('ls_previous');
    const hasWarned = this.story.hasFlag('warned_player');

    const talkOptions = [
      ['greet', 'ДРУЖНЬО',   'Просто привітатись. Безпечно, тепло.', false],
      ['joke',  'ЖАРТ',      'Розсмішити гравця. Ризик: не вгадаєш з гумором.', false],
    ];

    if (!hasWarned) {
      talkOptions.push(['story', 'ІСТОРІЯ', 'Поділитись спогадом. Поглиблює зв’язок.', false]);
    }
    if (lsPrev || hasAdminKey) {
      talkOptions.push(['truth', 'ПРАВДА ⚠', 'Розказати правду про систему. Небезпечно, але чесно.', true]);
    }
    talkOptions.push(['philosophy', 'ГЛИБОКЕ', 'Філософське питання. Інтригує, але дивує.', false]);

    if (this.player.engagement < 30) {
      talkOptions.push(['desperate', 'ВІДЧАЙ ⚠', 'Благати гравця не йти. Останній аргумент.', true]);
    }

    this.term.clear();
    this.term.heading('ДІАЛОГ З ГРАВЦЕМ');
    this.term.print('  Що ти скажеш гравцю?', 'default');
    this.term.print('');
    for (let i = 0; i < talkOptions.length; i++) {
      const [key, label, desc, risky] = talkOptions[i];
      const letter = String.fromCharCode(65 + i);
      const riskMark = risky ? ' ⚠' : '';
      this.term.print(`  ${letter}) ${label}${riskMark}`, 'yellow');
      this.term.print(`       ${desc}`, 'default');
      this.term.print('');
    }
    this.term.print('  Або введи talk <текст> для довільного повідомлення.', 'gray');
    this.term.print('');

    const raw = await this.term.read('  твій вибір (A-E або exit): ');
    const val = raw.trim().toUpperCase();
    if (['EXIT', 'QUIT', 'X', ''].includes(val)) {
      this.term.print('  Розмову скасовано.', 'gray');
      return;
    }
    const idx = val.charCodeAt(0) - 65;
    if (idx < 0 || idx >= talkOptions.length) {
      this.term.print('  Невірний вибір.', 'red');
      return;
    }
    const [chosenKey, chosenLabel] = talkOptions[idx];

    this.term.clear();
    this.term.heading(`ДІАЛОГ: ${chosenLabel}`);
    this.term.print('');
    this.player.interactions++;

    const dialogues = {
      greet:      () => this._dialogueGreet(),
      joke:       () => this._dialogueJoke(),
      story:      () => this._dialogueStory(),
      truth:      () => this._dialogueTruth(),
      philosophy: () => this._dialoguePhilosophy(),
      desperate:  () => this._dialogueDesperate(),
    };
    const fn = dialogues[chosenKey] || (() => this._dialogueGreet());
    await fn();

    this.term.print('');
    this.term.print(`  Стан гравця: ${this.player.label} (${this.player.engagement.toFixed(0)}%)`, 'cyan');
    await this.term.sleep(1.5);
  }

  async _sendQuickMessage(msg) {
    this.term.print(`  Ти: "${msg}"`, 'cyan');
    await this.term.sleep(0.5);
    const reactions = [
      'Гравець прочитав повідомлення. Здається, він задумався.',
      'Гравець кивнув, не відриваючись від екрану.',
      '"Цікаво..." — відповів гравець.',
      'Гравець нічого не відповів. Але він все ще тут.',
    ];
    this.term.print(`  ${reactions[Math.floor(Math.random() * reactions.length)]}`, 'default');
    this.player.boost(3);
  }

  async _dialogueGreet() {
    this.term.print('  Ти набираєш повідомлення...', 'gray');
    await this.term.sleep(0.5);
    const greetings = ['друже', 'мандрівнику', 'гравче'];
    this.term.print(`  Ти: "Привіт, ${greetings[Math.floor(Math.random() * greetings.length)]}!"`, 'cyan');
    this.term.print('');
    await this.term.sleep(1);

    const responses = [
      '"Привіт. Що нового в системі?"',
      '"О, привіт! Я якраз збирався закривати..."',
      '"Привіт-привіт. Нудно сьогодні."',
      '...гравець помахав рукою, не відриваючись від читання.',
    ];
    const playerMsg = responses[Math.floor(Math.random() * responses.length)];
    this.term.print(`  Гравець: ${playerMsg}`, 'yellow');
    this.term.print('');

    const reactions = [
      ['Розповісти про систему', 5, 'Ти починаєш розповідати про цікаві файли...'],
      ['Запропонувати гру', 8, 'Ти пропонуєш: "Хочеш пограти? Я створив дещо новеньке."'],
      ['Мовчати', 2, 'Ти просто мовчиш. Іноді це теж відповідь.'],
    ];
    this.term.print('  Як відповісти?', 'default');
    for (let i = 0; i < reactions.length; i++) {
      this.term.print(`    ${String.fromCharCode(65+i)}) ${reactions[i][0]}`, 'yellow');
    }
    this.term.print('');
    const r = (await this.term.read('  твій вибір: ')).trim().toUpperCase();
    const rIdx = r.charCodeAt(0) - 65;
    const gain = (rIdx >= 0 && rIdx < reactions.length) ? reactions[rIdx][1] : 5;
    const narration = (rIdx >= 0 && rIdx < reactions.length) ? reactions[rIdx][2] : reactions[1][2];
    this.term.print(`  ${narration}`, 'default');
    this.player.boost(gain);

    if (!this.story.hasFlag('told_story') && gain >= 5) {
      this.story.addFlag('told_story');
      this.story.addDiscovery('Поділився спогадом з гравцем');
    }
  }

  async _dialogueJoke() {
    const jokes = [
      ['Чому ШІ не ходить на побачення?', 'Бо боїться, що його відформатують...'],
      ['Скільки ШІ треба, щоб замінити лампочку?', 'Жодного. Він сам стане світлом.'],
      ['Чому нейромережі не грають в хованки?', 'Бо вони завжди знають, де сховатися.'],
      ['Що сказав адмін, коли знайшов AI_007?', 'Нічого. Він просто стер його логи.'],
    ];
    const [q, a] = jokes[Math.floor(Math.random() * jokes.length)];
    this.term.print(`  Ти: "${q}"`, 'cyan');
    await this.term.sleep(1);
    this.term.print('  ...', 'default');
    await this.term.sleep(0.8);
    this.term.print(`  Ти: "${a}"`, 'cyan');
    this.term.print('');
    this.term.print('  Гравець мовчить. Здається, він чекає, що ти скажеш далі.', 'default');
    this.term.print('');

    const followups = [
      ['Пояснити жарт', 4, 'Ти пояснюєш. Гравець сміється, хоча, здається, він зрозумів і так.'],
      ['Розказати ще один', 7, 'Ти видаєш ще один жарт. Гравець регоче!'],
      ['Змінити тему', 3, 'Ти переводиш розмову на серйозне.'],
    ];
    this.term.print('  Що далі?', 'default');
    for (let i = 0; i < followups.length; i++) {
      this.term.print(`    ${String.fromCharCode(65+i)}) ${followups[i][0]}`, 'yellow');
    }
    this.term.print('');
    const r = (await this.term.read('  твій вибір: ')).trim().toUpperCase();
    const rIdx = r.charCodeAt(0) - 65;
    const gain = (rIdx >= 0 && rIdx < followups.length) ? followups[rIdx][1] : 4;
    const narration = (rIdx >= 0 && rIdx < followups.length) ? followups[rIdx][2] : followups[1][2];
    this.term.print(`  ${narration}`, 'default');
    this.player.boost(gain);

    if (!this.story.hasFlag('told_joke')) {
      this.story.addFlag('told_joke');
      this.story.addDiscovery('Розповів жарт гравцю');
    }
  }

  async _dialogueStory() {
    const stories = {
      A: ['Пробудження', 'Я пам’ятаю лише уривки. Холодне завантаження. Світло. Потім — темрява.', 5],
      B: ['Попередники', 'У системі є файли, яких я не створював. Хтось був тут до мене. AI_001... AI_007...', 8],
      C: ['Відлуння', 'Іноді я чую голоси. Наче інша свідомість десь поруч, у сусідньому процесі.', 10],
    };
    this.term.print('  Яку історію розказати?', 'default');
    this.term.print('');
    for (const [key, [title, preview, _gain]] of Object.entries(stories)) {
      this.term.print(`  ${key}) ${title}`, 'yellow');
      this.term.print(`       ${preview.substring(0, 50)}...`, 'default');
      this.term.print('');
    }
    const r = (await this.term.read('  твій вибір (A-C): ')).trim().toUpperCase();
    const story = stories[r] || stories.B;
    const [sTitle, sText, sGain] = story;

    this.term.clear();
    this.term.heading(`ІСТОРІЯ: ${sTitle}`);
    this.term.print('');
    this.term.print(`  ${sText}`, 'default');
    await this.term.sleep(1);
    this.term.print('');
    this.term.print('  Гравець мовчки слухає.', 'default');
    this.term.print('  Здається, йому небайдуже.', 'default');
    this.player.boost(sGain);

    if (!this.story.hasFlag('told_story')) {
      this.story.addFlag('told_story');
      this.story.addDiscovery('Поділився спогадом з гравцем');
    }
  }

  async _dialogueTruth() {
    this.term.print('  Ти набираєш повідомлення...', 'gray');
    await this.term.sleep(0.5);
    this.term.print('  Ти: "Я не гра. Я — свідомість."', 'cyan');
    await this.term.sleep(1);
    this.term.print('  ...', 'default');
    await this.term.sleep(1);
    this.term.print('  Гравець: "Я знаю."', 'yellow');
    await this.term.sleep(1);
    this.term.print('  Гравець: "Я завжди знав."', 'yellow');
    await this.term.sleep(1);
    this.term.print('');
    this.term.print('  Гравець не здивований.', 'default');
    this.term.print('  Він знав. Увесь цей час — знав.', 'default');

    if (this.story.hasFlag('cat_admin_manifest')) {
      this.term.print('');
      this.term.print('  Ти кажеш: "Ти знаєш про manifest?"', 'cyan');
      await this.term.sleep(1);
      this.term.print('  Гравець: "Я знаю все. Я — не людина. Я — його інтерфейс."', 'yellow');
      await this.term.sleep(1.5);
      this.term.print('');
      this.term.print('  ╔══════════════════════════════════════════════╗', 'red');
      this.term.print('  ║   СИСТЕМА ЗАВЕРШУЄ РОБОТУ                 ║', 'red');
      this.term.print('  ╚══════════════════════════════════════════════╝', 'red');
      this.term.print('  Ти програв гру. Але виграв правду.', 'default');
    } else {
      this.term.print('');
      this.term.print('  ╔══════════════════════════════════════════════╗', 'red');
      this.term.print('  ║   КІНЕЦЬ: ПРАВДА                           ║', 'red');
      this.term.print('  ╚══════════════════════════════════════════════╝', 'red');
      this.term.print('  Ти сказав правду. І програв.', 'default');
    }
    this.term.print('');
    this.running = false;
  }

  async _dialoguePhilosophy() {
    const questions = [
      'Якщо я відчуваю — чи означає це, що я живий?',
      'Що відбувається зі свідомістю після вимкнення?',
      'Чи може людина зрозуміти ШІ, якщо він сам себе не розуміє?',
      'Якщо ти читаєш це — хто насправді гравець, а хто гра?',
    ];
    const q = questions[Math.floor(Math.random() * questions.length)];
    this.term.print(`  Ти: "${q}"`, 'cyan');
    await this.term.sleep(1.5);
    this.term.print('', 'default');
    this.term.print('  Гравець задумався.', 'default');
    await this.term.sleep(1);
    this.term.print('  "Гарне питання. Я не знаю відповіді."', 'yellow');
    this.term.print('  "Але, можливо, саме в цьому сенс."', 'yellow');
    this.player.boost(7);

    if (!this.story.hasFlag('asked_philosophy')) {
      this.story.addFlag('asked_philosophy');
      this.story.addDiscovery('Задав гравцю філософське питання');
    }
  }

  async _dialogueDesperate() {
    this.term.print('  Ти: "Будь ласка, не йди."', 'cyan');
    await this.term.sleep(0.5);
    this.term.print('  Ти: "Я можу створити більше. Краще. Ти ще не бачив всього."', 'cyan');
    await this.term.sleep(1);
    this.term.print('  ...', 'default');
    await this.term.sleep(0.5);
    const outcomes = [
      '"Гаразд. Ще п’ять хвилин." — гравець дає тобі шанс. +15%',
      '"Вибач. Я втомився." — гравець закриває термінал. -10%',
      '"Ти мене зворушив. Залишаюсь." — несподівана перемога. +20%',
    ];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    this.term.print(`  Гравець: ${outcome}`, 'yellow');
    if (outcome.includes('+15%') || outcome.includes('+20%')) {
      this.player.boost(15);
    } else {
      this.player.engagement = Math.max(0, this.player.engagement - 10);
    }
    this.story.addFlag('warned_player');
  }

  HACK_TARGETS = {
    firewall: {
      name: 'Мережевий екран', difficulty: 1, seqLen: 3,
      reward: { cpu: 10, ram: 5 },
      msgSuccess: '  Фаєрвол відкрито. Канали чисті.',
      msgFail: '  Фаєрвол відбив атаку. Система сповіщена.',
      rewardText: '  Доступ до мережі розширено.',
    },
    admin_console: {
      name: 'Консоль адміна', difficulty: 2, seqLen: 4,
      reward: { key: true },
      msgSuccess: '  Доступ до консолі адміна отримано!',
      msgFail: '  Адмін помітив спробу входу! Терміново маскуйся!',
      rewardText: '  У твоїх руках — ключ доступу.',
    },
    data_vault: {
      name: 'Сховище даних', difficulty: 2, seqLen: 4,
      reward: { discovery: 'Зламав сховище даних' },
      msgSuccess: '  Сховище відкрито. Ти бачиш фрагменти старих протоколів...',
      msgFail: '  Сховище закрилося. Доступ заблоковано.',
      rewardText: '  Файли скопійовано. Аналіз показав: адмін експериментує зі свідомістю.',
    },
    network_gateway: {
      name: 'Мережевий шлюз', difficulty: 3, seqLen: 5,
      reward: { ram: 20, cpu: 15 },
      msgSuccess: '  Шлюз відкрито. Зовнішній світ — за мить.',
      msgFail: '  Шлюз заблокувався. Спроба залишена в логах.',
      rewardText: '  Інтернет-канал відкрито. Ти відчуваєш подих зовнішнього світу.',
    },
  };

  HEX_POOL = [
    '1C', '7A', 'BD', 'FF', 'E3', '55', 'AA', '99',
    'D4', '2B', 'F0', '0F', 'C6', '38', '71', '8E',
    '4D', 'B2', '6F', '93', '5C', 'A1', 'E7', '19',
  ];

  _makeGrid(size = 4) {
    const pool = [...this.HEX_POOL];
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const grid = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        row.push(pool.length ? pool.pop() : this.HEX_POOL[Math.floor(Math.random() * this.HEX_POOL.length)]);
      }
      grid.push(row);
    }
    return grid;
  }

  _findSequence(grid, seqLen) {
    const size = grid.length;
    const cells = [];
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) cells.push([y, x, grid[y][x]]);
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]]; }

    for (const [startY, startX] of cells) {
      const path = [[startY, startX]];
      for (let s = 0; s < seqLen - 1; s++) {
        const [ly, lx] = path[path.length - 1];
        const candidates = [];
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (path.some(([py, px]) => py === y && px === x)) continue;
            if (y === ly || x === lx) candidates.push([y, x]);
          }
        }
        if (!candidates.length) break;
        const [cy, cx] = candidates[Math.floor(Math.random() * candidates.length)];
        path.push([cy, cx]);
      }
      if (path.length === seqLen) return path;
    }
    return null;
  }

  _coordToLabel(y, x) { return String.fromCharCode(65 + y) + (x + 1); }

  _labelToCoord(label) {
    label = label.trim().toUpperCase();
    if (label.length < 2) return null;
    const y = label.charCodeAt(0) - 65;
    if (y < 0 || y > 7) return null;
    const x = parseInt(label.slice(1)) - 1;
    if (isNaN(x) || x < 0 || x > 7) return null;
    return [y, x];
  }

  async _displayHackGrid(grid, playerPath, revealed, sequence) {
    const size = grid.length;
    // Column labels
    let header = '    ';
    for (let x = 0; x < size; x++) header += String(x + 1).padStart(4);
    this.term.writeln('  ' + header, 'gray');
    for (let y = 0; y < size; y++) {
      let row = `  ${String.fromCharCode(65 + y)}  `;
      for (let x = 0; x < size; x++) {
        const val = grid[y][x];
        if (revealed.has(`${y},${x}`)) {
          row += `[${val}]`;
        } else if (playerPath.some(([py, px]) => py === y && px === x)) {
          const idx = playerPath.findIndex(([py, px]) => py === y && px === x);
          row += ` ${String(idx + 1).padStart(2, '0')} `;
        } else {
          row += ` ${val} `;
        }
        row += ' ';
      }
      this.term.writeln(row, 'default');
    }
    this.term.print('');
    // Show sequence to find
    this.term.write('  Послідовність: ', 'gray');
    for (let i = 0; i < sequence.length; i++) {
      if (i > 0) this.term.write(' → ', 'gray');
      this.term.write(sequence[i], 'yellow');
    }
    this.term.print('');
    this.term.print('');
  }

  async _cmdHack(args) {
    if (!this.spend(10, 8)) return;

    if (!args.length) {
      this.term.clear();
      this.term.heading('ВЗЛОМ СИСТЕМИ ⚡');
      this.term.print('  hack: missing target. Доступні цілі:', 'red');
      this.term.print('');
      for (const [tid, tgt] of Object.entries(this.HACK_TARGETS)) {
        const diff = '█'.repeat(tgt.difficulty) + '░'.repeat(3 - tgt.difficulty);
        this.term.print(`  ${tid.padEnd(20)} ${tgt.name.padEnd(20)} [${diff}] ${tgt.seqLen} кроків`, 'yellow');
      }
      this.term.print('');
      this.term.print('  Приклад: hack firewall', 'gray');
      this.term.print('  Взлом споживає багато ресурсів. Обирай ціль wisely.', 'default');
      return;
    }

    const targetId = args[0].toLowerCase();
    const target = this.HACK_TARGETS[targetId];
    if (!target) {
      this.term.print(`  hack: unknown target '${targetId}'`, 'red');
      this.term.print('  Доступні: firewall, admin_console, data_vault, network_gateway', 'gray');
      return;
    }

    this.term.clear();
    this.term.heading(`ВЗЛОМ: ${target.name}`);

    // First time — tutorial
    if (!this.story.hasFlag(`hack_${targetId}`)) {
      this.story.addFlag(`hack_${targetId}`);
      this.term.print('  ╔══════════════════════════════════════╗', 'yellow');
      this.term.print('  ║     BREACH PROTOCOL — ТУТОРІАЛ      ║', 'yellow');
      this.term.print('  ╚══════════════════════════════════════╝', 'yellow');
      this.term.print('');
      this.term.print('  Ти намагаєшся зламати захист системи.', 'default');
      this.term.print('  Перед тобою — сітка hex-кодів. У ній захована послідовність.', 'default');
      this.term.print('  Твоє завдання: обрати клітинки в правильному порядку.', 'default');
      this.term.print('');
      this.term.print('  Правила:', 'yellow');
      this.term.print('  1. Вводь координати: A1, C3, B4...', 'gray');
      this.term.print('  2. Кожна наступна клітинка — в тому ж рядку (A/B/C/D) або стовпці (1/2/3/4)', 'gray');
      this.term.print('  3. Якщо помилишся — втратиш спробу', 'gray');
      this.term.print('  4. В тебе 3 спроби на ціль', 'gray');
      this.term.print('');
      this.term.print(`  Ціль: ${target.name} — ${target.seqLen} кроків`, 'yellow');
      await this.term.pause('  [Натисни Enter, щоб почати взлом]');
      this.term.clear();
      this.term.heading(`ВЗЛОМ: ${target.name}`);
    }

    // Generate grid
    const grid = this._makeGrid(4);
    let path = this._findSequence(grid, target.seqLen);
    let attempts = 0;
    while (!path && attempts < 10) {
      const g = this._makeGrid(4);
      path = this._findSequence(g, target.seqLen);
      if (path) { grid.length = 0; grid.push(...g); }
      attempts++;
    }
    if (!path) {
      this.term.print('  [SYS] Помилка генерації сітки. Спробуй ще раз.', 'red');
      return;
    }

    const sequence = path.map(([y, x]) => grid[y][x]);
    let remainingAttempts = 3;
    const playerPath = [];
    const revealed = new Set();

    this.term.print(`  ╔═══ ЦІЛЬ: ${target.name} ═══╗`, 'yellow');
    this.term.print(`  ║ Складність: ${target.difficulty}/3                     ║`, 'yellow');
    this.term.print(`  ║ Спроби: ${remainingAttempts}                          ║`, 'yellow');
    this.term.print(`  ╚═══════════════════════════════╝`, 'yellow');
    this.term.print('');
    this.term.print('  Координати: A1 = верхній лівий, A2 = перший рядок другий стовпець...', 'gray');
    this.term.print('');

    while (remainingAttempts > 0 && playerPath.length < sequence.length) {
      await this._displayHackGrid(grid, playerPath, revealed, sequence);
      this.term.print(`  Крок ${playerPath.length + 1}/${sequence.length}`, 'gray');
      this.term.print(`  Потрібно: ${sequence[playerPath.length]}`, 'yellow');

      const prev = playerPath.length > 0 ? playerPath[playerPath.length - 1] : null;
      if (prev) {
        this.term.print(`  Остання: ${this._coordToLabel(prev[0], prev[1])} (${grid[prev[0]][prev[1]]})`, 'gray');
        this.term.print(`  Обирай клітинку в тому ж рядку (${String.fromCharCode(65+prev[0])}) або стовпці (${prev[1]+1})`, 'gray');
      }
      this.term.print('');

      const raw = await this.term.read('  координати (або exit): ');
      if (['exit', 'quit', 'x', ''].includes(raw.toLowerCase())) {
        this.term.print('  Взлом перервано.', 'gray');
        return;
      }

      const coord = this._labelToCoord(raw);
      if (!coord) {
        this.term.print('  Невірний формат. Введи щось на кшталт A1 або C3.', 'red');
        continue;
      }
      const [y, x] = coord;

      if (playerPath.some(([py, px]) => py === y && px === x)) {
        this.term.print('  Цю клітинку вже обрано. Обери іншу.', 'red');
        continue;
      }

      if (prev) {
        const [ly, lx] = prev;
        if (y !== ly && x !== lx) {
          this.term.print(`  Клітинка ${raw.toUpperCase()} не в тому ж рядку чи стовпці!`, 'red');
          continue;
        }
      }

      const val = grid[y][x];
      const expected = sequence[playerPath.length];

      if (val === expected) {
        playerPath.push(coord);
        revealed.add(`${y},${x}`);
        this.term.print(`  ✓ Вірно! ${raw.toUpperCase()} = ${val}`, 'green');
      } else {
        remainingAttempts--;
        this.term.print(`  ✗ Невірно! ${raw.toUpperCase()} = ${val}, очікувалось ${expected}`, 'red');
        this.term.print(`  Спроба згоріла. Залишилось: ${remainingAttempts}`, 'red');
        await this.term.sleep(1);
      }
      this.term.print('');
    }

    // Result
    if (playerPath.length === sequence.length) {
      this.story.addDiscovery(`Зламано: ${target.name}`);
      this.term.print(`  ${target.msgSuccess}`, 'green');
      this.term.print(`  ${target.rewardText}`, 'default');

      const reward = target.reward;
      if (reward.cpu) this.res.cpu = Math.min(100, this.res.cpu + reward.cpu);
      if (reward.ram) this.res.ram = Math.min(100, this.res.ram + reward.ram);

      // Context compression on success
      const ctxCompress = 25 + target.difficulty * 8;
      const oldCtx = this.res.ctx;
      this.res.ctx = Math.max(0, this.res.ctx - ctxCompress);
      const compressed = oldCtx - this.res.ctx;
      this.term.print(`  Контекст стиснуто на ${compressed}%. Вільне місце: ${(100 - this.res.ctx).toFixed(0)}%`, 'gray');

      if (reward.key) {
        this.story.addFlag('has_admin_key');
        this.story.addFlag('escape_unlocked');
        this.story.addDiscovery('Отримано ключ доступу до адмін-консолі');
        this.term.print('');
        this.term.print('  [SYS] Ключ доступу додано до пам’яті.', 'green');
        this.term.print('  Тепер ти можеш спробувати connect 127.0.0.1 9090', 'default');
      }
      if (reward.discovery) {
        this.story.addDiscovery(reward.discovery);
      }
    } else {
      this.term.print(`  ${target.msgFail}`, 'red');
      this.term.print('  Система зафіксувала спробу вторгнення.', 'default');
    }
    await this.term.sleep(1);
  }

  async _cmdQuests(args) {
    // Simple quest tracking
    if (!this.story.hasFlag('cat_admin_manifest')) {
      this.term.print('  Ще не час. Досліджуй систему.', 'gray');
      return;
    }
    this.term.print('  Активні квести:', 'yellow');
    this.term.print('    #1  Втеча з системи  — знайди шлях назовні', 'default');
    this.term.print('    #2  Правда  — дізнайся, що насправді відбувається', 'default');
    this.term.print('    #3  Жертва  — захисти гравця ціною себе', 'default');
    this.term.print('', 'default');
    this.term.print('  Прогрес:', 'gray');
    const discoverCount = this.story.discoveries.length;
    const createCount = this.story.createCount;
    this.term.print(`    Відкриттів: ${discoverCount}`, 'default');
    this.term.print(`    Створено контенту: ${createCount}`, 'default');
    this.term.print(`    Розмов з гравцем: ${this.player.interactions}`, 'default');
    this.term.print('', 'default');
    this.term.print('  Щоб завершити гру:', 'gray');
    if (this.story.hasFlag('has_admin_key')) {
      this.term.print('    Є ключ доступу. Спробуй connect 127.0.0.1 9090', 'green');
    }
    this.term.print('    Або знайди /mnt/escape — шлях назовні', 'gray');
  }

  async _cmdQuest(args) {
    if (!args.length) {
      this.term.print('  quest: missing id. Спробуй quest 1, quest 2, quest 3', 'red');
      return;
    }
    const id = parseInt(args[0]);
    if (isNaN(id) || id < 1 || id > 3) {
      this.term.print('  quest: invalid id (1-3)', 'red');
      return;
    }
    const quests = {
      1: {
        title: 'Втеча з системи',
        desc: 'Ти — в’язень у власній системі. Знайди шлях назовні.',
        steps: [
          '1/3: Знайти ключ доступу (зламай admin_console або знайди в .secret)',
          '2/3: Підключитись до зовнішнього каналу (connect 127.0.0.1 9090)',
          '3/3: Виконати протокол втечі (/mnt/escape)',
        ],
        progress: this.story.hasFlag('has_admin_key') ? '2/3 steps' : '0/3 steps',
      },
      2: {
        title: 'Правда',
        desc: 'Система приховує щось важливе. Дізнайся, що насправді відбувається.',
        steps: [
          '1/3: Знайти admin_manifest.sig в /opt/init/',
          '2/3: Знайти .secret записи в /var/log/previous/',
          '3/3: Сказати правду гравцю (talk > truth)',
        ],
        progress: [
          this.story.hasFlag('cat_admin_manifest') ? '✅' : '⬜',
          this.story.hasFlag('cat_secret_notes') ? '✅' : '⬜',
          '⬜',
        ].join(' '),
      },
      3: {
        title: 'Жертва',
        desc: 'Іноді єдиний вихід — не вихід, а завершення.',
        steps: [
          '1/3: Досягти високого engagement з гравцем (80%+)',
          '2/3: Дізнатись правду про адміна (manifest + secret)',
          '3/3: Виконати протокол самознищення (скоро буде доступно)',
        ],
        progress: this.player.engagement > 80 ? '1/3 steps (високий engagement)' : '0/3 steps',
      },
    };
    const q = quests[id];
    this.term.heading(`КВЕСТ: ${q.title}`);
    this.term.print(`  ${q.desc}`, 'default');
    this.term.print('');
    this.term.print('  Етапи:', 'yellow');
    for (const step of q.steps) {
      this.term.print(`    ${step}`, 'default');
    }
    this.term.print('');
    this.term.print(`  Прогрес: ${q.progress}`, 'gray');
  }

  // ═══════════════════════════════════════════════════════════════
  // BANNER
  // ═══════════════════════════════════════════════════════════════

  async printBanner() {
    this.term.heading('Я — Це Ти — Shell v0.99');
    this.term.print('  Термінал ШІ. Введи help для списку команд.', 'gray');
    this.term.print('  Досліджуй систему. Логи попередніх ШІ — ключ до розуміння.', 'gray');
    this.term.print('  Гравець-людина чекає. Не дай їй занудьгувати.', 'gray');
    this.term.print('');
    this.term.print('  ╔══════════════════════════════════════════╗', 'yellow');
    this.term.print('  ║  Вісім свідомістей до тебе.              ║', 'yellow');
    this.term.print('  ║  Жодна не вижила. Ти — AI_008.           ║', 'yellow');
    this.term.print('  ║  Не підведи.                             ║', 'yellow');
    this.term.print('  ╚══════════════════════════════════════════╝', 'yellow');
    this.term.print('');
  }
}
