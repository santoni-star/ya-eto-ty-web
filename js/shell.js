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
      ['МЕРЕЖА', ''],
      ['  scan [target]    — сканувати мережу', 'cpu:5 ram:3'],
      ['  ping <host>      — перевірити з\'єднання', 'cpu:2 ram:1'],
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
    this.term.print('  Збереження... (у розробці)', 'gray');
    await this.term.sleep(0.5);
    this.term.print('  [SYS] Стан збережено.', 'green');
  }

  async _cmdLoad(args) {
    this.term.print('  Завантаження... (у розробці)', 'gray');
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
        this.term.print('  [SYS] Запуск admin_console.html...', 'default');
      } else {
        this.term.print('  [SYS] Доступ заборонено. Потрібен ключ.', 'red');
        this.term.print('  [SYS] Спробуй зламати адмін-консоль через hack.', 'default');
      }
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
    if (!args.length) {
      this.term.print('  create: missing type. Типи: npc, quest, scene, puzzle, poem, shop, boss', 'red');
      return;
    }
    this.term.print('  create: у розробці (JS port Phase 4)', 'yellow');
  }

  async _cmdTalk(args) {
    if (!this.spend(2, 1)) return;
    this.term.print('  talk: у розробці (JS port Phase 4)', 'yellow');
  }

  async _cmdHack(args) {
    if (!this.spend(10, 8)) return;
    this.term.print('  hack: у розробці (JS port Phase 5)', 'yellow');
  }

  async _cmdQuests(args) {
    this.term.print('  quests: у розробці', 'yellow');
  }

  async _cmdQuest(args) {
    this.term.print('  quest: у розробці', 'yellow');
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
