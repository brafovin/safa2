// Messi Memory Game
// 8 verschiedene Messi-Motive -> 16 Karten (8 Paare)
//
// Jede Karte hat mehrere Bild-Quellen (`sources`). Die Karte probiert sie
// nacheinander durch:
//   1. Eigenes Foto unter `images/photos/<id>.jpg` (falls vorhanden)
//   2. Echtes Foto von Wikimedia Commons (Special:FilePath leitet auf die
//      aktuelle Bilddatei weiter – kein Raten von Hash-Pfaden nötig)
//   3. SVG-Fallback als Illustration (falls kein Netzwerk / Bild fehlt)
//
// Wenn du deine eigenen Fotos benutzen willst: leg sie als JPG/PNG im Ordner
// `images/photos/` ab mit den Namen wc2022, barca, argentina, ballon, psg,
// miami, freekick, goat.

const WM = (filename) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=500`;

const MESSI_CARDS = [
  {
    id: "wc2022",
    label: "WM 2022",
    emoji: "🏆",
    sources: [
      "images/photos/wc2022.jpg",
      WM("Lionel-Messi-Argentina-2022-FIFA-World-Cup_(cropped).jpg"),
      "images/wc2022.svg",
    ],
  },
  {
    id: "barca",
    label: "FC Barcelona",
    emoji: "🔵🔴",
    sources: [
      "images/photos/barca.jpg",
      WM("Lionel_Messi_31-03-2007.jpg"),
      "images/barca.svg",
    ],
  },
  {
    id: "argentina",
    label: "Argentinien",
    emoji: "🇦🇷",
    sources: [
      "images/photos/argentina.jpg",
      WM("Lionel_Messi_vs_Nigeria_2018.jpg"),
      "images/argentina.svg",
    ],
  },
  {
    id: "ballon",
    label: "Ballon d'Or",
    emoji: "🏅",
    sources: [
      "images/photos/ballon.jpg",
      WM("Lionel_Messi_Player_of_the_Year_2011.jpg"),
      "images/ballon.svg",
    ],
  },
  {
    id: "psg",
    label: "Paris SG",
    emoji: "🗼",
    sources: [
      "images/photos/psg.jpg",
      WM("Lionel_Messi_(PSG)_-_2021.jpg"),
      "images/psg.svg",
    ],
  },
  {
    id: "miami",
    label: "Inter Miami",
    emoji: "🌴",
    sources: [
      "images/photos/miami.jpg",
      WM("Messi_Inter_Miami_(cropped).jpg"),
      "images/miami.svg",
    ],
  },
  {
    id: "freekick",
    label: "Freistoß",
    emoji: "⚽",
    sources: [
      "images/photos/freekick.jpg",
      WM("Lionel_Messi_free_kick_vs_Athletic_Bilbao.jpg"),
      "images/freekick.svg",
    ],
  },
  {
    id: "goat",
    label: "GOAT #10",
    emoji: "🐐",
    sources: [
      "images/photos/goat.jpg",
      WM("Lionel_Messi_20180626.jpg"),
      "images/goat.svg",
    ],
  },
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
        <img alt="${card.label}" loading="lazy" />
        <div class="fallback" style="display:none;">
          <span class="emoji">${card.emoji}</span>
          <span class="label">${card.label}</span>
        </div>
      </div>
    </div>
  `;

  const img = el.querySelector("img");
  const fallback = el.querySelector(".fallback");
  const sources = Array.isArray(card.sources)
    ? card.sources.slice()
    : [card.img];
  let idx = 0;

  const tryNext = () => {
    if (idx >= sources.length) {
      img.style.display = "none";
      fallback.style.display = "flex";
      return;
    }
    img.src = sources[idx++];
  };

  img.addEventListener("error", tryNext);
  tryNext();

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
