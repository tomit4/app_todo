const todoForm = document.getElementById("todo-form-container");
const todoInput = document.getElementById("todo-input");
const todoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");

function grabTodos() {
    let myTodos = [];
    const myLocallyStoredTodos = localStorage.getItem("todos");
    if (myLocallyStoredTodos !== null) {
        myTodos = JSON.parse(myLocallyStoredTodos);
    }
    return myTodos;
}

function createCheckBox(id) {
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    checkbox.type = "checkbox";
    checkbox.name = "todo-check";
    checkbox.value = "value";
    checkbox.id = `todo-check-${id}`;
    label.htmlFor = "todo-check";
    label.id = `todo-label-${id}`;
    return { checkbox, label };
}

function createBtn(id, type) {
    const btn = document.createElement("button");
    btn.id = `todo-${type}-btn-${id}`;
    const icon = document.createElement("i");
    icon.classList.add(`${type}-icon`);
    btn.appendChild(icon);
    return btn;
}

function generateTodo(myTodos) {
    for (let i = 0; i < myTodos.length; i++) {
        const newTodo = document.createElement("li");
        const newTodoSpan = document.createElement("span");
        const delBtn = createBtn(i, "del");
        const editBtn = createBtn(i, "edit");
        const { checkbox, label } = createCheckBox(i);
        newTodo.id = `todo-${i + 1}`;
        newTodoSpan.textContent = myTodos[i];
        newTodo.appendChild(newTodoSpan);
        newTodoSpan.appendChild(checkbox);
        newTodoSpan.appendChild(label);
        newTodoSpan.appendChild(delBtn);
        newTodoSpan.appendChild(editBtn);
        todoList.appendChild(newTodo);
    }
}

function renderTodos() {
    const myTodos = grabTodos();
    if (myTodos.length > 0) {
        todoList.replaceChildren();
        myTodos.reverse();
        generateTodo(myTodos);
    }
}

function handleSubmit(event) {
    event.preventDefault();
    const myTodos = grabTodos();
    const inputValueIsNotBlank = !todoInput.value.match(/^\s*$/);
    if (inputValueIsNotBlank) {
        myTodos.push(todoInput.value);
    }
    localStorage.setItem("todos", JSON.stringify(myTodos));
    todoInput.value = "";
    renderTodos();
}

function main() {
    todoForm.addEventListener("submit", handleSubmit);
    todoBtn.addEventListener("click", handleSubmit);
    renderTodos();
}

main();
