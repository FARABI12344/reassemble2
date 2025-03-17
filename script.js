// Words to assemble – add new words here as needed.
const words = ["COOK", "DOOR", "HOME", "POWER", "FIRE", "DUST", "GLOW", "FORK", "STAR", "TREE", "WIND", "JUMP", "FISH"];
let currentWordIndex = 0;
const timerDuration = 120; // 2 minutes in seconds
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

  // Create droppable slots for each letter of the current word.
  for (let i = 0; i < currentWord.length; i++) {
    let slot = document.createElement("div");
    slot.classList.add("droppable");
    slot.dataset.index = i;
    addDropListeners(slot);
    slotsContainer.appendChild(slot);
  }

  // Create draggable letters (shuffled).
  const lettersContainer = document.getElementById("letters-container");
  let letters = currentWord.split("");
  letters = shuffleArray(letters);
  letters.forEach((letter, index) => {
    let letterDiv = document.createElement("div");
    letterDiv.classList.add("draggable");
    letterDiv.setAttribute("draggable", "true");
    letterDiv.textContent = letter;
    // Create a unique ID using index and letter value.
    letterDiv.id = `letter-${index}-${letter}`;
    addDragListeners(letterDiv);
    lettersContainer.appendChild(letterDiv);
  });
  document.getElementById("next").disabled = true;
}

function clearContainers() {
  document.getElementById("slots-container").innerHTML = "";
  document.getElementById("letters-container").innerHTML = "";
}

// Drag and drop event listeners.
function addDragListeners(elem) {
  elem.addEventListener("dragstart", dragStart);
  elem.addEventListener("dragend", dragEnd);
}

function addDropListeners(slot) {
  slot.addEventListener("dragover", dragOver);
  slot.addEventListener("drop", drop);
}

let draggedElem = null;
let sourceContainer = null;

function dragStart(e) {
  draggedElem = this;
  sourceContainer = this.parentElement;
  e.dataTransfer.setData("text/plain", this.id);
  // Briefly hide the element for a smooth drag effect.
  setTimeout(() => {
    this.style.visibility = "hidden";
  }, 0);
}

function dragEnd() {
  this.style.visibility = "visible";
  draggedElem = null;
  sourceContainer = null;
}

function dragOver(e) {
  e.preventDefault();
  this.classList.add("hovered");
}

function drop(e) {
  e.preventDefault();
  this.classList.remove("hovered");
  let droppedId = e.dataTransfer.getData("text/plain");
  let dragged = document.getElementById(droppedId);

  // If dropped into the same container, do nothing.
  if (this === dragged.parentElement) return;

  // If the slot already has a letter, swap them.
  if (this.childElementCount > 0) {
    let existing = this.firstElementChild;
    if (sourceContainer) {
      sourceContainer.appendChild(existing);
    }
  }
  this.appendChild(dragged);
  updateOrder();
}

function updateOrder() {
  const slots = document.querySelectorAll(".droppable");
  let assembled = "";
  slots.forEach(slot => {
    if (slot.firstChild) {
      assembled += slot.firstChild.textContent;
    }
  });
  const currentWord = words[currentWordIndex];
  // Enable NEXT if the assembled word is correct.
  document.getElementById("next").disabled = (assembled !== currentWord);
}

// REDO: Return all letters back to the letters pool.
function redo() {
  const lettersContainer = document.getElementById("letters-container");
  const slots = document.querySelectorAll(".droppable");
  slots.forEach(slot => {
    if (slot.firstChild) {
      lettersContainer.appendChild(slot.firstChild);
    }
  });
  document.getElementById("next").disabled = true;
}

// SKIP: Proceed to the next word.
function skipWord() {
  nextWord();
}

function nextWord() {
  currentWordIndex++;
  if (currentWordIndex >= words.length) {
    alert("All words completed!");
    currentWordIndex = 0; // Restart or end the game as desired.
  }
  loadWord();
  resetTimer();
}

// Fisher–Yates shuffle.
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Timer functions.
function startTimer() {
  let timeLeft = timerDuration;
  updateTimerDisplay(timeLeft);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      disableDraggables();
      alert("Time's up!");
    }
  }, 1000);
}

function updateTimerDisplay(time) {
  const timerDisplay = document.getElementById("timer");
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  // Format seconds with a leading zero if needed.
  seconds = seconds < 10 ? "0" + seconds : seconds;
  // Display "M" only if seconds are 0 at the very start; otherwise, show minutes and seconds.
  timerDisplay.textContent = (time === timerDuration || seconds === "00") 
    ? `${minutes}M` 
    : `${minutes}M ${seconds}s`;
}

function resetTimer() {
  clearInterval(timerInterval);
  startTimer();
}

function disableDraggables() {
  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach(elem => {
    elem.setAttribute("draggable", "false");
  });
}
