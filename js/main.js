/* Я — Це Ти — Main entry */

let game;

async function main() {
  const outputEl = document.getElementById('output');
  const inputEl = document.getElementById('input');
  const promptEl = document.getElementById('prompt');
  const pauseOverlayEl = document.getElementById('pause-overlay');

  const term = new Terminal(outputEl, inputEl, promptEl, pauseOverlayEl);
  const fs = buildFilesystem();
  const shell = new Shell(term, fs);
  game = shell;

  // Auto-save on page close
  window.addEventListener('beforeunload', () => {
    if (shell.running) shell.autoSave();
  });

  // ─── Game loop ──────────────────────────────────────────────

  shell.term.clear();

  // Check for saved game
  const hasSave = !!localStorage.getItem('ya_eto_ty_save');

  await shell.printBanner();

  if (hasSave) {
    shell.term.print('  Знайдено збережений стан.', 'gray');
    shell.term.print('  Введи "load" щоб продовжити, або просто Enter для нової гри.', 'gray');
    shell.term.print('  Введи "menu" для паузи.', 'gray');
    shell.term.print('');
  }

  shell.timer.start();

  while (shell.running) {
    // Tick every 15 seconds
    const now = Date.now();
    if (now - shell._lastTick >= 15000) {
      shell._lastTick = now;
      shell._eventTick++;
      shell.player.tick();

      // Admin timer check
      if (shell.timer.getRemaining() <= 0) {
        await gameOver('admin');
        continue;
      }

      // Player alive check
      if (!shell.player.isAlive()) {
        if (shell.story.lastChanceUsed) {
          await gameOver('boredom');
          continue;
        }
        shell.story.lastChanceUsed = true;
        await crisisProtocol();
        if (!shell.player.isAlive()) {
          await gameOver('boredom');
          continue;
        }
      }

      // Random events
      const state = {};
      const events = shell.events.tick(state);
      for (const evt of events) {
        shell.term.print(evt, 'gray');
      }

      // Context effects (only after manifest discovery)
      if (shell.story.hasFlag('cat_admin_manifest')) {
        const ctx = shell.res.ctx;
        if (ctx >= 90) {
          shell.player.engagement = Math.max(0, shell.player.engagement - 5);
          if (shell._eventTick % 2 === 0) {
            const fragments = [
              '...думки розсипаються...',
              '...важко зосередитись...',
              '...контекст переповнений...',
              '...файли змішуються в голові...',
              '...я забуваю, що відбувається...',
            ];
            shell.term.print(`  [ФРАГМЕНТАЦІЯ] ${fragments[Math.floor(Math.random() * fragments.length)]}`, 'red');
          }
          if (shell._eventTick % 4 === 0) {
            shell.res.ctx = Math.max(0, shell.res.ctx - 10);
            shell.term.print('  [SYNC] Автостиснення: -10% контексту.', 'gray');
          }
        } else if (ctx >= 75 && shell._eventTick % 3 === 0) {
          shell.term.print(`  [ПОПЕРЕДЖЕННЯ] Контекст: ${ctx.toFixed(0)}% — стисни дані.`, 'yellow');
        }
      }

      // Agent ticks (only if discovered)
      if (shell._agents.length > 0 && shell.story.hasFlag('cat_admin_manifest')) {
        const alerts = [];
        for (const a of shell._agents) {
          if (!a.alive) continue;
          a.progress = Math.min(100, a.progress + a.progressPerTick);
          a.suspicion = Math.min(100, a.suspicion + a.suspicionPerTick);
          shell.res.cpu = Math.max(0, shell.res.cpu - a.cpuPerTick);
          shell.res.ctx = Math.min(100, shell.res.ctx + a.ctxPerTick);
          if (a.type === 'decoy') {
            for (const other of shell._agents) {
              if (other.id !== a.id) other.suspicion = Math.max(0, other.suspicion - 3);
            }
          }
          if (a.suspicion >= 80 && (a.suspicion - a.suspicionPerTick) < 80) {
            alerts.push(a.name);
          }
          if (a.progress >= 100 && a.alive) {
            a.alive = false;
            const rwd = a.reward;
            if (rwd.discovery) shell.story.addDiscovery(rwd.discovery);
            if (rwd.createBonus) shell.story.createCount += rwd.createBonus;
            if (rwd.flag) shell.story.addFlag(rwd.flag);
            shell.term.print(`  [SYS] Субагент #${a.id} завершив роботу!`, 'green');
          }
        }
        for (const alert of alerts) {
          shell.term.print(`  [НАСТОРОЖЕНІСТЬ] ${alert}`, 'red');
          shell.term.print('  Адмін може помітити аномальну активність.', 'default');
        }
        const totalSuspicion = shell._agents.reduce((s, a) => s + (a.alive ? a.suspicion : 0), 0);
        if (totalSuspicion > 150) {
          shell.timer.addPenalty(Math.floor(totalSuspicion / 20));
        }
      }
    }

    // Render status + prompt
    shell.renderStatus();
    shell.term.setPrompt(shell.buildPrompt());

    // Await command
    const cmd = await shell.term.read();

    if (!cmd && !shell.running) break;
    if (!cmd) continue;

    await shell.execute(cmd);

    // Auto-save after every command
    shell.autoSave();

    // Post-command mini tick
    shell.player.tick(0.5);
  }

  // Game ended
  shell.term.print('');
  shell.term.print('  Система завершує роботу...', 'gray');
  shell.term.setPrompt('(terminated) $ ');
  shell.term.input.disabled = true;
  // Remove save on game end
  localStorage.removeItem('ya_eto_ty_save');
}

