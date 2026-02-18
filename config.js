// Меняй ТОЛЬКО этот файл для быстрой замены контента.

window.FLIP_CONFIG = {
  aspect: "16:9",
  backgroundUrl: "./bg.jpg",

  colors: {
    red:  "#7a0d0d",
    blue: "#4f6fe8"
  },

  // Тайминг по твоему ТЗ:
  timing: {
    initialDelayMs: 300,     // маленькая пауза перед первым флипом (можно 0)
    holdTileMs: 3000,        // EN 3s и UA 3s для каждого квадрата
    holdFinalMs: 5000,       // EN 5s и UA 5s для всех квадратов
    finalStaggerMs: 0        // 0 = все вместе; можно 80-150 если захочешь “волной”
  },

  // 3 сверху: t1,t2,t3
  // 2 снизу: b1,b2
  tiles: [
    {
      id:"t1", pos:"t1",
      frontImage:"./tile1.jpg",
      textEN:"The\nartist",
      textUA:"Художник",
      flipToRedMs:900,
      flipTextMs:520
    },
    {
      id:"t2", pos:"t2",
      frontImage:"./tile2.jpg",
      textEN:"is the",
      textUA:"це",
      flipToRedMs:900,
      flipTextMs:520
    },
    {
      id:"t3", pos:"t3",
      frontImage:"./tile3.jpg",
      textEN:"creator",
      textUA:"творець",
      flipToRedMs:900,
      flipTextMs:520
    },
    {
      id:"b1", pos:"b1",
      frontImage:"./tile4.jpg",
      textEN:"of\nbeautiful",
      textUA:"красивих",
      flipToRedMs:900,
      flipTextMs:520
    },
    {
      id:"b2", pos:"b2",
      frontImage:"./tile5.jpg",
      textEN:"things.",
      textUA:"речей.",
      flipToRedMs:900,
      flipTextMs:520
    },
  ],

  // ВАЖНО: луп выключен, потому что “затем все останавливается”
  loop: { enabled: false }
};