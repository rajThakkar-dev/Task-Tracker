const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

const clearBtn = document.querySelector(".clear");

function toggleClearButton() {
    clearBtn.style.display =
        listContainer.children.length > 1 ? "block" : "none";
}

function addTask() {
    if (inputBox.value == '') {
        alert("You must write something!")
    }
    else {
        let li = document.createElement("li");

        let taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.innerHTML = inputBox.value;

        let status = document.createElement("span");
        status.className = "status status-pending";
        status.innerHTML = "Pending";

        let deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "\u00d7";

        li.appendChild(taskText);
        li.appendChild(status);
        li.appendChild(deleteBtn);
        listContainer.appendChild(li);
    }
    inputBox.value = "";
    saveData()
    toggleClearButton();
}

window.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
}
)

listContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("task-text") || e.target.parentElement.classList.contains("task-text")) {
        let li = e.target.classList.contains("task-text") ? e.target.parentElement : e.target.parentElement;
        li.classList.toggle("checked");
        let statusSpan = li.querySelector(".status");
        if (li.classList.contains("checked")) {
            statusSpan.textContent = "Completed";
            statusSpan.className = "status status-completed";
        } else {
            statusSpan.textContent = "Pending";
            statusSpan.className = "status status-pending";
        }
        saveData()
    }
    else if (e.target.tagName === "SPAN" && e.target.textContent === "\u00d7") {
        e.target.parentElement.remove();
        saveData();
        toggleClearButton();
    }
}, false)

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML)
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    toggleClearButton();
}
function removeAll() {
    listContainer.innerHTML = "";
    saveData();
    toggleClearButton();
}
showTask();