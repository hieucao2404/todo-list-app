import { TodoList } from "./todoList.js";

function showToast(message){
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = '#333';
    toast.style.color ='#fff';
    toast.style.padding = '8px 16px';
    toast.style.borderRadius = '4px';
    toast.style.display = 'block';
    setTimeout(() => {toast.style.display = 'none';}, 1500);
}

const todoList = new TodoList();
const input = document.getElementById("todo-input");
const prioritySelect = document.getElementById("priority-select");
const addBtn = document.getElementById("add-btn");
const ul = document.getElementById("todo-list");

const render = () => {
  ul.innerHTML = "";
  const todos = todoList.getFilteredTodos();
  if (todos.length === 0) {
    ul.innerHTML = "<li>No todos fuond</li>";
    return;
  }
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.classList.add(`priority-${todo.priority}`);
    const completed = todo.subtasks.filter((st) => st.completed).length;
    const total = todo.subtasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    li.innerHTML = `
  <label class="checkbox-container">
    <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}" class="toggle-checkbox">
    <span class="checkmark"></span>
  </label>
  <span class="todo-text">${todo.text}</span>
  <span class="todo-priority">${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>
  <button data-id="${todo.id}" class="delete-btn">Delete</button>
  <button data-id="${todo.id}" class="edit-btn">Edit</button>
  <div class="progress-bar-container">
      <div class="progress-bar" style="width: 100%; background: #eee; border-radius: 4px; height: 10px;">
      <div style="width: ${percent}%; background: #4caf50; height: 100%; border-radius: 4px;"></div>
  </div>
  <span class="progress-label">${completed}/${total} subtasks completed (${percent}%)</span>
  `;

    if (todo.subtasks.length > 0) {
      const subtaskList = document.createElement("ul");
      todo.subtasks.forEach((subtask) => {
        const subLi = document.createElement("li");
        subLi.innerHTML = `
  <label class="checkbox-container subtask-checkbox">
    <input type="checkbox" ${subtask.completed ? "checked" : ""} data-todo-id="${todo.id}" data-subtask-id="${subtask.id}" class="toggle-subtask-checkbox">
    <span class="checkmark"></span>
  </label>
  <span class="subtask-text">${subtask.text}</span>
  <button data-todo-id="${todo.id}" data-subtask-id="${subtask.id}" class="delete-subtask-btn">Delete</button>
  <button data-todo-id="${todo.id}" data-subtask-id="${subtask.id}" class="edit-subtask-btn">Edit</button>
                `;
        subtaskList.appendChild(subLi);
      });
      li.appendChild(subtaskList);
    }

    li.innerHTML += `
        <input type="text" class="subtask-input" placeholder="Add subtask" />
        <button data-todo-id="${todo.id}" class="add-subtask-btn">Add Subtask</button>
        `;

    ul.appendChild(li);
  });
};

