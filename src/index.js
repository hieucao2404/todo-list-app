import {TodoList} from './todoList.js';

const todoList = new TodoList();
const input = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const ul = document.getElementById('todo-list');

const render = () => {
    ul.innerHTML = '';
    const todos = todoList.getFilteredTodos();
    if(todos.length === 0){
        ul.innerHTML = '<li>No todos fuond</li>';
        return;
    }
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add(`priority-${todo.priority}`);
        li.innerHTML = `
        <span class="todo-text" style="text-decoration:${todo.completed ? 'line-through' : 'none'}">
        ${todo.text}
        </span>
        <span class="todo-priority">${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>
        <button data-id="${todo.id}" class= "toggle-btn">Toggle</button>
        <button data-id="${todo.id}" class="delete-btn">Delete</button>
        `;
        ul.appendChild(li);
    });
};

addBtn.addEventListener('click', () => {
    if(input.value.trim()){
        todoList.addTodo(input.value.trim(), prioritySelect.value);
        input.value ='';
        render();
    }
});

ul.addEventListener('click', e => {
    if(e.target.classList.contains('toggle-btn')){
        todoList.toggleTodo(Number(e.target.dataset.id));
        render();
    }
    if(e.target.classList.contains('delete-btn')){
        todoList.deleteTodo(Number(e.target.dataset.id));
        render();
    }
});

document.getElementById('filter-all').addEventListener('click', () => {
    todoList.setFilter('all');
    render();
});
document.getElementById('filter-active').addEventListener('click', () =>{
    todoList.setFilter('active');
    render();
});
document.getElementById('filter-completed').addEventListener('click', () =>{
    todoList.setFilter('completed');
    render();
});

//sortung buttons and logics
const sortTimeBtn = document.createElement('button');
sortTimeBtn.textContent = 'Sort by Time';
sortTimeBtn.onclick = () => {
    todoList.setSortMethod('time');
    render();
};

const sortPriorityBtn = document.createElement('button');
sortPriorityBtn.textContent = 'Sort by Priority';
sortPriorityBtn.onclick = () => {
    todoList.setSortMethod('priority');
    render();
};

document.body.insertBefore(sortTimeBtn, ul);
document.body.insertBefore(sortPriorityBtn, ul);

render();