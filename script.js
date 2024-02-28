const todoForm = document.getElementById("todo-form-container");
const todoInput = document.getElementById("todo-input");
const todoBtn = document.getElementById("add-todo-btn");
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

// TODO: render edit form and change todo list
function handleEdit(id) {
    // const { myTodos, myDone } = grabTodos();
    // localStorage.setItem("todo", JSON.stringify(myTodos));
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
    todoForm.addEventListener("submit", handleSubmit);
    todoBtn.addEventListener("click", handleSubmit);
    renderTodos();
}

main();
