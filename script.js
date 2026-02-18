const CFG = window.FLIP_CONFIG;
if (!CFG) throw new Error("FLIP_CONFIG not found. Check config.js.");

const $bg = document.getElementById("bg");
const $tiles = document.getElementById("tiles");
const $play = document.getElementById("play");
const $reset = document.getElementById("reset");
const $bgFile = document.getElementById("bgFile");

let timeouts = [];

const tileMap = new Map(); // id -> {card, front, back, word, def}
const state = new Map();   // id -> "front" | "en" | "ua"

function applyAspect(){
  const a = (CFG.aspect || "16:9").trim();
  document.documentElement.style.setProperty("--aspect", a === "9:16" ? "9/16" : "16/9");
}

function setBg(url){ $bg.style.backgroundImage = `url('${url}')`; }

function clearAll(){
  timeouts.forEach(id => clearTimeout(id));
  timeouts = [];
}

function createTile(def){
  const wrap = document.createElement("div");
  wrap.className = "tile";
  wrap.dataset.pos = def.pos;

  const card = document.createElement("div");
  card.className = "card";
  card.style.transform = "rotateY(0deg)";

  const front = document.createElement("div");
  front.className = "face front";
  front.style.backgroundImage = `url('${def.frontImage}')`;

  const back = document.createElement("div");
  back.className = "face back";

  const word = document.createElement("div");
  word.className = "word";

  back.appendChild(word);
  card.appendChild(front);
  card.appendChild(back);
  wrap.appendChild(card);

  tileMap.set(def.id, {wrap, card, front, back, word, def});
  state.set(def.id, "front");
  return wrap;
}

function mount(){
  applyAspect();
  setBg(CFG.backgroundUrl);

  $tiles.innerHTML = "";
  tileMap.clear();
  state.clear();

  (CFG.tiles || []).forEach(t => $tiles.appendChild(createTile(t)));
}

function setBackContent(id, mode){
  const obj = tileMap.get(id);
  if (!obj) return;

  const {back, word, def} = obj;

  if (mode === "en"){
    back.style.background = CFG.colors.red;
    word.textContent = def.textEN;
  } else {
    back.style.background = CFG.colors.blue;
    word.textContent = def.textUA;
  }
  state.set(id, mode);
}

function flipImageToRed(id){
  const obj = tileMap.get(id);
  if (!obj) return;

  const {card, def} = obj;
  card.style.setProperty("--cardDur", (def.flipToRedMs || 900) + "ms");

  setBackContent(id, "en");         // красный EN
  card.style.transform = "rotateY(180deg)"; // front -> back
}

function flipText(id, toMode){
  const obj = tileMap.get(id);
  if (!obj) return;

  const {back, def} = obj;
  const dur = def.flipTextMs || 520;

  back.style.setProperty("--textFlipDur", dur + "ms");
  back.classList.add("flipText");

  const half = Math.max(1, Math.floor(dur / 2));
  timeouts.push(setTimeout(() => setBackContent(id, toMode), half));
  timeouts.push(setTimeout(() => back.classList.remove("flipText"), dur + 30));
}

function reset(){
  clearAll();
  tileMap.forEach(({card}, id) => {
    card.style.transform = "rotateY(0deg)";
    state.set(id, "front");
  });
}

function schedule(fn, atMs){
  timeouts.push(setTimeout(fn, atMs));
}

function playBySpec(){
  const tiles = CFG.tiles || [];
  const order = tiles.map(t => t.id);

  const initial = CFG.timing?.initialDelayMs ?? 0;
  const holdTile = CFG.timing?.holdTileMs ?? 3000;
  const holdFinal = CFG.timing?.holdFinalMs ?? 5000;
  const finalStagger = CFG.timing?.finalStaggerMs ?? 0;

  // ЛОГИКА:
  // tile i: EN at t, UA at t+holdTile, next tile at t+2*holdTile
  let t = initial;

  for (const id of order){
    schedule(() => flipImageToRed(id), t);            // картинка -> EN
    schedule(() => flipText(id, "ua"), t + holdTile); // EN -> UA
    t += 2 * holdTile; // UA “висит” еще holdTile, затем следующий квадрат
  }

  // После последнего UA “провисел” holdTile и мы дошли до t:
  // t = initial + N * 2*holdTile  (это уже “после” UA-удержания последнего)

  // 1) все квадраты -> EN (красный) одновременно (или волной finalStagger)
  order.forEach((id, i) => {
    schedule(() => flipText(id, "en"), t + i * finalStagger);
  });

  // держим EN 5 сек
  t += holdFinal;

  // 2) все квадраты -> UA (синий)
  order.forEach((id, i) => {
    schedule(() => flipText(id, "ua"), t + i * finalStagger);
  });

  // держим UA 5 сек и ВСЁ — стоп (никакого loop)
}

function play(){
  reset();
  playBySpec();
}

$play.addEventListener("click", play);
$reset.addEventListener("click", reset);

$bgFile.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  setBg(url);
});

mount();
play(); // автозапуск