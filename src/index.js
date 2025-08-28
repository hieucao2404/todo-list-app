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

        if(todo.subtasks.length > 0){
            const subtaskList = document.createElement('ul');
            todo.subtasks.forEach(subtask => {
                const subLi = document.createElement('li');
                subLi.innerHTML = `
                <span style="text-decoration:${subtask.completed ? 'line-through' : 'none'}">
                ${subtask.text}
                </span>
                <button data-todo-id="${todo.id}" data-subtask-id="${subtask.id}" class="toggle-subtask-btn">Toggle</button>
                <button data-todo-id="${todo.id}" data-subtask-id="${subtask.id}" class="delete-subtask-btn">Delete</button>
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

    //add subtaskLisst
    if(e.target.classList.contains('toggle-subtask-btn')){
        const todoId =  Number(e.target.dataset.totoId);
        const subtaskId =  Number(e.target.dataset.subtaskId);
        const todo = todoList.todos.find(t => t.id === todoId);
        if(todo){
            todo.toggleSubtask(subtaskId);
            render();
        }
    }

    if(e.target.classList.contains('delete-subtask-btn')){
        const todoId = Number(e.target.dataset.todoId);
        const subtaskId = Number(e.target.dataset.subtaskId);
        const todo = todoList.todos.find(t => t.id === todoId);
        if(todo){
            todo.deleteSubtask(subtaskId);
            render();
        }
    }

    if (e.target.classList.contains('add-subtask-btn')) {
        const todoId = Number(e.target.dataset.todoId);
        const todo = todoList.todos.find(t => t.id === todoId);
        const input = e.target.previousElementSibling;
        if (todo && input.value.trim()) {
            todo.addSubtask(input.value.trim());
            input.value = '';
            render();
        }
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