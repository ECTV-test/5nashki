// config.js — редагуйте ЛИШЕ цей файл
//
// РЕКОМЕНДОВАНІ РОЗМІРИ ЗОБРАЖЕНЬ:
// - Фон (bg): 1920×1080 (найкраще) або 2560×1440; 4K можна, але буде важче.
// - Картинки квадратів (front): 800×800 або 1024×1024 (найкраще). Мінімум 600×600.
//
// ОРГАНІЗАЦІЯ ФАЙЛІВ (рекомендовано):
// - Кожну сцену тримайте в окремій папці: assets/scene01/, assets/scene02/, ...
//   Приклад: assets/scene01/bg.jpg + tile1..tile5.jpg
// - Те, що повторюється між сценами: assets/shared/
//
// ТАЙМІНГИ:
// - holdTileMs: скільки тримаємо EN, і скільки тримаємо UA (для кожного квадрата, послідовно).
// - holdFinalMs: скільки тримаємо ВСІ квадрати на EN, потім ВСІ на UA.
// - holdFrontBetweenScenesMs: після фінального UA повертаємо все на картинки (front) і чекаємо перед наступною сценою.
//
// ШВИДКОСТІ (на рівні квадрата):
// - flipToBackMs: швидкість першого перевороту (КАРТИНКА/front → EN/back).
// - flipTextMs: швидкість перевороту мови на звороті (EN ↔ UA) БЕЗ показу картинки знову.

window.FLIP_CONFIG = {
  format: "16:9",

  timing: {
    initialDelayMs: 300,
    holdTileMs: 3000,
    holdFinalMs: 5000,
    holdFrontBetweenScenesMs: 5000,
    finalStaggerMs: 0
  },

  colors: {
    en: "#7a0d0d",
    ua: "#4f6fe8"
  },

  order: ["t1","t2","t3","b1","b2"],

  scenes: [
    // SCENE 1
    {
      bg: "./assets/scene01/bg.jpg",
      tiles: {
        t1: { front:"./assets/scene01/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"The\nartist",    ua:"Художник" } },
        t2: { front:"./assets/scene01/tile2.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"is the",        ua:"це" } },
        t3: { front:"./assets/scene01/tile3.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"creator",       ua:"творець" } },
        b1: { front:"./assets/scene01/tile4.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"of\nbeautiful", ua:"красивих" } },
        b2: { front:"./assets/scene01/tile5.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"things.",       ua:"речей." } },
      }
    },

    // SCENE 2
    {
      bg: "./assets/scene01/bg.jpg",
      tiles: {
        t1: { front:"./assets/scene01/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"Art",           ua:"Мистецтво" } },
        t2: { front:"./assets/scene01/tile2.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"helps us",      ua:"допомагає нам" } },
        t3: { front:"./assets/scene01/tile3.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"see the",       ua:"бачити" } },
        b1: { front:"./assets/scene01/tile4.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"world",         ua:"світ" } },
        b2: { front:"./assets/scene01/tile5.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"in a new\nway.", ua:"по-новому." } },
      }
    },

    // SCENE 3
    {
      bg: "./assets/shared/bg.jpg",
      tiles: {
        t1: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"Every\nday",     ua:"Щодня" } },
        t2: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"we can",        ua:"ми можемо" } },
        t3: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"create",        ua:"створити" } },
        b1: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"something\nsmall", ua:"щось\nмаленьке" } },
        b2: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"and good.",     ua:"й добре." } },
      }
     },

    // приклад нової строки:
    // {
    //   bg: "./assets/scene00/bg.jpg",
    //   tiles: {
    //     t1: { front:"./assets/scene01/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"...", ua:"..." } },
    //     t2: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"...", ua:"..." } },
    //     t3: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"...", ua:"..." } },
    //     b1: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"...", ua:"..." } },
    //     b2: { front:"./assets/shared/tile1.jpg", flipToBackMs:900, flipTextMs:520, text:{ en:"...", ua:"..." } },
    //   }
    // }
  ]
};