addBtn.addEventListener("click", () => {
  if (input.value.trim()) {
    todoList.addTodo(input.value.trim(), prioritySelect.value);
    input.value = "";
    render();
    showToast("Todo added!");
  }
});

ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggle-btn")) {
    todoList.toggleTodo(Number(e.target.dataset.id));
    render();
  }
  if (e.target.classList.contains("delete-btn")) {
    todoList.deleteTodo(Number(e.target.dataset.id));
    render();
    showToast("Todo deleted");
  }

  //add subtaskLisst
  if (e.target.classList.contains("toggle-subtask-btn")) {
    const todoId = Number(e.target.dataset.todoId);
    const subtaskId = Number(e.target.dataset.subtaskId);
    const todo = todoList.todos.find((t) => t.id === todoId);
    if (todo) {
      todo.toggleSubtask(subtaskId);
      render();
      showToast("Subtask completed!")
    }
  }

  if (e.target.classList.contains("delete-subtask-btn")) {
    const todoId = Number(e.target.dataset.todoId);
    const subtaskId = Number(e.target.dataset.subtaskId);
    const todo = todoList.todos.find((t) => t.id === todoId);
    if (todo) {
      todo.deleteSubtask(subtaskId);
      render();
      showToast("Subtask deleted!")
    }
  }

  if (e.target.classList.contains("add-subtask-btn")) {
    const todoId = Number(e.target.dataset.todoId);
    const todo = todoList.todos.find(t => t.id === todoId);
    const input = e.target.previousElementSibling;
    if (todo && input.value.trim()) {
      todo.addSubtask(input.value.trim());
      input.value = "";
      render();
      showToast("Subtask added!")
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const todoId = Number(e.target.dataset.id);
    const todo = todoList.todos.find((t) => t.id === todoId);
    if (todo) {
      //replace todo text with input and save button
      const li = e.target.closest("li");
      li.querySelector(".todo-text").innerHTML = `
            <input type="text" class="edit-todo-input" value="${todo.text}" />
            <button data-id="${todo.id}" class="save-todo-btn">Save</button>
            `;
    }
  }

  //save edited todo
  if (e.target.classList.contains("save-todo-btn")) {
    const todoId = Number(e.target.dataset.id);
    const todo = todoList.todos.find((t) => t.id === todoId);
    const input = e.target.previousElementSibling;
    if (todo && input.value.trim()) {
      todo.text = input.value.trim();
      render();
    }
  }

  if (e.target.classList.contains("edit-subtask-btn")) {
    const todoId = Number(e.target.dataset.todoId);
    const subtaskId = Number(e.target.dataset.subtaskId);
    const todo = todoList.todos.find((t) => t.id === todoId);
    if (todo) {
      const subtask = todo.subtasks.find((st) => st.id === subtaskId);
      const subLi = e.target.closest("li");
      subLi.querySelector("span").innerHTML = `
            <input type="text" class="edit-subtask-input" value="${subtask.text}" />
            <button data-todo-id="${todoId}" data-subtask-id="${subtaskId}" class="save-subtask-btn">Save</button>
            `;
    }
  }

  //save edited subtask
  if (e.target.classList.contains("save-subtask-btn")) {
    const todoId = Number(e.target.dataset.todoId);
    const subtaskId = Number(e.target.dataset.subtaskId);
    const todo = todoList.todos.find((t) => t.id === todoId);
    const subtask = todo.subtasks.find((s) => s.id === subtaskId);
    const input = e.target.previousElementSibling;
    if (subtask && input.value.trim()) {
      subtask.text = input.value.trim();
      render();
    }
  }
});

ul.addEventListener("change", (e) => {
  if (e.target.classList.contains("toggle-checkbox")) {
    todoList.toggleTodo(Number(e.target.dataset.id));
    render();
  }
  if (e.target.classList.contains("toggle-subtask-checkbox")) {
    const todoId = Number(e.target.dataset.todoId);
    const subtaskId = Number(e.target.dataset.subtaskId);
    const todo = todoList.todos.find((t) => t.id === todoId);
    if (todo) {
      todo.toggleSubtask(subtaskId);
      render();
    }
  }
});

document.getElementById("filter-all").addEventListener("click", () => {
  todoList.setFilter("all");
  render();
});
document.getElementById("filter-active").addEventListener("click", () => {
  todoList.setFilter("active");
  render();
});
document.getElementById("filter-completed").addEventListener("click", () => {
  todoList.setFilter("completed");
  render();
});

//sortung buttons and logics
const sortTimeBtn = document.createElement("button");
sortTimeBtn.textContent = "Sort by Time";
sortTimeBtn.onclick = () => {
  todoList.setSortMethod("time");
  render();
};

const sortPriorityBtn = document.createElement("button");
sortPriorityBtn.textContent = "Sort by Priority";
sortPriorityBtn.onclick = () => {
  todoList.setSortMethod("priority");
  render();
};

document.body.insertBefore(sortTimeBtn, ul);
document.body.insertBefore(sortPriorityBtn, ul);

render();
