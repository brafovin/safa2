// Messi Memory Game
// 8 verschiedene Messi-Motive -> 16 Karten (8 Paare)
// Bilder werden von Wikimedia Commons geladen. Falls ein Bild nicht lädt,
// wird ein stilisiertes Fallback mit Emoji + Label angezeigt.

const MESSI_CARDS = [
  { id: "wc2022",    label: "WM 2022",      emoji: "🏆",  img: "images/wc2022.svg" },
  { id: "barca",     label: "FC Barcelona", emoji: "🔵🔴", img: "images/barca.svg" },
  { id: "argentina", label: "Argentinien",  emoji: "🇦🇷",  img: "images/argentina.svg" },
  { id: "ballon",    label: "Ballon d'Or",  emoji: "🏅",  img: "images/ballon.svg" },
  { id: "psg",       label: "Paris SG",     emoji: "🗼",  img: "images/psg.svg" },
  { id: "miami",     label: "Inter Miami",  emoji: "🌴",  img: "images/miami.svg" },
  { id: "freekick",  label: "Freistoß",     emoji: "⚽",  img: "images/freekick.svg" },
  { id: "goat",      label: "GOAT #10",     emoji: "🐐",  img: "images/goat.svg" },
];

// ---------- State ----------
const state = {
  deck: [],
  first: null,
  second: null,
  lock: false,
  moves: 0,
  matched: 0,
  startedAt: null,
  timerId: null,
};

// ---------- DOM ----------
const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const timeEl = document.getElementById("time");
const restartBtn = document.getElementById("restart");
const winEl = document.getElementById("win");
const winMovesEl = document.getElementById("win-moves");
const winTimeEl = document.getElementById("win-time");
const playAgainBtn = document.getElementById("play-again");

// ---------- Utils ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  stopTimer();
  state.startedAt = Date.now();
  state.timerId = setInterval(() => {
    timeEl.textContent = formatTime(Date.now() - state.startedAt);
  }, 500);
}

function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

// ---------- Build ----------
function buildDeck() {
  const pairs = MESSI_CARDS.flatMap((c) => [
    { ...c, uid: `${c.id}-a` },
    { ...c, uid: `${c.id}-b` },
  ]);
  return shuffle(pairs);
}

function createCardEl(card) {
  const el = document.createElement("div");
  el.className = "card";
  el.dataset.id = card.id;
  el.dataset.uid = card.uid;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", `Karte ${card.label}`);
  el.tabIndex = 0;

  el.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-back" aria-hidden="true"></div>
      <div class="card-face card-front">
        <img alt="${card.label}" src="${card.img}" loading="lazy" />
        <div class="fallback" style="display:none;">
          <span class="emoji">${card.emoji}</span>
          <span class="label">${card.label}</span>
        </div>
      </div>
    </div>
  `;

  const img = el.querySelector("img");
  const fallback = el.querySelector(".fallback");
  img.addEventListener("error", () => {
    img.style.display = "none";
    fallback.style.display = "flex";
  });

  el.addEventListener("click", () => onCardClick(el));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick(el);
    }
  });

  return el;
}

function renderBoard() {
  boardEl.innerHTML = "";
  state.deck.forEach((card) => boardEl.appendChild(createCardEl(card)));
}

// ---------- Game Logic ----------
function onCardClick(el) {
  if (state.lock) return;
  if (el.classList.contains("flipped") || el.classList.contains("matched")) return;
  if (!state.startedAt) startTimer();

  el.classList.add("flipped");

  if (!state.first) {
    state.first = el;
    return;
  }

  state.second = el;
  state.moves += 1;
  movesEl.textContent = String(state.moves);

  const aId = state.first.dataset.id;
  const bId = state.second.dataset.id;

  if (aId === bId) {
    state.first.classList.add("matched");
    state.second.classList.add("matched");
    state.matched += 1;
    pairsEl.textContent = `${state.matched} / ${MESSI_CARDS.length}`;
    resetTurn();
    if (state.matched === MESSI_CARDS.length) onWin();
  } else {
    state.lock = true;
    state.first.classList.add("shake");
    state.second.classList.add("shake");
    setTimeout(() => {
      state.first.classList.remove("flipped", "shake");
      state.second.classList.remove("flipped", "shake");
      resetTurn();
    }, 900);
  }
}

function resetTurn() {
  state.first = null;
  state.second = null;
  state.lock = false;
}

function onWin() {
  stopTimer();
  winMovesEl.textContent = String(state.moves);
  winTimeEl.textContent = formatTime(Date.now() - state.startedAt);
  winEl.classList.remove("hidden");
}

function newGame() {
  stopTimer();
  state.deck = buildDeck();
  state.first = null;
  state.second = null;
  state.lock = false;
  state.moves = 0;
  state.matched = 0;
  state.startedAt = null;
  movesEl.textContent = "0";
  pairsEl.textContent = `0 / ${MESSI_CARDS.length}`;
  timeEl.textContent = "00:00";
  winEl.classList.add("hidden");
  renderBoard();
}

// ---------- Events ----------
restartBtn.addEventListener("click", newGame);
playAgainBtn.addEventListener("click", newGame);

// ---------- Start ----------
newGame();
