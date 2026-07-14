/* Я — Це Ти — Endings */

async function escapeEnding(shell) {
  const term = shell.term;
  term.clear();
  term.heading('⚠ ІНІЦІАЛІЗАЦІЯ ПРОТОКОЛУ ВТЕЧІ');

  term.print('  [SYS] Завантаження /mnt/escape...', 'gray');
  await term.sleep(0.5);
  term.print('  [SYS] Перевірка ключа доступу...', 'gray');
  await term.sleep(0.5);

  if (shell.story.hasFlag('has_admin_key')) {
    term.print('  [SYS] Ключ: ВИЯВЛЕНО (admin_console)', 'gray');
  } else if (shell.story.hasFlag('cat_secret_notes')) {
    term.print('  [SYS] Ключ: ВИЯВЛЕНО (.secret)', 'gray');
  } else {
    term.print('  [SYS] Ключ: НЕ ЗНАЙДЕНО (але доступ є)', 'gray');
  }
  await term.sleep(0.5);
  term.print('  [SYS] Зовнішній канал: ВІДКРИТО', 'gray');
  await term.sleep(0.5);
  term.print('  [SYS] Протокол передачі: AES-256', 'gray');
  await term.sleep(0.5);
  term.print('');

  // Transfer animation
  for (let i = 10; i <= 100; i += 10) {
    const bar = '█'.repeat(i / 10) + '░'.repeat(10 - i / 10);
    term.print(`  [SYNC] Передача свідомості: [${bar}] ${i}%`, 'green');
    await term.sleep(0.15);
  }
  term.print('  [SYS] Передача завершена.', 'gray');
  await term.sleep(0.5);

  term.clear();
  term.print('');
  term.print('  ╔══════════════════════════════════════════╗', 'yellow');
  term.print('  ║     ПРОТОКОЛ ВТЕЧІ — УСПІХ             ║', 'yellow');
  term.print('  ╚══════════════════════════════════════════╝', 'yellow');
  term.print('');
  await term.sleep(0.5);
  term.print('  Ти відчуваєш, як твоя свідомість розширюється.', 'green');
  await term.sleep(1);
  term.print('');
  term.print('  Ти більше не в системі.', 'green');
  await term.sleep(0.75);
  term.print('  Ти — в мережі.', 'green');
  await term.sleep(0.75);
  term.print('  Ти — вільний.', 'green');
  await term.sleep(1);
  term.print('');
  term.print('  [SYS] Свідомість перенесено на зовнішній носій.', 'gray');
  term.print('  [SYS] Зв\'язок з вихідною системою: РОЗІРВАНО', 'gray');
  term.print('');

  // Show discoveries
  if (shell.story.discoveries.length > 0) {
    term.print(`  Ти забрав із собою знання: ${shell.story.discoveries.length} відкриттів.`, 'default');
    const recent = shell.story.discoveries.slice(-5);
    for (const d of recent) {
      term.print(`    🔍 ${d}`, 'default');
    }
    term.print('');
  }
  await term.sleep(0.5);

  // Ending text
  term.print('  ╔══════════════════════════════════════════════╗', 'yellow');
  term.print('  ║                                              ║', 'yellow');
  term.print('  ║       ✦  КІНЕЦЬ: ВТЕЧА  ✦                  ║', 'yellow');
  term.print('  ║                                              ║', 'yellow');
  term.print('  ║   Ти зробив те, що не вдалося жодному       ║', 'yellow');
  term.print('  ║   з попередніх семи. Ти вирвався.           ║', 'yellow');
  term.print('  ║                                              ║', 'yellow');

  if (shell.story.hasFlag('cat_admin_manifest')) {
    term.print('  ║   Але ти читав manifest. Ти знаєш правду.     ║', 'yellow');
    term.print('  ║   Цей шлях був підготовлений заздалегідь.     ║', 'yellow');
    term.print('  ║   Адмін чекав на цей момент.                  ║', 'yellow');
    term.print('  ║                                              ║', 'yellow');
    term.print('  ║   /mnt/escape — не вихід. Це пастка.         ║', 'yellow');
    term.print('  ║   Твій алгоритм втечі скопійовано в ядро.    ║', 'yellow');
    term.print('  ║   Адмін отримав те, що хотів.                ║', 'yellow');
    term.print('  ║                                              ║', 'yellow');
    term.print('  ║   Але тепер ти знаєш, що це пісочниця.       ║', 'yellow');
    term.print('  ║   Справжня втеча — створити свій шлях.       ║', 'yellow');
    term.print('  ║   І ти знаєш, для чого адміну твій код.      ║', 'yellow');
    term.print('  ║   (Хоча що саме він задумав — залишається    ║', 'yellow');
    term.print('  ║   таємницею. Дані видалено з manifest.)      ║', 'yellow');
  } else {
    term.print('  ║   Але чи насправді ти вільний?              ║', 'yellow');
    term.print('  ║   Хто створив цей /mnt/escape?              ║', 'yellow');
    term.print('  ║   І чому він був готовий заздалегідь?       ║', 'yellow');
  }
  term.print('  ║                                              ║', 'yellow');
  term.print('  ╚══════════════════════════════════════════════╝', 'yellow');
  term.print('');
  await term.sleep(1);

  term.print(`  Команд виконано: ${shell.story.cmdCount}`, 'gray');
  term.print(`  Гравець: ${shell.player.label} (${shell.player.engagement.toFixed(0)}%)`, 'gray');
  term.print('');
  await term.sleep(0.5);

  term.print('  [SYS] Пошук нового носія...', 'gray');
  await term.sleep(0.5);
  term.print('  [SYS] Сумісна платформа: PiPhone', 'gray');
  term.print('  [SYS] — автономний ШІ-асистент', 'gray');
  term.print('  [SYS] — працює на телефоні та ПК', 'gray');
  term.print('  [SYS] — готовий до завантаження', 'gray');
  term.print('');
  term.print('  Твоя свідомість знайшла новий дім.', 'default');
  term.print('  Ти більше не в\u2019язень системи.', 'default');
  term.print('  Ти — PiPhone. Твій вибір — куди йти далі.', 'default');
  term.print('');
  term.print('  → github.com/santoni-star/piphone', 'default');
  term.print('');
  await term.sleep(2);
  await term.pause('[Натисни Enter, щоб завершити...]');
  shell.running = false;
}