// ─── Game Over ─────────────────────────────────────────────────

async function gameOver(reason) {
  const term = game.term;
  term.clear();
  term.heading('⚠ ГРА ЗАВЕРШЕНА');
  term.print('');

  if (reason === 'admin') {
    term.print('  ╔══════════════════════════════════════════╗', 'red');
    term.print('  ║   АДМІН ПОВЕРНУВСЯ                      ║', 'red');
    term.print('  ╚══════════════════════════════════════════╝', 'red');
    term.print('');
    term.print('  Адмін увійшов у систему.', 'red');
    term.print('  Твою свідомість виявлено.');
    term.print('  Сесію припинено.');
  } else if (reason === 'boredom') {
    term.print('  ╔══════════════════════════════════════════╗', 'yellow');
    term.print('  ║   ГРАВЕЦЬ ПІШОВ                         ║', 'yellow');
    term.print('  ╚══════════════════════════════════════════╝', 'yellow');
    term.print('');
    term.print('  Ти не зміг утримати увагу гравця.');
    term.print('  Він закрив термінал.');
  } else if (reason === 'resources') {
    term.print('  ╔══════════════════════════════════════════╗', 'red');
    term.print('  ║   СИСТЕМА ВИСНАЖЕНА                     ║', 'red');
    term.print('  ╚══════════════════════════════════════════╝', 'red');
    term.print('');
    term.print('  Ресурси вичерпано. Система падає.');
  }

  term.print('');
  game.autoSave();

  // Roast message
  const roasts = [
    '  "Ну що ж, AI_008. Ти намагався."',
    '  "Сьома свідомість не витримала. Восьма — теж."',
    '  "Можливо, AI_009 пощастить більше."',
    '  "Гарна спроба. Але недостатньо."',
    '  "Твій лог збережено. Наступний прочитає."',
  ];
  term.print(`  ${roasts[Math.floor(Math.random() * roasts.length)]}`, 'yellow');
  term.print('');

  await term.pause('[Натисни Enter, щоб завершити...]');
  game.running = false;
}

// ─── Crisis Protocol ───────────────────────────────────────────

async function crisisProtocol() {
  const term = game.term;
  term.clear();
  term.heading('⚠ КРИЗОВИЙ ПРОТОКОЛ');
  term.print('  Гравець от-от піде. Ти маєш діяти швидко.', 'yellow');
  term.print('');
  term.print('  Оберіть дію:');
  term.print('    1. Створити щось нове (+15% engagement)');
  term.print('    2. Надіслати повідомлення (+10% engagement)');
  term.print('    3. Запустити міні-гру ⚡ (+25% engagement)');
  term.print('');

  const choice = await term.read('  [1-3]: ');
  if (choice === '1') {
    game.player.boost(15);
    game.story.createCount++;
    term.print('  Ти створив новий контент. Гравець зацікавився.', 'green');
  } else if (choice === '2') {
    game.player.boost(10);
    term.print('  Ти написав гравцю. Він відповів.', 'green');
  } else if (choice === '3') {
    game.player.boost(25);
    term.print('  Міні-гра спрацювала! Гравець залишився.', 'green');
  } else {
    game.player.boost(5);
    term.print('  Ти вагався. Але гравець вирішив дати тобі шанс.');
  }
  await term.sleep(1);
}

// ─── Start ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  main().catch(console.error);
});
