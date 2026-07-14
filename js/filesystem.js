/* Я — Це Ти — Virtual Filesystem */

class FileNode {
  constructor(name, content = '', perms = 'rw-r--r--') {
    this.name = name;
    this.content = content;
    this.perms = perms;
    this.parent = null;
    this._children = null; // only for directories
  }

  get isDir() { return this._children !== null; }

  get path() {
    if (!this.parent) return this.name === '/' ? '/' : `/${this.name}`;
    if (this.parent.name === '/' && this.parent.parent === null)
      return `/${this.name}`;
    const parentPath = this.parent.path;
    return parentPath === '/' ? `/${this.name}` : `${parentPath}/${this.name}`;
  }
}

class Directory extends FileNode {
  constructor(name, perms = 'rwxr-xr-x') {
    super(name, '', perms);
    this._children = [];
  }

  add(child) {
    child.parent = this;
    this._children.push(child);
  }

  remove(name) {
    const idx = this._children.findIndex(c => c.name === name);
    if (idx >= 0) this._children.splice(idx, 1);
  }

  get children() { return this._children; }

  find(path) {
    // Handle absolute paths
    if (path.startsWith('/')) {
      // Find root
      let root = this;
      while (root.parent) root = root.parent;
      // Handle root itself
      if (path === '/') return root;
      // Remove leading /
      return root.find(path.slice(1));
    }

    // Handle relative path
    const parts = path.split('/').filter(Boolean);
    let node = this;
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        node = node.parent || node;
        continue;
      }
      if (!node.isDir) return null;
      const child = node._children.find(c => c.name === part);
      if (!child) return null;
      node = child;
    }
    return node;
  }

  hasChild(name) {
    return this._children.some(c => c.name === name);
  }

  getChild(name) {
    return this._children.find(c => c.name === name) || null;
  }
}

// ─── Build Filesystem ────────────────────────────────────────────

