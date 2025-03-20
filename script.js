const words = ["COOK", "DOOR", "HOME", "POWER", "FIRE", "DUST", "GLOW", "FORK", "STAR", "TREE", "WIND", "JUMP", "FISH"];
let currentWordIndex = 0;
const timerDuration = 120;
let timerInterval;

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});

function initGame() {
  loadWord();
  startTimer();
  document.getElementById("redo").addEventListener("click", redo);
  document.getElementById("skip").addEventListener("click", skipWord);
  document.getElementById("next").addEventListener("click", nextWord);
}

function loadWord() {
  clearContainers();
  const currentWord = words[currentWordIndex];
  const slotsContainer = document.getElementById("slots-container");

  for (let i = 0; i < currentWord.length; i++) {
    let slot = document.createElement("div");
    slot.classList.add("droppable");
    slot.dataset.index = i;
    slotsContainer.appendChild(slot);
  }

  const lettersContainer = document.getElementById("letters-container");
  let letters = shuffleArray(currentWord.split(""));
  letters.forEach(letter => {
    let letterDiv = document.createElement("div");
    letterDiv.classList.add("draggable");
    letterDiv.textContent = letter;
    letterDiv.setAttribute("draggable", "true");
    lettersContainer.appendChild(letterDiv);
  });

  enableTouchDrag();
  document.getElementById("next").disabled = true;
}

function clearContainers() {
  document.getElementById("slots-container").innerHTML = "";
  document.getElementById("letters-container").innerHTML = "";
}

function enableTouchDrag() {
  document.querySelectorAll('.draggable').forEach(draggable => {
    draggable.addEventListener("touchstart", touchStart);
    draggable.addEventListener("touchmove", touchMove);
    draggable.addEventListener("touchend", touchEnd);
  });
}

let draggedElem = null;

function touchStart(e) {
  draggedElem = e.target;
}

function touchMove(e) {
  let touchLocation = e.targetTouches[0];
  draggedElem.style.position = "absolute";
  draggedElem.style.left = touchLocation.pageX + "px";
  draggedElem.style.top = touchLocation.pageY + "px";
}

function touchEnd(e) {
  draggedElem.style.position = "static";
  draggedElem = null;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function redo() {
  loadWord();
}

function skipWord() {
  nextWord();
}

function nextWord() {
  currentWordIndex = (currentWordIndex + 1) % words.length;
  loadWord();
}
