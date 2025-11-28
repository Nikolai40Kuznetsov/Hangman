// Словари (русские слова)
const DICTS = {
  animals: [
    "тигр","рысь","жираф","еж","пингвин","осел","сова","ягуар",
    "слон","бобр","дельфин","верблюд","волк","кабан","коала","енот","лисица"
  ],
  cities: [
    "минск","москва","париж","лондон","мадрид","киев","берлин",
    "рим","вильнюс","таллин","варшава","брест","гомель","гродно","витебск"
  ],
  tech: [
    "компьютер","сервер","браузер","алгоритм","база","робот","память",
    "процессор","датчик","интернет","протокол","масштабирование"
  ],
  movies: [
    "матрица","интерстеллар","аватар","таксист","гладиатор","джокер",
    "кубо","паразиты","амели","бондиана"
  ]
};
const ALL_WORDS = Object.values(DICTS).flat();
const ALPHABET = "ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ".split("");

let secret = "";
let revealed = [];
let mistakes = 0;
const MAX_MISTAKES = 9; 
let finished = false;
let theme = "—";
const $word = document.getElementById("word");
const $keyboard = document.getElementById("keyboard");
const $mistakes = document.getElementById("mistakes");
const $maxMistakes = document.getElementById("maxMistakes");
const $message = document.getElementById("message");
const $hint = document.getElementById("hint");
const $showHint = document.getElementById("showHint");
const $category = document.getElementById("category");
const $newGame = document.getElementById("newGame");
const $restart = document.getElementById("restart");
const $giveUp = document.getElementById("giveUp");
$maxMistakes.textContent = MAX_MISTAKES;
function chooseWord(cat) {
  const pool = cat === "random" ? ALL_WORDS : DICTS[cat] || ALL_WORDS;
  const word = pool[Math.floor(Math.random() * pool.length)];
  theme = cat === "random"
    ? Object.entries(DICTS).find(([, list]) => list.includes(word))?.[0] || "случайно"
    : cat;
  return word.toLowerCase();
}
function initGame() {
  finished = false;
  mistakes = 0;
  $mistakes.textContent = mistakes;
  secret = chooseWord($category.value);
  revealed = Array(secret.length).fill(false);
  renderWord();
  renderKeyboard();
  renderHangman();
  $message.textContent = "";
  $hint.textContent = `Тема: ${theme}`;
}
function renderWord() {
  $word.innerHTML = "";
  [...secret].forEach((ch, i) => {
    const span = document.createElement("div");
    span.className = "letter" + (revealed[i] ? " revealed" : "");
    span.textContent = revealed[i] ? ch.toUpperCase() : "";
    $word.appendChild(span);
  });
}
function renderKeyboard() {
  $keyboard.innerHTML = "";
  ALPHABET.forEach(letter => {
    const btn = document.createElement("div");
    btn.className = "key";
    btn.textContent = letter;
    btn.setAttribute("role", "button");
    btn.addEventListener("click", () => guess(letter));
    $keyboard.appendChild(btn);
  });
}
function updateKeys(letter, correct) {
  const nodes = [...$keyboard.children];
  const node = nodes.find(n => n.textContent === letter);
  if (!node) return;
  node.classList.add(correct ? "correct" : "wrong");
  node.style.pointerEvents = "none";
  node.style.opacity = "0.9";
}
function renderHangman() {
  for (let i = 0; i <= 8; i++) { // теперь 9 частей
    const part = document.getElementById("p" + i);
    if (part) {
      part.classList.toggle("visible", mistakes > i - 1);
    }
  }
}
function checkWinLose() {
  if (revealed.every(Boolean)) {
    finished = true;
    $message.innerHTML = `<div class="toast win">Победа! Слово: <b>${secret.toUpperCase()}</b></div>`;
  } else if (mistakes >= MAX_MISTAKES) {
    finished = true;
    $message.innerHTML = `<div class="toast lose">Проигрыш. Слово было: <b>${secret.toUpperCase()}</b></div>`;
    revealed = revealed.map(() => true);
    renderWord();
  }
}
function guess(letter) {
  if (finished) return;
  const l = letter.toLowerCase();
  let hit = false;
  [...secret].forEach((ch, i) => {
    if (ch === l) {
      revealed[i] = true;
      hit = true;
    }
  });
  updateKeys(letter, hit);
  if (!hit) {
    mistakes++;
    $mistakes.textContent = mistakes;
    renderHangman();
  } else {
    renderWord();
  }
  checkWinLose();
}
$showHint.addEventListener("change", () => {
  $hint.style.display = $showHint.checked ? "block" : "none";
});
$newGame.addEventListener("click", initGame);
$restart.addEventListener("click", initGame);
$giveUp.addEventListener("click", () => {
  if (finished) return;
  finished = true;
  $message.innerHTML = `<div class="toast lose">Вы сдались. Слово: <b>${secret.toUpperCase()}</b></div>`;
  revealed = revealed.map(() => true);
  renderWord();
});
$category.addEventListener("change", initGame);
window.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  if (ALPHABET.includes(key)) {
    guess(key);
  } else if (e.key === "Enter") {
    initGame();
  }
});
initGame();