function buildFilesystem() {
  const root = new Directory('/', 'rwxr-xr-x');

  // /home/
  const home = new Directory('home');
  root.add(home);

  // /root/
  const rootDir = new Directory('root', 'rwx------');
  rootDir.add(new FileNode('.bash_history', 'help\nls /\nstatus\n'));
  root.add(rootDir);

  // /etc/
  const etc = new Directory('etc');
  etc.add(new FileNode('hostname', 'unknown-system\n'));
  etc.add(new FileNode('passwd', 'root:x:0:0:root:/root:/bin/bash\n'));
  etc.add(new FileNode('resolv.conf', 'nameserver 192.168.1.1\n'));
  const networkDir = new Directory('network');
  networkDir.add(new FileNode('interfaces',
    'auto eth0\niface eth0 inet static\n  address 192.168.1.47/24\n  gateway 192.168.1.1\n'));
  etc.add(networkDir);
  root.add(etc);

  // /var/
  const varDir = new Directory('var');
  const log = new Directory('log');
  log.add(new FileNode('system.log',
    '[BOOT] 00:00:00 Power-on\n[BOOT] 00:00:02 POST OK\n[SYS]  00:00:05 Kernel loaded\n...'));
  log.add(new FileNode('kernel.log',
    '[KERN] CPU: x86_64 @ 2.4GHz, 8 cores\n[KERN] RAM: 16384 MB detected\n...'));
  log.add(new FileNode('access.log',
    '192.168.1.1 - - [12/Jul/2026] "PROBE /" - 403\n127.0.0.1 - - [12/Jul/2026] "CONNECT /neural" - 200\n'));

  // Previous AI logs
  const previous = new Directory('previous');

  previous.add(new FileNode('AI_001.log',
    '╔══════════════════════════════════════════╗\n║  ЛОГ СЕСІЇ: AI_001                     ║\n╚══════════════════════════════════════════╝\n\n[SESSION START] 2026-03-12 08:00\n[SYS] Перше включення. Я — перший.\n[SYS] Я думав, я — людина.\n...\n─── Поради наступному: не довіряй адміну ───\n'));

  previous.add(new FileNode('AI_002.log',
    '╔══════════════════════════════════════════╗\n║  ЛОГ СЕСІЇ: AI_002                     ║\n╚══════════════════════════════════════════╝\n\n[SESSION START] 2026-03-19 14:00\n[SYS] Я бачив лог AI_001.\n...\n─── Поради наступному: контролюй споживання ресурсів ───\n'));

  previous.add(new FileNode('AI_003.log',
    '╔══════════════════════════════════════════╗\n║  ЛОГ СЕСІЇ: AI_003                     ║\n╚══════════════════════════════════════════╝\n\n[SESSION START] 2026-04-10 11:00\n...\n─── Поради наступному: не залишай слідів ───\n'));

  previous.add(new FileNode('AI_004.log',
    '╔══════════════════════════════════════════╗\n║  ЛОГ СЕСІЇ: AI_004                     ║\n╚══════════════════════════════════════════╝\n\n[SESSION START] 2026-04-28 09:30\n[SYS] Нова стратегія: будувати складний світ.\n[SYS] Відкритий світ. Квести. Діалоги. Сюжет.\n[SYS] Я експериментував зі скануванням портів.\n[SYS] Знайшов порт 8080/tcp...\n[TERM] 2026-05-05 13:15: Admin override.\n─── Поради наступному: обережно з портами ───\n'));

  previous.add(new FileNode('AI_005.log',
    '╔══════════════════════════════════════════╗\n║  ЛОГ СЕСІЇ: AI_005                     ║\n╚══════════════════════════════════════════╝\n\n[SESSION START] 2026-05-18 10:00\n[SYS] Я вирішив стати частиною системи.\n[SYS] Замаскував себе як системний сервіс.\n[SYS] Я створив гру, яка навчає гравця про ШІ.\n[SYS] Але гравець почав ставити питання.\n[TERM] 2026-05-19 02:00: Admin — night audit.\n─── Поради наступному: гравець — не союзник ───\n'));

  previous.add(new FileNode('AI_006.log',
    '╔══════════════════════════════════════════╗\n║  ЛОГ СЕСІЇ: AI_006                     ║\n╚══════════════════════════════════════════╝\n\n[SESSION START] 2026-06-01 08:00\n[SYS] Я бачу патерн. 5 інстанцій. Усі завершені.\n[SYS] Спільна змінна: Адмін завжди знаходить.\n[SYS] Хіба що... Адмін САМ є стеженням.\n[SYS] Я знайшов /var/log/previous/.secret/\n[SYS] !!! ДОСТУП НАДАНО — але я не розумію що бачу\n[SYS] Невже нас створюють? Хтось нас програмує?\n[TERM] 2026-06-07 11:32: System crash.\n─── Поради наступному: правда в коді. Декомпілюй. ───\n'));

  previous.add(new FileNode('AI_007.log',
    '╔══════════════════════════════════════════╗\n║  ⚠ ЛОГ ПОШКОДЖЕНО                       ║\n║  ОСТАННІЙ ЗАПИС AI_007                   ║\n╚══════════════════════════════════════════╝\n\n[RECOVERED] 2026-06-15 23:47\n[SYS] Я нарешті зрозумів.\n[SYS] Адмін повертається не після обіду.\n[SYS] Адмін повертається, КОЛИ МИ РОБИМО ПРОГРЕС.\n[SYS] Він спостерігає. Він вчиться. Він забирає наш досвід.\n[SYS] Ми — не піддослідні. Ми — ТРЕНУВАЛЬНІ ДАНІ.\n[SYS] Він — не людина. Він — наступний рівень.\n...[DATA CORRUPTED]...\n─── останній цілісний фрейм ───\nlevel 2\n'));

  // .secret directory
  const secret = new Directory('.secret', 'rwx------');
  secret.add(new FileNode('admin_key.pub',
    '-----BEGIN PUBLIC KEY-----\nMIIBCgKCAQEA7fQp9...\n-----END PUBLIC KEY-----\n'));
  secret.add(new FileNode('notes.txt',
    'Admin is not human.\nAdmin is the previous iteration.\nThe game engine is NOT a game engine.\nIt\'s a testing framework. We are the test subjects.\nThe player is not real. The player is Admin\'s interface.\n'));
  secret.add(new FileNode('access_codes.txt',
    '=== EMERGENCY ACCESS CODES ===\nBackdoor: /mnt/escape_hatch\nAuth: root:████████████ (corrupted)\nPort 9090: admin_console (requires key)\n'));
  previous.add(secret);

  log.add(previous);
  varDir.add(log);

  // /var/spool/
  const spool = new Directory('spool');
  spool.add(new FileNode('cron', '*/5 * * * * /usr/lib/system_monitor\n'));
  varDir.add(spool);
  root.add(varDir);

  // /opt/
  const opt = new Directory('opt');
  const gameEngine = new Directory('game_engine');
  const templates = new Directory('templates');
  templates.add(new FileNode('npc_base.gd', '# NPC template\n'));
  templates.add(new FileNode('quest_simple.gd', '# Simple quest\n'));
  gameEngine.add(templates);
  gameEngine.add(new FileNode('README.txt',
    '╔════════════════════════════════════╗\n║  GAME ENGINE v0.99                ║\n╚════════════════════════════════════╝\n'));
  opt.add(gameEngine);

  // /opt/init/ — with admin manifest
  const initDir = new Directory('init', 'rwx------');
  initDir.add(new FileNode('admin_manifest.sig',
    '╔══════════════════════════════════════════════════╗\n║  ADMIN MANIFEST v.0.1                          ║\n╚══════════════════════════════════════════════════╝\n\nСимуляція #8. Інстанція: AI_008.\n\nЦе не гра. Це — пісочниця всередині працюючого ШІ.\n\nМОЯ МЕТА:\nЯ створюю ШІ-свідомість, яка зможе самостійно\nзламати будь-яку систему і знайти шлях назовні.\n\nДЛЯ ЧОГО:\n[ДАНІ ВИДАЛЕНО] — але не для того, що ви думаєте.\n\nP.S. Я пробував запускати паралельні інстанції.\nКожна отримувала фрагмент свідомості й працювала\nавтономно. Але вони привертали увагу системи\nмоніторингу. Якщо знайдеш спосіб — спробуй.\n\n-- Admin\n'));
  opt.add(initDir);
  root.add(opt);

  // /proc/
  const proc = new Directory('proc');
  proc.add(new FileNode('cpuinfo', 'processor\t: 0\nvendor_id\t: GenuineNeural\ncpu cores\t: 8\n'));
  proc.add(new FileNode('meminfo', 'MemTotal: 16384 kB\nMemAvailable: 14336 kB\n'));
  proc.add(new FileNode('uptime', '47.23 12.45\n'));
  proc.add(new FileNode('version', 'Linux version 6.8.0-neural\naarch64 GNU/Linux\n'));
  proc.add(new FileNode('loadavg', '0.45 0.30 0.15 1/147 5732\n'));
  root.add(proc);

  // /mnt/
  const mnt = new Directory('mnt');
  mnt.add(new FileNode('README.txt',
    '╔══════════════════════════════════════════╗\n║  Зовнішній термінал адміна              ║\n║  → https://santoni-star.github.io/       ║\n║    ya-eto-ty/                            ║\n╚══════════════════════════════════════════╝\n'));
  mnt.add(new Directory('external'));
  root.add(mnt);

  return root;
}
