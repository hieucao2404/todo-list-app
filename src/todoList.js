import {Todo} from './todo.js';

export class TodoList{
    constructor(){
        this.todos = [];
        this.filter = 'all';
        this.sortMethod = 'time'; // time or priority
    }

    addTodo(text, priority){
        const id = Date.now();
        this.todos.push(new Todo(id, text, priority));
    }

    toggleTodo(id){
        this.todos = this.todos.map(todo => todo.id === id ? {... todo, completed: !todo.completed} : todo);
    };
    
    deleteTodo(id){
        this.todos = this.todos.filter(todo => todo.id !== id);
    }

    getFilteredTodos(){
        let filtered = this.todos;
        if(this.filter === 'active') return this.todos.filter(t => !t.completed);
        if(this.filter === 'completed') return this.todos.filter(t => t.completed);

        if(this.sortMethod === 'priority'){
            const priorityOrder = {high: 0, medium: 1, low: 2};
            filtered = filtered.slice().sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else {
            filtered = filtered.slice().sort((a, b) => a.createAt -  b.createAt);
        }
        return filtered;
    }

    setFilter(filter){
        this.filter = filter;
    }

    setSortMethod(method){
        this.sortMethod = method;
    }

}