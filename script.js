const CFG = window.FLIP_CONFIG;
if (!CFG) throw new Error("FLIP_CONFIG not found. Check config.js.");

const $stage = document.getElementById("stage");
const $bg = document.getElementById("bg");
const $tiles = document.getElementById("tiles");
const $play = document.getElementById("play");
const $reset = document.getElementById("reset");
const $bgFile = document.getElementById("bgFile");
const $hotspot = document.getElementById("hotspot");

let runId = 0;
const tileMap = new Map();
const state = new Map(); // id -> "front" | "en" | "ua"

function setAspect(){
  const f = (CFG.format || "16:9").trim();
  document.documentElement.style.setProperty("--aspect", f === "9:16" ? "9/16" : "16/9");
}
function setBg(url){ $bg.style.backgroundImage = `url('${url}')`; }

function sleep(ms, myRun){
  return new Promise(res => setTimeout(() => {
    if (myRun !== runId) return res();
    res();
  }, Math.max(0, ms|0)));
}

function clearToFrontInstant(){
  for (const id of tileMap.keys()){
    const obj = tileMap.get(id);
    obj.card.style.setProperty("--cardDur", "0ms");
    obj.card.style.transform = "rotateY(0deg)";
    state.set(id, "front");
  }
  requestAnimationFrame(() => {
    for (const id of tileMap.keys()){
      tileMap.get(id).card.style.setProperty("--cardDur", "");
    }
  });
}

function mountStaticTiles(){
  $tiles.innerHTML = "";
  tileMap.clear();
  state.clear();

  const ids = CFG.order || ["t1","t2","t3","b1","b2"];
  const positions = { t1:"t1", t2:"t2", t3:"t3", b1:"b1", b2:"b2" };

  for (const id of ids){
    const wrap = document.createElement("div");
    wrap.className = "tile";
    wrap.dataset.pos = positions[id] || id;

    const card = document.createElement("div");
    card.className = "card";

    const front = document.createElement("div");
    front.className = "face front";

    const back = document.createElement("div");
    back.className = "face back";

    const word = document.createElement("div");
    word.className = "word";

    back.appendChild(word);
    card.appendChild(front);
    card.appendChild(back);
    wrap.appendChild(card);
    $tiles.appendChild(wrap);

    tileMap.set(id, {wrap, card, front, back, word});
    state.set(id, "front");
  }
}

function applyScene(scene){
  if (scene?.bg) setBg(scene.bg);

  const tiles = scene?.tiles || {};
  for (const [id, obj] of tileMap.entries()){
    const def = tiles[id];
    if (!def) continue;
    obj.front.style.backgroundImage = `url('${def.front}')`;
  }
  clearToFrontInstant();
}

function setBackContent(scene, id, lang){
  const obj = tileMap.get(id);
  const def = scene.tiles[id];
  if (!obj || !def) return;

  obj.back.style.background = (lang === "en") ? CFG.colors.en : CFG.colors.ua;
  obj.word.textContent = def.text?.[lang] ?? "";
  state.set(id, lang);
}

function flipFrontToBack(scene, id){
  const obj = tileMap.get(id);
  const def = scene.tiles[id];
  if (!obj || !def) return;

  obj.card.style.setProperty("--cardDur", (def.flipToBackMs ?? 900) + "ms");
  setBackContent(scene, id, "en");
  obj.card.style.transform = "rotateY(180deg)";
}

function flipBackToFront(scene, id){
  const obj = tileMap.get(id);
  const def = scene.tiles[id];
  if (!obj || !def) return;

  obj.card.style.setProperty("--cardDur", (def.flipToBackMs ?? 900) + "ms");
  obj.card.style.transform = "rotateY(0deg)";
  state.set(id, "front");
}

function flipText(scene, id, toLang){
  const obj = tileMap.get(id);
  const def = scene.tiles[id];
  if (!obj || !def) return;

  const dur = def.flipTextMs ?? 520;
  obj.back.style.setProperty("--textFlipDur", dur + "ms");
  obj.back.classList.add("flipText");

  setTimeout(() => {
    if (state.get(id) !== "front") setBackContent(scene, id, toLang);
  }, Math.floor(dur/2));

  setTimeout(() => {
    obj.back.classList.remove("flipText");
  }, dur + 30);
}

async function playAll(){
  const myRun = ++runId;

  setAspect();
  mountStaticTiles();

  const timing = CFG.timing || {};
  const initialDelay = timing.initialDelayMs ?? 0;
  const holdTile = timing.holdTileMs ?? 3000;
  const holdFinal = timing.holdFinalMs ?? 5000;
  const holdFront = timing.holdFrontBetweenScenesMs ?? 5000;
  const finalStagger = timing.finalStaggerMs ?? 0;

  const order = CFG.order || ["t1","t2","t3","b1","b2"];
  const scenes = CFG.scenes || [];

  for (let s = 0; s < scenes.length; s++){
    if (myRun !== runId) return;

    const scene = scenes[s];
    applyScene(scene);

    await sleep(initialDelay, myRun);

    for (const id of order){
      if (myRun !== runId) return;

      flipFrontToBack(scene, id);
      await sleep(holdTile, myRun);

      flipText(scene, id, "ua");
      await sleep(holdTile, myRun);
    }

    for (let i = 0; i < order.length; i++){
      const id = order[i];
      if (finalStagger) await sleep(finalStagger, myRun);
      flipText(scene, id, "en");
    }
    await sleep(holdFinal, myRun);

    for (let i = 0; i < order.length; i++){
      const id = order[i];
      if (finalStagger) await sleep(finalStagger, myRun);
      flipText(scene, id, "ua");
    }
    await sleep(holdFinal, myRun);

    for (const id of order) flipBackToFront(scene, id);
    await sleep(holdFront, myRun);
  }
}

function restart(){ runId++; playAll(); }
function reset(){ runId++; clearToFrontInstant(); }

$play.addEventListener("click", (e) => { e.stopPropagation(); restart(); });
$reset.addEventListener("click", (e) => { e.stopPropagation(); reset(); });

$bgFile.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  setBg(url);
});

let lastTap = 0;
$hotspot.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
  const now = Date.now();
  if (now - lastTap < 320){
    $stage.classList.toggle("showHud");
    lastTap = 0;
  } else {
    lastTap = now;
  }
});

$stage.addEventListener("pointerdown", () => {
  if ($stage.classList.contains("showHud")) return;
  restart();
});

restart();
