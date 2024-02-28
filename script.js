const todoForm = document.getElementById("todo-form-container");
const todoBtn = document.getElementById("add-todo-btn");
const editForm = document.getElementById("edit-todo-form-container");
const editFormInput = document.getElementById("edit-todo-input");
const editBtn = document.getElementById("edit-todo-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
const todoHeader = document.getElementById("todo-header");
const doneHeader = document.getElementById("done-header");

function grabTodos() {
    let myTodos = [];
    let myDone = [];
    const myLocallyStoredTodos = localStorage.getItem("todo");
    const myLocallyStoredDone = localStorage.getItem("done");
    if (myLocallyStoredTodos !== null) {
        myTodos = JSON.parse(myLocallyStoredTodos);
    }
    if (myLocallyStoredDone !== null) {
        myDone = JSON.parse(myLocallyStoredDone);
    }
    return { myTodos, myDone };
}

function createCheckBox(id) {
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    checkbox.type = "checkbox";
    checkbox.name = "todo-check";
    checkbox.value = "value";
    checkbox.id = `todo-check-${id}`;
    checkbox.addEventListener("change", handleCheckBoxChange);
    label.htmlFor = "todo-check";
    label.id = `todo-label-${id}`;
    return { checkbox, label };
}

function createBtn(id, todoType, btnType) {
    const btn = document.createElement("button");
    const icon = document.createElement("i");
    btn.addEventListener("click", handleBtnClick);
    btn.id = `${todoType}-${btnType}-btn-${id}`;
    icon.classList.add(`${btnType}-icon`);
    btn.appendChild(icon);
    return btn;
}

function generateTodo(myTodos) {
    for (let i = 0; i < myTodos.length; i++) {
        const newTodo = document.createElement("li");
        const newTodoSpan = document.createElement("span");
        const delBtn = createBtn(i, "todo", "del");
        const editBtn = createBtn(i, "todo", "edit");
        const { checkbox, label } = createCheckBox(i);
        newTodo.id = `todo-${i}`;
        newTodoSpan.textContent = myTodos[i];
        newTodoSpan.id = `todo-span-${i}`;
        newTodo.appendChild(newTodoSpan);
        newTodoSpan.appendChild(checkbox);
        newTodoSpan.appendChild(label);
        newTodoSpan.appendChild(delBtn);
        newTodoSpan.appendChild(editBtn);
        todoList.appendChild(newTodo);
    }
}

function generateDone(myDone) {
    for (let i = 0; i < myDone.length; i++) {
        const newDone = document.createElement("li");
        const newDoneSpan = document.createElement("span");
        const delBtn = createBtn(i, "done", "del");
        newDone.id = `done-${i}`;
        newDoneSpan.textContent = myDone[i];
        newDoneSpan.id = `done-span-${i}`;
        newDone.appendChild(newDoneSpan);
        newDoneSpan.appendChild(delBtn);
        doneList.appendChild(newDone);
    }
}

function renderTodos() {
    const { myTodos, myDone } = grabTodos();
    todoList.replaceChildren();
    doneList.replaceChildren();
    if (myTodos.length > 0) {
        generateTodo(myTodos);
    }
    if (myDone.length > 0) {
        generateDone(myDone);
    }
    setHeaders();
}

function handleSubmit(event) {
    event.preventDefault();
    const { myTodos } = grabTodos();
    const inputValueIsNotBlank = !todoInput.value.match(/^\s*$/);
    if (inputValueIsNotBlank) {
        myTodos.unshift(todoInput.value);
    }
    // TODO: add else clause to render error message to user
    localStorage.setItem("todo", JSON.stringify(myTodos));
    todoInput.value = "";
    renderTodos();
}

function handleCheckBoxChange() {
    if (this.checked) {
        const { myTodos, myDone } = grabTodos();
        const todoId = Number(this.id.split("-")[2]);
        myDone.unshift(myTodos[todoId]);
        myTodos.splice(todoId, 1);
        localStorage.setItem("todo", JSON.stringify(myTodos));
        localStorage.setItem("done", JSON.stringify(myDone));
        renderTodos();
    }
}

function handleDelete(id, todoType) {
    const { myTodos, myDone } = grabTodos();
    if (todoType === "todo") {
        myTodos.splice(id, 1);
        localStorage.setItem("todo", JSON.stringify(myTodos));
    } else if (todoType === "done") {
        myDone.splice(id, 1);
        localStorage.setItem("done", JSON.stringify(myDone));
    }
}

// TODO: Refactor
function handleEdit(id) {
    const { myTodos } = grabTodos();
    todoForm.style.display =
        !todoForm.style.display.length || todoForm.style.display === "none"
            ? "block"
            : "none";
    todoBtn.style.display =
        !todoBtn.style.display.length || todoBtn.style.display === "none"
            ? "block"
            : "none";
    editForm.style.display =
        !editForm.style.display.length || editForm.style.display === "flex"
            ? "none"
            : "flex";
    editBtn.style.display =
        !editBtn.style.display.length || editBtn.style.display === "flex"
            ? "none"
            : "flex";
    editFormInput.placeholder = myTodos[id];
    editFormInput.value = "";
    if (!editForm.classList.contains(`edit-todo-${id}`)) {
        editForm.classList.add(`edit-todo-${id}`);
    }
    if (!editBtn.classList.contains(`edit-todo-${id}`)) {
        editBtn.classList.add(`edit-todo-${id}`);
    }
}

function handleEditSubmit(event) {
    event.preventDefault();
    const { myTodos } = grabTodos();
    const id = this.classList[this.classList.length - 1].split("-")[2];
    const inputValueIsNotBlank = !editFormInput.value.match(/^\s*$/);
    if (inputValueIsNotBlank) {
        myTodos[id] = editFormInput.value;
        localStorage.setItem("todo", JSON.stringify(myTodos));
        editFormInput.value = "";
        todoInput.value = "";
        renderTodos();
    }
}

function handleBtnClick() {
    const todoType = this.id.split("-")[0];
    const btnType = this.id.split("-")[1];
    const id = Number(this.id.split("-")[3]);
    if (btnType === "del") {
        handleDelete(id, todoType);
    } else if (btnType === "edit") {
        handleEdit(id);
    }
    renderTodos();
}

function setHeaders() {
    const { myTodos, myDone } = grabTodos();
    todoHeader.textContent = myTodos.length === 0 ? "" : "Todo";
    doneHeader.textContent = myDone.length === 0 ? "" : "Done";
}

function main() {
    todoForm.style.display = "block";
    todoBtn.style.display = "block";
    editForm.style.display = "none";
    editBtn.style.display = "none";
    todoForm.addEventListener("submit", handleSubmit);
    todoBtn.addEventListener("click", handleSubmit);
    editForm.addEventListener("submit", handleEditSubmit);
    editBtn.addEventListener("click", handleEditSubmit);
    renderTodos();
}

main();
