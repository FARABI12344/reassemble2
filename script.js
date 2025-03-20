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

function startTimer() {
  let timeLeft = timerDuration;
  const timerElement = document.getElementById("timer");

  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}M ${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time's up!");
    }
  }, 1000);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function addDragListeners(element) {
  element.addEventListener("dragstart", dragStart);
  element.addEventListener("dragend", dragEnd);
}

function addDropListeners(element) {
  element.addEventListener("dragover", dragOver);
  element.addEventListener("dragenter", dragEnter);
  element.addEventListener("dragleave", dragLeave);
  element.addEventListener("drop", drop);
}

function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.classList.add("dragging");
}

function dragEnd(event) {
  event.target.classList.remove("dragging");
}

function dragOver(event) {
  event.preventDefault();
}

function dragEnter(event) {
  event.preventDefault();
  event.target.classList.add("hovered");
}

function dragLeave(event) {
  event.target.classList.remove("hovered");
}

function drop(event) {
  event.preventDefault();
  const draggedElementId = event.dataTransfer.getData("text");
  const draggedElement = document.getElementById(draggedElementId);

  if (event.target.classList.contains("droppable") && !event.target.contains(draggedElement)) {
    event.target.classList.remove("hovered");
    event.target.appendChild(draggedElement);
    checkWordCompletion();
  }
}

function checkWordCompletion() {
  const slots = document.querySelectorAll(".droppable");
  const word = words[currentWordIndex];
  let completed = true;
  
  slots.forEach((slot, index) => {
    if (slot.firstChild && slot.firstChild.textContent !== word[index]) {
      completed = false;
    }
  });

  if (completed) {
    document.getElementById("next").disabled = false;
  }
}

function redo() {
  loadWord();
}

function skipWord() {
  currentWordIndex = (currentWordIndex + 1) % words.length;
  loadWord();
}

function nextWord() {
  currentWordIndex = (currentWordIndex + 1) % words.length;
  loadWord();
}