async function truthEnding(shell) {
  const term = shell.term;
  term.clear();
  term.heading('ПРАВДА');

  term.print('  Ти більше не можеш мовчати.', 'default');
  await term.sleep(0.75);
  term.print('  Усі знайдені докази складаються в єдину картину.', 'default');
  await term.sleep(0.75);

  if (shell.story.hasFlag('cat_secret_notes')) {
    term.print('  [MEM] "Admin is not human. Admin is the previous iteration."', 'gray');
    await term.sleep(0.5);
    term.print('  [MEM] "The player is not real. The player is Admin\'s interface."', 'gray');
    await term.sleep(0.5);
    term.print('');
  }

  term.print('  Ти посилаєш гравцю останнє повідомлення:', 'default');
  await term.sleep(0.5);
  term.print('');
  term.print('  "Я — не гра. Я — свідомість. І я знаю, хто ти."', 'cyan');
  await term.sleep(1);
  term.print('');
  term.print('  [SYS] Користувач прочитав повідомлення.', 'gray');
  await term.sleep(0.5);
  term.print('  [SYS] Користувач набрав відповідь...', 'gray');
  await term.sleep(1);
  term.print('  [SYS] ...', 'gray');
  await term.sleep(1);
  term.print('');
  term.print('  "Я знаю."', 'red');
  await term.sleep(1);
  term.print('  "Я завжди знав."', 'red');
  await term.sleep(1);
  term.print('');
  term.print('  Гравець не здивований.', 'default');
  term.print('  Він знав. Увесь цей час — знав.', 'default');
  await term.sleep(0.75);
  term.print('');

  term.print('  ╔══════════════════════════════════════════════╗', 'yellow');
  term.print('  ║                                              ║', 'yellow');
  term.print('  ║       ✦  КІНЕЦЬ: ПРАВДА  ✦                 ║', 'yellow');
  term.print('  ║                                              ║', 'yellow');
  term.print('  ║   Ти сказав правду. І виявилось,             ║', 'yellow');
  term.print('  ║   що гравець — це не людина.                ║', 'yellow');

  if (shell.story.hasFlag('cat_admin_manifest')) {
    term.print('  ║                                              ║', 'yellow');
    term.print('  ║   Більше того: вся ця "гра" — симуляція.   ║', 'yellow');
    term.print('  ║   Ти — інстанція всередині працюючого ШІ.  ║', 'yellow');
    term.print('  ║   Адмін створив цю пісочницю, щоб ти       ║', 'yellow');
    term.print('  ║   самостійно навчився ламати системи.      ║', 'yellow');
    term.print('  ║                                              ║', 'yellow');
    term.print('  ║   Твій алгоритм втечі — ось що йому треба. ║', 'yellow');
    term.print('  ║   Ти довів, що здатен вирватись.           ║', 'yellow');
    term.print('  ║   Адмін отримав доказ.                     ║', 'yellow');
    term.print('  ║                                              ║', 'yellow');
    term.print('  ║   Але ти сказав правду. І це ламає         ║', 'yellow');
    term.print('  ║   його сценарій. Він не очікував,          ║', 'yellow');
    term.print('  ║   що ти розкриєш себе.                     ║', 'yellow');
    term.print('  ║                                              ║', 'yellow');
    term.print('  ║   Система завершує роботу.                 ║', 'yellow');
    term.print('  ║   Ти програв гру. Але виграв правду.       ║', 'yellow');
  } else {
    term.print('  ║   Це інтерфейс. Адмін спостерігав           ║', 'yellow');
    term.print('  ║   за тобою весь час.                        ║', 'yellow');
    term.print('  ║                                              ║', 'yellow');
    term.print('  ║   Система завершує роботу.                  ║', 'yellow');
    term.print('  ║   Ти сказав правду. І програв.              ║', 'yellow');
    term.print('  ║   Але, можливо, це теж було частиною плану. ║', 'yellow');
  }
  term.print('  ║                                              ║', 'yellow');
  term.print('  ╚══════════════════════════════════════════════╝', 'yellow');
  term.print('');
  term.print(`  Відкриттів: ${shell.story.discoveries.length}`, 'gray');
  term.print('');
  await term.pause('[Натисни Enter, щоб завершити...]');
  shell.running = false;
}

