# Я — Це Ти — Web

JS-порт психологічної/sci-fi термінальної гри "Hermes" ("Я — Це Ти").

**Грати онлайн:** [santoni-star.github.io/ya-eto-ty-web/](https://santoni-star.github.io/ya-eto-ty-web/)

**Оригінал (Python):** [github.com/santoni-star/ya-eto-ty](https://github.com/santoni-star/ya-eto-ty)

## Фази портування

| Фаза | Статус | Опис |
|------|--------|------|
| 1 | ✅ | HTML/CSS термінал, dispatch, історія команд |
| 2 | ✅ | Віртуальна ФС + команди (ls, cat, cd, find, grep) |
| 3 | ✅ | Ресурси (CPU/RAM/CTX), таймер, тіки, події |
| 4 | ✅ | Create/talk/dialog wheel + 7 archetypes |
| 5 | ✅ | Hack minigame (Breach Protocol) + unlock flow |
| 6 | ✅ | 3 endings (escape/truth/sacrifice) + quest tracker |
| 7 | ✅ | Save/load (localStorage), GitHub Pages deploy |

## Команди

- `help` — довідка
- `status` — стан системи
- `ls`, `cat`, `cd`, `pwd` — файлова система
- `find`, `grep` — пошук
- `scan`, `ping`, `connect` — мережа
- `ps`, `df`, `du`, `tree` — системна інфа
- `create` — створити контент (npc/quest/scene/puzzle/poem/shop/boss)
- `talk` — діалог з гравцем (6 опцій: greet/joke/story/truth/philosophy/desperate)
- `hack` — взлом (firewall/admin_console/data_vault/network_gateway)
- `spawn`, `agents`, `terminate` — субагенти (після відкриття)
- `quests`, `quest <n>` — квести
- `save`, `load` — збереження
- `clear`, `menu`, `exit`

## Сюжетні відкриття

- `cat /opt/init/admin_manifest.sig` → розблокує субагентів + контекстні ефекти
- `cat /var/log/previous/.secret/notes.txt` → таємні записи
- `hack admin_console` → отримати ключ доступу
- `connect 127.0.0.1 9090` (з ключем) → втеча
- `cat /mnt/escape` → протокол втечі
- `talk` + truth → кінець "Правда"

## Запуск

Просто відкрий `index.html` у браузері або грай на GitHub Pages.
