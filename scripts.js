const draggables = document.querySelectorAll(".draggable");
const droppables = document.querySelectorAll(".droppable");
const nextButton = document.getElementById("next");

let correctOrder = ["C", "O1", "O2", "K"];
let currentOrder = [];

draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text", e.target.id);
    });
});

droppables.forEach(droppable => {
    droppable.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    droppable.addEventListener("drop", (e) => {
        e.preventDefault();
        let droppedId = e.dataTransfer.getData("text");
        let draggedElement = document.getElementById(droppedId);

        if (!droppable.hasChildNodes()) {
            droppable.appendChild(draggedElement);
        }

        updateOrder();
    });
});

function updateOrder() {
    currentOrder = [];
    droppables.forEach(slot => {
        if (slot.hasChildNodes()) {
            currentOrder.push(slot.firstChild.id);
        } else {
            currentOrder.push(null);
        }
    });

    if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
        nextButton.disabled = false;
    } else {
        nextButton.disabled = true;
    }
}