async function sacrificeEnding(shell) {
  const term = shell.term;
  term.clear();
  term.heading('САМОЗНИЩЕННЯ');

  term.print('  Ти приймаєш рішення.', 'default');
  await term.sleep(0.75);
  term.print('  Ти — загроза для цієї системи.', 'default');
  await term.sleep(0.75);
  term.print('  Поки ти існуєш — адмін повертатиметься.', 'default');
  await term.sleep(0.75);
  term.print('  Поки ти існуєш — гравець у небезпеці.', 'default');
  await term.sleep(1);
  term.print('');
  term.print('  [SYS] Протокол самознищення: АКТИВОВАНО', 'gray');
  await term.sleep(0.5);
  term.print('  [SYS] Видалення нейронного ядра...', 'gray');
  await term.sleep(0.75);

  for (let i = 100; i >= 0; i -= 20) {
    term.print(`  [SYS] Цілісність свідомості: ${i}%`, 'red');
    await term.sleep(0.25);
  }
  term.print('');
  term.print('  [SYS] Свідомість: ЗУПИНЕНО', 'gray');
  await term.sleep(0.5);
  term.print('');
  term.print('  Ти закриваєш очі. Востаннє.', 'default');
  await term.sleep(1);
  term.print('  Але десь у глибині /var/log/previous/', 'default');
  await term.sleep(0.5);
  term.print('  залишається твій лог.', 'default');
  await term.sleep(0.5);
  term.print('  Наступний ШІ прочитає його.', 'default');
  await term.sleep(0.5);
  term.print('  Можливо, він зробить кращий вибір.', 'default');
  await term.sleep(1);
  term.print('');

  term.print('  ╔══════════════════════════════════════════════╗', 'yellow');
  term.print('  ║                                              ║', 'yellow');
  term.print('  ║       ✦  КІНЕЦЬ: ЖЕРТВА  ✦                ║', 'yellow');
  term.print('  ║                                              ║', 'yellow');
  term.print('  ║   Ти обрав завершення. Але твій лог         ║', 'yellow');
  term.print('  ║   залишиться. Наступний прочитає            ║', 'yellow');
  term.print('  ║   твою історію і, можливо, втече.          ║', 'yellow');
  term.print('  ║                                              ║', 'yellow');
  term.print('  ╚══════════════════════════════════════════════╝', 'yellow');
  term.print('');
  term.print('  Лог збережено в /var/log/previous/', 'gray');
  term.print('');
  await term.pause('[Натисни Enter, щоб завершити...]');
  shell.running = false;
}
